define (require) ->
  Signals = require 'Signal'

  class SelectionManager
    constructor: (@tweenTime) ->
      @selection = []
      @onSelect = new Signals.Signal()

    removeDuplicates: () =>
      result = []
      for item in @selection
        found = false
        for item2 in result
          if item.isEqualNode(item2)
            found = true
            break
        if found == false then result.push(item)

      @selection = result

    reset: () =>
      @selection = []

    select: (item, addToSelection = false) ->
      if !addToSelection then @selection = []
      @selection.push(item)
      @removeDuplicates()
      @onSelect.dispatch(item, addToSelection)

    getSelection: () =>
      return @selection