define (require) ->
  d3 = require 'd3'
  Signals = require 'Signal'
  Utils = require 'cs!core/Utils'

  class Keys
    constructor: (@timeline) ->
      @onKeyUpdated = new Signals.Signal()

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
        propertyData.keys = sortKeys(propertyData.keys)
        lineData.isDirty = true
        self.onKeyUpdated.dispatch()

      drag = d3.behavior.drag()
        .origin((d) -> return d;)
        .on("drag", dragmove)

      propValue = (d,i,j) -> d.keys
      propKey = (d, k) -> d.time
      keys = properties.select('.line-item__keys').selectAll('.key').data(propValue, propKey)

      selectKey = (d) ->
        propertyObject = this.parentNode
        lineObject = propertyObject.parentNode.parentNode
        lineData = d3.select(lineObject).datum()
        propertyData = d3.select(propertyObject).datum()

        d3.selectAll('.key__shape--selected').classed('key__shape--selected', false)
        d3.select(this).selectAll('rect').classed('key__shape--selected', true)
        self.timeline.onSelect.dispatch(lineData, d, propertyData, this)

      key_size = 6
      keys.enter()
        .append('g')
        .attr('class', 'key')
        .call(drag)
        .on('click', selectKey)
        .append('rect')
        .attr('x', -3)
        .attr('width', key_size)
        .attr('height', key_size)
        .attr('class', 'key__shape')
        .attr('transform', 'rotate(45)')

      keys.attr 'transform', (d) ->
        dx = self.timeline.x(d.time * 1000) + 3
        dy = 9
        return "translate(" + dx + "," + dy + ")"

      keys.exit().remove()
