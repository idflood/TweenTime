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
    constructor: (@tweenTime, @selectionManager) ->
      @isDirty = true
      @onSelect = new Signals.Signal()
      @timer = @tweenTime.timer
      @currentTime = @timer.time #used in timeindicator.
      @initialDomain = [0, @timer.totalDuration - 220 * 1000]
      margin = {top: 6, right: 20, bottom: 0, left: 190}
      this.margin = margin

      width = window.innerWidth - margin.left - margin.right
      height = 270 - margin.top - margin.bottom - 40
      @lineHeight = 20
      @label_position_x = -170

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

      @header = new Header(@timer, @initialDomain, @tweenTime, width)
      @timeIndicator = new TimeIndicator(this, @svgContainerTime)

      self = this
      console.log @linesContainer
      @linesContainer.on("mousedown", () ->
        p = d3.mouse(this)
        self.linesContainer.append('rect')
          .attr({
            rx: 6,
            ry: 6,
            class: 'selection',
            x: p[0],
            y: p[1],
            width: 0,
            height: 0
          })
      ).on("mousemove", () ->
        s = self.linesContainer.select('.selection')
        if s.empty() then return
        p = d3.mouse(this)
        d = {
          x: parseInt(s.attr('x'), 10),
          y: parseInt(s.attr('y'), 10),
          width: parseInt(s.attr('width'), 10),
          height: parseInt(s.attr('height'), 10)
        }
        move = {
          x: p[0] - d.x,
          y: p[1] - d.y
        }
        if move.x < 1 || move.x * 2 < d.width
          d.x = p[0]
          d.width -= move.x
        else
          d.width = move.x

        if move.y < 1 || move.y * 2 < d.height
          d.y = p[1]
          d.height -= move.y
        else
          d.height = move.y

        s.attr(d)


        d.timeStart = self.x.invert(d.x).getTime() / 1000
        d.timeEnd = self.x.invert(d.x + d.width).getTime() / 1000

        containerBounding = self.linesContainer[0][0].getBoundingClientRect()

        # not sure why there is ~15px difference in y
        d.y -= 15

        # deselect all previously selected items
        d3.selectAll('.key__shape--selected').classed('key__shape--selected', false)
        self.selectionManager.reset()
        d3.selectAll('.key').each (state_data, i) ->
          #console.log state_data
          itemBounding = d3.select(this)[0][0].getBoundingClientRect()
          y = itemBounding.top - containerBounding.top
          if state_data.time >= d.timeStart && state_data.time <= d.timeEnd
            # use or condition for top and bottom
            if (y >= d.y && y <= d.y + d.height) || (y + 10 >= d.y && y + 10 <= d.y + d.height)
              d3.select(this).selectAll('rect').classed('key__shape--selected', true)
              self.selectionManager.select(this, true)
          #console.log

      ).on("mouseup", () ->
        self.linesContainer.selectAll('.selection').remove()
      )

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
