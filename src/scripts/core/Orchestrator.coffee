define (require) ->
  Signals = require 'Signal'
  TweenMax = require 'TweenMax'
  TimelineMax = require 'TimelineMax'

  class Orchestrator
    constructor: (@timer, @data) ->
      @mainTimeline = new TimelineMax({paused: true})
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
          # Add a dom element for color tweening and other css properties.
          item._domHelper = document.createElement('div')
          #item._isDirty = true
          for key, property of item.properties
            if property.keys.length
              # Take the value of the first key as initial value.
              # @todo: update this when the value of the first key change. (when rebuilding the timeline, simply delete item.values before item._timeline)
              property.val = property.keys[0].val
            item.values[property.name] = property.val

            if property.type && property.type == "color"
              # If the property is a color mark it as css
              property.css = true

            if property.css
              # If property is a css or a color value apply it to the domHelper element.
              item._domHelper.style[property.name] = property.val

        # Create the timeline if needed
        if !item._timeline
          item._timeline = new TimelineMax()
          @mainTimeline.add(item._timeline, 0)
          item._isDirty = true

        if item._isDirty then has_dirty_items = true

        if item._timeline and item._isDirty and item.properties
          item._isDirty = false
          #item._timeline.clear()

          for property in item.properties
            if property._timeline
              property._timeline.clear()
            else
              property._timeline = new TimelineMax()
              item._timeline.add(property._timeline, 0)

            propertyTimeline = property._timeline
            propName = property.name
            # Add a inital key, even if there is no animation to set the value from time 0.
            first_key = if property.keys.length > 0 then property.keys[0] else false
            tween_time = 0
            if first_key
              tween_time = Math.min(-1, first_key.time - 0.1)

            tween_duration = 0
            val = {}
            easing = @getEasing()
            val.ease = easing
            data_target = item.values
            if property.css
              val.css = {}
              val.css[propName] = if first_key then first_key.val else property.val
              data_target = item._domHelper
            else
              val[propName] = if first_key then first_key.val else property.val

            tween = TweenMax.to(data_target, tween_duration, val)
            propertyTimeline.add(tween, tween_time)

            for key, key_index in property.keys
              if key_index < property.keys.length - 1
                next_key = property.keys[key_index + 1]
                tween_duration = next_key.time - key.time

                val = {}
                easing = @getEasing(next_key)
                val.ease = easing
                if property.css
                  val.css = {}
                  val.css[propName] = next_key.val
                else
                  val[propName] = next_key.val

                tween = TweenMax.to(data_target, tween_duration, val)
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

      # update the css properties.
      for item in @data
        if item._domHelper
          # Only if item has a domHelper.
          for property in item.properties
            if property.css
              # Only css values.
              item.values[property.name] = item._domHelper.style[property.name]

      if has_dirty_items then @onUpdate.dispatch()
