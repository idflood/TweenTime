let Signals = require('js-signals');
let _ = require('lodash');
import Utils from '../core/Utils';

export default class PropertyBase {
  // @instance_property: The current property on the data object.
  // @lineData: The line data object.
  constructor(instance_property, lineData, editor, key_val = false) {
    this.instance_property = instance_property;
    this.lineData = lineData;
    this.editor = editor;
    this.key_val = key_val;

    // this.update = this.update.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onKeyClick = this.onKeyClick.bind(this);

    this.timer = editor.timer;
    this.keyAdded = new Signals.Signal();
    this.render();

    this.$key = this.$el.find('.property__key');
  }

  onKeyClick(e) {
    e.preventDefault();
    var currentValue = this.getCurrentVal();
    this.addKey(currentValue);
  }

  getInputVal() {
    return this.$el.find('input').val();
  }

  getCurrentVal() {
    var val = this.instance_property.val;
    var prop_name = this.instance_property.name;

    // if we selected a key simply return it's value
    if (this.key_val) {
      return this.key_val.val;
    }
    if (this.lineData.values !== undefined && this.lineData.values[prop_name]) {
      return this.lineData.values[prop_name];
    }
    return val;
  }

  onInputChange() {
    var current_value = this.getInputVal();
    var currentTime = this.timer.getCurrentTime() / 1000;

    // if we selected a key simply get the time from it.
    if (this.key_val) {
      currentTime = this.key_val.time;
    }

    if (this.instance_property.keys && this.instance_property.keys.length) {
      // Add a new key if there is no other key at same time
      var current_key = _.find(this.instance_property.keys, (key) => key.time === currentTime);

      if (current_key) {
        // if there is a key update it
        current_key.val = current_value;
      }
      else {
        // add a new key
        this.addKey(current_value);
      }
    }
    else {
      // There is no keys, simply update the property value (for data saving)
      this.instance_property.val = current_value;
      // Also directly set the lineData value.
      this.lineData.values[this.instance_property.name] = current_value;
      // Simply update the custom object with new values.
      if (this.lineData.object) {
        currentTime = this.timer.getCurrentTime() / 1000;
        // Set the property on the instance object.
        this.lineData.object.update(currentTime - this.lineData.start);
      }
    }

    // Something changed, make the lineData dirty to rebuild things. d
    this.lineData._isDirty = true;
  }

  getCurrentKey() {
    var time = this.timer.getCurrentTime() / 1000;
    if (!this.instance_property || !this.instance_property.keys) {
      return false;
    }
    if (this.instance_property.keys.length === 0) {
      return false;
    }
    for (var i = 0; i < this.instance_property.keys.length; i++) {
      var key = this.instance_property.keys[i];
      if (key.time === time) {
        return key;
      }
    }
    return false;
  }

  addKey(val) {
    var core = this.editor.tweenTime;
    var currentTime = this.timer.getCurrentTime() / 1000;
    var key = {
      time: currentTime,
      val: val
    };
    if (core.options.defaultEase) {
      key.ease = core.options.defaultEase;
    }
    this.instance_property.keys.push(key);
    this.instance_property.keys = Utils.sortKeys(this.instance_property.keys);
    this.lineData._isDirty = true;
    this.keyAdded.dispatch();
  }

  render() {
    // current values are defined in @lineData.values
    this.values = this.lineData.values !== undefined ? this.lineData.values : {};
  }

  update() {
    var key = this.getCurrentKey();
    this.$key.toggleClass('property__key--active', key);
  }

  remove() {
    if (this.keyAdded) {
      this.keyAdded.dispose();
    }
    delete this.instance_property;
    delete this.lineData;
    delete this.editor;
    delete this.key_val;

    delete this.timer;
    delete this.keyAdded;
    delete this.$key;
  }
}
