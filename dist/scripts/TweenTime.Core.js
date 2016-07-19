(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("signals"), require("gsap"), require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define(["signals", "TweenMax", "lodash"], factory);
	else if(typeof exports === 'object')
		exports["Core"] = factory(require("signals"), require("gsap"), require("lodash"));
	else
		root["TweenTime"] = root["TweenTime"] || {}, root["TweenTime"]["Core"] = factory(root["signals"], root["TweenMax"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__) {
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
	
	var _Orchestrator = __webpack_require__(6);
	
	var _Orchestrator2 = _interopRequireDefault(_Orchestrator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(8);
	
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
	  }, {
	    key: 'getTotalDuration',
	    value: function getTotalDuration() {
	      return this.orchestrator.getTotalDuration();
	    }
	  }, {
	    key: 'addOnEventListener',
	    value: function addOnEventListener(callback) {
	      this.orchestrator.onEvent.add(callback);
	    }
	  }, {
	    key: 'removeOnEventListener',
	    value: function removeOnEventListener(callback) {
	      this.orchestrator.onEvent.remove(callback);
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

	/* WEBPACK VAR INJECTION */(function(setImmediate) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Signals = __webpack_require__(5);
	
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
	    this.preStatusChanged = new Signals.Signal();
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
	      var _this = this;
	
	      this.preStatusChanged.dispatch(true);
	      setImmediate(function () {
	        _this.is_playing = true;
	        _this.statusChanged.dispatch(_this.is_playing);
	      });
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      var _this2 = this;
	
	      this.preStatusChanged.dispatch(false);
	      setImmediate(function () {
	        _this2.is_playing = false;
	        _this2.statusChanged.dispatch(_this2.is_playing);
	      });
	    }
	  }, {
	    key: 'toggle',
	    value: function toggle() {
	      var _this3 = this;
	
	      this.preStatusChanged.dispatch(!this.is_playing);
	      setImmediate(function () {
	        _this3.is_playing = !_this3.is_playing;
	        _this3.statusChanged.dispatch(_this3.is_playing);
	      });
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
	
	      this.updated.dispatch(this.time[0], this.is_playing ? elapsed : 0);
	
	      this.last_timeStamp = timestamp;
	      this.last_time = this.time[0];
	      window.requestAnimationFrame(this.update);
	    }
	  }]);
	
	  return Timer;
	}();
	
	exports.default = Timer;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3).setImmediate))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(4).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
	
	  immediateIds[id] = true;
	
	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });
	
	  return id;
	};
	
	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3).setImmediate, __webpack_require__(3).clearImmediate))

/***/ },
/* 4 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Signals = __webpack_require__(5);
	var TweenMax = __webpack_require__(7);
	
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
	    this.onEvent = new Signals.Signal();
	  }
	
	  _createClass(Orchestrator, [{
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
	    value: function update(timestamp, elapsed) {
	      var seconds = timestamp / 1000;
	      var seconds_elapsed = elapsed / 1000;
	
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
	          // item._timeline.clear();
	
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
	
	      // check if event type property to be fired
	      for (var _i = 0; _i < this.data.length; _i++) {
	        var _item = this.data[_i];
	        for (var _property_key = 0; _property_key < _item.properties.length; _property_key++) {
	          var _property = _item.properties[_property_key];
	          if (_property.type !== 'event') {
	            continue;
	          }
	          for (var _key_index = 0; _key_index < _property.keys.length; _key_index++) {
	            var _key = _property.keys[_key_index];
	            if (seconds_elapsed > 0 && _key.time <= seconds && _key.time > seconds - seconds_elapsed) {
	              this.onEvent.dispatch(_property.name, _key.val);
	            }
	          }
	        }
	      }
	
	      // update the css properties.
	      for (var _i2 = 0; _i2 < this.data.length; _i2++) {
	        var _item2 = this.data[_i2];
	        for (var _property_key2 = 0; _property_key2 < _item2.properties.length; _property_key2++) {
	          var _property2 = _item2.properties[_property_key2];
	          if (_property2.css && _property2.keys.length) {
	            // Only css values.
	            _item2.values[_property2.name] = _item2._domHelper.style[_property2.name];
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
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=TweenTime.Core.js.map