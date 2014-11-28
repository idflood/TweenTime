define (require) ->
  class UndoManager
    $ = require 'jquery'

    constructor: (@editor) ->
      @history_max = 100
      @history = []
      @current_index = 0
      # Add the initial state
      @addState()

      $(document).keydown (e) =>
        if e.keyCode == 90
          if e.metaKey || e.ctrlKey
            if !e.shiftKey
              # (command | ctrl) Z
              @undo()
            else
              # (command | ctrl) shift Z
              @redo()

    undo: () =>
      # If there is no more history return
      if @current_index <= 0 then return false
      @current_index -= 1
      @setState(@current_index)

    redo: () =>
      # Stop if there is no more things.
      if @current_index >= @history.length - 1 then return false
      @current_index += 1
      @setState(@current_index)

    addState: () =>
      data = JSON.parse(@editor.exporter.getJSON())

      # if we did some undo before and then edit something,
      # we want to remove all actions past the current index first.
      if @current_index + 1 < @history.length
        @history.splice(@current_index + 1, @history.length - 1)

      @history.push(data)

      # Keep history to a max size by removing the first element if needed.
      if @history.length > @history_max then @history.shift()

      # Set the current index
      @current_index = @history.length - 1

    setState: (index) =>
      state = @history[index]
      data = state.data
      tweenTime = @editor.tweenTime

      #tweenTime.data = data
      # naively copy keys and values from previous state
      for item, item_key in data
        # if item is not defined copy it
        if !tweenTime.data[item_key]
          tweenTime.data[item_key] = item
        else
          for prop, prop_key in item.properties
            # if property is not defined copy it
            if !tweenTime.data[item_key].properties[prop_key]
              tweenTime.data[item_key].properties[prop_key] = prop
            else
              # set property keys
              keys = tweenTime.data[item_key].properties[prop_key].keys
              for key, key_key in prop.keys
                if !keys[key_key]
                  keys[key_key] = key
                else
                  keys[key_key].time = key.time
                  keys[key_key].val = key.val
                  keys[key_key].ease = key.ease
              #tweenTime.data[item_key].properties[prop_key].keys = prop.keys

        tweenTime.data[item_key].isDirty = true

      @editor.render(false, true)