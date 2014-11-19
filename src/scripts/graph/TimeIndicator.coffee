define (require) ->
  $ = require 'jquery'
  d3 = require 'd3'
  Signals = require 'Signal'

  class TimeIndicator
    constructor: (@timeline, @container) ->
      @timeSelection = @container.selectAll('.time-indicator').data(@timeline.currentTime)
      timeGrp = @timeSelection.enter().append("svg")
        .attr('class', "time-indicator timeline__right-mask")
        .attr('width', window.innerWidth - @timeline.label_position_x)
        .attr('height', 442)

      @timeSelection = timeGrp.append('rect')
        .attr('class', 'time-indicator__line')
        .attr('x', -1)
        .attr('y', -@timeline.margin.top - 5)
        .attr('width', 1)
        .attr('height', 1000)

    render: () =>
      @timeSelection = @container.selectAll('.time-indicator rect')
      @timeSelection.attr('x', @timeline.x(@timeline.currentTime[0]) - 0.5)
