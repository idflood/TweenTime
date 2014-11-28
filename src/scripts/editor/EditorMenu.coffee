define (require) ->
  saveAs = require 'FileSaver'

  class EditorMenu
    constructor: (@tweenTime, @$timeline, @editor) ->
      @timer = @tweenTime.timer

      @initExport()
      @initToggle()

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

    initExport: () ->
      self = this
      exporter = @editor.exporter

      @$timeline.find('[data-action="export"]').click (e) ->
        e.preventDefault()
        data = exporter.getJSON()
        blob = new Blob([data], {"type": "text/json;charset=utf-8"})
        saveAs(blob, 'data.json')
