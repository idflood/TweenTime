define (require) ->
  class EditorControls
    constructor: (@tweenTime, @$timeline) ->
      @timer = @tweenTime.timer
      @initControls()

      $(document).keypress (e) =>
        console.log e
        if e.charCode == 32
          # Space
          @playPause()

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

      $bt_first = @$timeline.find('.control--first')
      $bt_first.click (e) =>
        e.preventDefault()
        @timer.seek([0])

      $bt_last = @$timeline.find('.control--last')
      $bt_last.click (e) =>
        e.preventDefault()
        total = @tweenTime.getTotalDuration()
        @timer.seek([total * 1000])