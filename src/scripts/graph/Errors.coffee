define (require) ->
  d3 = require 'd3'
  Signals = require 'Signal'
  Utils = require 'cs!core/Utils'

  class Errors
    constructor: (@timeline) ->

    render: (properties) ->
      self = this
      subGrp = self.timeline.properties.subGrp
      propertiesWithError = (d) -> d.errors?
      errorsGrp = subGrp.append('svg')
        .attr('class','property__errors')
        .attr('width', window.innerWidth - self.timeline.label_position_x)
        .attr('height', self.timeline.lineHeight)
      errorsValue = (d,i,j) -> d.errors
      errorTime = (d, k) -> d.time
      errors = properties.filter(propertiesWithError).selectAll('.property__error').data(errorsValue, errorTime)
      errors.enter().append('rect')
        .attr('class', 'property__error')
        .attr('width', 4)
        .attr('height', self.timeline.lineHeight)
        .attr('y', '1')

      properties.selectAll('.property__error')
        .attr 'x', (d) ->
          dx = self.timeline.x(d.time * 1000)
          return dx

      errors.exit().remove()
