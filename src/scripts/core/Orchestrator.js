let Signals = require('js-signals');
let TweenMax = require('TweenMax');
let TimelineMax = require('TimelineMax');
let Quad = require('Quad');

import Utils from './Utils';
import BezierEasing from 'bezier-easing';

export default class Orchestrator {
  constructor(timer, data) {
    this.update = this.update.bind(this);
    this.timer = timer;
    this.data = data;
    this.mainTimeline = new TimelineMax({paused: true});
    this.onUpdate = new Signals.Signal();
    this.timer.updated.add(this.update);
    this.update(0);
    this.onEvent = new Signals.Signal();
  }

  addUpdateListener(listener) {
    this.onUpdate.add(listener);
  }

  removeUpdateListener(listener) {
    this.onUpdate.remove(listener);
  }

  setData(data) {
    this.data = data;
  }

  getTotalDuration() {
    return this.mainTimeline.totalDuration();
  }

  getEasing(key = false) {
    if (key && key.ease) {
      return Utils.getEasingPoints(key.ease);
    }
    return Utils.getEasingPoints('Quad.easeOut');
  }

  initSpecialProperties(item) {
    // Add a dom element for color tweening and other css properties.
    item._domHelper = document.createElement('div');
    for (var property_key = 0; property_key < item.properties.length; property_key++) {
      var property = item.properties[property_key];
      // Setup special properties
      if (property.type && property.type === 'color') {
        // If the property is a color mark it as css
        property.css = true;
      }

      if (property.css) {
        // If property is a css or a color value apply it to the domHelper element.
        item._domHelper.style[property.name] = property.val;
      }
    }
  }

  initItemValues(item) {
    item.values = {};
    // item._isDirty = true
    for (var property_key = 0; property_key < item.properties.length; property_key++) {
      var property = item.properties[property_key];
      if (property.keys.length) {
        // Take the value of the first key as initial value.
        // this.todo: update this when the value of the first key change. (when rebuilding the timeline, simply delete item.values before item._timeline)
        property.val = property.keys[0].val;
      }
      item.values[property.name] = property.val;
    }
  }

  update(timestamp, elapsed) {
    var seconds = timestamp / 1000;
    var seconds_elapsed = elapsed / 1000;

    var has_dirty_items = false;

    for (let i = 0; i < this.data.length; i++) {
      let item = this.data[i];
      if (!item._domHelper) {
        this.initSpecialProperties(item);
      }

      // create the values object to contain all properties
      if (!item.values) {
        this.initItemValues(item);
      }

      // Create the timeline if needed
      if (!item._timeline) {
        item._timeline = new TimelineMax();
        this.mainTimeline.add(item._timeline, 0);
        item._isDirty = true;
      }

      if (item._isDirty) {
        has_dirty_items = true;
      }

      if (item._timeline && item._isDirty && item.properties) {
        item._isDirty = false;
        // item._timeline.clear();

        for (let property_key = 0; property_key < item.properties.length; property_key++) {
          let property = item.properties[property_key];
          if (property._timeline) {
            property._timeline.clear();
          }
          else {
            property._timeline = new TimelineMax();
            item._timeline.add(property._timeline, 0);
          }

          // Add a reference to the parent item for easier reference.
          if (!property._line) {
            property._line = item;
          }

          var propertyTimeline = property._timeline;
          var propName = property.name;

          // If there is no key stop there and set value to default.
          if (!property.keys.length) {
            item.values[property.name] = property.val;
            continue;
          }

          // Set the data values target object.
          var data_target = item.values;
          // Add a inital key, even if there is no animation to set the value from time 0.
          var first_key = property.keys[0];

          var tween_time = 0;
          if (first_key) {
            tween_time = Math.min(-1, first_key.time - 0.1);
          }

          var tween_duration = 0;
          var val = {};
          var easing = this.getEasing();
          // Use spread to convert array to multiple arguments.
          val.ease = BezierEasing(...easing);

          if (property.css) {
            data_target = item._domHelper;
            val.css = {};
            val.css[propName] = first_key ? first_key.val : property.val;
          }
          else {
            val[propName] = first_key ? first_key.val : property.val;
          }

          var tween = TweenMax.to(data_target, tween_duration, val);
          propertyTimeline.add(tween, tween_time);

          for (let key_index = 0; key_index < property.keys.length; key_index++) {
            let key = property.keys[key_index];
            // Add a reference to the parent property, allow easier access
            // without relying on dom order.
            if (!key._property) {
              key._property = property;
            }

            if (key_index < property.keys.length - 1) {
              var next_key = property.keys[key_index + 1];
              tween_duration = next_key.time - key.time;

              val = {};
              easing = this.getEasing(next_key);

              // Use spread to convert array to multiple arguments.
              val.ease = BezierEasing(...easing);
              if (property.css) {
                val.css = {};
                val.css[propName] = next_key.val;
              }
              else {
                val[propName] = next_key.val;
              }

              tween = TweenMax.to(data_target, tween_duration, val);
              propertyTimeline.add(tween, key.time);
            }
          }

          // Directly seek the property timeline to update the value.
          propertyTimeline.seek(seconds);
        }
        // Force main timeline to refresh but never try to go to < 0
        // to prevent glitches when current time is 0.
        if (seconds > 0) {
          seconds = seconds - 0.0000001;
        }
        else {
          seconds = seconds + 0.0000001;
        }
      }
    }

    // Finally update the main timeline.
    this.mainTimeline.seek(seconds);

    // check if event type property to be fired
    for (let i = 0; i < this.data.length; i++) {
      let item = this.data[i];
      for (let property_key = 0; property_key < item.properties.length; property_key++) {
        let property = item.properties[property_key];
        if (property.type !== 'event') {
          continue;
        }
        for (let key_index = 0; key_index < property.keys.length; key_index++) {
          let key = property.keys[key_index];
          if (seconds_elapsed > 0 && key.time <= seconds && key.time > seconds - seconds_elapsed) {
            this.onEvent.dispatch(property.name, key.val);
          }
        }
      }
    }

    // update the css properties.
    for (let i = 0; i < this.data.length; i++) {
      let item = this.data[i];
      for (let property_key = 0; property_key < item.properties.length; property_key++) {
        let property = item.properties[property_key];
        if (property.css && property.keys.length) {
          // Only css values.
          item.values[property.name] = item._domHelper.style[property.name];
        }
      }
    }

    if (has_dirty_items) {
      this.onUpdate.dispatch();
    }
  }
}
