let d3 = require('d3');
let Signals = require('js-signals');
import Utils from '../core/Utils';

export default class Properties {
  constructor(timeline) {
    this.timeline = timeline;
    this.onKeyAdded = new Signals.Signal();
    this.subGrp = false;
  }

  render(bar) {
    var self = this;

    var propVal = function(d) {
      if (d.properties) {
        return d.properties.filter((prop) => {return prop.keys.length;});
      } else {
        return [];
      }
    };
    var propKey = function(d) {
      return d.name;
    };

    var properties = bar.selectAll('.line-item').data(propVal, propKey);
    var subGrp = properties.enter()
      .append('g')
      .attr("class", 'line-item');

    // Save subGrp in a variable for use in Errors.coffee
    self.subGrp = subGrp;

    properties.attr ("transform", function(d, i) {
        var sub_height = (i + 1) * self.timeline.lineHeight;
        return "translate(0," + sub_height + ")";
      });

    subGrp.append('rect')
      .attr('class', 'click-handler click-handler--property')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', self.timeline.x(self.timeline.timer.totalDuration + 100))
      .attr('height', self.timeline.lineHeight)
      .on('dblclick', function(d) {
        var lineObject = this.parentNode.parentNode;
        var lineValue = d3.select(lineObject).datum();
        var def = d["default"] ? d["default"] : 0;
        var mouse = d3.mouse(this);
        var dx = self.timeline.x.invert(mouse[0]);
        dx = dx.getTime() / 1000;
        var prevKey = Utils.getPreviousKey(d.keys, dx);
        // set the value to match the previous key if we found one
        if (prevKey) {
          def = prevKey.val;
        }
        d._line = lineValue;
        var newKey = {
          time: dx,
          val: def,
          _property: d
        };
        d.keys.push(newKey);
        // Sort the keys for tweens creation
        d.keys = Utils.sortKeys(d.keys);

        lineValue._isDirty = true;
        var keyContainer = this.parentNode;
        self.onKeyAdded.dispatch(newKey, keyContainer);
      });

    // Mask
    subGrp.append('svg')
      .attr('class','line-item__keys timeline__right-mask')
      .attr('width', window.innerWidth - self.timeline.label_position_x)
      .attr('height', self.timeline.lineHeight)
      .attr('fill', '#f00');

    subGrp.append('text')
      .attr("class", "line-label line-label--small")
      .attr("x", self.timeline.label_position_x + 10)
      .attr("y", 15)
      .text(function(d) {
        return d.name;
      });

    subGrp.append("line")
      .attr("class", 'line-separator--secondary')
      .attr("x1", -self.timeline.margin.left)
      .attr("x2", self.timeline.x(self.timeline.timer.totalDuration + 100))
      .attr("y1", self.timeline.lineHeight)
      .attr("y2", self.timeline.lineHeight);

    bar.selectAll('.line-item').attr('display', function() {
        var lineObject = this.parentNode;
        var lineValue = d3.select(lineObject).datum();
        if (!lineValue.collapsed) {
          return "block";
        } else {
          return "none";
        }
      });

    properties.exit().remove();

    return properties;
  }
}
