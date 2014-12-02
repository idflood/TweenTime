define (require) ->
  class Exporter
    constructor: (@editor) ->

    getData: () =>
      tweenTime = @editor.tweenTime
      domain = @editor.timeline.x.domain()
      domain_start = domain[0]
      domain_end = domain[1]

      return {
        settings: {
          time: tweenTime.timer.getCurrentTime(),
          duration: tweenTime.timer.getDuration(),
          domain: [domain_start.getTime(), domain_end.getTime()]
        },
        data: tweenTime.data
      }

    getJSON: () =>
      options = @editor.options
      json_replacer = (key, val) ->
        # Disable all private properies from TweenMax/TimelineMax
        if key.indexOf('_') == 0 then return undefined
        if options.json_replacer? then return options.json_replacer(key, val)
        return val

      data = @getData()
      json = JSON.stringify(data, json_replacer, 2)
      return json