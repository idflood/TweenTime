define (require) ->
  class EditorControls
    constructor: (@tweenTime, @$timeline) ->
      @timer = @tweenTime.timer
      @$time = @$timeline.find('.control--time')
      @last_time = -1
      @initControls()

      $(document).keypress (e) =>
        console.log e
        if e.charCode == 32
          # Space
          @playPause()

      window.requestAnimationFrame(@render)

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

      @$time.change (e) =>
        seconds = parseFloat(@$time.val(), 10) * 1000
        @timer.seek([seconds])

    render: () =>
      time = @timer.getCurrentTime() / 1000
      if time != @last_time
        @$time.val(time.toFixed(3))
        @last_time = time

      window.requestAnimationFrame(@render)