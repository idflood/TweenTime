define (require) ->
  $ = require 'jquery'
  _ = require 'lodash'
  Signals = require 'Signal'
  Property = require 'cs!editor/Property'

  tpl_propertiesEditor = require 'text!templates/propertiesEditor.tpl.html'

  class PropertiesEditor
    constructor: (@editor) ->
      @timeline = @editor.timeline
      @timer = @editor.timer
      @selectionManager = editor.selectionManager

      @$el = $(tpl_propertiesEditor)
      @$container = @$el.find('.properties-editor__main')
      # todo: rename keyAdded to updated
      @keyAdded = new Signals.Signal()
      @keyRemoved = new Signals.Signal()
      @items = []

      # Close properties by default.
      $('body').addClass('properties-is-closed')
      # Add the properties editor to the document.
      $('body').append(@$el)

      @selectionManager.onSelect.add(@onSelect)

      # Stop event propagation to no play by accident.
      @$el.keypress (e) -> e.stopPropagation()

    onKeyAdded: () =>
      console.log "on key added"
      @keyAdded.dispatch()

    onSelect: (domElement = false) =>
      @items = []
      @$container.empty()
      if domElement instanceof Array
        for element in domElement
          @addProperty(element)
      else
        @addProperty(domElement)

      # When selecting anything, automatically display the properties editor.
      if @items.length then $('body').removeClass('properties-is-closed')

    addProperty: (domElement) =>
      prop = new Property(@editor, @$container, domElement)
      prop.keyAdded.add(@onKeyAdded)
      @items.push(prop)

    render: (time, time_changed) =>
      if !time_changed then return
      for prop in @items
        prop.update()
