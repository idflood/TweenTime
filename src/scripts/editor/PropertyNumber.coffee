define (require) ->
  $ = require 'jquery'
  Signals = require 'Signal'
  _ = require 'lodash'
  d3 = require 'd3'
  DraggableNumber = require 'draggablenumber'

  Mustache = require 'Mustache'
  tpl_property = require 'text!templates/propertyNumber.tpl.html'

  class PropertyNumber
    # @property: Static property definition (ex: {name: 'x', label: 'x', val: 0})
    # @instance_property: The current property on the data object.
    # @object: The parent object.
    constructor: (@property, @instance_property, @object, @timer, @key_val = false) ->
      # key_val is defined if we selected a key
      @$el = false
      @keyAdded = new Signals.Signal()
      @render()

    onKeyClick: (e) =>
      e.preventDefault()
      currentValue = @getCurrentVal()
      @addKey(currentValue)

    getInputVal: () =>
      parseFloat(@$el.find('input').val(), 10)

    getCurrentVal: () =>
      val = @property.val
      prop_name = if @instance_property.name then @instance_property.name else @property.name

      # if we selected a key simply return it's value
      if @key_val
        return @key_val.val

      if @object.values? && @object.values[prop_name]
        return @object.values[prop_name]

      if @instance_property and @instance_property.val?
        # Use the instance property if defined (value changed but no key)
        val = @instance_property.val
      return val

    getProperty: () =>
      properties = @object.properties
      return _.find(properties, (prop) => prop.name == @instance_property.name)

    addKey: (val) =>
      property = @getProperty()
      if !property
        property = {keys: [], name: @property.name, val: current_value}
        properties.push(property)
      # We want seconds for keys and not milliseconds.
      currentTime = @timer.getCurrentTime() / 1000
      key = {time: currentTime, val: val}

      property.keys.push(key)
      sortKeys = (keys) -> keys.sort((a, b) -> d3.ascending(a.time, b.time))
      property.keys = sortKeys(property.keys)
      # Todo: remove object.isDirty, make it nicer.
      @object.isDirty = true
      @keyAdded.dispatch()

    render: () =>
      # current values are defined in @object.values
      @values = if @object.values? then @object.values else {}
      # By default assign the property default value
      val = @getCurrentVal()

      data =
        id: @property.name # "circleRadius" instead of "circle radius"
        label: @property.label
        #has_keys: if @instance_property.keys then true else false
        val: val


      view = Mustache.render(tpl_property, data)
      @$el = $(view)
      @$el.find('.property__key').click(@onKeyClick)

      $input = @$el.find('input')
      onInputChange = (e) =>
        current_value = @getInputVal()
        currentTime = @timer.getCurrentTime() / 1000
        # if we selected a key simply get the time from it.
        if @key_val
          currentTime = @key_val.time
        current_property = @getProperty()

        if current_property.keys && current_property.keys.length
          # Add a new key if there is no other key at same time
          current_key = _.find(current_property.keys, (key) => key.time == currentTime)

          if current_key
            # if there is a key update it
            current_key.val = current_value
          else
            # add a new key
            @addKey(current_value)
        else
          # There is no keys, simply update the property value (for data saving)
          current_property.val = current_value
          # Also directly set the object value.
          @object.values[@property.name] = current_value

          # Simply update the custom object with new values.
          if @object.object
            currentTime = @timer.getCurrentTime() / 1000
            # Set the property on the instance object.
            @object.object.update(currentTime - @object.start)

        # Something changed, make the object dirty to rebuild things.
        @object.isDirty = true

      draggable = new DraggableNumber($input.get(0), {
        changeCallback: onInputChange
      })
      $input.data('draggable', draggable)
      $input.change(onInputChange)

    update: () =>
      val = @getCurrentVal()
      $input = @$el.find('input')
      draggable = $input.data('draggable')
      if draggable
        draggable.set(val.toFixed(3))
      else
        $input.val(val.toFixed(3))