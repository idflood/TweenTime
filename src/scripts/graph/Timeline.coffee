$ = require 'jquery'
d3 = require 'd3'

Utils = require '../core/Utils'
Header = require './Header'
TimeIndicator = require './TimeIndicator'
Items = require './Items'
KeysPreview = require './KeysPreview'
Properties = require './Properties'
Keys = require './Keys'
Errors = require './Errors'
Selection = require './Selection'

extend = (object, properties) ->
  for key, val of properties
    object[key] = val
  object

class Timeline
  constructor: (@editor) ->
    @tweenTime = @editor.tweenTime
    @timer = @tweenTime.timer
    @selectionManager = @editor.selectionManager

    @_isDirty = true
    @timer = @tweenTime.timer
    @currentTime = @timer.time #used in timeindicator.

    @initialDomain = [0, 20 * 1000] # show from 0 to 20 seconds
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
      .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")

    @header = new Header(@timer, @initialDomain, @tweenTime, width, margin)
    @timeIndicator = new TimeIndicator(this, @svgContainerTime)

    @selection = new Selection(this, @svg, margin)

    @items = new Items(this, @linesContainer)
    @items.onUpdate.add(@onUpdate)
    @keysPreview = new KeysPreview(this, @linesContainer)

    @properties = new Properties(this)
    @properties.onKeyAdded.add (newKey, keyContainer) =>
      @_isDirty = true
      # render the timeline directly so that we can directly select
      # the new key with it's domElement.
      @render(0, false)
      @keys.selectNewKey(newKey, keyContainer)
    @errors = new Errors(this)
    @keys = new Keys(this)
    @keys.onKeyUpdated.add(@onUpdate)

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
      @_isDirty = true

    # First render
    window.requestAnimationFrame(@render)

    window.onresize = () =>
      INNER_WIDTH = window.innerWidth
      width = INNER_WIDTH - margin.left - margin.right
      @svg.attr("width", width + margin.left + margin.right)
      @svg.selectAll('.timeline__right-mask')
        .attr('width', INNER_WIDTH)
      @x.range([0, width])

      @_isDirty = true
      @header.resize(INNER_WIDTH)
      @render()

  onUpdate: () =>
    @editor.render(false, true)

  render: (time, time_changed) =>
    if time_changed
      # Update current domain when playing to keep time indicator in view.
      margin_ms = 16
      if @timer.getCurrentTime() > @initialDomain[1]
        domainLength = @initialDomain[1] - @initialDomain[0]
        @initialDomain[0] += domainLength - margin_ms
        @initialDomain[1] += domainLength - margin_ms
        @header.setDomain(@initialDomain)
      if @timer.getCurrentTime() < @initialDomain[0]
        domainLength = @initialDomain[1] - @initialDomain[0]
        @initialDomain[0] = @timer.getCurrentTime()
        @initialDomain[1] = @initialDomain[0] + domainLength
        @header.setDomain(@initialDomain)

    if @_isDirty || time_changed
      # Render header and time indicator everytime the time changed.
      @header.render()
      @timeIndicator.render()

    if @_isDirty
      # No need to call this on each frames, but only on brush, key drag, ...
      bar = @items.render()
      @keysPreview.render(bar)
      properties = @properties.render(bar)
      @errors.render(properties)
      @keys.render(properties)
      @_isDirty = false

      # Adapt the timeline height.
      height = Math.max(@items.dy + 30, 230)
      @xAxis.tickSize(-height, 0)
      @xAxisGrid.tickSize(-height, 0)
      @xGrid.call(@xAxisGrid)
      @xAxisElement.call(@xAxis)
      @svg.attr("height", height)

module.exports = Timeline