var _ = require('lodash');

import Utils from './core/Utils';
import Timer from './core/Timer';
var Orchestrator = require('./core/Orchestrator.coffee');

export default class Core {
  constructor (data) {
    this.data = data;
    this.timer = new Timer();
    this.orchestrator = new Orchestrator(this.timer, this.data);
  }

  getItem(item_id) {
    // In case we passed the item object directly return it.
    if (item_id != null && typeof item_id == 'object') {
      return item_id;
    }

    return _.find(this.data, (item) => item.id == item_id);
  }

  getProperty(prop_name, item_id_or_obj) {
    // If we passed the item name get the object from it.
    item_id_or_obj = this.getItem(item_id_or_obj);

    // Return false if we have no item
    if (!item_id_or_obj) {
      return false;
    }

    return _.find(item_id_or_obj.properties, property => property.name == prop_name);
  }

  getValues(item_id_or_obj) {
    // If we passed the item name get the object from it.
    item_id_or_obj = this.getItem(item_id_or_obj)

    // Return false if we have no item
    if (!item_id_or_obj) {
      return undefined;
    }

    return item_id_or_obj.values;
  }

  getValue(prop_name, item_id_or_obj) {
    // If we passed the item name get the object from it.
    var values = this.getValues(item_id_or_obj);

    // Return false if we have no item
    if (!values) {
      return undefined;
    }

    if (values[prop_name] != null) {
      return values[prop_name];
    }
    else {
      return undefined;
    }
  }

  getKeyAt(property, time_in_seconds) {
    return _.find(property.keys, key => key.time == time_in_seconds);
  }

  setValue(property, new_val, time_in_seconds = false) {
    if (time_in_seconds == false) {
      time_in_seconds = this.timer.getCurrentTime() / 1000;
    }
    var key = this.getKeyAt(property, time_in_seconds);

    if (key) {
      // If we found a key, simply update the value.
      key.val = new_val;
    }
    else {
      // If no key, create it and add it to the array.
      key = {val: new_val, time: time_in_seconds};
      property.keys.push(key);
      // Also sort the keys.
      property.keys = Utils.sortKeys(property.keys);
    }
  }

  getTotalDuration() {
    return this.orchestrator.getTotalDuration();
  }
}

module.exports = Core;
