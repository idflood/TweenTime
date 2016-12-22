let d3 = require('d3');
let Signals = require('js-signals');
import Utils from '../core/Utils';
let _ = require('lodash');

export default class Keys {
  constructor(timeline) {
    this.timeline = timeline;
    this.onKeyUpdated = new Signals.Signal();
  }

  selectNewKey(data) {
    var self = this;
    var key = d3.selectAll('.key').filter(function(item) {
      return item._id === data._id;
    });
    if (key.length) {
      d3.selectAll('.key--selected').classed('key--selected', false);
      key.classed('key--selected', true);
      key = key[0][0];
      data._dom = key;
      self.timeline.selectionManager.select(data);
    }
  }

  render(properties) {
    const self = this;
    const tweenTime = self.timeline.tweenTime;

    const dragmove = function(key_data) {
      const sourceEvent = d3.event.sourceEvent;
      const propertyData = key_data._property;
      const lineData = propertyData._line;

      const currentDomainStart = self.timeline.x.domain()[0];
      var mouse = d3.mouse(this);
      var old_time = key_data.time;
      var dx = self.timeline.x.invert(mouse[0]);
      dx = dx.getTime();
      dx = dx / 1000 - currentDomainStart / 1000;
      dx = key_data.time + dx;

      var selection = self.timeline.selectionManager.getSelection();
      var selection_first_time = false;
      var selection_last_time = false;
      if (selection.length) {
        selection_first_time = selection[0].time;
        selection_last_time = selection[selection.length - 1].time;
      }

      selection = _.filter(selection, (item) => {return _.isEqual(item, key_data) === false;});

      var timeMatch = false;
      if (sourceEvent.shiftKey) {
        timeMatch = Utils.getClosestTime(tweenTime.data, dx, lineData.id, propertyData.name, tweenTime.timer);
      }
      if (timeMatch === false) {
        timeMatch = dx;
      }

      key_data.time = timeMatch;
      // Sort the keys of the current selected item.
      propertyData.keys = Utils.sortKeys(propertyData.keys);
      var time_offset = key_data.time - old_time;

      var updateKeyItem = function(item) {
        var property = item._property;
        property._line._isDirty = true;
        property.keys = Utils.sortKeys(property.keys);
      };

      var key_scale = false;
      var is_first = false;
      if (selection.length) {
        if (sourceEvent.altKey && selection_first_time !== false && selection_last_time !== false) {
          is_first = selection_first_time === old_time;
          if (is_first) {
            key_scale = (selection_last_time - key_data.time) / (selection_last_time - old_time);
          }
          else {
            key_scale = (key_data.time - selection_first_time) / (old_time - selection_first_time);
          }
        }

        for (var i = 0; i < selection.length; i++) {
          var data = selection[i];
          if (key_scale === false) {
            data.time += time_offset;
          }
          else {
            if (is_first) {
              data.time = selection_last_time - (selection_last_time - data.time) * key_scale;
            }
            else {
              data.time = selection_first_time + (data.time - selection_first_time) * key_scale;
            }
          }
          updateKeyItem(data);
        }
      }

      lineData._isDirty = true;
      self.onKeyUpdated.dispatch();
    };

    var propValue = function(d) {
      return d.keys;
    };
    var propKey = function(d) {
      if (!d._id) {
        d._id = Utils.guid();
      }
      return d._id;
    };
    var keys = properties.select('.line-item__keys').selectAll('.key').data(propValue, propKey);

    // Hide keys if curve editor mode.
    properties.select('.line-item__keys').attr('display', function() {
      if (!self.timeline.editor.curveEditEnabled) {
        return 'block';
      }
      return 'none';
    });

    // selectKey is triggered by dragstart event
    var selectKey = function(key_data) {
      var event = d3.event;
      // with dragstart event the mousevent is is inside the event.sourcEvent
      if (event.sourceEvent) {
        event = event.sourceEvent;
      }

      var addToSelection = event.shiftKey;
      // if element is already selectionned and we are on
      // the dragstart event, we stop there since it is already selected.
      if (d3.event.type && d3.event.type === 'dragstart') {
        if (d3.select(this).classed('key--selected')) {
          return;
        }
      }

      // Also keep a reference to the key dom element.
      key_data._dom = this;

      self.timeline.selectionManager.select(key_data, addToSelection);
    };

    var dragend = function() {
      self.timeline.editor.undoManager.addState();
    };

    var drag = d3.behavior.drag()
      .origin((d) => {return d;})
      .on('drag', dragmove)
      .on('dragstart', selectKey)
      .on('dragend', dragend);

    var key_grp = keys.enter()
      .append('g')
      .attr('class', 'key')
      // Use the unique id added in propKey above for the dom element id.
      .attr('id', (d) => {return d._id;})
      .on('mousedown', function() {
        // Don't trigger mousedown on linescontainer else
        // it create the selection rectangle
        d3.event.stopPropagation();
      })
      .call(drag);

    properties.selectAll('.key')
      .attr('class', function(d) {
        var cls = 'key';
        // keep selected class
        if (d3.select(this).classed('key--selected')) {
          cls += ' key--selected';
        }
        if (d.ease) {
          if (Array.isArray(d.ease)) {
            cls += ' easeCustom'
          }
          else {
            var ease = d.ease.split('.');
            if (ease.length === 2) {
              cls += ' ' + ease[1];
            }
          }

        }
        else {
          // If no easing specified, the it's the default Quad.easeOut
          cls += ' easeOut';
        }
        return cls;
      });

    var grp_linear = key_grp.append('g')
      .attr('class', 'ease-linear');
    grp_linear.append('path')
      .attr('class', 'key__shape-arrow')
      .attr('d', 'M 0 -6 L 6 0 L 0 6');
    grp_linear.append('path')
      .attr('class', 'key__shape-arrow')
      .attr('d', 'M 0 -6 L -6 0 L 0 6');

    var grp_in = key_grp.append('g')
      .attr('class', 'ease-in');
    grp_in.append('path')
      .attr('class', 'key__shape-rect')
      .attr('d', 'M 0 -6 L 0 6 L 4 5 L 1 0 L 4 -5');
    grp_in.append('path')
      .attr('class', 'key__shape-arrow')
      .attr('d', 'M 0 -6 L -6 0 L 0 6');

    var grp_out = key_grp.append('g')
      .attr('class', 'ease-out');
    grp_out.append('path')
      .attr('class', 'key__shape-rect')
      .attr('d', 'M 0 -6 L 0 6 L -4 5 L -1 0 L -4 -5');
    grp_out.append('path')
      .attr('class', 'key__shape-arrow')
      .attr('d', 'M 0 -6 L 6 0 L 0 6');

    var grp_inout = key_grp.append('g')
      .attr('class', 'ease-inout');
    grp_inout.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 5);

    var grp_custom = key_grp.append('g')
      .attr('class', 'ease-custom');
    grp_custom.append('path')
      .attr('class', 'key__shape-arrow')
      .attr('d', 'M 0 -6 L 6 0 L 0 6')
      .attr({
        transform: 'translate(-5, 0)'
      });

    var g2 = grp_custom.append('g')
      .attr({
        transform: 'scale(-1, 1) translate(-5, 0)'
      });

    g2.append('path')
      .attr('class', 'key__shape-arrow')
      .attr('d', 'M 0 -6 L 6 0 L 0 6');

    keys.attr('transform', function(d) {
      var dx = self.timeline.x(d.time * 1000);
      dx = parseInt(dx, 10);
      var dy = 10;
      return 'translate(' + dx + ',' + dy + ')';
    });

    keys.exit().remove();
  }
}
