# References:
#
# d3.js drag/add
# http://stackoverflow.com/questions/19911514/how-can-i-click-to-add-or-drag-in-d3
#
# d3.js brush (show only a portion of time)
# http://bl.ocks.org/bunkat/1962173
#
# d3.js drag date items
# http://codepen.io/Problematic/pen/mskwj
#
# Soundjs
# http://www.createjs.com/#!/SoundJS/documentation
# http://www.createjs.com/Docs/SoundJS/modules/SoundJS.html
#
# Soundjs music visualizer
# https://github.com/CreateJS/SoundJS/blob/master/examples/MusicVisualizer.html
define (require) ->
  tpl_timeline = require 'text!templates/timeline.tpl.html'
  Timeline = require 'cs!graph/Timeline'
  PropertiesEditor = require 'cs!editor/PropertiesEditor'
  EditorMenu = require 'cs!editor/EditorMenu'
  EditorControls = require 'cs!editor/EditorControls'
  SelectionManager = require 'cs!editor/SelectionManager'

  class Editor
    constructor: (@tweenTime, options = {}) ->
      @timer = @tweenTime.timer
      @lastTime = -1

      @$timeline = $(tpl_timeline)
      $('body').append(@$timeline)
      $('body').addClass('has-editor')

      @selectionManager = new SelectionManager(@tweenTime)
      @timeline = new Timeline(@tweenTime, @selectionManager)
      @menu = new EditorMenu(@tweenTime, @$timeline)
      if options.onMenuCreated? then options.onMenuCreated(@$timeline.find('.editor__menu'))

      @propertiesEditor = new PropertiesEditor(@timeline, @timer, @selectionManager)
      @propertiesEditor.keyAdded.add(@onKeyAdded)

      @controls = new EditorControls(@tweenTime, @$timeline)

      # Will help resize the canvas to correct size (minus sidebar and timeline)
      window.editorEnabled = true
      window.dispatchEvent(new Event('resize'))
      window.requestAnimationFrame(@render)

    onKeyAdded: () =>
      @timeline.isDirty = true

    render: () =>
      time = @timer.time[0]
      time_changed = if @lastTime == time then false else true

      @timeline.render(time, time_changed)
      @controls.render(time, time_changed)
      @propertiesEditor.render(time, time_changed)

      @lastTime = @timer.time[0]
      window.requestAnimationFrame(@render)
