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

  class Editor
    constructor: (@tweenTime, options = {}) ->
      @timer = @tweenTime.timer

      @$timeline = $(tpl_timeline)
      $('body').append(@$timeline)
      $('body').addClass('has-editor')

      @timeline = new Timeline(@tweenTime)
      @menu = new EditorMenu(@tweenTime, @$timeline)
      if options.onMenuCreated? then options.onMenuCreated(@$timeline.find('.editor__menu'))

      @propertiesEditor = new PropertiesEditor(@timeline, @timer)
      @propertiesEditor.keyAdded.add(@onKeyAdded)

      @controls = new EditorControls(@tweenTime, @$timeline)

      # Will help resize the canvas to correct size (minus sidebar and timeline)
      window.editorEnabled = true
      window.dispatchEvent(new Event('resize'))

    onKeyAdded: () =>
      @timeline.isDirty = true
