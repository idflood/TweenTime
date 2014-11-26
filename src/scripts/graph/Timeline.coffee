define (require) ->
  $ = require 'jquery'
  d3 = require 'd3'

  Utils = require 'cs!core/Utils'
  Header = require 'cs!graph/Header'
  TimeIndicator = require 'cs!graph/TimeIndicator'
  Items = require 'cs!graph/Items'

  Properties = require 'cs!graph/Properties'
  Keys = require 'cs!graph/Keys'
  Errors = require 'cs!graph/Errors'
  Selection = require 'cs!graph/Selection'

  extend = (object, properties) ->
    for key, val of properties
      object[key] = val
    object

  class Timeline
    constructor: (@tweenTime, @selectionManager) ->
      @isDirty = true
      @timer = @tweenTime.timer
      @currentTime = @timer.time #used in timeindicator.
      @initialDomain = [0, @timer.totalDuration - 220 * 1000]
      margin = {top: 6, right: 20, bottom: 0, left: 265}
      this.margin = margin

      width = window.innerWidth - margin.left - margin.right
      height = 270 - margin.top - margin.bottom - 40
      @lineHeight = 20
      @label_position_x = -margin.left + 20

      @x = d3.time.scale().range([0, width])
      @x.domain(@initialDomain)

      @xAxis = d3.svg.axis()
        .scale(@x)
        .orient("top")
        .tickSize(-height, 0)
        .tickFormat(Utils.formatMinutes)

      @svg = d3.select('.timeline__main').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", 600)

      @svgContainer = @svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      @svgContainerTime = @svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")

      @linesContainer = @svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + (margin.top + 10) + ")")

      @header = new Header(@timer, @initialDomain, @tweenTime, width, margin)
      @timeIndicator = new TimeIndicator(this, @svgContainerTime)

      @selection = new Selection(this, @linesContainer)

      @items = new Items(this, @linesContainer)
      @items.onUpdate.add () => @isDirty = true

      @properties = new Properties(this)
      @properties.onKeyAdded.add (newKey, keyContainer) =>
        @isDirty = true
        # render the timeline directly so that we can directly select
        # the new key with it's domElement.
        @render(0, false)
        @keys.selectNewKey(newKey, keyContainer)
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

    render: (time, time_changed) =>
      if @isDirty || time_changed
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
