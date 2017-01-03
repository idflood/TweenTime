let d3 = require('d3');
let Signals = require('js-signals');
import Utils from '../core/Utils';

const MAX_HEIGHT = 190;

export default class PropertyCurveEdit {
  constructor(timeline, container) {
    this.timeline = timeline;
    this.container = container;
    this.dy = 10 + this.timeline.margin.top;
    this.onCurveUpdated = new Signals.Signal();
  }

  normalizeVal(val, min, max, min2, max2) {
    if (min === min2 && max === max2) {
      return val;
    }
    const diff = max - min;
    const diff2 = max2 - min2;
    const t = (val - min) / diff;
    return min2 + t * diff2;
  }

  // Get bezier point from easing (0 to 1) and previous and next point.
  bezierPoint(pt, prev, next) {
    const x = this.normalizeVal(pt.x, 0, 1, prev.x, next.x);
    const y = this.normalizeVal(pt.y, 0, 1, prev.y, next.y);
    return {x, y};
  }

  // Transform an array of points to a SVG bezier path.
  getPath(points) {
    // Path first start by Move command (absolute);
    let p = `M ${points[0].x} ${points[0].y}`;
    // Then it's C a.x a.y, b.x b.y, c.x x.y
    points.forEach((pt, i) => {
      // Drop first one since already in 'M' command above.
      if (i > 0) {
        p += ', ';
        if ((i - 1) % 3 === 0) {
          p += 'C ';
        }
        if (isNaN(pt.x) || isNaN(pt.y)) {
          return false;
        }
        p += `${pt.x} ${pt.y}`;
      }
    });
    return p;
  }

  processCurveValues(d) {
    let invalid = false;
    if (d.keys.length <= 1) {
      d._curvePoints = [];
      d._curvePointsBezier = [];
      d._controlPoints = [];
      return [{points: [], name: d.name}];
    }
    // preprocess min and max for keys.
    d._min = d3.min(d.keys, (k) => k.val);
    d._max = d3.max(d.keys, (k) => k.val);

    d._curvePoints = [];
    // set raw points, without bezier control yet.
    d.keys.forEach((key) => {
      const x = this.timeline.x(key.time * 1000);
      const y = this.normalizeVal(key.val, d._min, d._max, 0, MAX_HEIGHT);
      d._curvePoints.push({x, y, ease: key.ease, id: `curve1-${key._id}`, _key: key});
    });

    // Control points, grouped by point + handle.
    d._controlPoints = [];
    // Add all points, with controls bezier. (p1, bezier1, bezier2, p2, …).
    d._curvePointsBezier = [];
    d._curvePoints.forEach((pt, i) => {
      const next = d._curvePoints[i + 1];
      // If non number points return an empty path.
      if (isNaN(pt.x) || isNaN(pt.y)) {
        invalid = true;
      }
      d._curvePointsBezier.push({x: pt.x, y: pt.y, ease: pt.ease, _key: pt._key});
      if (next) {
        const easing = Utils.getEasingPoints(next.ease);
        const p1 = this.bezierPoint({x: easing[0], y: easing[1]}, pt, next);
        const p2 = this.bezierPoint({x: easing[2], y: easing[3]}, pt, next);

        // Save prev point for time calculation on drag move.
        p1._next = next;
        p2._next = next;
        p1._prev = pt;
        p2._prev = pt;
        // The index of the handles in the easing.
        p1._Xindex = 0;
        p1._Yindex = 1;
        p2._Xindex = 2;
        p2._Yindex = 3;
        d._curvePointsBezier.push(p1);
        d._curvePointsBezier.push(p2);
        // If non number points return an empty path.
        if (isNaN(next.x) || isNaN(next.y) ||
            isNaN(p1.x) || isNaN(p1.y) ||
            isNaN(p2.x) || isNaN(p2.y)) {
          invalid = true;
        }
        d._controlPoints.push({point: pt, handle: p1, id: `${pt._key._id}-a`});
        d._controlPoints.push({point: next, handle: p2, id: `${pt._key._id}-b`});
      }
    });
    const path = this.getPath(d._curvePointsBezier);
    // If invalid path (non number points) return an empty path.
    if (!path || invalid) {
      d._curvePoints = [];
      d._curvePointsBezier = [];
      d._controlPoints = [];
      return [{points: [], name: d.name}];
    }
    return [{points: d._curvePoints, path, name: d.name}];
  }

