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

  class Editor
    constructor: (@tweenTime) ->
      @timer = @tweenTime.timer

      @$timeline = $(tpl_timeline)
      $('body').append(@$timeline)
      $('body').addClass('has-editor')

      @timeline = new Timeline(@tweenTime)
      @initControls()
      @initExport()
      @initAdd()
      @initPropertiesEditor()
      @initToggle()

      $(document).keypress (e) =>
        console.log e
        if e.charCode == 32
          # Space
          @playPause()

      # Will help resize the canvas to correct size (minus sidebar and timeline)
      window.editorEnabled = true
      window.dispatchEvent(new Event('resize'))

    initToggle: () ->
      timelineClosed = false
      $toggleLink = @$timeline.find('[data-action="toggle"]')
      $toggleLink.click (e) =>
        e.preventDefault()
        timelineClosed = !timelineClosed
        $toggleLink.toggleClass('menu-item--toggle-up', timelineClosed)
        $('body').toggleClass('timeline-is-closed', timelineClosed)
        window.dispatchEvent(new Event('resize'))

      propertiesClosed = false
      $toggleLinkSide = $('.properties-editor').find('[data-action="toggle"]')
      $toggleLinkSide.click (e) =>
        e.preventDefault()
        propertiesClosed = !propertiesClosed
        $toggleLinkSide.toggleClass('menu-item--toggle-left', propertiesClosed)
        $('body').toggleClass('properties-is-closed', propertiesClosed)

        window.dispatchEvent(new Event('resize'))


    onKeyAdded: () =>
      @timeline.isDirty = true

    initPropertiesEditor: () ->
      @propertiesEditor = new PropertiesEditor(@timeline, @timer)
      @propertiesEditor.keyAdded.add(@onKeyAdded)

    initAdd: () ->
      if !window.ElementFactory then return
      $container = @$timeline.find('.submenu--add')
      elements = window.ElementFactory.elements
      self = this

      for element_name, element of elements
        # body...
        $link = $('<a href="#" data-key="' + element_name + '">' + element_name + '</a>')
        $container.append($link)

      $container.find('a').click (e) ->
        e.preventDefault()
        element_name = $(this).data('key')
        if ElementFactory.elements[element_name]
          all_data = self.tweenTime.data
          next_id = all_data.length + 1
          id = "item" + next_id
          label = element_name + " " + next_id
          current_time = self.tweenTime.timer.time[0] / 1000
          data =
            isDirty: true
            id: id
            label: label
            type: element_name
            start: current_time
            end: current_time + 2
            collapsed: false
            properties: []
            #options: window.ElementFactory.elements[element_name].default_attributes()
            #properties: window.ElementFactory.elements[element_name].default_properties(current_time)
          self.tweenTime.data.push(data)
          self.timeline.isDirty = true

    initExport: () ->
      self = this
      copyAndClean = (source) ->
        target = []
        for obj in source

          new_data =
            id: obj.id,
            type: obj.type,
            label: obj.label,
            start: obj.start,
            end: obj.end,
            collapsed: obj.collapsed,
            properties: obj.properties

          target.push(new_data)

        return target
      @$timeline.find('[data-action="export"]').click (e) ->
        e.preventDefault()
        # @todo: use second parameter of JSON.stringify to export clean json.
        export_data = copyAndClean(self.tweenTime.data)
        # Alternative to heave nice looking json string.
        data = JSON.stringify(export_data, null, 2)

        console.log data

    playPause: () =>
      @timer.toggle()
      $play_pause = @$timeline.find('.control--play-pause')
      $play_pause.toggleClass('icon-pause', @timer.is_playing)
      $play_pause.toggleClass('icon-play', !@timer.is_playing)

    initControls: () ->
      $play_pause = @$timeline.find('.control--play-pause')
      $play_pause.click (e) =>
        e.preventDefault()
        @playPause()
