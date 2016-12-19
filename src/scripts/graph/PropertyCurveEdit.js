let d3 = require('d3');
let Signals = require('js-signals');
import Utils from '../core/Utils';

// https://github.com/hnakamur/d3.js-drag-bezier-curves-example/blob/master/app/index.js
// http://greensock.com/forums/topic/7921-translating-css-cubic-bezier-easing-to-gsap/
// https://github.com/gre/bezier-easing
// https://matthewlein.com/ceaser/

export default class PropertyCurveEdit {
  constructor(timeline) {
    this.timeline = timeline;
    this.dy = 10 + this.timeline.margin.top;
  }

  render(properties) {
    const self = this;
    const tweenTime = self.timeline.tweenTime;

    const propValue = function(d) {
      return d.keys;
    };
    const propKey = function(d) {
      if (!d._id) {
        d._id = Utils.guid();
      }
      return d._id;
    };
    const curves = properties.select('.line-item__curves').selectAll('.curve').data(propValue, propKey);
  }
}
