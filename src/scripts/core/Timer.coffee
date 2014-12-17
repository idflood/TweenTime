Signals = require 'js-signals'

class Timer
  constructor: () ->
    # in millisecond
    @totalDuration = 240 * 1000
    # Use an array for the time for easier d3.js integration (used as data for timeseeker).
    @time = [0]
    @is_playing = false
    @last_timeStamp = -1
    @last_time = -1
    @updated = new Signals.Signal()
    @statusChanged = new Signals.Signal()
    @durationChanged = new Signals.Signal()
    @seeked = new Signals.Signal()
    window.requestAnimationFrame(@update)

  getCurrentTime: () => @time[0]

  getDuration: () ->
    return @totalDuration / 1000

  setDuration: (seconds) ->
    @totalDuration = seconds * 1000
    @durationChanged.dispatch(seconds)

  play: () ->
    @is_playing = true
    @statusChanged.dispatch(@is_playing)

  stop: () ->
    @is_playing = false
    @statusChanged.dispatch(@is_playing)

  toggle: () ->
    @is_playing = !@is_playing
    @statusChanged.dispatch(@is_playing)

  seek: (time) ->
    @time[0] = time[0]
    @seeked.dispatch(@time[0])

  update: (timestamp) =>
    # Init timestamp
    if @last_timeStamp == -1 then @last_timeStamp = timestamp
    elapsed = timestamp - @last_timeStamp

    if @is_playing
      @time[0] += elapsed

    if @time[0] >= @totalDuration
      # Stop timer when reaching the end.
      @time[0] = @totalDuration
      @stop()

    #if @last_time != @time[0]
    @updated.dispatch(@time[0])

    @last_timeStamp = timestamp
    @last_time = @time[0]
    window.requestAnimationFrame(@update)

module.exports = Timer
