define (require) ->
  Signals = require 'Signal'
  TweenMax = require 'TweenMax'
  TimelineMax = require 'TimelineMax'

  class Orchestrator
    constructor: (@timer, @data) ->
      @mainTimeline = new TimelineMax({paused: true})

      @updating = false
      @onUpdate = new Signals.Signal()
      @timer.updated.add(@update)
      @update(0)

    getTotalDuration: () => return @mainTimeline.totalDuration()

    getEasing: (key = false) ->
      if key && key.ease
        ease_index = key.ease.split('.')
        if ease_index.length == 2 && window[ease_index[0]] && window[ease_index[0]][ease_index[1]]
          return window[ease_index[0]][ease_index[1]]
      return Quad.easeOut

    update: (timestamp) =>
      seconds = timestamp / 1000
      has_dirty_items = false

      for item in @data
        # create the values object to contain all properties
        if !item.values
          item.values = {}
          #item.isDirty = true
          for key, property of item.properties
            if property.keys.length
              # Take the value of the first key as initial value.
              # @todo: update this when the value of the first key change. (when rebuilding the timeline, simply delete item.values before item.timeline)
              property.val = property.keys[0].val
            item.values[property.name] = property.val

        # Create the timeline if needed
        if !item.timeline
          item.timeline = new TimelineMax()
          @mainTimeline.add(item.timeline, 0)
          item.isDirty = true

        if item.isDirty then has_dirty_items = true

        if item.timeline and item.isDirty and item.properties
          item.isDirty = false
          #item.timeline.clear()

          for property in item.properties
            if property.timeline
              property.timeline.clear()
            else
              property.timeline = new TimelineMax()
              item.timeline.add(property.timeline, 0)

            propertyTimeline = property.timeline
            propName = property.name
            # Add a inital key, even if there is no animation to set the value from time 0.
            first_key = if property.keys.length > 0 then property.keys[0] else false
            tween_time = 0
            if first_key
              tween_time = Math.min(-1, first_key.time - 0.1)

            tween_duration = 0
            val = {}
            val[propName] = if first_key then first_key.val else property.val
            easing = @getEasing()
            val.ease = easing
            tween = TweenMax.to(item.values, tween_duration, val)
            propertyTimeline.add(tween, tween_time)

            for key, key_index in property.keys
              if key_index < property.keys.length - 1
                next_key = property.keys[key_index + 1]
                tween_duration = next_key.time - key.time

                val = {}
                val[propName] = next_key.val
                easing = @getEasing(next_key)
                val.ease = easing
                tween = TweenMax.to(item.values, tween_duration, val)
                propertyTimeline.add(tween, key.time)

            # Directly seek the property timeline to update the value.
            propertyTimeline.seek(seconds)
          # Force main timeline to refresh but never try to go to < 0
          # to prevent glitches when current time is 0.
          if seconds > 0
            seconds = seconds - 0.0000001
          else
            seconds = seconds + 0.0000001

      # Finally update the main timeline.
      @mainTimeline.seek(seconds)

      if has_dirty_items then @onUpdate.dispatch()
