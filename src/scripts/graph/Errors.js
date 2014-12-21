let d3 = require('d3');
let Signals = require('js-signals');
import Utils from '../core/Utils';

export default class Errors {
  constructor(timeline) {
    this.timeline = timeline;
  }

  render(properties) {
    var self = this;
    var subGrp = self.timeline.properties.subGrp
    var propertiesWithError = function(d) {
      return d.errors != null;
    };
    // use insert with :first-child to prepend.
    var errorsGrp = subGrp.insert('svg', ':first-child')
      .attr('class','line-item__errors')
      .attr('width', window.innerWidth - self.timeline.label_position_x)
      .attr('height', self.timeline.lineHeight);

    var errorsValue = function(d, i, j) {
      return d.errors;
    };
    var errorTime = function(d, k) {
      return d.time;
    };

    var errors = properties.filter(propertiesWithError)
      .select('.line-item__errors').selectAll('.error')
      .data(errorsValue, errorTime);

    errors.enter().append('rect')
      .attr('class', 'error')
      .attr('width', 4)
      .attr('height', self.timeline.lineHeight - 1)
      .attr('y', '1');

    properties.selectAll('.error').attr('x', function(d) {
      var dx;
      dx = self.timeline.x(d.time * 1000);
      return dx;
    });

    errors.exit().remove();
  }
}
