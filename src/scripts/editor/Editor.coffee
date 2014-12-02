define (require) ->
  tpl_timeline = require 'text!templates/timeline.tpl.html'
  Timeline = require 'cs!graph/Timeline'
  PropertiesEditor = require 'cs!editor/PropertiesEditor'
  EditorMenu = require 'cs!editor/EditorMenu'
  EditorControls = require 'cs!editor/EditorControls'
  SelectionManager = require 'cs!editor/SelectionManager'
  Exporter = require 'cs!editor/Exporter'
  UndoManager = require 'cs!editor/UndoManager'

  class Editor
    constructor: (@tweenTime, @options = {}) ->
      @timer = @tweenTime.timer
      @lastTime = -1

      @$timeline = $(tpl_timeline)
      $('body').append(@$timeline)
      $('body').addClass('has-editor')

      @selectionManager = new SelectionManager(@tweenTime)
      @exporter = new Exporter(this)

      @timeline = new Timeline(this)
      @menu = new EditorMenu(@tweenTime, @$timeline, this)
      if @options.onMenuCreated? then @options.onMenuCreated(@$timeline.find('.timeline__menu'))

      @propertiesEditor = new PropertiesEditor(this, @selectionManager)
      @propertiesEditor.keyAdded.add(@onKeyAdded)
      @propertiesEditor.keyRemoved.add(@onKeyRemoved)

      @controls = new EditorControls(@tweenTime, @$timeline)

      @undoManager = new UndoManager(this)
      # Will help resize the canvas to correct size (minus sidebar and timeline)
      window.editorEnabled = true
      window.dispatchEvent(new Event('resize'))
      window.requestAnimationFrame(@update)

    onKeyAdded: () =>
      @undoManager.addState()
      @render(false, true)

    onKeyRemoved: (item) =>
      @selectionManager.removeItem(item)
      @undoManager.addState()
      if @selectionManager.selection.length
        @selectionManager.triggerSelect()
      @render(false, true)

    render: (time = false, force = false) =>
      if time == false then time = @timer.time[0]
      if force then @timeline._isDirty = true

      @timeline.render(time, force)
      @controls.render(time, force)
      @propertiesEditor.render(time, force)

    update: () =>
      time = @timer.time[0]
      time_changed = if @lastTime == time then false else true

      @render(time, time_changed)

      @lastTime = @timer.time[0]
      window.requestAnimationFrame(@update)
