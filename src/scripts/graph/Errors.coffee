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
      # use insert with :first-child to prepend.
      errorsGrp = subGrp.insert('svg', ':first-child')
        .attr('class','line-item__errors')
        .attr('width', window.innerWidth - self.timeline.label_position_x)
        .attr('height', self.timeline.lineHeight)
      errorsValue = (d,i,j) -> d.errors
      errorTime = (d, k) -> d.time
      errors = properties.filter(propertiesWithError).select('.line-item__errors').selectAll('.error').data(errorsValue, errorTime)
      errors.enter().append('rect')
        .attr('class', 'error')
        .attr('width', 4)
        .attr('height', self.timeline.lineHeight - 1)
        .attr('y', '1')

      properties.selectAll('.error')
        .attr 'x', (d) ->
          dx = self.timeline.x(d.time * 1000)
          return dx

      errors.exit().remove()
