define (require) ->
  d3 = require 'd3'
  Signals = require 'Signal'
  Utils = require 'cs!core/Utils'

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

    removeItem: (item) =>
      index = @selection.indexOf(item)
      if index > -1
        @selection.splice(index, 1)

    sortSelection: () =>
      compare = (a, b) ->
        if !a.__data__ || !b.__data__ then return 0
        if a.__data__.time < b.__data__.time then return -1
        if a.__data__.time > b.__data__.time then return 1
        return 0
      @selection = @selection.sort(compare)

    reset: () =>
      @selection = []
      @highlightItems()
      @onSelect.dispatch(@selection, false)

    triggerSelect: () =>
      @onSelect.dispatch(@selection, false)

    select: (item, addToSelection = false) ->
      if !addToSelection then @selection = []
      if item instanceof Array
        for el in item
          @selection.push(el)
      else
        @selection.push(item)

      @removeDuplicates()
      @highlightItems()
      @sortSelection()
      @onSelect.dispatch(@selection, addToSelection)

    getSelection: () =>
      return @selection

    highlightItems: () ->
      d3.selectAll('.bar--selected').classed('bar--selected', false)
      d3.selectAll('.key--selected').classed('key--selected', false)

      for item in @selection
        d3item = d3.select(item)
        if d3item.classed('bar')
          d3item.classed('bar--selected', true)
        else if d3item.classed('key')
          d3item.classed('key--selected', true)
