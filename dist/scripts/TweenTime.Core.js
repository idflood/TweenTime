(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require(undefined), require("TweenMax"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash", "signals", "TweenMax"], factory);
	else if(typeof exports === 'object')
		exports["Core"] = factory(require("lodash"), require("./signals"), require("TweenMax"));
	else
		root["TweenTime"] = root["TweenTime"] || {}, root["TweenTime"]["Core"] = factory(root["_"], root["signals"], root["TweenMax"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_14__, __WEBPACK_EXTERNAL_MODULE_24__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _ = __webpack_require__(1);
	
	var Utils = __webpack_require__(9)["default"];
	var Timer = __webpack_require__(10)["default"];
	var Orchestrator = __webpack_require__(11)["default"];
	var Core = (function () {
	  var Core = function Core(data, options) {
	    if (options === undefined) options = {};
	    this.data = data;
	    this.timer = new Timer(options);
	    this.orchestrator = new Orchestrator(this.timer, this.data);
	  };
	
	  Core.prototype.getItem = function (item_id) {
	    // In case we passed the item object directly return it.
	    if (item_id != null && typeof item_id == "object") {
	      return item_id;
	    }
	
	    return _.find(this.data, function (item) {
	      return item.id == item_id;
	    });
	  };
	
	  Core.prototype.getProperty = function (prop_name, item_id_or_obj) {
	    // If we passed the item name get the object from it.
	    item_id_or_obj = this.getItem(item_id_or_obj);
	
	    // Return false if we have no item
	    if (!item_id_or_obj) {
	      return false;
	    }
	
	    return _.find(item_id_or_obj.properties, function (property) {
	      return property.name == prop_name;
	    });
	  };
	
	  Core.prototype.getValues = function (item_id_or_obj) {
	    // If we passed the item name get the object from it.
	    item_id_or_obj = this.getItem(item_id_or_obj);
	
	    // Return false if we have no item
	    if (!item_id_or_obj) {
	      return undefined;
	    }
	
	    return item_id_or_obj.values;
	  };
	
	  Core.prototype.getValue = function (prop_name, item_id_or_obj) {
	    // If we passed the item name get the object from it.
	    var values = this.getValues(item_id_or_obj);
	
	    // Return false if we have no item
	    if (!values) {
	      return undefined;
	    }
	
	    if (values[prop_name] != null) {
	      return values[prop_name];
	    } else {
	      return undefined;
	    }
	  };
	
	  Core.prototype.getKeyAt = function (property, time_in_seconds) {
	    return _.find(property.keys, function (key) {
	      return key.time == time_in_seconds;
	    });
	  };
	
	  Core.prototype.setValue = function (property, new_val, time_in_seconds) {
	    if (time_in_seconds === undefined) time_in_seconds = false;
	    if (time_in_seconds === false) {
	      time_in_seconds = this.timer.getCurrentTime() / 1000;
	    }
	    var key = this.getKeyAt(property, time_in_seconds);
	
	    if (key) {
	      // If we found a key, simply update the value.
	      key.val = new_val;
	    } else {
	      // If no key, create it and add it to the array.
	      key = { val: new_val, time: time_in_seconds };
	      property.keys.push(key);
	      // Also sort the keys.
	      property.keys = Utils.sortKeys(property.keys);
	    }
	  };
	
	  Core.prototype.getTotalDuration = function () {
	    return this.orchestrator.getTotalDuration();
	  };
	
	  return Core;
	})();
	
	exports["default"] = Core;
	
	
	module.exports = Core;

/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },

/***/ 9:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Utils = (function () {
	  var Utils = function Utils() {};
	
	  Utils.formatMinutes = function (d) {
	    // convert milliseconds to seconds
	    d = d / 1000;
	    var hours = Math.floor(d / 3600);
	    var minutes = Math.floor((d - (hours * 3600)) / 60);
	    var seconds = d - (minutes * 60);
	    var output = seconds + "s";
	    if (minutes) {
	      output = minutes + "m " + output;
	    }
	    if (hours) {
	      output = hours + "h " + output;
	    }
	    return output;
	  };
	
	  Utils.getClosestTime = function (data, time, objectId, property_name, timer, tolerance) {
	    if (objectId === undefined) objectId = false;
	    if (property_name === undefined) property_name = false;
	    if (timer === undefined) timer = false;
	    if (tolerance === undefined) tolerance = 0.1;
	    if (timer) {
	      var timer_time = timer.getCurrentTime() / 1000;
	      if (Math.abs(timer_time - time) <= tolerance) {
	        return timer_time;
	      }
	    }
	
	    if (objectId || property_name) {
	      for (var i = 0; i < data.length; i++) {
	        var item = data[i];
	        // Don't match item with itself, but allow property to match item start/end.
	        if (item.id != objectId || property_name) {
	          // First check start & end.
	          if (Math.abs(item.start - time) <= tolerance) {
	            return item.start;
	          }
	
	          if (Math.abs(item.end - time) <= tolerance) {
	            return item.end;
	          }
	        }
	
	        // Test properties keys
	        for (var j = 0; j < item.properties.length; j++) {
	          var prop = item.properties[j];
	          // Don't match property with itself.
	          if (prop.keys && (item.id != objectId || prop.name != property_name)) {
	            for (var k = 0; k < prop.keys; k++) {
	              var key = prop.keys[k];
	              if (Math.abs(key.time - time) <= tolerance) {
	                return key.time;
	              }
	            }
	          }
	        }
	      }
	    }
	    return false;
	  };
	
	  Utils.getPreviousKey = function (keys, time) {
	    var prevKey = false;
	    for (var i = 0; i < keys.length; i++) {
	      var key = keys[i];
	      if (key.time < time) {
	        prevKey = key;
	      } else {
	        return prevKey;
	      }
	    }
	    return prevKey;
	  };
	
	  Utils.sortKeys = function (keys) {
	    var compare = function (a, b) {
	      if (a.time < b.time) {
	        return -1;
	      }
	      if (a.time > b.time) {
	        return 1;
	      }
	      return 0;
	    };
	    return keys.sort(compare);
	  };
	
	  Utils.guid = function () {
	    var s4 = function () {
	      return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
	    };
	    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
	  };
	
	  return Utils;
	})();
	
	exports["default"] = Utils;

/***/ },

/***/ 10:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Signals = __webpack_require__(14);
	
	var Timer = (function () {
	  var Timer = function Timer(options) {
	    var _this = this;
	    if (options === undefined) options = {};
	    // in millisecond
	    this.totalDuration = options.totalDuration || 240 * 1000;
	    // Use an array for the time for easier d3.js integration (used as data for timeseeker).
	    this.time = [0];
	    this.is_playing = false;
	    this.last_timeStamp = -1;
	    this.last_time = -1;
	    this.updated = new Signals.Signal();
	    this.statusChanged = new Signals.Signal();
	    this.durationChanged = new Signals.Signal();
	    this.seeked = new Signals.Signal();
	    window.requestAnimationFrame(function (timestamp) {
	      return _this.update(timestamp);
	    });
	  };
	
	  Timer.prototype.getCurrentTime = function () {
	    return this.time[0];
	  };
	
	  Timer.prototype.getDuration = function () {
	    return this.totalDuration / 1000;
	  };
	
	  Timer.prototype.setDuration = function (seconds) {
	    this.totalDuration = seconds * 1000;
	    this.durationChanged.dispatch(seconds);
	  };
	
	  Timer.prototype.play = function () {
	    this.is_playing = true;
	    this.statusChanged.dispatch(this.is_playing);
	  };
	
	  Timer.prototype.stop = function () {
	    this.is_playing = false;
	    this.statusChanged.dispatch(this.is_playing);
	  };
	
	  Timer.prototype.toggle = function () {
	    this.is_playing = !this.is_playing;
	    this.statusChanged.dispatch(this.is_playing);
	  };
	
	  Timer.prototype.seek = function (time) {
	    this.time[0] = time[0];
	    this.seeked.dispatch(this.time[0]);
	  };
	
	  Timer.prototype.update = function (timestamp) {
	    var _this2 = this;
	    // Init timestamp
	    if (this.last_timeStamp == -1) {
	      this.last_timeStamp = timestamp;
	    }
	    var elapsed = timestamp - this.last_timeStamp;
	
	    if (this.is_playing) {
	      this.time[0] += elapsed;
	    }
	
	    if (this.time[0] >= this.totalDuration) {
	      // Stop timer when reaching the end.
	      this.time[0] = this.totalDuration;
	      this.stop();
	    }
	
	    this.updated.dispatch(this.time[0]);
	
	    this.last_timeStamp = timestamp;
	    this.last_time = this.time[0];
	    window.requestAnimationFrame(function (timestamp) {
	      return _this2.update(timestamp);
	    });
	  };
	
	  return Timer;
	})();
	
	exports["default"] = Timer;

/***/ },

/***/ 11:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Signals = __webpack_require__(14);
	var TweenMax = __webpack_require__(24);
	
	var Orchestrator = (function () {
	  var Orchestrator = function Orchestrator(timer, data) {
	    this.update = this.update.bind(this);
	    this.timer = timer;
	    this.data = data;
	    this.mainTimeline = new TimelineMax({ paused: true });
	    this.onUpdate = new Signals.Signal();
	    this.timer.updated.add(this.update);
	    this.update(0);
	  };
	
	  Orchestrator.prototype.getTotalDuration = function () {
	    return this.mainTimeline.totalDuration();
	  };
	
	  Orchestrator.prototype.getEasing = function (key) {
	    if (key === undefined) key = false;
	    if (key && key.ease) {
	      var ease_index = key.ease.split(".");
	      if (ease_index.length == 2 && window[ease_index[0]] && window[ease_index[0]][ease_index[1]]) {
	        return window[ease_index[0]][ease_index[1]];
	      }
	    }
	    return Quad.easeOut;
	  };
	
	  Orchestrator.prototype.initSpecialProperties = function (item) {
	    // Add a dom element for color tweening and other css properties.
	    item._domHelper = document.createElement("div");
	    for (var property_key = 0; property_key < item.properties.length; property_key++) {
	      var property = item.properties[property_key];
	      // Setup special properties
	      if (property.type && property.type == "color") {
	        // If the property is a color mark it as css
	        property.css = true;
	      }
	
	      if (property.css) {
	        // If property is a css or a color value apply it to the domHelper element.
	        item._domHelper.style[property.name] = property.val;
	      }
	    }
	  };
	
	  Orchestrator.prototype.initItemValues = function (item) {
	    item.values = {};
	    //item._isDirty = true
	    for (var property_key = 0; property_key < item.properties.length; property_key++) {
	      var property = item.properties[property_key];
	      if (property.keys.length) {
	        // Take the value of the first key as initial value.
	        // this.todo: update this when the value of the first key change. (when rebuilding the timeline, simply delete item.values before item._timeline)
	        property.val = property.keys[0].val;
	      }
	      item.values[property.name] = property.val;
	    }
	  };
	
	  Orchestrator.prototype.update = function (timestamp) {
	    var seconds = timestamp / 1000;
	    var has_dirty_items = false;
	
	    for (var i = 0; i < this.data.length; i++) {
	      var item = this.data[i];
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
	        //item._timeline.clear();
	
	        for (var property_key = 0; property_key < item.properties.length; property_key++) {
	          var property = item.properties[property_key];
	          if (property._timeline) {
	            property._timeline.clear();
	          } else {
	            property._timeline = new TimelineMax();
	            item._timeline.add(property._timeline, 0);
	          }
	
	          var propertyTimeline = property._timeline;
	          var propName = property.name;
	          // Add a inital key, even if there is no animation to set the value from time 0.
	          var first_key = property.keys.length ? property.keys[0] : false;
	
	          var tween_time = 0;
	          if (first_key) {
	            tween_time = Math.min(-1, first_key.time - 0.1);
	          }
	
	          var tween_duration = 0;
	          var val = {};
	          var easing = this.getEasing();
	          val.ease = easing;
	          var data_target = item.values;
	          if (property.css) {
	            val.css = {};
	            val.css[propName] = first_key ? first_key.val : property.val;
	            data_target = item._domHelper;
	          } else {
	            val[propName] = first_key ? first_key.val : property.val;
	          }
	
	          var tween = TweenMax.to(data_target, tween_duration, val);
	          propertyTimeline.add(tween, tween_time);
	
	          for (var key_index = 0; key_index < property.keys.length; key_index++) {
	            var key = property.keys[key_index];
	
	            if (key_index < property.keys.length - 1) {
	              var next_key = property.keys[key_index + 1];
	              tween_duration = next_key.time - key.time;
	
	              val = {};
	              easing = this.getEasing(next_key);
	              val.ease = easing;
	              if (property.css) {
	                val.css = {};
	                val.css[propName] = next_key.val;
	              } else {
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
	          seconds = seconds - 1e-7;
	        } else {
	          seconds = seconds + 1e-7;
	        }
	      }
	    }
	
	    // Finally update the main timeline.
	    this.mainTimeline.seek(seconds);
	
	    // update the css properties.
	    for (var i = 0; i < this.data.length; i++) {
	      var item = this.data[i];
	      for (var property_key = 0; property_key < item.properties.length; property_key++) {
	        var property = item.properties[property_key];
	        if (property.css) {
	          // Only css values.
	          item.values[property.name] = item._domHelper.style[property.name];
	        }
	      }
	    }
	
	    if (has_dirty_items) {
	      this.onUpdate.dispatch();
	    }
	  };
	
	  return Orchestrator;
	})();
	
	exports["default"] = Orchestrator;

/***/ },

/***/ 14:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_14__;

/***/ },

/***/ 24:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_24__;

/***/ }

/******/ })
});

//# sourceMappingURL=TweenTime.Core.js.map