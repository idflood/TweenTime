var _ = require('lodash');

import Utils from './core/Utils';
import Timer from './core/Timer';
import Orchestrator from './core/Orchestrator';

class Core {
  constructor(data, options = {}) {
    this.data = data;
    this.options = options;
    this.timer = new Timer(options);
    this.orchestrator = new Orchestrator(this.timer, this.data);
  }

  addUpdateListener(listener) {
    this.orchestrator.addUpdateListener(listener);
  }

  removeUpdateListener(listener) {
    this.orchestrator.removeUpdateListener(listener);
  }

  setData(data) {
    this.data = data;
    this.orchestrator.setData(data);
  }

  getData() {
    return this.data;
  }

  getItem(item_id) {
    // In case we passed the item object directly return it.
    if (item_id && typeof item_id === 'object') {
      return item_id;
    }

    return _.find(this.data, (item) => item.id === item_id);
  }

  getCurrentTime() {
    return this.timer.getCurrentTime();
  }

  getProperty(prop_name, item_id_or_obj) {
    // If we passed the item name get the object from it.
    let item = this.getItem(item_id_or_obj);

    // Return false if we have no item
    if (!item) {
      return false;
    }

    return _.find(item.properties, property => property.name === prop_name);
  }

  getValues(item_id_or_obj) {
    // If we passed the item name get the object from it.
    let item = this.getItem(item_id_or_obj);

    // Return false if we have no item
    if (!item) {
      return undefined;
    }

    return item.values;
  }

  getValue(prop_name, item_id_or_obj) {
    // If we passed the item name get the object from it.
    var values = this.getValues(item_id_or_obj);

    // Return false if we have no item
    if (!values) {
      return undefined;
    }

    if (values[prop_name] !== undefined) {
      return values[prop_name];
    }
    return undefined;
  }

  getKeyAt(property, time_in_seconds) {
    return _.find(property.keys, key => key.time === time_in_seconds);
  }

  setValue(property, new_val, time_in_seconds = false) {
    let time = time_in_seconds;
    if (time === false) {
      time = this.timer.getCurrentTime() / 1000;
    }
    var key = this.getKeyAt(property, time);

    if (key) {
      // If we found a key, simply update the value.
      key.val = new_val;
    }
    else {
      // If we are not on a key but the property has other keys,
      // create it and add it to the keys array.
      key = {val: new_val, time: time, _property: property};
      if (this.options.defaultEase) {
        key.ease = this.options.defaultEase;
      }
      property.keys.push(key);
      // Also sort the keys.
      property.keys = Utils.sortKeys(property.keys);
    }
  }

  getTotalDuration() {
    return this.orchestrator.getTotalDuration();
  }

  addOnEventListener(callback) {
    this.orchestrator.onEvent.add(callback);
  }

  removeOnEventListener(callback) {
    this.orchestrator.onEvent.remove(callback);
  }
}

module.exports = Core;
