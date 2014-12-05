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

    onInputChange: (e) =>
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
