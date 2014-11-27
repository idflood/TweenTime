define (require) ->
  d3 = require 'd3'
  Signals = require 'Signal'
  Utils = require 'cs!core/Utils'
  _ = require 'lodash'

  class Keys
    constructor: (@timeline) ->
      @onKeyUpdated = new Signals.Signal()

    selectNewKey: (data, container) ->
      self = this
      key = d3.select(container).selectAll('.key').filter((item) ->
        return item.time == data.time
      )
      if key.length
        d3.selectAll('.key__shape--selected').classed('key__shape--selected', false)
        key.selectAll('rect').classed('key__shape--selected', true)
        key = key[0][0]
        self.timeline.selectionManager.select(key)

    render: (properties) ->
      self = this
      tweenTime = self.timeline.tweenTime

      sortKeys = (keys) -> keys.sort((a, b) -> d3.ascending(a.time, b.time))

      dragmove = (d) ->
        sourceEvent = d3.event.sourceEvent
        propertyObject = this.parentNode
        lineObject = propertyObject.parentNode.parentNode
        propertyData = d3.select(propertyObject).datum()
        lineData = d3.select(lineObject).datum()

        currentDomainStart = self.timeline.x.domain()[0]
        mouse = d3.mouse(this)
        old_time = d.time
        dx = self.timeline.x.invert(mouse[0])
        dx = dx.getTime()
        dx = dx / 1000 - currentDomainStart / 1000
        dx = d.time + dx

        timeMatch = false
        if sourceEvent.shiftKey
          timeMatch = Utils.getClosestTime(tweenTime.data, dx, lineData.id, propertyData.name, tweenTime.timer)
        if timeMatch == false
          timeMatch = dx

        d.time = timeMatch
        time_offset = d.time - old_time

        selection = self.timeline.selectionManager.getSelection()
        selection = _.filter(selection, (item) => item.isEqualNode(this) == false)
        if selection.length
          for item in selection
            data = d3.select(item).datum()
            data.time += time_offset
            itemPropertyObject = item.parentNode
            itemPropertyData = d3.select(itemPropertyObject).datum()
            itemLineObject = itemPropertyObject.parentNode.parentNode
            itemLineData = d3.select(itemLineObject).datum()
            itemLineData.isDirty = true
            itemPropertyData.keys = sortKeys(itemPropertyData.keys)

        lineData.isDirty = true
        self.onKeyUpdated.dispatch()

      propValue = (d,i,j) -> d.keys
      propKey = (d, k) -> d.time
      keys = properties.select('.line-item__keys').selectAll('.key').data(propValue, propKey)

      # selectKey is triggered by dragstart event
      selectKey = (d) ->
        event = d3.event
        console.log event
        # with dragstart event the mousevent is is inside the event.sourcEvent
        if event.sourceEvent then event = event.sourceEvent

        addToSelection = event.shiftKey
        # if element is already selectionned and we are on
        # the dragstart event, we stop there since it is already selected.
        if d3.event.type && d3.event.type == "dragstart"
          if d3.select(this).selectAll('rect').classed('key__shape--selected')
            return

        if !addToSelection
          d3.selectAll('.key__shape--selected').classed('key__shape--selected', false)
        d3.select(this).selectAll('rect').classed('key__shape--selected', true)

        self.timeline.selectionManager.select(this, addToSelection)

      drag = d3.behavior.drag()
        .origin((d) -> return d;)
        .on("drag", dragmove)
        .on("dragstart", selectKey)

      key_size = 6
      keys.enter()
        .append('g')
        .attr('class', 'key')
        .on('mousedown', () ->
          # Don't trigger mousedown on linescontainer else
          # it create the selection rectangle
          d3.event.stopPropagation()
        )
        .call(drag)
        .append('rect')
        .attr('x', -3)
        .attr('width', key_size)
        .attr('height', key_size)
        .attr('class', 'key__shape')
        .attr('transform', 'rotate(45)')

      keys.attr 'transform', (d) ->
        dx = self.timeline.x(d.time * 1000) + 2
        dy = 9
        return "translate(" + dx + "," + dy + ")"

      keys.exit().remove()
