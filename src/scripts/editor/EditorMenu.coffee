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
      options = self.editor.options
      json_replacer = (key, val) ->
        if key == 'timeline' then return undefined
        if key == 'tween' then return undefined
        if key == 'updating' then return undefined
        if key == 'isDirty' then return undefined
        # Disable all private properies from TweenMax/TimelineMax
        if key.indexOf('_') == 0 then return undefined
        if options.json_replacer? then return options.json_replacer(key, val)
        return val

      @$timeline.find('[data-action="export"]').click (e) ->
        e.preventDefault()
        # Alternative to have nice looking json string.
        domain = self.editor.timeline.x.domain()
        domain_start = domain[0]
        domain_end = domain[1]

        data = {
          settings: {
            time: self.tweenTime.timer.getCurrentTime(),
            duration: self.tweenTime.timer.getDuration(),
            domain: [domain_start.getTime(), domain_end.getTime()]
          },
          data: self.tweenTime.data
        }
        data = JSON.stringify(data, json_replacer, 2)
        blob = new Blob([data], {"type": "text/json;charset=utf-8"})
        saveAs(blob, 'data.json')
