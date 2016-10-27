(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("signals"), require("gsap"), require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define(["signals", "TweenMax", "lodash"], factory);
	else if(typeof exports === 'object')
		exports["Core"] = factory(require("signals"), require("gsap"), require("lodash"));
	else
		root["TweenTime"] = root["TweenTime"] || {}, root["TweenTime"]["Core"] = factory(root["signals"], root["TweenMax"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__) {
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
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Utils = __webpack_require__(1);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	var _Timer = __webpack_require__(2);
	
	var _Timer2 = _interopRequireDefault(_Timer);
	
	var _Orchestrator = __webpack_require__(4);
	
	var _Orchestrator2 = _interopRequireDefault(_Orchestrator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(6);
	
	var Core = function () {
	  function Core(data) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    _classCallCheck(this, Core);
	
	    this.data = data;
	    this.options = options;
	    this.timer = new _Timer2.default(options);
	    this.orchestrator = new _Orchestrator2.default(this.timer, this.data);
	  }
	
	  _createClass(Core, [{
	    key: 'setData',
	    value: function setData(data) {
	      this.data = data;
	      this.orchestrator.setData(data);
	    }
	  }, {
	    key: 'getItem',
	    value: function getItem(item_id) {
	      // In case we passed the item object directly return it.
	      if (item_id && (typeof item_id === 'undefined' ? 'undefined' : _typeof(item_id)) === 'object') {
	        return item_id;
	      }
	
	      return _.find(this.data, function (item) {
	        return item.id === item_id;
	      });
	    }
	  }, {
	    key: 'getCurrentTime',
	    value: function getCurrentTime() {
	      return this.timer.getCurrentTime();
	    }
	  }, {
	    key: 'getProperty',
	    value: function getProperty(prop_name, item_id_or_obj) {
	      // If we passed the item name get the object from it.
	      var item = this.getItem(item_id_or_obj);
	
	      // Return false if we have no item
	      if (!item) {
	        return false;
	      }
	
	      return _.find(item.properties, function (property) {
	        return property.name === prop_name;
	      });
	    }
	  }, {
	    key: 'getValues',
	    value: function getValues(item_id_or_obj) {
	      // If we passed the item name get the object from it.
	      var item = this.getItem(item_id_or_obj);
	
	      // Return false if we have no item
	      if (!item) {
	        return undefined;
	      }
	
	      return item.values;
	    }
	  }, {
	    key: 'getValue',
	    value: function getValue(prop_name, item_id_or_obj) {
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
	  }, {
	    key: 'getKeyAt',
	    value: function getKeyAt(property, time_in_seconds) {
	      return _.find(property.keys, function (key) {
	        return key.time === time_in_seconds;
	      });
	    }
	  }, {
	    key: 'setValue',
	    value: function setValue(property, new_val) {
	      var time_in_seconds = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	
	      var time = time_in_seconds;
	      if (time === false) {
	        time = this.timer.getCurrentTime() / 1000;
	      }
	      var key = this.getKeyAt(property, time);
	
	      if (key) {
	        // If we found a key, simply update the value.
	        key.val = new_val;
	      } else {
	        if (property.keys.length === 0) {
	          // If the property doesn't have any key simply the the value.
	          property.val = new_val;
	        } else {
	          // If we are not on a key but the property has other keys,
	          // create it and add it to the keys array.
	          key = { val: new_val, time: time, _property: property };
	          if (this.options.defaultEase) {
	            key.ease = this.options.defaultEase;
	          }
	          property.keys.push(key);
	          // Also sort the keys.
	          property.keys = _Utils2.default.sortKeys(property.keys);
	        }
	      }
	    }
	  }, {
	    key: 'getTotalDuration',
	    value: function getTotalDuration() {
	      return this.orchestrator.getTotalDuration();
	    }
	  }]);
	
	  return Core;
	}();
	
	module.exports = Core;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Utils = function () {
	  function Utils() {
	    _classCallCheck(this, Utils);
	  }
	
	  _createClass(Utils, null, [{
	    key: 'formatMinutes',
	    value: function formatMinutes(d) {
	      // convert milliseconds to seconds
	      var seconds = d / 1000;
	      var hours = Math.floor(seconds / 3600);
	      var minutes = Math.floor((seconds - hours * 3600) / 60);
	      seconds = seconds - minutes * 60;
	      var output = seconds + 's';
	      if (minutes) {
	        output = minutes + 'm ' + output;
	      }
	      if (hours) {
	        output = hours + 'h ' + output;
	      }
	      return output;
	    }
	  }, {
	    key: 'getClosestTime',
	    value: function getClosestTime(data, time) {
	      var objectId = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	      var property_name = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
	      var timer = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
	      var tolerance = arguments.length <= 5 || arguments[5] === undefined ? 0.1 : arguments[5];
	
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
	          if (item.id !== objectId || property_name) {
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
	            if (prop.keys && (item.id !== objectId || prop.name !== property_name)) {
	              for (var k = 0; k < prop.keys.length; k++) {
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
	    }
	  }, {
	    key: 'getPreviousKey',
	    value: function getPreviousKey(keys, time) {
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
	    }
	  }, {
	    key: 'sortKeys',
	    value: function sortKeys(keys) {
	      var compare = function compare(a, b) {
	        if (a.time < b.time) {
	          return -1;
	        }
	        if (a.time > b.time) {
	          return 1;
	        }
	        return 0;
	      };
	      return keys.sort(compare);
	    }
	  }, {
	    key: 'guid',
	    value: function guid() {
	      var s4 = function s4() {
	        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	      };
	      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	    }
	  }]);
	
	  return Utils;
	}();
	
	exports.default = Utils;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Signals = __webpack_require__(3);
	
	var Timer = function () {
	  function Timer() {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    _classCallCheck(this, Timer);
	
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
	    this.update = this.update.bind(this);
	    window.requestAnimationFrame(this.update);
	  }
	
	  _createClass(Timer, [{
	    key: 'getCurrentTime',
	    value: function getCurrentTime() {
	      return this.time[0];
	    }
	  }, {
	    key: 'getDuration',
	    value: function getDuration() {
	      return this.totalDuration / 1000;
	    }
	  }, {
	    key: 'setDuration',
	    value: function setDuration(seconds) {
	      this.totalDuration = seconds * 1000;
	      this.durationChanged.dispatch(seconds);
	    }
	  }, {
	    key: 'play',
	    value: function play() {
	      this.is_playing = true;
	      this.statusChanged.dispatch(this.is_playing);
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      this.is_playing = false;
	      this.statusChanged.dispatch(this.is_playing);
	    }
	  }, {
	    key: 'toggle',
	    value: function toggle() {
	      this.is_playing = !this.is_playing;
	      this.statusChanged.dispatch(this.is_playing);
	    }
	  }, {
	    key: 'seek',
	    value: function seek(time) {
	      this.time[0] = time[0];
	      this.seeked.dispatch(this.time[0]);
	    }
	  }, {
	    key: 'update',
	    value: function update(timestamp) {
	      // Init timestamp
	      if (this.last_timeStamp === -1) {
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
	      window.requestAnimationFrame(this.update);
	    }
	  }]);
	
	  return Timer;
	}();
	
	exports.default = Timer;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Signals = __webpack_require__(3);
	var TweenMax = __webpack_require__(5);
	
	var Orchestrator = function () {
	  function Orchestrator(timer, data) {
	    _classCallCheck(this, Orchestrator);
	
	    this.update = this.update.bind(this);
	    this.timer = timer;
	    this.data = data;
	    this.mainTimeline = new TimelineMax({ paused: true });
	    this.onUpdate = new Signals.Signal();
	    this.timer.updated.add(this.update);
	    this.update(0);
	  }
	
	  _createClass(Orchestrator, [{
	    key: 'setData',
	    value: function setData(data) {
	      this.data = data;
	    }
	  }, {
	    key: 'getTotalDuration',
	    value: function getTotalDuration() {
	      return this.mainTimeline.totalDuration();
	    }
	  }, {
	    key: 'getEasing',
	    value: function getEasing() {
	      var key = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
	      if (key && key.ease) {
	        var ease_index = key.ease.split('.');
	        if (ease_index.length === 2 && window[ease_index[0]] && window[ease_index[0]][ease_index[1]]) {
	          return window[ease_index[0]][ease_index[1]];
	        }
	      }
	      return Quad.easeOut;
	    }
	  }, {
	    key: 'initSpecialProperties',
	    value: function initSpecialProperties(item) {
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
	  }, {
	    key: 'initItemValues',
	    value: function initItemValues(item) {
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
	  }, {
	    key: 'update',
	    value: function update(timestamp) {
	      var seconds = timestamp / 1000;
	      var has_dirty_items = false;
	      var i;
	      var item;
	      var property;
	      var property_key;
	
	      for (i = 0; i < this.data.length; i++) {
	        item = this.data[i];
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
	
	          for (property_key = 0; property_key < item.properties.length; property_key++) {
	            property = item.properties[property_key];
	            if (property._timeline) {
	              property._timeline.clear();
	            } else {
	              property._timeline = new TimelineMax();
	              item._timeline.add(property._timeline, 0);
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
	            val.ease = easing;
	
	            if (property.css) {
	              data_target = item._domHelper;
	              val.css = {};
	              val.css[propName] = first_key ? first_key.val : property.val;
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
	            seconds = seconds - 0.0000001;
	          } else {
	            seconds = seconds + 0.0000001;
	          }
	        }
	      }
	
	      // Finally update the main timeline.
	      this.mainTimeline.seek(seconds);
	
	      // update the css properties.
	      for (i = 0; i < this.data.length; i++) {
	        item = this.data[i];
	        for (property_key = 0; property_key < item.properties.length; property_key++) {
	          property = item.properties[property_key];
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
	  }]);
	
	  return Orchestrator;
	}();
	
	exports.default = Orchestrator;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=TweenTime.Core.js.map