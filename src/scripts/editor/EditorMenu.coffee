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
