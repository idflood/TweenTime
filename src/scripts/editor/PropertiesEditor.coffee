define (require) ->
  $ = require 'jquery'
  _ = require 'lodash'
  Signals = require 'Signal'
  PropertyNumber = require 'cs!editor/PropertyNumber'
  PropertyTween = require 'cs!editor/PropertyTween'

  tpl_propertiesEditor = require 'text!templates/propertiesEditor.tpl.html'

  class PropertiesEditor
    constructor: (@timeline, @timer) ->
      @$el = $(tpl_propertiesEditor)
      @$container = @$el.find('.properties-editor__main')
      # todo: rename keyAdded to updated
      @keyAdded = new Signals.Signal()

      $('body').append(@$el)

      @timeline.onSelect.add(@onSelect)

    onKeyAdded: () =>
      @keyAdded.dispatch()

    # todo: rename data to key
    onSelect: (selectedObject, data = false, propertyData = false, d3Object = false) =>
      @$container.empty()
      # data and propertyData are defined on key select.
      property_name = false
      if propertyData
        property_name = propertyData.name

      if selectedObject.label
        @$container.append('<h2 class="properties-editor__title">' + selectedObject.label + '</h2>')

      if selectedObject.classObject
        # if we uuse the ElementFactory we have access to more informations
        type_properties = selectedObject.classObject.properties

        for key, prop of type_properties
          # show all properties or only 1 if we selected a key.
          if !property_name || key == property_name
            instance_prop = _.find(selectedObject.properties, (d) -> d.name == key)
            prop = new PropertyNumber(prop, instance_prop, selectedObject, @timer, data)
            prop.keyAdded.add(@onKeyAdded)
            @$container.append(prop.$el)
      else
        # Basic data, loop through properties.
        for key, instance_prop of selectedObject.properties
          if !property_name || instance_prop.name == property_name
            prop = new PropertyNumber({label: instance_prop.name}, instance_prop, selectedObject, @timer, data)
            prop.keyAdded.add(@onKeyAdded)
            @$container.append(prop.$el)

      if property_name
        # Add tween select if we are editing a key.
        tween = new PropertyTween({label: instance_prop.name}, instance_prop, selectedObject, @timer, data)
        @$container.append(tween.$el)

        # Add a remove key button
        $actions = $('<div class="properties-editor__actions actions"></div>')
        $remove_bt = $('<a href="#" class="actions__item">Remove key</a>')
        $actions.append($remove_bt)
        @$container.append($actions)

        $remove_bt.click (e) =>
          e.preventDefault()
          index = propertyData.keys.indexOf(data)
          if index > -1
            propertyData.keys.splice(index, 1)
            selectedObject.isDirty = true
            @keyAdded.dispatch()
            #if d3Object then $(d3Object).remove()