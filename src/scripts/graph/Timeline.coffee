define (require) ->
  $ = require 'jquery'
  d3 = require 'd3'
  Signals = require 'Signal'

  Utils = require 'cs!core/Utils'
  Header = require 'cs!graph/Header'
  TimeIndicator = require 'cs!graph/TimeIndicator'
  Items = require 'cs!graph/Items'

  Properties = require 'cs!graph/Properties'
  Keys = require 'cs!graph/Keys'
  Errors = require 'cs!graph/Errors'

  extend = (object, properties) ->
    for key, val of properties
      object[key] = val
    object

  class Timeline
    constructor: (@tweenTime) ->
      @isDirty = true
      @onSelect = new Signals.Signal()
      @timer = @tweenTime.timer
      @currentTime = @timer.time #used in timeindicator.
      @lastTime = @currentTime[0]
      @initialDomain = [0, @timer.totalDuration - 220 * 1000]
      margin = {top: 6, right: 20, bottom: 0, left: 190}
      this.margin = margin

      width = window.innerWidth - margin.left - margin.right
      height = 270 - margin.top - margin.bottom - 40
      @lineHeight = 20
      @label_position_x = -170
      console.log d3
      console.log d3.time
      console.log d3.time.scale
      @x = d3.time.scale().range([0, width])
      @x.domain(@initialDomain)

      @xAxis = d3.svg.axis()
        .scale(@x)
        .orient("top")
        .tickSize(-height, 0)
        .tickFormat(Utils.formatMinutes)

      @svg = d3.select('.editor__time-main').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", 600)

      @svgContainer = @svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      @svgContainerTime = @svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")

      @linesContainer = @svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + (margin.top + 10) + ")")

      @header = new Header(@timer, @initialDomain, width)
      @timeIndicator = new TimeIndicator(this, @svgContainerTime)

      @items = new Items(this, @linesContainer)
      @items.onUpdate.add () => @isDirty = true
      # Propagate onSelect event.
      @items.onSelect.add (d) => @onSelect.dispatch(d)
      @properties = new Properties(this)
      @properties.onKeyAdded.add () => @isDirty = true
      @errors = new Errors(this)
      @keys = new Keys(this)
      @keys.onKeyUpdated.add () => @isDirty = true

      @xAxisGrid = d3.svg.axis()
        .scale(@x)
        .ticks(100)
        .tickSize(-@items.dy, 0)
        .tickFormat("")
        .orient("top")

      @xGrid = @svgContainer.append('g')
        .attr('class', 'x axis grid')
        .attr("transform", "translate(0," + margin.top + ")")
        .call(@xAxisGrid)

      @xAxisElement = @svgContainer.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + margin.top + ")")
        .call(@xAxis)

      @header.onBrush.add (extent) =>
        @x.domain(extent)
        @xGrid.call(@xAxisGrid)
        @xAxisElement.call(@xAxis)
        @isDirty = true

      # First render
      window.requestAnimationFrame(@render)

      window.onresize = () =>
        INNER_WIDTH = window.innerWidth
        width = INNER_WIDTH - margin.left - margin.right
        @svg.attr("width", width + margin.left + margin.right)
        @svg.selectAll('.timeline__right-mask')
          .attr('width', INNER_WIDTH)
        @x.range([0, width])

        @xGrid.call(@xAxisGrid)
        @xAxisElement.call(@xAxis)
        @header.resize(INNER_WIDTH)

    render: () =>
      if @isDirty || @timer.time[0] != @lastTime
        @header.render()
        @timeIndicator.render()

      if @isDirty
        # No need to call this on each frames, but only on brush, key drag, ...
        bar = @items.render()
        properties = @properties.render(bar)
        @errors.render(properties)
        @keys.render(properties)
        @isDirty = false

        # Adapt the timeline height.
        height = Math.max(@items.dy + 30, 230)
        @xAxis.tickSize(-height, 0)
        @xAxisGrid.tickSize(-height, 0)
        @xGrid.call(@xAxisGrid)
        @xAxisElement.call(@xAxis)
        @svg.attr("height", height)

      @lastTime = @timer.time[0]
      window.requestAnimationFrame(@render)
