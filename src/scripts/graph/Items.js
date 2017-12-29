let d3 = require('d3');
let Signals = require('js-signals');
let _ = require('lodash');
import Utils from '../core/Utils';

export default class Items {
  constructor(timeline, container) {
    this.timeline = timeline;
    this.container = container;
    this.dy = 10 + this.timeline.margin.top;
    this.onUpdate = new Signals.Signal();
  }

  render() {
    const self = this;
    const tweenTime = self.timeline.tweenTime;
    const editor = self.timeline.editor;

    const selectBar = function(data) {
      self.timeline.selectionManager.select(data);
    };

    const dragmove = function(d) {
      const dx = self.timeline.x.invert(d3.event.x).getTime() / 1000;
      const diff = dx - d.start;
      d.start += diff;
      d.end += diff;
      if (d.properties) {
        for (var prop_key = 0; prop_key < d.properties.length; prop_key++) {
          var prop = d.properties[prop_key];
          for (var i = 0; i < prop.keys.length; i++) {
            var key = prop.keys[i];
            key.time += diff;
          }
        }
      }
      d._isDirty = true;
      self.onUpdate.dispatch();
    };

    const dragmoveLeft = function(d) {
      d3.event.sourceEvent.stopPropagation();
      var sourceEvent = d3.event.sourceEvent;
      var dx = self.timeline.x.invert(d3.event.x).getTime() / 1000;
      var timeMatch = false;
      if (sourceEvent.shiftKey) {
        timeMatch = Utils.getClosestTime(tweenTime.data, dx, d.id, false, tweenTime.timer);
      }
      if (!timeMatch) {
        var diff = dx - d.start;
        timeMatch = d.start + diff;
      }
      d.start = timeMatch;
      d._isDirty = true;
      self.onUpdate.dispatch();
    };

    const dragmoveRight = function(d) {
      d3.event.sourceEvent.stopPropagation();
      var sourceEvent = d3.event.sourceEvent;
      var dx = self.timeline.x.invert(d3.event.x).getTime() / 1000;
      var timeMatch = false;
      if (sourceEvent.shiftKey) {
        timeMatch = Utils.getClosestTime(tweenTime.data, dx, false, false, tweenTime.timer);
      }
      if (!timeMatch) {
        var diff = dx - d.end;
        timeMatch = d.end + diff;
      }
      d.end = timeMatch;
      d._isDirty = true;
      self.onUpdate.dispatch();
    };

    const dragLeft = d3.behavior.drag()
      .origin(function() {
        var t = d3.select(this);
        return {x: t.attr('x'), y: t.attr('y')};
      })
      .on('drag', dragmoveLeft);

    const dragRight = d3.behavior.drag()
      .origin(function() {
        var t = d3.select(this);
        return {x: t.attr('x'), y: t.attr('y')};
      })
      .on('drag', dragmoveRight);

    const drag = d3.behavior.drag()
      .origin(function() {
        var t = d3.select(this);
        return {x: t.attr('x'), y: t.attr('y')};
      })
      .on('drag', dragmove);

    const bar_border = 1;
    const bar = this.container.selectAll('.line-grp')
      .data(this.timeline.tweenTime.data, (d) => {return d.id;});

    const barEnter = bar.enter()
      .append('g').attr('class', 'line-grp');

    const barContainerRight = barEnter.append('svg')
      .attr({
        class: 'timeline__right-mask',
        width: window.innerWidth - self.timeline.label_position_x
      });

    bar.select('.timeline__right-mask')
      .attr({
        display: () => self.timeline.editor.curveEditEnabled ? 'none' : 'block',
        height: (d) => (d.properties.length + 1) * self.timeline.lineHeight
      });

    barContainerRight.append('rect')
      .attr('class', 'bar')
      // Add a unique id for SelectionManager.removeDuplicates
      .attr('id', () => {return Utils.guid();})
      .attr('y', 3)
      .attr('height', 14);

    barContainerRight.append('rect')
      .attr('class', 'bar-anchor bar-anchor--left')
      .attr('y', 2)
      .attr('height', 16)
      .attr('width', 6)
      .call(dragLeft);

    barContainerRight.append('rect')
      .attr('class', 'bar-anchor bar-anchor--right')
      .attr('y', 2)
      .attr('height', 16)
      .attr('width', 6)
      .call(dragRight);

    self.dy = 10 + this.timeline.margin.top;
    bar.attr('transform', function(d) {
      var y = self.dy;
      self.dy += self.timeline.lineHeight;
      if (!d.collapsed) {
        var numProperties = 0;
        if (d.properties) {
          if (editor.options.showEmptyProperties) {
            var visibleProperties = d.properties;
          } else {
            var visibleProperties = _.filter(d.properties, function(prop) {
              return prop.keys.length;
            });
          }
          numProperties = visibleProperties.length;
        }
        self.dy += numProperties * self.timeline.lineHeight;
      }
      return 'translate(0,' + y + ')';
    });

    const barWithStartAndEnd = function(d) {
      if (d.start !== undefined && d.end !== undefined) {
        return true;
      }
      return false;
    };

    bar.selectAll('.bar-anchor--left')
      .filter(barWithStartAndEnd)
      .attr('x', (d) => {return self.timeline.x(d.start * 1000) - 1;})
      .on('mousedown', function() {
        // Don't trigger mousedown on linescontainer else
        // it create the selection rectangle
        d3.event.stopPropagation();
      });

    bar.selectAll('.bar-anchor--right')
      .filter(barWithStartAndEnd)
      .attr('x', (d) => {return self.timeline.x(d.end * 1000) - 1;})
      .on('mousedown', function() {
        // Don't trigger mousedown on linescontainer else
        // it create the selection rectangle
        d3.event.stopPropagation();
      });

    bar.selectAll('.bar')
      .filter(barWithStartAndEnd)
      .attr('x', (d) => {return self.timeline.x(d.start * 1000) + bar_border;})
      .attr('width', function(d) {
        return Math.max(0, (self.timeline.x(d.end) - self.timeline.x(d.start)) * 1000 - bar_border);
      })
      .call(drag)
      .on('click', selectBar)
      .on('mousedown', function() {
        // Don't trigger mousedown on linescontainer else
        // it create the selection rectangle
        d3.event.stopPropagation();
      });

    barEnter.append('text')
      .attr('class', 'line-label')
      .attr('x', self.timeline.label_position_x + 10)
      .attr('y', 16)
      .text((d) => {return d.label;})
      .on('click', selectBar)
      .on('mousedown', function() {
        // Don't trigger mousedown on linescontainer else
        // it create the selection rectangle
        d3.event.stopPropagation();
      });

    barEnter.append('text')
      .attr('class', 'line__toggle')
      .attr('x', self.timeline.label_position_x - 10)
      .attr('y', 16)
      .on('click', function(d) {
        d.collapsed = !d.collapsed;
        self.onUpdate.dispatch();
      });

    bar.selectAll('.line__toggle').text(function(d) {
      if (d.collapsed) {
        return '▸';
      }
      return '▾';
    });

    barEnter.append('line')
      .attr('class', 'line-separator')
      .attr('x1', -self.timeline.margin.left)
      .attr('y1', self.timeline.lineHeight)
      .attr('y2', self.timeline.lineHeight);

    // Hide property line separator if curve editor is enabled.
    bar.selectAll('.line-separator')
      .attr('x2', function() {
        if (editor.curveEditEnabled) {
          return 0;
        }
        return self.timeline.x(self.timeline.timer.totalDuration + 100);
      });

    bar.exit().remove();

    return bar;
  }
}
