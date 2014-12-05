define (require) ->
  $ = require 'jquery'
  Signals = require 'Signal'
  _ = require 'lodash'
  Utils = require 'cs!core/Utils'

  Mustache = require 'Mustache'
  tpl_property = require 'text!templates/propertyNumber.tpl.html'

  class PropertyBase
    # @instance_property: The current property on the data object.
    # @lineData: The line data object.
    constructor: (@instance_property, @lineData, @editor, @key_val = false) ->
      @timer = @editor.timer
      @keyAdded = new Signals.Signal()
      @render()

      @$key = @$el.find('.property__key')

    onKeyClick: (e) =>
      e.preventDefault()
      currentValue = @getCurrentVal()
      @addKey(currentValue)

    getInputVal: () =>
      return @$el.find('input').val()

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

    update: () =>
      key = @getCurrentKey()
      @$key.toggleClass('property__key--active', key)
