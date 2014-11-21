define (require) ->
  $ = require 'jquery'
  d3 = require 'd3'

  Signals = require 'Signal'
  Utils = require 'cs!core/Utils'

  class Header
    constructor: (@timer, @initialDomain, width) ->
      @onBrush = new Signals.Signal()
      @margin = {top: 10, right: 20, bottom: 0, left: 190}
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

    createBrushHandle: () =>
      @xAxisElement = @svgContainer.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (@margin.top + 7) + ")")
        .call(@xAxis)

      onBrush = () =>
        extent0 = @brush.extent()
        @onBrush.dispatch(extent0)
        @render()
        @xDisplayed.domain(extent0)

      @brush = d3.svg.brush()
        .x(@x)
        .extent(@initialDomain)
        .on("brush", onBrush)

      gBrush = @svgContainer.append("g")
        .attr("class", "brush")
        .call(@brush)
        .selectAll("rect")
        .attr('height', 20)

    render: () =>
      timeSelection = @svgContainer.selectAll('.time-indicator')
      timeSelection.attr('transform', 'translate(' + (@xDisplayed(@currentTime[0]) + 0.5) + ', 25)')

    createTimeHandle: () =>
      self = this

      dragTimeMove = (d) ->
        d3.event.sourceEvent.stopPropagation()
        event = d3.event.sourceEvent
        event_x = if event.x? then event.x else event.clientX
        dx = self.xDisplayed.invert(event_x - self.margin.left)
        dx = dx.getTime()
        dx = Math.max(0, dx)
        self.timer.seek([dx])

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
        .attr("transform", "translate(0," + 30 + ")")
        .call(dragTime)
      timeGrp.append('rect')
        .attr('class', 'time-indicator__line')
        .attr('x', -1)
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
