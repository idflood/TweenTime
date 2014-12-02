define (require) ->
  d3 = require 'd3'
  Signals = require 'Signal'
  _ = require 'lodash'
  Utils = require 'cs!core/Utils'

  class Items
    constructor: (@timeline, @container) ->
      @dy = 10 + @timeline.margin.top
      @onUpdate = new Signals.Signal()

    render: () =>
      self = this
      tweenTime = self.timeline.tweenTime

      selectBar = (d) ->
        self.timeline.selectionManager.select(this)

      dragmove = (d) ->
        dx = self.timeline.x.invert(d3.event.x).getTime() / 1000
        diff = (dx - d.start)
        d.start += diff
        d.end += diff
        if d.properties
          for prop in d.properties
            for key in prop.keys
              key.time += diff

        d._isDirty = true
        self.onUpdate.dispatch()

      dragmoveLeft = (d) ->
        d3.event.sourceEvent.stopPropagation()
        sourceEvent = d3.event.sourceEvent
        dx = self.timeline.x.invert(d3.event.x).getTime() / 1000
        timeMatch = false

        if sourceEvent.shiftKey
          timeMatch = Utils.getClosestTime(tweenTime.data, dx, d.id, false, tweenTime.timer)
        if !timeMatch
          diff = (dx - d.start)
          timeMatch = d.start + diff

        d.start = timeMatch
        d._isDirty = true
        self.onUpdate.dispatch()

      dragmoveRight = (d) ->
        d3.event.sourceEvent.stopPropagation()
        sourceEvent = d3.event.sourceEvent
        dx = self.timeline.x.invert(d3.event.x).getTime() / 1000
        timeMatch = false
        if sourceEvent.shiftKey
          timeMatch = Utils.getClosestTime(tweenTime.data, dx, false, false, tweenTime.timer)
        if !timeMatch
          diff = (dx - d.end)
          timeMatch = d.end + diff

        d.end = timeMatch
        d._isDirty = true
        self.onUpdate.dispatch()

      dragLeft = d3.behavior.drag()
        .origin((d) ->
          t = d3.select(this)
          return {x: t.attr('x'), y: t.attr('y')})
        .on("drag", dragmoveLeft)

      dragRight = d3.behavior.drag()
        .origin((d) ->
          t = d3.select(this)
          return {x: t.attr('x'), y: t.attr('y')})
        .on("drag", dragmoveRight)

      drag = d3.behavior.drag()
        .origin((d) ->
          t = d3.select(this)
          return {x: t.attr('x'), y: t.attr('y')})
        .on("drag", dragmove)

      bar_border = 1
      bar = @container.selectAll(".line-grp")
        .data(@timeline.tweenTime.data, (d) -> d.id)

      barEnter = bar.enter()
        .append('g').attr('class', 'line-grp')

      barContainerRight = barEnter.append('svg')
        .attr('class', 'timeline__right-mask')
        .attr('width', window.innerWidth - self.timeline.label_position_x)
        .attr('height', self.timeline.lineHeight)

      barContainerRight.append("rect")
        .attr("class", "bar")
        # Add a unique id for SelectionManager.removeDuplicates
        .attr('id', (d) -> Utils.guid())
        .attr("y", 3)
        .attr("height", 14)

      barContainerRight.append("rect")
        .attr("class", "bar-anchor bar-anchor--left")
        .attr("y", 2)
        .attr("height", 16)
        .attr("width", 6)
        .call(dragLeft)

      barContainerRight.append("rect")
        .attr("class", "bar-anchor bar-anchor--right")
        .attr("y", 2)
        .attr("height", 16)
        .attr("width", 6)
        .call(dragRight)

      self.dy = 10 + @timeline.margin.top
      bar.attr "transform", (d, i) ->
        y = self.dy
        self.dy += self.timeline.lineHeight
        if !d.collapsed
          numProperties = 0
          if d.properties
            # only show properties with keys
            visibleProperties = _.filter(d.properties, (prop) -> prop.keys.length)
            numProperties = visibleProperties.length
          self.dy += numProperties * self.timeline.lineHeight

        return "translate(0," + y + ")"

      barWithStartAndEnd = (d) ->
        if d.start? && d.end? then return true
        return false

      bar.selectAll('.bar-anchor--left')
        .filter(barWithStartAndEnd)
        .attr("x", (d) -> return self.timeline.x(d.start * 1000) - 1)
        .on('mousedown', () ->
          # Don't trigger mousedown on linescontainer else
          # it create the selection rectangle
          d3.event.stopPropagation()
        )

      bar.selectAll('.bar-anchor--right')
        .filter(barWithStartAndEnd)
        .attr("x", (d) -> return self.timeline.x(d.end * 1000) - 1)
        .on('mousedown', () ->
          # Don't trigger mousedown on linescontainer else
          # it create the selection rectangle
          d3.event.stopPropagation()
        )

      bar.selectAll('.bar')
        .filter(barWithStartAndEnd)
        .attr("x", (d) -> return self.timeline.x(d.start * 1000) + bar_border)
        .attr("width", (d) ->
          return Math.max(0, (self.timeline.x(d.end) - self.timeline.x(d.start)) * 1000 - bar_border)
        )
        .call(drag)
        .on("click", selectBar)
        .on('mousedown', () ->
          # Don't trigger mousedown on linescontainer else
          # it create the selection rectangle
          d3.event.stopPropagation()
        )

      barEnter.append("text")
        .attr("class", "line-label")
        .attr("x", self.timeline.label_position_x + 10)
        .attr("y", 16)
        .text((d) -> d.label)
        .on('click', selectBar)
        .on('mousedown', () ->
          # Don't trigger mousedown on linescontainer else
          # it create the selection rectangle
          d3.event.stopPropagation()
        )

      self = this
      barEnter.append("text")
        .attr("class", "line__toggle")
        .attr("x", self.timeline.label_position_x - 10)
        .attr("y", 16)
        .on 'click', (d) ->
          d.collapsed = !d.collapsed
          self.onUpdate.dispatch()

      bar.selectAll(".line__toggle")
        .text((d) -> if d.collapsed then "▸" else"▾")

      barEnter.append("line")
        .attr("class", 'line-separator')
        .attr("x1", -self.timeline.margin.left)
        .attr("x2", self.timeline.x(self.timeline.timer.totalDuration + 100))
        .attr("y1", self.timeline.lineHeight)
        .attr("y2", self.timeline.lineHeight)

      bar.exit().remove()

      return bar
