define (require) ->
  $ = require 'jquery'
  Signals = require 'Signal'
  _ = require 'lodash'
  d3 = require 'd3'
  Utils = require 'cs!core/Utils'
  DraggableNumber = require 'draggablenumber'

  Mustache = require 'Mustache'
  tpl_property = require 'text!templates/propertyNumber.tpl.html'

  class PropertyNumber
    # @instance_property: The current property on the data object.
    # @lineData: The line data object.
    constructor: (@instance_property, @lineData, @editor, @key_val = false) ->
      @timer = @editor.timer
      # key_val is defined if we selected a key
      @$el = false
      @keyAdded = new Signals.Signal()
      @render()

      @$input = @$el.find('input')
      @$key = @$el.find('.property__key')

    onKeyClick: (e) =>
      e.preventDefault()
      currentValue = @getCurrentVal()
      @addKey(currentValue)

    getInputVal: () =>
      parseFloat(@$el.find('input').val(), 10)

    getCurrentVal: () =>
      val = @instance_property.val
      prop_name = @instance_property.name

      # if we selected a key simply return it's value
      if @key_val
        return @key_val.val

      if @lineData.values? && @lineData.values[prop_name]
        return @lineData.values[prop_name]

      return val

    getCurrentKey: () =>
      time = @timer.getCurrentTime() / 1000

      if !@instance_property || !@instance_property.keys then return false
      if @instance_property.keys.length == 0 then return false
      for key in @instance_property.keys
        if key.time == time then return key
      return false

    addKey: (val) =>
      currentTime = @timer.getCurrentTime() / 1000
      key = {time: currentTime, val: val}

      @instance_property.keys.push(key)

      @instance_property.keys = Utils.sortKeys(@instance_property.keys)
      # Todo: remove lineData._isDirty, make it nicer.
      @lineData._isDirty = true
      @keyAdded.dispatch()

    render: () =>
      # current values are defined in @lineData.values
      @values = if @lineData.values? then @lineData.values else {}
      # By default assign the property default value
      val = @getCurrentVal()

      data =
        id: @instance_property.name # "circleRadius" instead of "circle radius"
        label: @instance_property.label || @instance_property.name
        val: val

      view = Mustache.render(tpl_property, data)
      @$el = $(view)
      @$el.find('.property__key').click(@onKeyClick)

      $input = @$el.find('input')
      onInputChange = (e) =>
        current_value = @getInputVal()
        currentTime = @timer.getCurrentTime() / 1000
        # if we selected a key simply get the time from it.
        if @key_val then currentTime = @key_val.time

        if @instance_property.keys && @instance_property.keys.length
          # Add a new key if there is no other key at same time
          current_key = _.find(@instance_property.keys, (key) => key.time == currentTime)

          if current_key
            # if there is a key update it
            current_key.val = current_value
          else
            # add a new key
            @addKey(current_value)
        else
          # There is no keys, simply update the property value (for data saving)
          @instance_property.val = current_value
          # Also directly set the lineData value.
          @lineData.values[@instance_property.name] = current_value

          # Simply update the custom object with new values.
          if @lineData.object
            currentTime = @timer.getCurrentTime() / 1000
            # Set the property on the instance object.
            @lineData.object.update(currentTime - @lineData.start)

        # Something changed, make the lineData dirty to rebuild things. d
        @lineData._isDirty = true

      onChangeEnd = (new_val) =>
        @editor.undoManager.addState()

      draggable = new DraggableNumber($input.get(0), {
        changeCallback: onInputChange,
        endCallback: onChangeEnd
      })
      $input.data('draggable', draggable)
      $input.change(onInputChange)

    update: () =>
      val = @getCurrentVal()
      key = @getCurrentKey()

      @$key.toggleClass('property__key--active', key)
      draggable = @$input.data('draggable')

      if draggable
        draggable.set(val.toFixed(3))
      else
        @$input.val(val.toFixed(3))
