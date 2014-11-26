define (require) ->
  class EditorMenu
    constructor: (@tweenTime, @$timeline) ->
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
      json_replacer = (key, val) ->
        if key == 'timeline' then return undefined
        if key == 'tween' then return undefined
        if key == 'updating' then return undefined
        if key == 'isDirty' then return undefined
        # Disable all private properies from TweenMax/TimelineMax
        if key.indexOf('_') == 0 then return undefined
        return val

      @$timeline.find('[data-action="export"]').click (e) ->
        e.preventDefault()
        # Alternative to have nice looking json string.
        data = JSON.stringify(self.tweenTime.data, json_replacer, 2)
        a = document.createElement('a')
        a.target = '_blank'
        blob = new Blob([data], {"type": "text/plain;charset=utf-8"})
        a.href = (window.URL || webkitURL).createObjectURL(blob)
        a.click()
