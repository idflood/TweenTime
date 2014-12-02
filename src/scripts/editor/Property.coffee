define (require) ->
  Signals = require 'Signal'
  PropertyNumber = require 'cs!editor/PropertyNumber'
  PropertyTween = require 'cs!editor/PropertyTween'

  class Property
    constructor: (@editor, @$el, domElement) ->
      @timeline = @editor.timeline
      @timer = @editor.timer
      @selectionManager = editor.selectionManager
      @keyAdded = new Signals.Signal()
      @items = []
      @numberProp = false
      @tweenProp = false

      d3Object = d3.select(domElement)

      key_val = false
      propertyObject = false
      propertyData = false
      lineObject = false
      lineData = false

      if d3Object.classed('key')
        propertyObject = domElement.parentNode
        lineObject = propertyObject.parentNode.parentNode
        lineData = d3.select(lineObject).datum()
        propertyData = d3.select(propertyObject).datum()
        key_val = d3Object.datum()

      # click on bar
      if d3Object.classed('bar')
        lineData = d3Object.datum()

      # click on bar label
      if d3Object.classed('line-label')
        domElement = domElement.parentNode
        d3Object = d3.select(domElement)
        lineData = d3Object.datum()

      # data and propertyData are defined on key select.
      property_name = false
      if propertyData
        property_name = propertyData.name

      # Get the property container.
      $container = @getContainer(lineData)

      # Basic data, loop through properties.
      for key, instance_prop of lineData.properties
        # show all properties or only 1 if we selected a key.
        if !property_name || instance_prop.name == property_name
          numberProp = @addNumberProperty(instance_prop, lineData, key_val, $container)
          @items.push(numberProp)

      if property_name
        # Add tween select if we are editing a key.
        tweenProp = @addTweenProperty(instance_prop, lineData, key_val, $container)
        @items.push(tweenProp)

      return

    onKeyAdded: () =>
      # propagate the event.
      @keyAdded.dispatch()

    getContainer: (lineData) ->
      $container = false
      if lineData.id
        # try to find a container for this object
        $container = $('#property--' + lineData.id)
        if !$container.length
          # If no container for the specific item, create it
          $container = $container = $('<div class="properties__wrapper" id="property--' + lineData.id + '"></div>')
          @$el.append($container)

          if lineData.label
            # Also add the object name
            $container.append('<h2 class="properties-editor__title">' + lineData.label + '</h2>')

      if $container == false
        $container = $('<div class="properties__wrapper" id="no-item"></div>')
        @$el.append($container)
      return $container

    addNumberProperty: (instance_prop, lineData, key_val, $container) =>
      prop = new PropertyNumber(instance_prop, lineData, @editor, key_val)
      prop.keyAdded.add(@onKeyAdded)
      $container.append(prop.$el)
      return prop

    addTweenProperty: (instance_prop, lineData, key_val, $container) =>
      tween = new PropertyTween(instance_prop, lineData, @editor, key_val, @timeline)
      $container.append(tween.$el)

      # Add a remove key button
      tween.$el.find('[data-action-remove]').click (e) =>
        e.preventDefault()
        index = propertyData.keys.indexOf(key_val)
        if index > -1
          propertyData.keys.splice(index, 1)
          @keyRemoved.dispatch(domElement)
          lineData._isDirty = true
      return tween

    update: () =>
      for item in @items
        item.update()
      return
