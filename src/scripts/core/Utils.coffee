class Utils
  @formatMinutes: (d) ->
    # convert milliseconds to seconds
    d = d / 1000
    hours = Math.floor(d / 3600)
    minutes = Math.floor((d - (hours * 3600)) / 60)
    seconds = d - (minutes * 60)
    output = seconds + "s"
    output = minutes + "m " + output  if minutes
    output = hours + "h " + output  if hours
    return output

  @getClosestTime: (data, time, objectId = false, property_name = false, timer = false, tolerance = 0.1) ->
    if timer
      timer_time = timer.getCurrentTime() / 1000
      if Math.abs(timer_time - time) <= tolerance
        return timer_time

    if objectId || property_name
      for item in data
        # Don't match item with itself, but allow property to match item start/end.
        if item.id != objectId || property_name
          # First check start & end.
          if Math.abs(item.start - time) <= tolerance
            return item.start
          if Math.abs(item.end - time) <= tolerance
            return item.end

        # Test properties keys
        for prop in item.properties
          # Don't match property with itself.
          if prop.keys && (item.id != objectId || prop.name != property_name)
            for key in prop.keys
              if Math.abs(key.time - time) <= tolerance
                return key.time

    return false

  @getPreviousKey: (keys, time) ->
    prevKey = false
    for key in keys
      if key.time < time
        prevKey = key
      else
        return prevKey
    return prevKey

  @sortKeys: (keys) ->
    compare = (a, b) ->
      if a.time < b.time then return -1
      if a.time > b.time then return 1
      return 0
    return keys.sort(compare)

  @guid: () ->
    s4 = () -> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()

module.exports = Utils
