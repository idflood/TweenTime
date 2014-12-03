define (require) ->
  $ = require 'jquery'
  d3 = require 'd3'

  Signals = require 'Signal'
  Utils = require 'cs!core/Utils'

  class Header
    constructor: (@timer, @initialDomain, @tweenTime, width, margin) ->
      @onBrush = new Signals.Signal()
      @margin = {top: 10, right: 20, bottom: 0, left: margin.left}
      @height = 50 - @margin.top - @margin.bottom + 20

      @currentTime = @timer.time
      @x = d3.time.scale().range([0, width])
      @x.domain([0, @timer.totalDuration])

      # Same as @x from timeline
      @xDisplayed = d3.time.scale().range([0, width])
      @xDisplayed.domain(@initialDomain)

      @xAxis = d3.svg.axis()
        .scale(@x)
        .orient("top")
        .tickSize(-5, 0)
        .tickFormat(Utils.formatMinutes)

      @svg = d3.select('.timeline__header').append("svg")
        .attr("width", width + @margin.left + @margin.right)
        .attr("height", 56)
      @svgContainer = @svg.append("g")
        .attr("transform", "translate(" + @margin.left + "," + @margin.top + ")")

      @createBrushHandle()
      @createTimeHandle()
      @timer.durationChanged.add(@onDurationChanged)

    adaptDomainToDuration: (domain, seconds) =>
      ms = seconds * 1000
      new_domain = [domain[0], domain[1]]
      # Make the domain smaller or equal to ms.
      new_domain[0] = Math.min(new_domain[0], ms)
      new_domain[1] = Math.min(new_domain[1], ms)
      # Should not go below 0.
      new_domain[0] = Math.max(new_domain[0], 0)

      return new_domain

    onDurationChanged: (seconds) =>
      @x.domain([0, @timer.totalDuration])
      @xAxisElement.call(@xAxis)
      @initialDomain = @adaptDomainToDuration(@initialDomain, seconds)

      @brush.x(@x).extent(@initialDomain)
      @svgContainer.select('.brush').call(@brush)
      # Same as onBrush
      @onBrush.dispatch(@initialDomain)
      @render()
      @xDisplayed.domain(@initialDomain)

    createBrushHandle: () =>
      @xAxisElement = @svgContainer.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (@margin.top + 7) + ")")
        .call(@xAxis)

      onBrush = () =>
        extent0 = @brush.extent()
        # Get domain as milliseconds and not date.
        start = extent0[0].getTime()
        end = extent0[1].getTime()
        # Set the initial domain.
        @initialDomain[0] = start
        @initialDomain[1] = end
        @onBrush.dispatch(@initialDomain)
        @render()
        @xDisplayed.domain(@initialDomain)

      @brush = d3.svg.brush()
        .x(@x)
        .extent(@initialDomain)
        .on("brush", onBrush)

      @gBrush = @svgContainer.append("g")
        .attr("class", "brush")
        .call(@brush)
        .selectAll("rect")
        .attr('height', 20)

    render: () =>
      timeSelection = @svgContainer.selectAll('.time-indicator')
      timeSelection.attr('transform', 'translate(' + (@xDisplayed(@currentTime[0])) + ', 25)')

    createTimeHandle: () =>
      self = this

      dragTimeMove = (d) ->
        event = d3.event.sourceEvent
        event.stopPropagation()
        tweenTime = self.tweenTime
        event_x = if event.x? then event.x else event.clientX
        dx = self.xDisplayed.invert(event_x - self.margin.left)
        dx = dx.getTime()
        dx = Math.max(0, dx)

        timeMatch = false
        if event.shiftKey
          time = dx / 1000
          timeMatch = Utils.getClosestTime(tweenTime.data, time, '---non-existant')
          if timeMatch != false then timeMatch = timeMatch * 1000
        if timeMatch == false
          timeMatch = dx
        self.timer.seek([timeMatch])

      dragTime = d3.behavior.drag()
        .origin((d) -> return d;)
        .on("drag", dragTimeMove)

      timeSelection = @svgContainer.selectAll('.time-indicator').data(@currentTime)

      timeClicker = timeSelection.enter().append('rect')
        .attr('x', 0)
        .attr('y', 20)
        .attr('width', self.xDisplayed(self.timer.totalDuration))
        .attr('height', 50)
        .attr('fill-opacity', 0)
        .on('click', (d) ->
          mouse = d3.mouse(this)
          dx = self.xDisplayed.invert(mouse[0])
          dx = dx.getTime()
          dx = Math.max(0, dx)
          self.timer.seek([dx])
        )

      timeGrp = timeSelection.enter().append("g")
        .attr('class', "time-indicator")
        .attr("transform", "translate(-0.5," + 30 + ")")
        .call(dragTime)
      timeGrp.append('rect')
        .attr('class', 'time-indicator__line')
        .attr('x', -0.5)
        .attr('y', 0)
        .attr('width', 1)
        .attr('height', 1000)
      timeGrp.append('path')
        .attr('class', 'time-indicator__handle')
        .attr('d', 'M -5 -3 L -5 5 L 0 10 L 5 5 L 5 -3 L -5 -3')

      # Mask time indicator
      # todo: remove the mask.
      @svgContainer.append("rect")
        .attr("class", "graph-mask")
        .attr("x", -self.margin.left)
        .attr("y", -self.margin.top)
        .attr("width", self.margin.left - 20)
        .attr("height", self.height)

    resize: (width) =>
      width = width - @margin.left - @margin.right
      @svg.attr("width", width + @margin.left + @margin.right)


      @x.range([0, width])
      @xDisplayed.range([0, width])
      @xAxisElement.call(@xAxis)