  render() {
    const self = this;
    const tweenTime = self.timeline.tweenTime;

    const bar = this.container.selectAll('.curve-grp')
      .data(this.timeline.tweenTime.data, (d) => d.id);

    bar.enter()
      .append('svg').attr('class', 'curve-grp timeline__right-mask');

    // Show curves only if curve editor mode.
    bar.attr('display', (d) => {
      const selection = self.timeline.selectionManager.getSelection();

      if (this.timeline.editor.curveEditEnabled) {
        // Check if this item is in selection.
        for (let i = 0; i < selection.length; i++) {
          if (selection[i].id === d.id) {
            return 'block';
          }
          // If we selected a property inside the item.
          if (selection[i]._line && selection[i]._line.id === d.id) {
            return 'block';
          }
        }
      }
      return 'none';
    });

    bar.exit().remove();

    const propVal1 = (d) => d.properties || [];
    const propKey1 = (d) => d.name;

    const properties = bar.selectAll('.curves-preview')
      .data(propVal1, propKey1)
      .attr('display', (d) => {
        const selection = self.timeline.selectionManager.getSelection();
        for (let i = 0; i < selection.length; i++) {
          const selectedItem = selection[i];
          if (selectedItem.name && selectedItem.name === d.name) {
            // Also check that it is from the same item.
            if (selectedItem._line.id === d._line.id) {
              return 'block';
            }
          }
          // If we have selected the whole item show the curve too.
          if (selectedItem.id && selectedItem.id === d._line.id) {
            return 'block';
          }
        }
        return 'none';
      });

    properties.enter()
      .append('g')
      .attr({
        class: 'curves-preview',
        transform: 'translate(0,10)',
        width: window.innerWidth - self.timeline.label_position_x,
        height: 300
      });

    properties.exit().remove();

    const curveKey = (d) => d.name;
    var curves = properties.selectAll('.curve')
      .data((d) => this.processCurveValues(d), curveKey);

    curves.enter()
      .append('path')
      .attr({
        class: 'curve',
        fill: 'none',
        stroke: '#aaa'
      });

    curves.attr('d', (d) => d.path);

    curves.exit().remove();

    const pointVal = (d) => d._curvePoints || [];
    const pointKey = (d) => d.id;
    const handleVal = (d) => d._controlPoints || [];
    const handleKey = (d) => d.id;

    const handle = properties.selectAll('.curve__handle')
      .data(handleVal, handleKey);

    const handleLine = properties.selectAll('.curve__handle-line')
      .data(handleVal, handleKey);

    const points = properties.selectAll('.curve__point')
      .data(pointVal, pointKey);

    // Handle line.
    const dragHandleStart = function(d) {
      var event = d3.event;
      // with dragstart event the mousevent is is inside the event.sourcEvent
      if (event.sourceEvent) {
        event = event.sourceEvent;
      }

      // Also keep a reference to the key dom element.
      d._dom = this;
    };

    const dragHandleMove = function(d) {
      var sourceEvent = d3.event.sourceEvent;

      const point = d.handle._next;
      const prev = d.handle._prev;
      const handle = d.handle;
      const key = point._key;
      const propertyData = prev._key._property;
      const itemData = propertyData._line;

      // Get ease array.
      const ease = Utils.getEasingPoints(point.ease);
      const timeBetweenPrevNext = key.time - prev._key.time;

      const mouse = d3.mouse(this);
      const old_time = key.time;
      let dx = self.timeline.x.invert(mouse[0]);
      dx = dx.getTime() / 1000;
      dx = (dx - prev._key.time) / timeBetweenPrevNext;


      // Get point A value top in px.
      const valueApx = self.normalizeVal(prev._key.val, propertyData._min, propertyData._max, 0, MAX_HEIGHT);
      // Same for B key value
      const valueBpx = self.normalizeVal(point._key.val, propertyData._min, propertyData._max, 0, MAX_HEIGHT);

      var dy = (mouse[1] - valueApx) / (valueBpx - valueApx);

      // dx is restricted to 0 - 1.
      dx = Math.min(1, Math.max(0, dx));

      ease[handle._Xindex] = dx;
      ease[handle._Yindex] = dy;
      point._key.ease = ease;

      propertyData._isDirty = true;
      itemData._isDirty = true;
      self.onCurveUpdated.dispatch();
    };

    const dragHandleEnd = (d) => {

    };

    const dragHandle = d3.behavior.drag()
      .origin((d) => {return d;})
      .on('drag', dragHandleMove)
      .on('dragstart', dragHandleStart)
      .on('dragend', dragHandleEnd);

    handleLine.enter()
      .append('line')
      .attr({
        class: 'curve__handle-line',
        fill: 'none'
      });

    handleLine.attr({
      x1: (d) => d.point.x,
      y1: (d) => d.point.y,
      x2: (d) => d.handle.x,
      y2: (d) => d.handle.y
    });

    handleLine.exit().remove();

    // The key point.
    points.enter()
      .append('circle')
      .attr({
        class: 'curve__point',
        fill: '#fff',
        r: 4
      });

    points.attr({
      cx: (d) => d.x,
      cy: (d) => d.y
    });

    points.exit().remove();

    // Handle point.
    handle.enter()
      .append('circle')
      .attr({
        class: 'curve__handle',
        fill: '#aaa',
        r: 4
      })
      .on('mousedown', function() {
        // Don't trigger mousedown on handler else
        // it create the selection rectangle
        d3.event.stopPropagation();
      })
      .call(dragHandle);

    handle.attr({
      cx: (d) => d.handle.x,
      cy: (d) => d.handle.y
    });

    handle.exit().remove();
  }
}
