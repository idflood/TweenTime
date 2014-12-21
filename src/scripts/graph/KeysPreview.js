let d3 = require('d3');

export default class KeysPreview {
  constructor(timeline, container) {
    this.timeline = timeline;
    this.container = container;
  }

  render(bar) {
    var self = this;
    var tweenTime = self.timeline.tweenTime;

    var propVal = function(d, i) {
      if (d.properties) {
        return d.properties;
      } else {
        return [];
      }
    };
    var propKey = function(d) {
      return d.name;
    };

    var properties = bar.selectAll('.keys-preview').data(propVal, propKey);

    var subGrp = properties.enter()
      .append('svg')
      .attr("class", 'keys-preview timeline__right-mask')
      .attr('width', window.innerWidth - self.timeline.label_position_x)
      .attr('height', self.timeline.lineHeight);

    var setItemStyle = function(d) {
      var item = d3.select(this.parentNode.parentNode);
      var bar_data = item.datum();
      if (bar_data.collapsed === true) {
        return "";
      }
      // Show only when item is collapsed
      return "display: none;";
    }

    properties.selectAll('.key--preview')
      .attr("style", setItemStyle);

    var keyValue = function(d, i, j) {
      return d.keys;
    };
    var keyKey = function(d, k) {
      return d.time;
    };
    var keys = properties.selectAll('.key--preview').data(keyValue, keyKey);

    var key_item = keys.enter()
      .append('path')
      .attr('class', 'key--preview')
      .attr("style", setItemStyle)
      .attr('d', 'M 0 -4 L 4 0 L 0 4 L -4 0');

    keys.attr('transform', function(d) {
        var dx = self.timeline.x(d.time * 1000);
        dx = parseInt(dx, 10);
        var dy = 11;
        return "translate(" + dx + "," + dy + ")";
      });

    keys.exit().remove();
  }
}
