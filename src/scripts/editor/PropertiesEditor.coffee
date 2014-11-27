define (require) ->
  $ = require 'jquery'
  _ = require 'lodash'
  Signals = require 'Signal'
  PropertyNumber = require 'cs!editor/PropertyNumber'
  PropertyTween = require 'cs!editor/PropertyTween'

  tpl_propertiesEditor = require 'text!templates/propertiesEditor.tpl.html'

  class PropertiesEditor
    constructor: (@timeline, @timer, @selectionManager) ->
      @$el = $(tpl_propertiesEditor)
      @$container = @$el.find('.properties-editor__main')
      # todo: rename keyAdded to updated
      @keyAdded = new Signals.Signal()
      @selectedProps = []

      $('body').append(@$el)

      @selectionManager.onSelect.add(@onSelect)

    onKeyAdded: () =>
      @keyAdded.dispatch()

    onSelect: (domElement = false) =>
      @$container.empty()
      if domElement instanceof Array
        for element in domElement
          @addProperty(element)
      else
        @addProperty(domElement)

    addProperty: (domElement) =>
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

      @selectedProps = []

      # data and propertyData are defined on key select.
      property_name = false
      if propertyData
        property_name = propertyData.name

      $el = false
      if lineData.id
        # try to find a container for this object
        $el = $('#property--' + lineData.id)
        if !$el.length
          # If no container for the specific item, create it
          $el = $el = $('<div class="properties__wrapper" id="property--' + lineData.id + '"></div>')
          @$container.append($el)

          if lineData.label
            # Also add the object name
            $el.append('<h2 class="properties-editor__title">' + lineData.label + '</h2>')

      if $el == false
        $el = $('<div class="properties__wrapper" id="no-item"></div>')
        @$container.append($el)

      # Basic data, loop through properties.
      for key, instance_prop of lineData.properties
        # show all properties or only 1 if we selected a key.
        if !property_name || instance_prop.name == property_name
          prop = new PropertyNumber(instance_prop, lineData, @timer, key_val)
          prop.keyAdded.add(@onKeyAdded)
          @selectedProps.push(prop)
          $el.append(prop.$el)

      if property_name
        # Add tween select if we are editing a key.
        tween = new PropertyTween(instance_prop, lineData, @timer, key_val, @timeline)
        @selectedProps.push(tween)
        $el.append(tween.$el)

        # Add a remove key button
        $actions = $('<div class="properties-editor__actions actions"></div>')
        $remove_bt = $('<a href="#" class="actions__item">Remove key</a>')
        $actions.append($remove_bt)
        $el.append($actions)

        $remove_bt.click (e) =>
          e.preventDefault()
          index = propertyData.keys.indexOf(key_val)
          if index > -1
            propertyData.keys.splice(index, 1)
            lineData.isDirty = true
            @keyAdded.dispatch()

    render: (time, time_changed) =>
      if !time_changed then return
      for prop in @selectedProps
        prop.update()
