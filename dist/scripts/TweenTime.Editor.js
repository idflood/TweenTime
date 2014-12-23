(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require(undefined), require("d3"), require("jquery"), require("DraggableNumber"), require("spectrum"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash", "signals", "d3", "jquery", "DraggableNumber", "spectrum"], factory);
	else if(typeof exports === 'object')
		exports["Editor"] = factory(require("lodash"), require("./signals"), require("d3"), require("jquery"), require("DraggableNumber"), require("spectrum"));
	else
		root["TweenTime"] = root["TweenTime"] || {}, root["TweenTime"]["Editor"] = factory(root["_"], root["signals"], root["d3"], root["$"], root["DraggableNumber"], root["spectrum"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_12__, __WEBPACK_EXTERNAL_MODULE_14__, __WEBPACK_EXTERNAL_MODULE_15__, __WEBPACK_EXTERNAL_MODULE_31__, __WEBPACK_EXTERNAL_MODULE_32__) {
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

	"use strict";
	
	var tpl_timeline = __webpack_require__(16);
	var Timeline = __webpack_require__(5)["default"];
	var PropertiesEditor = __webpack_require__(6)["default"];
	var EditorMenu = __webpack_require__(7)["default"];
	var EditorControls = __webpack_require__(8)["default"];
	var SelectionManager = __webpack_require__(9)["default"];
	var Exporter = __webpack_require__(10)["default"];
	var UndoManager = __webpack_require__(11)["default"];
	var Editor = (function () {
	  var Editor = function Editor(tweenTime, options) {
	    var _this = this;
	    if (options === undefined) options = {};
	    this.tweenTime = tweenTime;
	    this.options = options;
	    this.timer = this.tweenTime.timer;
	    this.lastTime = -1;
	
	    this.onKeyAdded = this.onKeyAdded.bind(this);
	    this.onKeyRemoved = this.onKeyRemoved.bind(this);
	
	    this.$timeline = $(tpl_timeline());
	    $("body").append(this.$timeline);
	    $("body").addClass("has-editor");
	
	    this.selectionManager = new SelectionManager(this.tweenTime);
	    this.exporter = new Exporter(this);
	    this.timeline = new Timeline(this, options);
	
	    this.propertiesEditor = new PropertiesEditor(this, this.selectionManager);
	    this.propertiesEditor.keyAdded.add(this.onKeyAdded);
	    this.propertiesEditor.keyRemoved.add(this.onKeyRemoved);
	
	    this.menu = new EditorMenu(this.tweenTime, this.$timeline, this);
	    if (this.options.onMenuCreated != null) {
	      this.options.onMenuCreated(this.$timeline.find(".timeline__menu"));
	    }
	
	    this.controls = new EditorControls(this.tweenTime, this.$timeline);
	    this.undoManager = new UndoManager(this);
	
	    // Will help resize the canvas to correct size (minus sidebar and timeline)
	    window.editorEnabled = true;
	    window.dispatchEvent(new Event("resize"));
	    window.requestAnimationFrame(function () {
	      return _this.update();
	    });
	  };
	
	  Editor.prototype.onKeyAdded = function () {
	    this.undoManager.addState();
	    this.render(false, false, true);
	  };
	
	  Editor.prototype.onKeyRemoved = function (item) {
	    this.selectionManager.removeItem(item);
	    this.undoManager.addState();
	    if (this.selectionManager.selection.length) {
	      this.selectionManager.triggerSelect();
	    }
	    this.render(false, false, true);
	  };
	
	  Editor.prototype.render = function (time, time_changed, force) {
	    if (time === undefined) time = false;
	    if (time_changed === undefined) time_changed = false;
	    if (force === undefined) force = false;
	    if (time === false) {
	      time = this.timer.time[0];
	    }
	    if (force) {
	      this.timeline._isDirty = true;
	    }
	    this.timeline.render(time, time_changed);
	    this.controls.render(time, time_changed);
	    this.propertiesEditor.render(time, time_changed);
	  };
	
	  Editor.prototype.update = function () {
	    var _this2 = this;
	    var time = this.timer.time[0];
	    var time_changed = this.lastTime === time ? false : true;
	
	    this.render(time, time_changed);
	    this.lastTime = this.timer.time[0];
	    window.requestAnimationFrame(function () {
	      return _this2.update();
	    });
	  };
	
	  return Editor;
	})();
	
	module.exports = Editor;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
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
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var d3 = __webpack_require__(14);
	
	var Utils = __webpack_require__(2)["default"];
	var Header = __webpack_require__(17)["default"];
	var TimeIndicator = __webpack_require__(18)["default"];
	var Items = __webpack_require__(19)["default"];
	var KeysPreview = __webpack_require__(20)["default"];
	var Properties = __webpack_require__(21)["default"];
	var Keys = __webpack_require__(22)["default"];
	var Errors = __webpack_require__(23)["default"];
	var Selection = __webpack_require__(24)["default"];
	var Timeline = (function () {
	  var Timeline = function Timeline(editor, options) {
	    var _this = this;
	    this.editor = editor;
	    this.tweenTime = this.editor.tweenTime;
	    this.timer = this.tweenTime.timer;
	    this.selectionManager = this.editor.selectionManager;
	
	    this._isDirty = true;
	    this.timer = this.tweenTime.timer;
	    this.currentTime = this.timer.time; // used in timeindicator.
	
	    this.onUpdate = this.onUpdate.bind(this);
	
	    // Make the domain cover 20% of the totalDuation by default.
	    this.initialDomain = [];
	    this.initialDomain[0] = options.domainStart || 0;
	    this.initialDomain[1] = options.domainEnd || this.timer.totalDuration * 0.2;
	
	    // Adapt time to be greater or equal to domainStart.
	    if (this.initialDomain[0] > this.timer.getCurrentTime()) {
	      this.timer.time[0] = this.initialDomain[0];
	    }
	
	    var margin = { top: 6, right: 20, bottom: 0, left: 265 };
	    this.margin = margin;
	
	    var width = window.innerWidth - margin.left - margin.right;
	    var height = 270 - margin.top - margin.bottom - 40;
	    this.lineHeight = 20;
	    this.label_position_x = -margin.left + 20;
	
	    this.x = d3.time.scale().domain(this.initialDomain).range([0, width]);
	
	    this.xAxis = d3.svg.axis().scale(this.x).orient("top").tickSize(-height, 0).tickFormat(Utils.formatMinutes);
	
	    this.svg = d3.select(".timeline__main").append("svg").attr("width", width + margin.left + margin.right).attr("height", 600);
	
	    this.svgContainer = this.svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	    this.svgContainerTime = this.svg.append("g").attr("transform", "translate(" + margin.left + ",0)");
	
	    this.linesContainer = this.svg.append("g").attr("transform", "translate(" + margin.left + "," + (margin.top) + ")");
	
	    this.header = new Header(this.timer, this.initialDomain, this.tweenTime, width, margin);
	    this.timeIndicator = new TimeIndicator(this, this.svgContainerTime);
	
	    this.selection = new Selection(this, this.svg, margin);
	
	    this.items = new Items(this, this.linesContainer);
	    this.items.onUpdate.add(this.onUpdate);
	    this.keysPreview = new KeysPreview(this, this.linesContainer);
	
	    this.properties = new Properties(this);
	    this.properties.onKeyAdded.add(function (newKey, keyContainer) {
	      _this._isDirty = true;
	      // render the timeline directly so that we can directly select
	      // the new key with it's domElement.
	      _this.render(0, false);
	      _this.keys.selectNewKey(newKey, keyContainer);
	    });
	    this.errors = new Errors(this);
	    this.keys = new Keys(this);
	    this.keys.onKeyUpdated.add(function () {
	      _this.onUpdate();
	    });
	
	    this.xAxisGrid = d3.svg.axis().scale(this.x).ticks(100).tickSize(-this.items.dy, 0).tickFormat("").orient("top");
	
	    this.xGrid = this.svgContainer.append("g").attr("class", "x axis grid").attr("transform", "translate(0," + margin.top + ")").call(this.xAxisGrid);
	
	    this.xAxisElement = this.svgContainer.append("g").attr("class", "x axis").attr("transform", "translate(0," + margin.top + ")").call(this.xAxis);
	
	    this.header.onBrush.add(function (extent) {
	      _this.x.domain(extent);
	      _this.xGrid.call(_this.xAxisGrid);
	      _this.xAxisElement.call(_this.xAxis);
	      _this._isDirty = true;
	    });
	
	    // First render
	    window.requestAnimationFrame(function () {
	      _this.render();
	    });
	
	    window.onresize = function () {
	      var INNER_WIDTH = window.innerWidth;
	      var width = INNER_WIDTH - margin.left - margin.right;
	      _this.svg.attr("width", width + margin.left + margin.right);
	      _this.svg.selectAll(".timeline__right-mask").attr("width", INNER_WIDTH);
	      _this.x.range([0, width]);
	
	      _this._isDirty = true;
	      _this.header.resize(INNER_WIDTH);
	      _this.render();
	    };
	  };
	
	  Timeline.prototype.onUpdate = function () {
	    this.editor.render(false, true);
	  };
	
	  Timeline.prototype.render = function (time, time_changed) {
	    if (time_changed) {
	      // Update current domain when playing to keep time indicator in view.
	      var margin_ms = 16;
	      if (this.timer.getCurrentTime() > this.initialDomain[1]) {
	        var domainLength = this.initialDomain[1] - this.initialDomain[0];
	        this.initialDomain[0] += domainLength - margin_ms;
	        this.initialDomain[1] += domainLength - margin_ms;
	        this.header.setDomain(this.initialDomain);
	      }
	      if (this.timer.getCurrentTime() < this.initialDomain[0]) {
	        var domainLength = this.initialDomain[1] - this.initialDomain[0];
	        this.initialDomain[0] = this.timer.getCurrentTime();
	        this.initialDomain[1] = this.initialDomain[0] + domainLength;
	        this.header.setDomain(this.initialDomain);
	      }
	    }
	
	    if (this._isDirty || time_changed) {
	      // Render header and time indicator everytime the time changed.
	      this.header.render();
	      this.timeIndicator.render();
	    }
	
	    if (this._isDirty) {
	      // No need to call this on each frames, but only on brush, key drag, ...
	      var bar = this.items.render();
	      this.keysPreview.render(bar);
	      var properties = this.properties.render(bar);
	      this.errors.render(properties);
	      this.keys.render(properties);
	      this._isDirty = false;
	
	      // Adapt the timeline height.
	      var height = Math.max(this.items.dy + 30, 230);
	      this.xAxis.tickSize(-height, 0);
	      this.xAxisGrid.tickSize(-height, 0);
	      this.xGrid.call(this.xAxisGrid);
	      this.xAxisElement.call(this.xAxis);
	      this.svg.attr("height", height);
	      this.timeIndicator.updateHeight(height);
	    }
	  };
	
	  return Timeline;
	})();
	
	exports["default"] = Timeline;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var $ = __webpack_require__(15);
	var Signals = __webpack_require__(12);
	var Property = __webpack_require__(25)["default"];
	
	
	var tpl_propertiesEditor = __webpack_require__(26);
	
	var PropertiesEditor = (function () {
	  var PropertiesEditor = function PropertiesEditor(editor) {
	    this.editor = editor;
	
	    this.render = this.render.bind(this);
	    this.addProperty = this.addProperty.bind(this);
	    this.onSelect = this.onSelect.bind(this);
	    this.onKeyAdded = this.onKeyAdded.bind(this);
	
	    this.timeline = this.editor.timeline;
	    this.timer = this.editor.timer;
	    this.selectionManager = editor.selectionManager;
	
	    this.$el = $(tpl_propertiesEditor());
	    this.$container = this.$el.find(".properties-editor__main");
	    // todo: rename keyAdded to updated
	    this.keyAdded = new Signals.Signal();
	    this.keyRemoved = new Signals.Signal();
	    this.items = [];
	
	    // Close properties by default.
	    $("body").addClass("properties-is-closed");
	    // Add the properties editor to the document.
	    $("body").append(this.$el);
	
	    this.selectionManager.onSelect.add(this.onSelect);
	
	    // Stop event propagation to no play by accident.
	    this.$el.keypress(function (e) {
	      return e.stopPropagation();
	    });
	  };
	
	  PropertiesEditor.prototype.onKeyAdded = function () {
	    this.keyAdded.dispatch();
	  };
	
	  PropertiesEditor.prototype.onSelect = function (domElement) {
	    if (domElement === undefined) domElement = false;
	    this.items.forEach(function (item) {
	      item.remove();
	    });
	    this.items = [];
	    this.$container.empty();
	    if (domElement instanceof Array) {
	      for (var i = 0; i < domElement.length; i++) {
	        var element = domElement[i];
	        this.addProperty(element);
	      }
	    } else {
	      this.addProperty(domElement);
	    }
	
	    // When selecting anything, automatically display the properties editor.
	    if (this.items.length) {
	      $("body").removeClass("properties-is-closed");
	    }
	  };
	
	  PropertiesEditor.prototype.addProperty = function (domElement) {
	    var prop = new Property(this.editor, this.$container, domElement);
	    prop.keyAdded.add(this.onKeyAdded);
	    this.items.push(prop);
	  };
	
	  PropertiesEditor.prototype.render = function (time, time_changed) {
	    if (!time_changed) {
	      return;
	    }
	    this.items.forEach(function (prop) {
	      prop.update();
	    });
	  };
	
	  return PropertiesEditor;
	})();
	
	exports["default"] = PropertiesEditor;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var saveAs = __webpack_require__(27);
	
	var EditorMenu = (function () {
	  var EditorMenu = function EditorMenu(tweenTime, $timeline, editor) {
	    this.tweenTime = tweenTime;
	    this.$timeline = $timeline;
	    this.editor = editor;
	    this.timer = this.tweenTime.timer;
	    this.initExport();
	    this.initToggle();
	  };
	
	  EditorMenu.prototype.initToggle = function () {
	    var timelineClosed = false;
	    var $toggleLink = this.$timeline.find("[data-action=\"toggle\"]");
	    $toggleLink.click(function (e) {
	      e.preventDefault();
	      timelineClosed = !timelineClosed;
	      $toggleLink.toggleClass("menu-item--toggle-up", timelineClosed);
	      $("body").toggleClass("timeline-is-closed", timelineClosed);
	      return window.dispatchEvent(new Event("resize"));
	    });
	    var $toggleLinkSide = $(".properties-editor").find("[data-action=\"toggle\"]");
	    $toggleLinkSide.click(function (e) {
	      var propertiesClosed;
	      e.preventDefault();
	      propertiesClosed = !$("body").hasClass("properties-is-closed");
	      $("body").toggleClass("properties-is-closed", propertiesClosed);
	      return window.dispatchEvent(new Event("resize"));
	    });
	  };
	
	  EditorMenu.prototype.initExport = function () {
	    var exporter = this.editor.exporter;
	    this.$timeline.find("[data-action=\"export\"]").click(function (e) {
	      e.preventDefault();
	      var data = exporter.getJSON();
	      var blob = new Blob([data], {
	        type: "text/json;charset=utf-8"
	      });
	      saveAs(blob, "data.json");
	    });
	  };
	
	  return EditorMenu;
	})();
	
	exports["default"] = EditorMenu;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var EditorControls = (function () {
	  var EditorControls = function EditorControls(tweenTime, $timeline) {
	    var _this = this;
	    this.tweenTime = tweenTime;
	    this.$timeline = $timeline;
	    this.timer = this.tweenTime.timer;
	    this.$time = this.$timeline.find(".control--time");
	    this.$time_end = this.$timeline.find(".control--time-end");
	    this.initControls();
	    this.$time_end.val(this.tweenTime.timer.getDuration());
	
	    $(document).keypress(function (e) {
	      if (e.charCode == 32) {
	        // Space
	        _this.playPause();
	      }
	    });
	  };
	
	  EditorControls.prototype.playPause = function () {
	    var $play_pause;
	    this.timer.toggle();
	    $play_pause = this.$timeline.find(".control--play-pause");
	    $play_pause.toggleClass("icon-pause", this.timer.is_playing);
	    $play_pause.toggleClass("icon-play", !this.timer.is_playing);
	  };
	
	  EditorControls.prototype.initControls = function () {
	    var _this2 = this;
	    var $play_pause = this.$timeline.find(".control--play-pause");
	    $play_pause.click(function (e) {
	      e.preventDefault();
	      _this2.playPause();
	    });
	    var $bt_first = this.$timeline.find(".control--first");
	    $bt_first.click(function (e) {
	      e.preventDefault();
	      _this2.timer.seek([0]);
	    });
	    var $bt_last = this.$timeline.find(".control--last");
	    $bt_last.click(function (e) {
	      e.preventDefault();
	      var total = _this2.tweenTime.getTotalDuration();
	      _this2.timer.seek([total * 1000]);
	    });
	    this.$time.change(function () {
	      var seconds = parseFloat(_this2.$time.val(), 10) * 1000;
	      _this2.timer.seek([seconds]);
	    });
	    this.$time_end.change(function () {
	      var seconds = parseFloat(_this2.$time_end.val(), 10);
	      _this2.timer.setDuration(seconds);
	    });
	  };
	
	  EditorControls.prototype.render = function (time, time_changed) {
	    if (time_changed) {
	      var seconds = time / 1000;
	      this.$time.val(seconds.toFixed(3));
	    }
	  };
	
	  return EditorControls;
	})();
	
	exports["default"] = EditorControls;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var d3 = __webpack_require__(14);
	var Signals = __webpack_require__(12);
	
	var SelectionManager = (function () {
	  var SelectionManager = function SelectionManager(tweenTime) {
	    this.tweenTime = tweenTime;
	    this.selection = [];
	    this.onSelect = new Signals.Signal();
	  };
	
	  SelectionManager.prototype.removeDuplicates = function () {
	    var result = [];
	    for (var i = 0; i < this.selection.length; i++) {
	      var item = this.selection[i];
	      var found = false;
	      for (var j = 0; j < result.length; j++) {
	        var item2 = result[j];
	        if (item.isEqualNode(item2)) {
	          found = true;
	          break;
	        }
	      }
	      if (found === false) {
	        result.push(item);
	      }
	    }
	    this.selection = result;
	  };
	
	  SelectionManager.prototype.removeItem = function (item) {
	    var index = this.selection.indexOf(item);
	    if (index > -1) {
	      this.selection.splice(index, 1);
	    }
	  };
	
	  SelectionManager.prototype.sortSelection = function () {
	    var compare = function (a, b) {
	      if (!a.__data__ || !b.__data__) {
	        return 0;
	      }
	      if (a.__data__.time < b.__data__.time) {
	        return -1;
	      }
	      if (a.__data__.time > b.__data__.time) {
	        return 1;
	      }
	      return 0;
	    };
	    this.selection = this.selection.sort(compare);
	  };
	
	  SelectionManager.prototype.reset = function () {
	    this.selection = [];
	    this.highlightItems();
	    this.onSelect.dispatch(this.selection, false);
	  };
	
	  SelectionManager.prototype.triggerSelect = function () {
	    this.onSelect.dispatch(this.selection, false);
	  };
	
	  SelectionManager.prototype.select = function (item, addToSelection) {
	    if (addToSelection === undefined) addToSelection = false;
	    if (!addToSelection) {
	      this.selection = [];
	    }
	    if (item instanceof Array) {
	      for (var i = 0; i < item.length; i++) {
	        var el = item[i];
	        this.selection.push(el);
	      }
	    } else {
	      this.selection.push(item);
	    }
	
	    this.removeDuplicates();
	    this.highlightItems();
	    this.sortSelection();
	    this.onSelect.dispatch(this.selection, addToSelection);
	  };
	
	  SelectionManager.prototype.getSelection = function () {
	    return this.selection;
	  };
	
	  SelectionManager.prototype.highlightItems = function () {
	    d3.selectAll(".bar--selected").classed("bar--selected", false);
	    d3.selectAll(".key--selected").classed("key--selected", false);
	
	    for (var i = 0; i < this.selection.length; i++) {
	      var item = this.selection[i];
	      var d3item = d3.select(item);
	      if (d3item.classed("bar")) {
	        d3item.classed("bar--selected", true);
	      } else if (d3item.classed("key")) {
	        d3item.classed("key--selected", true);
	      }
	    }
	  };
	
	  return SelectionManager;
	})();
	
	exports["default"] = SelectionManager;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Exporter = (function () {
	  var Exporter = function Exporter(editor) {
	    this.editor = editor;
	  };
	
	  Exporter.prototype.getData = function () {
	    var tweenTime = this.editor.tweenTime;
	    var domain = this.editor.timeline.x.domain();
	    var domain_start = domain[0];
	    var domain_end = domain[1];
	    return {
	      settings: {
	        time: tweenTime.timer.getCurrentTime(),
	        duration: tweenTime.timer.getDuration(),
	        domain: [domain_start.getTime(), domain_end.getTime()]
	      },
	      data: tweenTime.data
	    };
	  };
	
	  Exporter.prototype.getJSON = function () {
	    var options = this.editor.options;
	    var json_replacer = function (key, val) {
	      // Disable all private properies from TweenMax/TimelineMax
	      if (key.indexOf("_") === 0) {
	        return undefined;
	      }
	      if (options.json_replacer != null) {
	        return options.json_replacer(key, val);
	      }
	      return val;
	    };
	
	    data = this.getData();
	    return JSON.stringify(data, json_replacer, 2);
	  };
	
	  return Exporter;
	})();
	
	exports["default"] = Exporter;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var $ = __webpack_require__(15);
	
	var UndoManager = (function () {
	  var UndoManager = function UndoManager(editor) {
	    var _this = this;
	    this.editor = editor;
	    this.history_max = 100;
	    this.history = [];
	    this.current_index = 0;
	
	    // Add the initial state
	    this.addState();
	
	    $(document).keydown(function (e) {
	      if (e.keyCode == 90) {
	        if (e.metaKey || e.ctrlKey) {
	          if (!e.shiftKey) {
	            // (command | ctrl) Z
	            _this.undo();
	          } else {
	            // (command | ctrl) shift Z
	            _this.redo();
	          }
	        }
	      }
	    });
	  };
	
	  UndoManager.prototype.undo = function () {
	    // If there is no more history return
	    if (this.current_index <= 0) {
	      return false;
	    }
	    this.current_index -= 1;
	    this.setState(this.current_index);
	  };
	
	  UndoManager.prototype.redo = function () {
	    // Stop if there is no more things.
	    if (this.current_index >= this.history.length - 1) {
	      return false;
	    }
	    this.current_index += 1;
	    this.setState(this.current_index);
	  };
	
	  UndoManager.prototype.addState = function () {
	    var data = JSON.parse(this.editor.exporter.getJSON());
	
	    // if we did some undo before and then edit something,
	    // we want to remove all actions past the current index first.
	    if (this.current_index + 1 < this.history.length) {
	      this.history.splice(this.current_index + 1, this.history.length - 1);
	    }
	
	    this.history.push(data);
	
	    // Keep history to a max size by removing the first element if needed.
	    if (this.history.length > this.history_max) {
	      this.history.shift();
	    }
	
	    // Set the current index
	    this.current_index = this.history.length - 1;
	  };
	
	  UndoManager.prototype.setState = function (index) {
	    var state = this.history[index];
	    var data = state.data;
	    var tweenTime = this.editor.tweenTime;
	
	    // naively copy keys and values from previous state
	    for (var item_key = 0; item_key < data.length; item_key++) {
	      var item = data[item_key];
	      // if item is not defined copy it
	      if (!tweenTime.data[item_key]) {
	        tweenTime.data[item_key] = item;
	      } else {
	        for (var prop_key = 0; prop_key < item.properties.length; prop_key++) {
	          var prop = item.properties[prop_key];
	          // if property is not defined copy it
	          if (!tweenTime.data[item_key].properties[prop_key]) {
	            tweenTime.data[item_key].properties[prop_key] = prop;
	          } else {
	            // set property keys
	            var keys = tweenTime.data[item_key].properties[prop_key].keys;
	            for (var key_key = 0; key_key < prop.keys.length; key_key++) {
	              var key = prop.keys[key_key];
	              if (!keys[key_key]) {
	                keys[key_key] = key;
	              } else {
	                keys[key_key].time = key.time;
	                keys[key_key].val = key.val;
	                keys[key_key].ease = key.ease;
	              }
	            }
	          }
	        }
	      }
	
	      tweenTime.data[item_key]._isDirty = true;
	    }
	    this.editor.render(false, true);
	  };
	
	  return UndoManager;
	})();
	
	exports["default"] = UndoManager;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

/***/ },
/* 13 */,
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_14__;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_15__;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var H = __webpack_require__(37);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"timeline\">");t.b("\n" + i);t.b("  <nav class=\"timeline__menu\">");t.b("\n" + i);t.b("    <a href=\"#\" class=\"menu-item\" data-action=\"export\">Export</a>");t.b("\n" + i);t.b("    <a href=\"#\" class=\"menu-item menu-item--toggle\" data-action=\"toggle\"><i class=\"icon-toggle\"></i></a>");t.b("\n" + i);t.b("  </nav>");t.b("\n" + i);t.b("  <div class=\"timeline__controls controls\">");t.b("\n" + i);t.b("    <a href=\"#\" class=\"control control--first icon-first\"></a>");t.b("\n" + i);t.b("    <a href=\"#\" class=\"control control--play-pause icon-play\"></a>");t.b("\n" + i);t.b("    <a href=\"#\" class=\"control control--last icon-last\"></a>");t.b("\n" + i);t.b("    <input type=\"text\" class=\"control control--input control--time\" /> <span class=\"control__time-separator\">/</span> <input type=\"text\" class=\"control control--input control--time-end\" />");t.b("\n" + i);t.b("  </div>");t.b("\n" + i);t.b("  <div class=\"timeline__header\">");t.b("\n");t.b("\n" + i);t.b("  </div>");t.b("\n" + i);t.b("  <div class=\"timeline__main\">");t.b("\n");t.b("\n" + i);t.b("  </div>");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<div class=\"timeline\">\n  <nav class=\"timeline__menu\">\n    <a href=\"#\" class=\"menu-item\" data-action=\"export\">Export</a>\n    <a href=\"#\" class=\"menu-item menu-item--toggle\" data-action=\"toggle\"><i class=\"icon-toggle\"></i></a>\n  </nav>\n  <div class=\"timeline__controls controls\">\n    <a href=\"#\" class=\"control control--first icon-first\"></a>\n    <a href=\"#\" class=\"control control--play-pause icon-play\"></a>\n    <a href=\"#\" class=\"control control--last icon-last\"></a>\n    <input type=\"text\" class=\"control control--input control--time\" /> <span class=\"control__time-separator\">/</span> <input type=\"text\" class=\"control control--input control--time-end\" />\n  </div>\n  <div class=\"timeline__header\">\n\n  </div>\n  <div class=\"timeline__main\">\n\n  </div>\n</div>\n", H); return T.render.apply(T, arguments); };

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var d3 = __webpack_require__(14);
	
	var Signals = __webpack_require__(12);
	var Utils = __webpack_require__(2)["default"];
	var Header = (function () {
	  var Header = function Header(timer, initialDomain, tweenTime, width, margin) {
	    this.timer = timer;
	    this.initialDomain = initialDomain;
	    this.tweenTime = tweenTime;
	
	    this.onBrush = new Signals.Signal();
	    this.margin = { top: 10, right: 20, bottom: 0, left: margin.left };
	    this.height = 50 - this.margin.top - this.margin.bottom + 20;
	
	    this.currentTime = this.timer.time;
	    this.x = d3.time.scale().range([0, width]);
	    this.x.domain([0, this.timer.totalDuration]);
	
	    // Same as this.x from timeline
	    this.xDisplayed = d3.time.scale().range([0, width]);
	    this.xDisplayed.domain(this.initialDomain);
	
	    this.xAxis = d3.svg.axis().scale(this.x).orient("top").tickSize(-5, 0).tickFormat(Utils.formatMinutes);
	
	    this.svg = d3.select(".timeline__header").append("svg").attr("width", width + this.margin.left + this.margin.right).attr("height", 56);
	
	    this.svgContainer = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
	
	    this.createBrushHandle();
	    this.createTimeHandle();
	    this.timer.durationChanged.add(this.onDurationChanged);
	  };
	
	  Header.prototype.adaptDomainToDuration = function (domain, seconds) {
	    var ms = seconds * 1000;
	    var new_domain = [domain[0], domain[1]];
	    // Make the domain smaller or equal to ms.
	    new_domain[0] = Math.min(new_domain[0], ms);
	    new_domain[1] = Math.min(new_domain[1], ms);
	    // Should not go below 0.
	    new_domain[0] = Math.max(new_domain[0], 0);
	
	    return new_domain;
	  };
	
	  Header.prototype.setDomain = function () {
	    this.brush.x(this.x).extent(this.initialDomain);
	    this.svgContainer.select(".brush").call(this.brush);
	    // Same as onBrush
	    this.onBrush.dispatch(this.initialDomain);
	    this.render();
	    this.xDisplayed.domain(this.initialDomain);
	  };
	
	  Header.prototype.onDurationChanged = function (seconds) {
	    this.x.domain([0, this.timer.totalDuration]);
	    this.xAxisElement.call(this.xAxis);
	    this.initialDomain = this.adaptDomainToDuration(this.initialDomain, seconds);
	    this.setDomain(this.initialDomain);
	  };
	
	  Header.prototype.createBrushHandle = function () {
	    var _this = this;
	    this.xAxisElement = this.svgContainer.append("g").attr("class", "x axis").attr("transform", "translate(0," + (this.margin.top + 7) + ")").call(this.xAxis);
	
	    var onBrush = function () {
	      var extent0 = _this.brush.extent();
	      // Get domain as milliseconds and not date.
	      var start = extent0[0].getTime();
	      var end = extent0[1].getTime();
	      // Set the initial domain.
	      _this.initialDomain[0] = start;
	      _this.initialDomain[1] = end;
	      _this.setDomain(_this.initialDomain);
	    };
	
	    this.brush = d3.svg.brush().x(this.x).extent(this.initialDomain).on("brush", onBrush);
	
	    this.gBrush = this.svgContainer.append("g").attr("class", "brush").call(this.brush).selectAll("rect").attr("height", 20);
	  };
	
	  Header.prototype.render = function () {
	    var timeSelection = this.svgContainer.selectAll(".time-indicator");
	    timeSelection.attr("transform", "translate(" + (this.xDisplayed(this.currentTime[0])) + ", 25)");
	  };
	
	  Header.prototype.createTimeHandle = function () {
	    var self = this;
	
	    var dragTimeMove = function () {
	      var event = d3.event.sourceEvent;
	      event.stopPropagation();
	      var tweenTime = self.tweenTime;
	      var event_x = event.x != null ? event.x : event.clientX;
	      var dx = self.xDisplayed.invert(event_x - self.margin.left);
	      dx = dx.getTime();
	      dx = Math.max(0, dx);
	
	      var timeMatch = false;
	      if (event.shiftKey) {
	        time = dx / 1000;
	        timeMatch = Utils.getClosestTime(tweenTime.data, time, "---non-existant");
	        if (timeMatch !== false) {
	          timeMatch = timeMatch * 1000;
	        }
	      }
	      if (timeMatch === false) {
	        timeMatch = dx;
	      }
	      self.timer.seek([timeMatch]);
	    };
	
	    var dragTime = d3.behavior.drag().origin(function (d) {
	      return d;
	    }).on("drag", dragTimeMove);
	
	    var timeSelection = this.svgContainer.selectAll(".time-indicator").data(this.currentTime);
	
	    timeSelection.enter().append("rect").attr("x", 0).attr("y", 20).attr("width", self.xDisplayed(self.timer.totalDuration)).attr("height", 50).attr("fill-opacity", 0).on("click", function () {
	      var mouse = d3.mouse(this);
	      var dx = self.xDisplayed.invert(mouse[0]);
	      dx = dx.getTime();
	      dx = Math.max(0, dx);
	      self.timer.seek([dx]);
	    });
	
	    var timeGrp = timeSelection.enter().append("g").attr("class", "time-indicator").attr("transform", "translate(-0.5," + 30 + ")").call(dragTime);
	
	    timeGrp.append("rect").attr("class", "time-indicator__line").attr("x", -0.5).attr("y", 0).attr("width", 1).attr("height", 1000);
	
	    timeGrp.append("path").attr("class", "time-indicator__handle").attr("d", "M -5 -3 L -5 5 L 0 10 L 5 5 L 5 -3 L -5 -3");
	
	    // Mask time indicator
	    // todo: remove the mask.
	    this.svgContainer.append("rect").attr("class", "graph-mask").attr("x", -self.margin.left).attr("y", -self.margin.top).attr("width", self.margin.left - 5).attr("height", self.height);
	  };
	
	  Header.prototype.resize = function (width) {
	    width = width - this.margin.left - this.margin.right;
	    this.svg.attr("width", width + this.margin.left + this.margin.right);
	
	    this.x.range([0, width]);
	    this.xDisplayed.range([0, width]);
	    this.xAxisElement.call(this.xAxis);
	  };
	
	  return Header;
	})();
	
	exports["default"] = Header;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var TimeIndicator = (function () {
	  var TimeIndicator = function TimeIndicator(timeline, container) {
	    this.timeline = timeline;
	    this.container = container;
	    this.timeSelection = this.container.selectAll(".time-indicator").data(this.timeline.currentTime);
	    this.timeGrp = this.timeSelection.enter().append("svg").attr("class", "time-indicator timeline__right-mask").attr("width", window.innerWidth - this.timeline.label_position_x).attr("height", 442);
	
	    this.timeSelection = this.timeGrp.append("rect").attr("class", "time-indicator__line").attr("x", -1).attr("y", -this.timeline.margin.top - 5).attr("width", 1).attr("height", 1000);
	  };
	
	  TimeIndicator.prototype.updateHeight = function (height) {
	    this.timeGrp.attr("height", height);
	    this.timeSelection.attr("height", height + this.timeline.margin.top + 5);
	  };
	
	  TimeIndicator.prototype.render = function () {
	    this.timeSelection = this.container.selectAll(".time-indicator rect");
	    this.timeSelection.attr("x", this.timeline.x(this.timeline.currentTime[0]) - 0.5);
	  };
	
	  return TimeIndicator;
	})();
	
	exports["default"] = TimeIndicator;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var d3 = __webpack_require__(14);
	var Signals = __webpack_require__(12);
	var _ = __webpack_require__(1);
	var Utils = __webpack_require__(2)["default"];
	var Items = (function () {
	  var Items = function Items(timeline, container) {
	    this.timeline = timeline;
	    this.container = container;
	    this.dy = 10 + this.timeline.margin.top;
	    this.onUpdate = new Signals.Signal();
	  };
	
	  Items.prototype.render = function () {
	    var self = this;
	    var tweenTime = self.timeline.tweenTime;
	
	    var selectBar = function () {
	      self.timeline.selectionManager.select(this);
	    };
	
	    var dragmove = function (d) {
	      var dx = self.timeline.x.invert(d3.event.x).getTime() / 1000;
	      var diff = (dx - d.start);
	      d.start += diff;
	      d.end += diff;
	      if (d.properties) {
	        for (var prop_key = 0; prop_key < d.properties.length; prop_key++) {
	          var prop = d.properties[prop_key];
	          for (var i = 0; i < prop.keys.length; i++) {
	            var key = prop.keys[i];
	            key.time += diff;
	          }
	        }
	      }
	      d._isDirty = true;
	      self.onUpdate.dispatch();
	    };
	
	    var dragmoveLeft = function (d) {
	      d3.event.sourceEvent.stopPropagation();
	      var sourceEvent = d3.event.sourceEvent;
	      var dx = self.timeline.x.invert(d3.event.x).getTime() / 1000;
	      var timeMatch = false;
	      if (sourceEvent.shiftKey) {
	        timeMatch = Utils.getClosestTime(tweenTime.data, dx, d.id, false, tweenTime.timer);
	      }
	      if (!timeMatch) {
	        var diff = dx - d.start;
	        timeMatch = d.start + diff;
	      }
	      d.start = timeMatch;
	      d._isDirty = true;
	      self.onUpdate.dispatch();
	    };
	
	    var dragmoveRight = function (d) {
	      d3.event.sourceEvent.stopPropagation();
	      var sourceEvent = d3.event.sourceEvent;
	      var dx = self.timeline.x.invert(d3.event.x).getTime() / 1000;
	      var timeMatch = false;
	      if (sourceEvent.shiftKey) {
	        timeMatch = Utils.getClosestTime(tweenTime.data, dx, false, false, tweenTime.timer);
	      }
	      if (!timeMatch) {
	        var diff = dx - d.end;
	        timeMatch = d.end + diff;
	      }
	      d.end = timeMatch;
	      d._isDirty = true;
	      self.onUpdate.dispatch();
	    };
	
	    var dragLeft = d3.behavior.drag().origin(function () {
	      var t = d3.select(this);
	      return { x: t.attr("x"), y: t.attr("y") };
	    }).on("drag", dragmoveLeft);
	
	    var dragRight = d3.behavior.drag().origin(function () {
	      var t = d3.select(this);
	      return { x: t.attr("x"), y: t.attr("y") };
	    }).on("drag", dragmoveRight);
	
	    var drag = d3.behavior.drag().origin(function () {
	      var t = d3.select(this);
	      return { x: t.attr("x"), y: t.attr("y") };
	    }).on("drag", dragmove);
	
	    var bar_border = 1;
	    var bar = this.container.selectAll(".line-grp").data(this.timeline.tweenTime.data, function (d) {
	      return d.id;
	    });
	
	    var barEnter = bar.enter().append("g").attr("class", "line-grp");
	
	    var barContainerRight = barEnter.append("svg").attr("class", "timeline__right-mask").attr("width", window.innerWidth - self.timeline.label_position_x).attr("height", self.timeline.lineHeight);
	
	    barContainerRight.append("rect").attr("class", "bar")
	    // Add a unique id for SelectionManager.removeDuplicates
	    .attr("id", function () {
	      return Utils.guid();
	    }).attr("y", 3).attr("height", 14);
	
	    barContainerRight.append("rect").attr("class", "bar-anchor bar-anchor--left").attr("y", 2).attr("height", 16).attr("width", 6).call(dragLeft);
	
	    barContainerRight.append("rect").attr("class", "bar-anchor bar-anchor--right").attr("y", 2).attr("height", 16).attr("width", 6).call(dragRight);
	
	    self.dy = 10 + this.timeline.margin.top;
	    bar.attr("transform", function (d) {
	      var y = self.dy;
	      self.dy += self.timeline.lineHeight;
	      if (!d.collapsed) {
	        var numProperties = 0;
	        if (d.properties) {
	          var visibleProperties = _.filter(d.properties, function (prop) {
	            return prop.keys.length;
	          });
	          numProperties = visibleProperties.length;
	        }
	        self.dy += numProperties * self.timeline.lineHeight;
	      }
	      return "translate(0," + y + ")";
	    });
	
	    var barWithStartAndEnd = function (d) {
	      if ((d.start != null) && (d.end != null)) {
	        return true;
	      }
	      return false;
	    };
	
	    bar.selectAll(".bar-anchor--left").filter(barWithStartAndEnd).attr("x", function (d) {
	      return self.timeline.x(d.start * 1000) - 1;
	    }).on("mousedown", function () {
	      // Don't trigger mousedown on linescontainer else
	      // it create the selection rectangle
	      d3.event.stopPropagation();
	    });
	
	    bar.selectAll(".bar-anchor--right").filter(barWithStartAndEnd).attr("x", function (d) {
	      return self.timeline.x(d.end * 1000) - 1;
	    }).on("mousedown", function () {
	      // Don't trigger mousedown on linescontainer else
	      // it create the selection rectangle
	      d3.event.stopPropagation();
	    });
	
	    bar.selectAll(".bar").filter(barWithStartAndEnd).attr("x", function (d) {
	      return self.timeline.x(d.start * 1000) + bar_border;
	    }).attr("width", function (d) {
	      return Math.max(0, (self.timeline.x(d.end) - self.timeline.x(d.start)) * 1000 - bar_border);
	    }).call(drag).on("click", selectBar).on("mousedown", function () {
	      // Don't trigger mousedown on linescontainer else
	      // it create the selection rectangle
	      d3.event.stopPropagation();
	    });
	
	    barEnter.append("text").attr("class", "line-label").attr("x", self.timeline.label_position_x + 10).attr("y", 16).text(function (d) {
	      return d.label;
	    }).on("click", selectBar).on("mousedown", function () {
	      // Don't trigger mousedown on linescontainer else
	      // it create the selection rectangle
	      d3.event.stopPropagation();
	    });
	
	    var self = this;
	    barEnter.append("text").attr("class", "line__toggle").attr("x", self.timeline.label_position_x - 10).attr("y", 16).on("click", function (d) {
	      d.collapsed = !d.collapsed;
	      self.onUpdate.dispatch();
	    });
	
	    bar.selectAll(".line__toggle").text(function (d) {
	      if (d.collapsed) {
	        return "\u25b8";
	      } else {
	        return "\u25be";
	      }
	    });
	
	    barEnter.append("line").attr("class", "line-separator").attr("x1", -self.timeline.margin.left).attr("x2", self.timeline.x(self.timeline.timer.totalDuration + 100)).attr("y1", self.timeline.lineHeight).attr("y2", self.timeline.lineHeight);
	
	    bar.exit().remove();
	
	    return bar;
	  };
	
	  return Items;
	})();
	
	exports["default"] = Items;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var d3 = __webpack_require__(14);
	
	var KeysPreview = (function () {
	  var KeysPreview = function KeysPreview(timeline, container) {
	    this.timeline = timeline;
	    this.container = container;
	  };
	
	  KeysPreview.prototype.render = function (bar) {
	    var self = this;
	
	    var propVal = function (d) {
	      if (d.properties) {
	        return d.properties;
	      } else {
	        return [];
	      }
	    };
	    var propKey = function (d) {
	      return d.name;
	    };
	
	    var properties = bar.selectAll(".keys-preview").data(propVal, propKey);
	
	    properties.enter().append("svg").attr("class", "keys-preview timeline__right-mask").attr("width", window.innerWidth - self.timeline.label_position_x).attr("height", self.timeline.lineHeight);
	
	    var setItemStyle = function () {
	      var item = d3.select(this.parentNode.parentNode);
	      var bar_data = item.datum();
	      if (bar_data.collapsed === true) {
	        return "";
	      }
	      // Show only when item is collapsed
	      return "display: none;";
	    };
	
	    properties.selectAll(".key--preview").attr("style", setItemStyle);
	
	    var keyValue = function (d) {
	      return d.keys;
	    };
	    var keyKey = function (d) {
	      return d.time;
	    };
	    var keys = properties.selectAll(".key--preview").data(keyValue, keyKey);
	
	    keys.enter().append("path").attr("class", "key--preview").attr("style", setItemStyle).attr("d", "M 0 -4 L 4 0 L 0 4 L -4 0");
	
	    keys.attr("transform", function (d) {
	      var dx = self.timeline.x(d.time * 1000);
	      dx = parseInt(dx, 10);
	      var dy = 11;
	      return "translate(" + dx + "," + dy + ")";
	    });
	
	    keys.exit().remove();
	  };
	
	  return KeysPreview;
	})();
	
	exports["default"] = KeysPreview;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var d3 = __webpack_require__(14);
	var Signals = __webpack_require__(12);
	var Utils = __webpack_require__(2)["default"];
	var Properties = (function () {
	  var Properties = function Properties(timeline) {
	    this.timeline = timeline;
	    this.onKeyAdded = new Signals.Signal();
	    this.subGrp = false;
	  };
	
	  Properties.prototype.render = function (bar) {
	    var _this = this;
	    var self = this;
	
	    var propVal = function (d) {
	      if (d.properties) {
	        return d.properties.filter(function (prop) {
	          return prop.keys.length;
	        });
	      } else {
	        return [];
	      }
	    };
	    var propKey = function (d) {
	      return d.name;
	    };
	
	    var properties = bar.selectAll(".line-item").data(propVal, propKey);
	    var subGrp = properties.enter().append("g").attr("class", "line-item");
	
	    // Save subGrp in a variable for use in Errors.coffee
	    self.subGrp = subGrp;
	
	    properties.attr("transform", function (d, i) {
	      var sub_height = (i + 1) * self.timeline.lineHeight;
	      return "translate(0," + sub_height + ")";
	    });
	
	    subGrp.append("rect").attr("class", "click-handler click-handler--property").attr("x", 0).attr("y", 0).attr("width", self.timeline.x(self.timeline.timer.totalDuration + 100)).attr("height", self.timeline.lineHeight).on("dblclick", function (d) {
	      var lineObject = _this.parentNode.parentNode;
	      var lineValue = d3.select(lineObject).datum();
	      var def = d["default"] ? d["default"] : 0;
	      var mouse = d3.mouse(_this);
	      var dx = self.timeline.x.invert(mouse[0]);
	      dx = dx.getTime() / 1000;
	      var prevKey = Utils.getPreviousKey(d.keys, dx);
	      // set the value to match the previous key if we found one
	      if (prevKey) {
	        def = prevKey.val;
	      }
	      var newKey = {
	        time: dx,
	        val: def
	      };
	      d.keys.push(newKey);
	      // Sort the keys for tweens creation
	      d.keys = Utils.sortKeys(d.keys);
	
	      lineValue._isDirty = true;
	      keyContainer = _this.parentNode;
	      self.onKeyAdded.dispatch(newKey, keyContainer);
	    });
	
	    // Mask
	    subGrp.append("svg").attr("class", "line-item__keys timeline__right-mask").attr("width", window.innerWidth - self.timeline.label_position_x).attr("height", self.timeline.lineHeight).attr("fill", "#f00");
	
	    subGrp.append("text").attr("class", "line-label line-label--small").attr("x", self.timeline.label_position_x + 10).attr("y", 15).text(function (d) {
	      return d.name;
	    });
	
	    subGrp.append("line").attr("class", "line-separator--secondary").attr("x1", -self.timeline.margin.left).attr("x2", self.timeline.x(self.timeline.timer.totalDuration + 100)).attr("y1", self.timeline.lineHeight).attr("y2", self.timeline.lineHeight);
	
	    bar.selectAll(".line-item").attr("display", function () {
	      var lineObject = this.parentNode;
	      var lineValue = d3.select(lineObject).datum();
	      if (!lineValue.collapsed) {
	        return "block";
	      } else {
	        return "none";
	      }
	    });
	
	    properties.exit().remove();
	
	    return properties;
	  };
	
	  return Properties;
	})();
	
	exports["default"] = Properties;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var d3 = __webpack_require__(14);
	var Signals = __webpack_require__(12);
	var Utils = __webpack_require__(2)["default"];
	var _ = __webpack_require__(1);
	
	var Keys = (function () {
	  var Keys = function Keys(timeline) {
	    this.timeline = timeline;
	    this.onKeyUpdated = new Signals.Signal();
	  };
	
	  Keys.prototype.selectNewKey = function (data, container) {
	    var self = this;
	    var key = d3.select(container).selectAll(".key").filter(function (item) {
	      return item.time === data.time;
	    });
	    if (key.length) {
	      d3.selectAll(".key--selected").classed("key--selected", false);
	      key.classed("key--selected", true);
	      key = key[0][0];
	      self.timeline.selectionManager.select(key);
	    }
	  };
	
	  Keys.prototype.render = function (properties) {
	    var self = this;
	    var tweenTime = self.timeline.tweenTime;
	
	    var dragmove = function (d) {
	      var _this = this;
	      var sourceEvent = d3.event.sourceEvent;
	      var propertyObject = this.parentNode;
	      var lineObject = propertyObject.parentNode.parentNode;
	      var propertyData = d3.select(propertyObject).datum();
	      var lineData = d3.select(lineObject).datum();
	
	      var currentDomainStart = self.timeline.x.domain()[0];
	      var mouse = d3.mouse(this);
	      var old_time = d.time;
	      var dx = self.timeline.x.invert(mouse[0]);
	      dx = dx.getTime();
	      dx = dx / 1000 - currentDomainStart / 1000;
	      dx = d.time + dx;
	
	      var selection = self.timeline.selectionManager.getSelection();
	      var selection_first_time = false;
	      var selection_last_time = false;
	      if (selection.length) {
	        selection_first_time = d3.select(selection[0]).datum().time;
	        selection_last_time = d3.select(selection[selection.length - 1]).datum().time;
	      }
	      selection = _.filter(selection, function (item) {
	        return item.isEqualNode(_this) === false;
	      });
	
	      var timeMatch = false;
	      if (sourceEvent.shiftKey) {
	        timeMatch = Utils.getClosestTime(tweenTime.data, dx, lineData.id, propertyData.name, tweenTime.timer);
	      }
	      if (timeMatch === false) {
	        timeMatch = dx;
	      }
	
	      d.time = timeMatch;
	      // Sort the keys of the current selected item.
	      propertyData.keys = Utils.sortKeys(propertyData.keys);
	      var time_offset = d.time - old_time;
	
	      var updateKeyItem = function (item) {
	        var itemPropertyObject = item.parentNode;
	        var itemPropertyData = d3.select(itemPropertyObject).datum();
	        var itemLineObject = itemPropertyObject.parentNode.parentNode;
	        var itemLineData = d3.select(itemLineObject).datum();
	        itemLineData._isDirty = true;
	        itemPropertyData.keys = Utils.sortKeys(itemPropertyData.keys);
	      };
	
	      var key_scale = false;
	      var is_first = false;
	      if (selection.length) {
	        if (sourceEvent.altKey && (selection_first_time != null) && (selection_last_time != null)) {
	          is_first = selection_first_time === old_time;
	          if (is_first) {
	            key_scale = (selection_last_time - d.time) / (selection_last_time - old_time);
	          } else {
	            key_scale = (d.time - selection_first_time) / (old_time - selection_first_time);
	          }
	        }
	
	        for (var i = 0; i < selection.length; i++) {
	          var item = selection[i];
	          data = d3.select(item).datum();
	          if (key_scale === false) {
	            data.time += time_offset;
	          } else {
	            if (is_first) {
	              data.time = selection_last_time - (selection_last_time - data.time) * key_scale;
	            } else {
	              data.time = selection_first_time + (data.time - selection_first_time) * key_scale;
	            }
	          }
	          updateKeyItem(item);
	        }
	      }
	
	      lineData._isDirty = true;
	      self.onKeyUpdated.dispatch();
	    };
	
	    var propValue = function (d) {
	      return d.keys;
	    };
	    var propKey = function (d) {
	      if (!d._id) {
	        d._id = Utils.guid();
	      }
	      return d._id;
	    };
	    var keys = properties.select(".line-item__keys").selectAll(".key").data(propValue, propKey);
	
	    // selectKey is triggered by dragstart event
	    var selectKey = function () {
	      var event = d3.event;
	      // with dragstart event the mousevent is is inside the event.sourcEvent
	      if (event.sourceEvent) {
	        event = event.sourceEvent;
	      }
	
	      var addToSelection = event.shiftKey;
	      // if element is already selectionned and we are on
	      // the dragstart event, we stop there since it is already selected.
	      if (d3.event.type && d3.event.type === "dragstart") {
	        if (d3.select(this).classed("key--selected")) {
	          return;
	        }
	      }
	      self.timeline.selectionManager.select(this, addToSelection);
	    };
	
	    var dragend = function () {
	      self.timeline.editor.undoManager.addState();
	    };
	
	    var drag = d3.behavior.drag().origin(function (d) {
	      return d;
	    }).on("drag", dragmove).on("dragstart", selectKey).on("dragend", dragend);
	
	    var key_grp = keys.enter().append("g").attr("class", "key")
	    // Use the unique id added in propKey above for the dom element id.
	    .attr("id", function (d) {
	      return d._id;
	    }).on("mousedown", function () {
	      // Don't trigger mousedown on linescontainer else
	      // it create the selection rectangle
	      d3.event.stopPropagation();
	    }).call(drag);
	
	    properties.selectAll(".key").attr("class", function (d) {
	      var cls = "key";
	      // keep selected class
	      if (d3.select(this).classed("key--selected")) {
	        cls += " key--selected";
	      }
	      if (d.ease) {
	        var ease = d.ease.split(".");
	        if (ease.length === 2) {
	          cls += " " + ease[1];
	        }
	      } else {
	        // If no easing specified, the it's the default Quad.easeOut
	        cls += " easeOut";
	      }
	      return cls;
	    });
	
	    var grp_linear = key_grp.append("g").attr("class", "ease-linear");
	    grp_linear.append("path").attr("class", "key__shape-arrow").attr("d", "M 0 -6 L 6 0 L 0 6");
	    grp_linear.append("path").attr("class", "key__shape-arrow").attr("d", "M 0 -6 L -6 0 L 0 6");
	
	    var grp_in = key_grp.append("g").attr("class", "ease-in");
	    grp_in.append("path").attr("class", "key__shape-rect").attr("d", "M 0 -6 L 0 6 L 4 5 L 1 0 L 4 -5");
	    grp_in.append("path").attr("class", "key__shape-arrow").attr("d", "M 0 -6 L -6 0 L 0 6");
	
	    var grp_out = key_grp.append("g").attr("class", "ease-out");
	    grp_out.append("path").attr("class", "key__shape-rect").attr("d", "M 0 -6 L 0 6 L -4 5 L -1 0 L -4 -5");
	    grp_out.append("path").attr("class", "key__shape-arrow").attr("d", "M 0 -6 L 6 0 L 0 6");
	
	    var grp_inout = key_grp.append("g").attr("class", "ease-inout");
	    grp_inout.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 5);
	
	    keys.attr("transform", function (d) {
	      var dx = self.timeline.x(d.time * 1000);
	      dx = parseInt(dx, 10);
	      var dy = 10;
	      return "translate(" + dx + "," + dy + ")";
	    });
	
	    keys.exit().remove();
	  };
	
	  return Keys;
	})();
	
	exports["default"] = Keys;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Errors = (function () {
	  var Errors = function Errors(timeline) {
	    this.timeline = timeline;
	  };
	
	  Errors.prototype.render = function (properties) {
	    var self = this;
	    var subGrp = self.timeline.properties.subGrp;
	    var propertiesWithError = function (d) {
	      return d.errors != null;
	    };
	    // use insert with :first-child to prepend.
	    subGrp.insert("svg", ":first-child").attr("class", "line-item__errors").attr("width", window.innerWidth - self.timeline.label_position_x).attr("height", self.timeline.lineHeight);
	
	    var errorsValue = function (d) {
	      return d.errors;
	    };
	    var errorTime = function (d) {
	      return d.time;
	    };
	
	    var errors = properties.filter(propertiesWithError).select(".line-item__errors").selectAll(".error").data(errorsValue, errorTime);
	
	    errors.enter().append("rect").attr("class", "error").attr("width", 4).attr("height", self.timeline.lineHeight - 1).attr("y", "1");
	
	    properties.selectAll(".error").attr("x", function (d) {
	      var dx;
	      dx = self.timeline.x(d.time * 1000);
	      return dx;
	    });
	
	    errors.exit().remove();
	  };
	
	  return Errors;
	})();
	
	exports["default"] = Errors;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Selection = (function () {
	  var Selection = function Selection(timeline, svg, margin) {
	    this.timeline = timeline;
	    this.svg = svg;
	    this.margin = margin;
	
	    this.onMouseUp = this.onMouseUp.bind(this);
	    this.init();
	  };
	
	  Selection.prototype.onMouseUp = function () {
	    this.svg.selectAll(".selection").remove();
	    // Enable again the default browser text selection.
	    $("body").css({
	      "user-select": "all"
	    });
	  };
	
	  Selection.prototype.init = function () {
	    var self = this;
	    this.svg.on("mousedown", function () {
	      var p = d3.mouse(this);
	      // Only init selection if we click on the timeline and not on the labels.
	      if (p[0] < self.timeline.margin.left) {
	        return;
	      }
	      self.svg.append("rect").attr({
	        "class": "selection",
	        x: p[0],
	        y: p[1],
	        width: 0,
	        height: 0
	      });
	      // Unselect items.
	      self.timeline.selectionManager.reset();
	      // Prevent default browser text selection.
	      $("body").css({
	        "user-select": "none"
	      });
	    }).on("mousemove", function () {
	      var s = self.svg.select(".selection");
	      if (s.empty()) {
	        return;
	      }
	      var p = d3.mouse(this);
	      var d = {
	        x: parseInt(s.attr("x"), 10),
	        y: parseInt(s.attr("y"), 10),
	        width: parseInt(s.attr("width"), 10),
	        height: parseInt(s.attr("height"), 10)
	      };
	      // Apply margin to mouse selection.
	      p[0] = Math.max(self.margin.left, p[0]);
	
	      var move = {
	        x: p[0] - d.x,
	        y: p[1] - d.y
	      };
	      if (move.x < 1 || move.x * 2 < d.width) {
	        d.x = p[0];
	        d.width -= move.x;
	      } else {
	        d.width = move.x;
	      }
	
	      if (move.y < 1 || move.y * 2 < d.height) {
	        d.y = p[1];
	        d.height -= move.y;
	      } else {
	        d.height = move.y;
	      }
	
	      s.attr(d);
	
	      // remove margins from selection
	      d.x -= self.margin.left;
	      var key_width = 6;
	
	      d.timeStart = self.timeline.x.invert(d.x - key_width).getTime() / 1000;
	      d.timeEnd = self.timeline.x.invert(d.x + d.width + key_width).getTime() / 1000;
	      var containerBounding = self.svg[0][0].getBoundingClientRect();
	
	      // deselect all previously selected items
	      d3.selectAll(".key--selected").classed("key--selected", false);
	      self.timeline.selectionManager.reset();
	      var selection = [];
	      d3.selectAll(".key").each(function (state_data) {
	        var item_data = d3.select(this.parentNode.parentNode.parentNode).datum();
	        if (item_data.collapsed !== true) {
	          var itemBounding = d3.select(this)[0][0].getBoundingClientRect();
	          var y = itemBounding.top - containerBounding.top;
	          if (state_data.time >= d.timeStart && state_data.time <= d.timeEnd) {
	            // use or condition for top and bottom
	            if ((y >= d.y && y <= d.y + d.height) || (y + 10 >= d.y && y + 10 <= d.y + d.height)) {
	              d3.select(this).classed("key--selected", true);
	              selection.push(this);
	            }
	          }
	        }
	      });
	      self.timeline.selectionManager.select(selection);
	    });
	    // Attach the mouseup event to window so that it catch it event if
	    // mouseup happen outside of the browser window.
	    $(window).on("mouseup", this.onMouseUp);
	  };
	
	  return Selection;
	})();
	
	exports["default"] = Selection;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Signals = __webpack_require__(12);
	var PropertyNumber = __webpack_require__(28)["default"];
	var PropertyColor = __webpack_require__(29)["default"];
	var PropertyTween = __webpack_require__(30)["default"];
	var Property = (function () {
	  var Property = function Property(editor, $el, domElement) {
	    this.editor = editor;
	    this.$el = $el;
	
	    this.onKeyAdded = this.onKeyAdded.bind(this);
	
	    this.timeline = editor.timeline;
	    this.timer = editor.timer;
	    this.selectionManager = editor.selectionManager;
	    this.keyAdded = new Signals.Signal();
	    this.items = [];
	    this.numberProp = false;
	    this.tweenProp = false;
	
	    var d3Object = d3.select(domElement);
	
	    var key_val = false;
	    var propertyObject = false;
	    var propertyData = false;
	    var lineObject = false;
	    var lineData = false;
	
	    if (d3Object.classed("key")) {
	      propertyObject = domElement.parentNode;
	      lineObject = propertyObject.parentNode.parentNode;
	      lineData = d3.select(lineObject).datum();
	      propertyData = d3.select(propertyObject).datum();
	      key_val = d3Object.datum();
	    }
	
	    // click on bar
	    if (d3Object.classed("bar")) {
	      lineData = d3Object.datum();
	    }
	
	    // click on bar label
	    if (d3Object.classed("line-label")) {
	      domElement = domElement.parentNode;
	      d3Object = d3.select(domElement);
	      lineData = d3Object.datum();
	    }
	
	    // data and propertyData are defined on key select.
	    var property_name = false;
	    if (propertyData) {
	      property_name = propertyData.name;
	    }
	
	    // Get the property container.
	    var $container = this.getContainer(lineData);
	
	    var $tween_container = $container;
	
	    // Basic data, loop through properties.
	    for (var key in lineData.properties) {
	      var instance_prop = lineData.properties[key];
	      // show all properties or only 1 if we selected a key.
	      if (!property_name || instance_prop.name === property_name) {
	        var $grp_container = this.getGroupContainer(instance_prop, $container);
	        var numberProp = this.addNumberProperty(instance_prop, lineData, key_val, $grp_container);
	        this.items.push(numberProp);
	        if (instance_prop.name === property_name) {
	          $tween_container = $grp_container;
	        }
	      }
	    }
	
	    if (property_name) {
	      // Add tween select if we are editing a key.
	      var tweenProp = this.addTweenProperty(instance_prop, lineData, key_val, $tween_container, propertyData, domElement);
	      this.items.push(tweenProp);
	    }
	  };
	
	  Property.prototype.onKeyAdded = function () {
	    // propagate the event.
	    this.keyAdded.dispatch();
	  };
	
	  Property.prototype.getGroupContainer = function (instance_prop, $container) {
	    var $existing, $grp, grp_class;
	    if (!instance_prop.group) {
	      grp_class = "property-grp--general";
	      $existing = $container.find("." + grp_class);
	      if ($existing.length) {
	        return $existing;
	      } else {
	        $grp = this.createGroupContainer(grp_class);
	        $container.append($grp);
	        return $grp;
	      }
	    } else {
	      // Replace all spaces to dash and make class lowercase
	      var group_name = instance_prop.group.replace(/\s+/g, "-").toLowerCase();
	      grp_class = "property-grp--" + group_name;
	      $existing = $container.find("." + grp_class);
	      if ($existing.length) {
	        return $existing;
	      } else {
	        $grp = this.createGroupContainer(grp_class, instance_prop.group);
	        $container.append($grp);
	        return $grp;
	      }
	    }
	  };
	
	  Property.prototype.createGroupContainer = function (grp_class, label) {
	    if (label === undefined) label = false;
	    var $grp = $("<div class=\"property-grp " + grp_class + "\"></div>");
	    if (label) {
	      $grp.append("<h3 class=\"property-grp__title\">" + label + "</h3>");
	    }
	    return $grp;
	  };
	
	  Property.prototype.getContainer = function (lineData) {
	    var $container = false;
	    if (lineData.id) {
	      $container = $("#property--" + lineData.id);
	      if (!$container.length) {
	        $container = $container = $("<div class=\"properties__wrapper\" id=\"property--" + lineData.id + "\"></div>");
	        this.$el.append($container);
	        if (lineData.label) {
	          $container.append("<h2 class=\"properties-editor__title\">" + lineData.label + "</h2>");
	        }
	      }
	    }
	    if ($container === false) {
	      $container = $("<div class=\"properties__wrapper\" id=\"no-item\"></div>");
	      this.$el.append($container);
	    }
	    return $container;
	  };
	
	  Property.prototype.remove = function () {
	    this.items.forEach(function (item) {
	      item.remove();
	    });
	    if (this.keyAdded) {
	      this.keyAdded.dispose();
	    }
	
	    delete this.editor;
	    delete this.$el;
	
	    delete this.timeline;
	    delete this.timer;
	    delete this.selectionManager;
	    delete this.keyAdded;
	    delete this.items;
	    delete this.numberProp;
	    delete this.tweenProp;
	  };
	
	  Property.prototype.addNumberProperty = function (instance_prop, lineData, key_val, $container) {
	    var propClass = PropertyNumber;
	    if (instance_prop.type && instance_prop.type === "color") {
	      propClass = PropertyColor;
	    }
	    var prop = new propClass(instance_prop, lineData, this.editor, key_val);
	    prop.keyAdded.add(this.onKeyAdded);
	    $container.append(prop.$el);
	    return prop;
	  };
	
	  Property.prototype.addTweenProperty = function (instance_prop, lineData, key_val, $container, propertyData, domElement) {
	    var _this = this;
	    var tween = new PropertyTween(instance_prop, lineData, this.editor, key_val, this.timeline);
	    $container.append(tween.$el);
	
	    // Add a remove key button
	    tween.$el.find("[data-action-remove]").click(function (e) {
	      e.preventDefault();
	      var index = propertyData.keys.indexOf(key_val);
	      if (index > -1) {
	        propertyData.keys.splice(index, 1);
	        _this.editor.propertiesEditor.keyRemoved.dispatch(domElement);
	        return lineData._isDirty = true;
	      }
	    });
	    return tween;
	  };
	
	  Property.prototype.update = function () {
	    for (var i = 0; i < this.items.length; i++) {
	      var item = this.items[i];
	      item.update();
	    }
	  };
	
	  return Property;
	})();
	
	exports["default"] = Property;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var H = __webpack_require__(37);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"properties-editor\">");t.b("\n" + i);t.b("  <a href=\"#\" class=\"menu-item menu-item--toggle-side\" data-action=\"toggle\"><i class=\"icon-toggle\"></i></a>");t.b("\n" + i);t.b("  <div class=\"properties-editor__main\"></div>");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<div class=\"properties-editor\">\n  <a href=\"#\" class=\"menu-item menu-item--toggle-side\" data-action=\"toggle\"><i class=\"icon-toggle\"></i></a>\n  <div class=\"properties-editor__main\"></div>\n</div>\n", H); return T.render.apply(T, arguments); };

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {"use strict";
	
	/* FileSaver.js
	 * A saveAs() FileSaver implementation.
	 * 2014-08-29
	 *
	 * By Eli Grey, http://eligrey.com
	 * License: X11/MIT
	 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
	 */
	
	/*global self */
	/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */
	
	/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
	
	var saveAs = saveAs
	// IE 10+ (native saveAs)
	 || (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
	// Everyone else
	 || (function (view) {
	  "use strict";
	  // IE <10 is explicitly unsupported
	  if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
	    return;
	  }
	  var doc = view.document
	  // only get URL when necessary in case Blob.js hasn't overridden it yet
	  , get_URL = function () {
	    return view.URL || view.webkitURL || view;
	  }, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"), can_use_save_link = "download" in save_link, click = function (node) {
	    var event = doc.createEvent("MouseEvents");
	    event.initMouseEvent("click", true, false, view, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	    node.dispatchEvent(event);
	  }, webkit_req_fs = view.webkitRequestFileSystem, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem, throw_outside = function (ex) {
	    (view.setImmediate || view.setTimeout)(function () {
	      throw ex;
	    }, 0);
	  }, force_saveable_type = "application/octet-stream", fs_min_size = 0
	  // See https://code.google.com/p/chromium/issues/detail?id=375297#c7 for
	  // the reasoning behind the timeout and revocation flow
	  , arbitrary_revoke_timeout = 10, revoke = function (file) {
	    var revoker = function () {
	      if (typeof file === "string") {
	        // file is an object URL
	        get_URL().revokeObjectURL(file);
	      } else {
	        // file is a File
	        file.remove();
	      }
	    };
	    if (view.chrome) {
	      revoker();
	    } else {
	      setTimeout(revoker, arbitrary_revoke_timeout);
	    }
	  }, dispatch = function (filesaver, event_types, event) {
	    event_types = [].concat(event_types);
	    var i = event_types.length;
	    while (i--) {
	      var listener = filesaver["on" + event_types[i]];
	      if (typeof listener === "function") {
	        try {
	          listener.call(filesaver, event || filesaver);
	        } catch (ex) {
	          throw_outside(ex);
	        }
	      }
	    }
	  }, FileSaver = function (blob, name) {
	    // First try a.download, then web filesystem, then object URLs
	    var filesaver = this, type = blob.type, blob_changed = false, object_url, target_view, dispatch_all = function () {
	      dispatch(filesaver, "writestart progress write writeend".split(" "));
	    }
	    // on any filesys errors revert to saving with object URLs
	    , fs_error = function () {
	      // don't create more object URLs than needed
	      if (blob_changed || !object_url) {
	        object_url = get_URL().createObjectURL(blob);
	      }
	      if (target_view) {
	        target_view.location.href = object_url;
	      } else {
	        var new_tab = view.open(object_url, "_blank");
	        if (new_tab == undefined && typeof safari !== "undefined") {
	          //Apple do not allow window.open, see http://bit.ly/1kZffRI
	          view.location.href = object_url;
	        }
	      }
	      filesaver.readyState = filesaver.DONE;
	      dispatch_all();
	      revoke(object_url);
	    }, abortable = function (func) {
	      return function () {
	        if (filesaver.readyState !== filesaver.DONE) {
	          return func.apply(this, arguments);
	        }
	      };
	    }, create_if_not_found = { create: true, exclusive: false }, slice;
	    filesaver.readyState = filesaver.INIT;
	    if (!name) {
	      name = "download";
	    }
	    if (can_use_save_link) {
	      object_url = get_URL().createObjectURL(blob);
	      save_link.href = object_url;
	      save_link.download = name;
	      click(save_link);
	      filesaver.readyState = filesaver.DONE;
	      dispatch_all();
	      revoke(object_url);
	      return;
	    }
	    // Object and web filesystem URLs have a problem saving in Google Chrome when
	    // viewed in a tab, so I force save with application/octet-stream
	    // http://code.google.com/p/chromium/issues/detail?id=91158
	    // Update: Google errantly closed 91158, I submitted it again:
	    // https://code.google.com/p/chromium/issues/detail?id=389642
	    if (view.chrome && type && type !== force_saveable_type) {
	      slice = blob.slice || blob.webkitSlice;
	      blob = slice.call(blob, 0, blob.size, force_saveable_type);
	      blob_changed = true;
	    }
	    // Since I can't be sure that the guessed media type will trigger a download
	    // in WebKit, I append .download to the filename.
	    // https://bugs.webkit.org/show_bug.cgi?id=65440
	    if (webkit_req_fs && name !== "download") {
	      name += ".download";
	    }
	    if (type === force_saveable_type || webkit_req_fs) {
	      target_view = view;
	    }
	    if (!req_fs) {
	      fs_error();
	      return;
	    }
	    fs_min_size += blob.size;
	    req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) {
	      fs.root.getDirectory("saved", create_if_not_found, abortable(function (dir) {
	        var save = function () {
	          dir.getFile(name, create_if_not_found, abortable(function (file) {
	            file.createWriter(abortable(function (writer) {
	              writer.onwriteend = function (event) {
	                target_view.location.href = file.toURL();
	                filesaver.readyState = filesaver.DONE;
	                dispatch(filesaver, "writeend", event);
	                revoke(file);
	              };
	              writer.onerror = function () {
	                var error = writer.error;
	                if (error.code !== error.ABORT_ERR) {
	                  fs_error();
	                }
	              };
	              "writestart progress write abort".split(" ").forEach(function (event) {
	                writer["on" + event] = filesaver["on" + event];
	              });
	              writer.write(blob);
	              filesaver.abort = function () {
	                writer.abort();
	                filesaver.readyState = filesaver.DONE;
	              };
	              filesaver.readyState = filesaver.WRITING;
	            }), fs_error);
	          }), fs_error);
	        };
	        dir.getFile(name, { create: false }, abortable(function (file) {
	          // delete file if it already exists
	          file.remove();
	          save();
	        }), abortable(function (ex) {
	          if (ex.code === ex.NOT_FOUND_ERR) {
	            save();
	          } else {
	            fs_error();
	          }
	        }));
	      }), fs_error);
	    }), fs_error);
	  }, FS_proto = FileSaver.prototype, saveAs = function (blob, name) {
	    return new FileSaver(blob, name);
	  };
	  FS_proto.abort = function () {
	    var filesaver = this;
	    filesaver.readyState = filesaver.DONE;
	    dispatch(filesaver, "abort");
	  };
	  FS_proto.readyState = FS_proto.INIT = 0;
	  FS_proto.WRITING = 1;
	  FS_proto.DONE = 2;
	
	  FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null;
	
	  return saveAs;
	}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content));
	// `self` is undefined in Firefox for Android content script context
	// while `this` is nsIContentFrameMessageManager
	// with an attribute `content` that corresponds to the window
	
	if (typeof module !== "undefined" && module !== null) {
	  module.exports = saveAs;
	} else if (("function" !== "undefined" && __webpack_require__(38) !== null) && (__webpack_require__(39) != null)) {
	  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return saveAs;
	  }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(40)(module)))

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _extends = function (child, parent) {
	  child.prototype = Object.create(parent.prototype, {
	    constructor: {
	      value: child,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  child.__proto__ = parent;
	};
	
	var $ = __webpack_require__(15);
	var PropertyBase = __webpack_require__(33)["default"];
	var DraggableNumber = __webpack_require__(31);
	
	var tpl_property = __webpack_require__(34);
	
	var PropertyNumber = (function (PropertyBase) {
	  var PropertyNumber =
	  // instance_property: The current property on the data object.
	  // lineData: The line data object.
	  function PropertyNumber(instance_property, lineData, editor, key_val) {
	    if (key_val === undefined) key_val = false;
	    PropertyBase.call(this, instance_property, lineData, editor, key_val);
	    this.onInputChange = this.onInputChange.bind(this);
	    this.$input = this.$el.find("input");
	  };
	
	  _extends(PropertyNumber, PropertyBase);
	
	  PropertyNumber.prototype.getInputVal = function () {
	    return parseFloat(this.$el.find("input").val());
	  };
	
	  PropertyNumber.prototype.render = function () {
	    var _this = this;
	    PropertyBase.prototype.render.call(this);
	    // By default assign the property default value
	    var val = this.getCurrentVal();
	
	    data = {
	      id: this.instance_property.name, // "circleRadius" instead of "circle radius"
	      label: this.instance_property.label || this.instance_property.name,
	      val: val
	    };
	
	    var view = tpl_property(data);
	    this.$el = $(view);
	    this.$el.find(".property__key").click(this.onKeyClick);
	
	    var $input = this.$el.find("input");
	
	    var onChangeEnd = function () {
	      _this.editor.undoManager.addState();
	    };
	
	    var draggableOptions = {
	      changeCallback: function () {
	        return _this.onInputChange();
	      },
	      endCallback: function () {
	        return onChangeEnd();
	      }
	    };
	    // Set min & max if they are defined.
	    if ("min" in this.instance_property) {
	      draggableOptions.min = this.instance_property.min;
	    }
	    if ("max" in this.instance_property) {
	      draggableOptions.max = this.instance_property.max;
	    }
	
	    var draggable = new DraggableNumber($input.get(0), draggableOptions);
	    $input.data("draggable", draggable);
	    $input.change(this.onInputChange);
	  };
	
	  PropertyNumber.prototype.remove = function () {
	    PropertyBase.prototype.remove.call(this);
	    if (this.$input.data("draggable")) {
	      this.$input.data("draggable").destroy();
	    }
	
	    delete this.$input;
	    delete this.$el;
	  };
	
	  PropertyNumber.prototype.update = function () {
	    PropertyBase.prototype.update.call(this);
	    var val = this.getCurrentVal();
	    var draggable = this.$input.data("draggable");
	
	    if (draggable) {
	      draggable.set(val.toFixed(3));
	    } else {
	      this.$input.val(val.toFixed(3));
	    }
	  };
	
	  return PropertyNumber;
	})(PropertyBase);
	
	exports["default"] = PropertyNumber;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _extends = function (child, parent) {
	  child.prototype = Object.create(parent.prototype, {
	    constructor: {
	      value: child,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  child.__proto__ = parent;
	};
	
	var $ = __webpack_require__(15);
	__webpack_require__(32);
	var PropertyBase = __webpack_require__(33)["default"];
	
	
	var tpl_property = __webpack_require__(35);
	
	var PropertyColor = (function (PropertyBase) {
	  var PropertyColor = function PropertyColor(instance_property, lineData, editor, key_val) {
	    if (key_val === undefined) key_val = false;
	    PropertyBase.call(this, instance_property, lineData, editor, key_val);
	    this.onInputChange = this.onInputChange.bind(this);
	    this.$input = this.$el.find("input");
	  };
	
	  _extends(PropertyColor, PropertyBase);
	
	  PropertyColor.prototype.render = function () {
	    var _this = this;
	    PropertyBase.prototype.render.call(this);
	    // By default assign the property default value
	    var val = this.getCurrentVal();
	
	    data = {
	      id: this.instance_property.name, // "circleRadius" instead of "circle radius"
	      label: this.instance_property.label || this.instance_property.name,
	      val: val
	    };
	
	    var view = tpl_property(data);
	    this.$el = $(view);
	    this.$el.find(".property__key").click(this.onKeyClick);
	
	    var $input = this.$el.find("input");
	
	    $input.spectrum({
	      allowEmpty: false,
	      showAlpha: true,
	      clickoutFiresChange: false,
	      preferredFormat: "rgb",
	      change: function () {
	        _this.editor.undoManager.addState();
	      },
	      move: function (color) {
	        if (color._a == 1) {
	          $input.val(color.toHexString());
	        } else {
	          $input.val(color.toRgbString());
	        }
	
	        _this.onInputChange();
	      }
	    });
	
	    $input.change(this.onInputChange);
	  };
	
	  PropertyColor.prototype.remove = function () {
	    PropertyBase.prototype.remove.call(this);
	    this.$el.find("input").spectrum("destroy");
	    delete this.$el;
	    delete this.$input;
	  };
	
	  PropertyColor.prototype.update = function () {
	    PropertyBase.prototype.update.call(this);
	    var val = this.getCurrentVal();
	    this.$input.val(val);
	    this.$input.spectrum("set", val);
	  };
	
	  return PropertyColor;
	})(PropertyBase);
	
	exports["default"] = PropertyColor;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var $ = __webpack_require__(15);
	
	var tpl_property = __webpack_require__(36);
	
	var PropertyTween = (function () {
	  var PropertyTween =
	  // instance_property: The current property on the data object.
	  // lineData: The line data object.
	  function PropertyTween(instance_property, lineData, editor, key_val, timeline) {
	    if (key_val === undefined) key_val = false;
	    this.instance_property = instance_property;
	    this.lineData = lineData;
	    this.editor = editor;
	    this.key_val = key_val;
	    this.timeline = timeline;
	
	    this.onChange = this.onChange.bind(this);
	
	    this.timer = this.editor.timer;
	    this.$time = false;
	    this.$el = false;
	    this.render();
	  };
	
	  PropertyTween.prototype.remove = function () {
	    delete this.$el;
	    delete this.instance_property;
	    delete this.lineData;
	    delete this.editor;
	    delete this.key_val;
	    delete this.timeline;
	
	    delete this.timer;
	    delete this.$time;
	  };
	
	  PropertyTween.prototype.render = function () {
	    var _this = this;
	    var self = this;
	    if (!this.key_val.ease) {
	      this.key_val.ease = "Quad.easeOut";
	    }
	    var data = {
	      id: this.instance_property.name + "_tween",
	      val: this.key_val.ease,
	      time: this.key_val.time.toFixed(3),
	      options: ["Linear.easeNone"],
	      selected: function () {
	        if (this.toString() === self.key_val.ease) {
	          return "selected";
	        } else {
	          return "";
	        }
	      }
	    };
	
	    var tweens = ["Quad", "Cubic", "Quart", "Quint", "Strong"];
	    for (var i = 0; i < tweens.length; i++) {
	      var tween = tweens[i];
	      data.options.push(tween + ".easeOut");
	      data.options.push(tween + ".easeIn");
	      data.options.push(tween + ".easeInOut");
	    }
	
	    this.$el = $(tpl_property(data));
	    this.$time = this.$el.find(".property__key-time strong");
	    this.$time.keypress(function (e) {
	      if (e.charCode == 13) {
	        // Enter
	        e.preventDefault();
	        _this.$time.blur();
	        _this.updateKeyTime(_this.$time.text());
	      }
	    });
	
	    this.$time.on("click", function () {
	      return document.execCommand("selectAll", false, null);
	    });
	    this.$el.find("select").change(this.onChange);
	  };
	
	  PropertyTween.prototype.updateKeyTime = function (time) {
	    time = parseFloat(time);
	    if (isNaN(time)) {
	      time = this.key_val.time;
	    }
	    this.$time.text(time);
	    this.key_val.time = time;
	    this.onChange();
	  };
	
	  PropertyTween.prototype.onChange = function () {
	    var ease = this.$el.find("select").val();
	    this.key_val.ease = ease;
	    this.editor.undoManager.addState();
	    this.lineData._isDirty = true;
	    this.timeline._isDirty = true;
	  };
	
	  PropertyTween.prototype.update = function () {
	    // todo: use mustache instead...
	    this.$time.html(this.key_val.time.toFixed(3));
	  };
	
	  return PropertyTween;
	})();
	
	exports["default"] = PropertyTween;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_31__;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_32__;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Signals = __webpack_require__(12);
	var _ = __webpack_require__(1);
	var Utils = __webpack_require__(2)["default"];
	var PropertyBase = (function () {
	  var PropertyBase =
	  // @instance_property: The current property on the data object.
	  // @lineData: The line data object.
	  function PropertyBase(instance_property, lineData, editor, key_val) {
	    if (key_val === undefined) key_val = false;
	    this.instance_property = instance_property;
	    this.lineData = lineData;
	    this.editor = editor;
	    this.key_val = key_val;
	
	    //this.update = this.update.bind(this);
	    this.onInputChange = this.onInputChange.bind(this);
	    this.onKeyClick = this.onKeyClick.bind(this);
	
	    this.timer = editor.timer;
	    this.keyAdded = new Signals.Signal();
	    this.render();
	
	    this.$key = this.$el.find(".property__key");
	  };
	
	  PropertyBase.prototype.onKeyClick = function (e) {
	    e.preventDefault();
	    var currentValue = this.getCurrentVal();
	    this.addKey(currentValue);
	  };
	
	  PropertyBase.prototype.getInputVal = function () {
	    return this.$el.find("input").val();
	  };
	
	  PropertyBase.prototype.getCurrentVal = function () {
	    var val = this.instance_property.val;
	    var prop_name = this.instance_property.name;
	
	    // if we selected a key simply return it's value
	    if (this.key_val) {
	      return this.key_val.val;
	    }
	    if (this.lineData.values != null && this.lineData.values[prop_name]) {
	      return this.lineData.values[prop_name];
	    }
	    return val;
	  };
	
	  PropertyBase.prototype.onInputChange = function () {
	    var current_value = this.getInputVal();
	    var currentTime = this.timer.getCurrentTime() / 1000;
	    // if we selected a key simply get the time from it.
	    if (this.key_val) {
	      currentTime = this.key_val.time;
	    }
	
	    if (this.instance_property.keys && this.instance_property.keys.length) {
	      // Add a new key if there is no other key at same time
	      var current_key = _.find(this.instance_property.keys, function (key) {
	        return key.time == currentTime;
	      });
	
	      if (current_key) {
	        // if there is a key update it
	        current_key.val = current_value;
	      } else {
	        // add a new key
	        this.addKey(current_value);
	      }
	    } else {
	      // There is no keys, simply update the property value (for data saving)
	      this.instance_property.val = current_value;
	      // Also directly set the lineData value.
	      this.lineData.values[this.instance_property.name] = current_value;
	      // Simply update the custom object with new values.
	      if (this.lineData.object) {
	        currentTime = function (_val) {
	          return _val.timer.getCurrentTime();
	        } / 1000;
	        // Set the property on the instance object.
	        this.lineData.object.update(currentTime - this.lineData.start);
	      }
	    }
	
	    // Something changed, make the lineData dirty to rebuild things. d
	    this.lineData._isDirty = true;
	  };
	
	  PropertyBase.prototype.getCurrentKey = function () {
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
	  };
	
	  PropertyBase.prototype.addKey = function (val) {
	    var currentTime = this.timer.getCurrentTime() / 1000;
	    var key = {
	      time: currentTime,
	      val: val
	    };
	    this.instance_property.keys.push(key);
	    this.instance_property.keys = Utils.sortKeys(this.instance_property.keys);
	    this.lineData._isDirty = true;
	    this.keyAdded.dispatch();
	  };
	
	  PropertyBase.prototype.render = function () {
	    // current values are defined in @lineData.values
	    this.values = this.lineData.values != null ? this.lineData.values : {};
	  };
	
	  PropertyBase.prototype.update = function () {
	    var key = this.getCurrentKey();
	    this.$key.toggleClass("property__key--active", key);
	  };
	
	  PropertyBase.prototype.remove = function () {
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
	  };
	
	  return PropertyBase;
	})();
	
	exports["default"] = PropertyBase;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var H = __webpack_require__(37);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"property property--number\">");t.b("\n" + i);t.b("  <button class=\"property__key\"></button>");t.b("\n" + i);t.b("  <label for=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"property__label\">");t.b(t.v(t.f("label",c,p,0)));t.b("</label>");t.b("\n" + i);t.b("  <input type=\"number\" id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"property__input\" value=\"");t.b(t.v(t.f("val",c,p,0)));t.b("\" />");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<div class=\"property property--number\">\n  <button class=\"property__key\"></button>\n  <label for=\"{{id}}\" class=\"property__label\">{{label}}</label>\n  <input type=\"number\" id=\"{{id}}\" class=\"property__input\" value=\"{{val}}\" />\n</div>\n", H); return T.render.apply(T, arguments); };

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var H = __webpack_require__(37);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"property property--number\">");t.b("\n" + i);t.b("  <button class=\"property__key\"></button>");t.b("\n" + i);t.b("  <label for=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"property__label\">");t.b(t.v(t.f("label",c,p,0)));t.b("</label>");t.b("\n" + i);t.b("  <input id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"property__input\" value=\"");t.b(t.v(t.f("val",c,p,0)));t.b("\" />");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<div class=\"property property--number\">\n  <button class=\"property__key\"></button>\n  <label for=\"{{id}}\" class=\"property__label\">{{label}}</label>\n  <input id=\"{{id}}\" class=\"property__input\" value=\"{{val}}\" />\n</div>\n", H); return T.render.apply(T, arguments); };

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var H = __webpack_require__(37);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"property property--tween\">");t.b("\n" + i);t.b("  <label for=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"property__label\">easing</label>");t.b("\n" + i);t.b("  <div class=\"property__select\">");t.b("\n" + i);t.b("    <div class=\"custom-select\">");t.b("\n" + i);t.b("      <select id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\">");t.b("\n" + i);if(t.s(t.f("options",c,p,1),c,p,0,212,279,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("        <option value=\"");t.b(t.v(t.d(".",c,p,0)));t.b("\" ");t.b(t.v(t.f("selected",c,p,0)));t.b(">");t.b(t.v(t.d(".",c,p,0)));t.b("</option>");t.b("\n" + i);});c.pop();}t.b("      </select>");t.b("\n" + i);t.b("    </div>");t.b("\n" + i);t.b("  </div>");t.b("\n" + i);t.b("</div>");t.b("\n" + i);t.b("<div class=\"properties-editor__actions actions\">");t.b("\n" + i);t.b("  <span class=\"property__key-time\">key at <strong class=\"property__key-input\" contenteditable=\"true\">");t.b(t.v(t.f("time",c,p,0)));t.b("</strong> seconds</span>");t.b("\n" + i);t.b("  <a href=\"#\" class=\"actions__item\" data-action-remove>Remove key</a>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }}, "<div class=\"property property--tween\">\n  <label for=\"{{id}}\" class=\"property__label\">easing</label>\n  <div class=\"property__select\">\n    <div class=\"custom-select\">\n      <select id=\"{{id}}\">\n        {{#options}}\n        <option value=\"{{.}}\" {{selected}}>{{.}}</option>\n        {{/options}}\n      </select>\n    </div>\n  </div>\n</div>\n<div class=\"properties-editor__actions actions\">\n  <span class=\"property__key-time\">key at <strong class=\"property__key-input\" contenteditable=\"true\">{{time}}</strong> seconds</span>\n  <a href=\"#\" class=\"actions__item\" data-action-remove>Remove key</a>\n</div>", H); return T.render.apply(T, arguments); };

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */
	
	// This file is for use with Node.js. See dist/ for browser files.
	
	var Hogan = __webpack_require__(41);
	Hogan.Template = __webpack_require__(42).Template;
	Hogan.template = Hogan.Template;
	module.exports = Hogan;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = function (module) {
	  if (!module.webpackPolyfill) {
	    module.deprecate = function () {};
	    module.paths = [];
	    // module.parent = undefined by default
	    module.children = [];
	    module.webpackPolyfill = 1;
	  }
	  return module;
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */
	
	(function (Hogan) {
	  // Setup regex  assignments
	  // remove whitespace according to Mustache spec
	  var rIsWhitespace = /\S/, rQuot = /\"/g, rNewline = /\n/g, rCr = /\r/g, rSlash = /\\/g, rLineSep = /\u2028/, rParagraphSep = /\u2029/;
	
	  Hogan.tags = {
	    "#": 1, "^": 2, "<": 3, $: 4,
	    "/": 5, "!": 6, ">": 7, "=": 8, _v: 9,
	    "{": 10, "&": 11, _t: 12
	  };
	
	  Hogan.scan = function scan(text, delimiters) {
	    var len = text.length, IN_TEXT = 0, IN_TAG_TYPE = 1, IN_TAG = 2, state = IN_TEXT, tagType = null, tag = null, buf = "", tokens = [], seenTag = false, i = 0, lineStart = 0, otag = "{{", ctag = "}}";
	
	    function addBuf() {
	      if (buf.length > 0) {
	        tokens.push({ tag: "_t", text: new String(buf) });
	        buf = "";
	      }
	    }
	
	    function lineIsWhitespace() {
	      var isAllWhitespace = true;
	      for (var j = lineStart; j < tokens.length; j++) {
	        isAllWhitespace = (Hogan.tags[tokens[j].tag] < Hogan.tags._v) || (tokens[j].tag == "_t" && tokens[j].text.match(rIsWhitespace) === null);
	        if (!isAllWhitespace) {
	          return false;
	        }
	      }
	
	      return isAllWhitespace;
	    }
	
	    function filterLine(haveSeenTag, noNewLine) {
	      addBuf();
	
	      if (haveSeenTag && lineIsWhitespace()) {
	        for (var j = lineStart, next; j < tokens.length; j++) {
	          if (tokens[j].text) {
	            if ((next = tokens[j + 1]) && next.tag == ">") {
	              // set indent to token value
	              next.indent = tokens[j].text.toString();
	            }
	            tokens.splice(j, 1);
	          }
	        }
	      } else if (!noNewLine) {
	        tokens.push({ tag: "\n" });
	      }
	
	      seenTag = false;
	      lineStart = tokens.length;
	    }
	
	    function changeDelimiters(text, index) {
	      var close = "=" + ctag, closeIndex = text.indexOf(close, index), delimiters = trim(text.substring(text.indexOf("=", index) + 1, closeIndex)).split(" ");
	
	      otag = delimiters[0];
	      ctag = delimiters[delimiters.length - 1];
	
	      return closeIndex + close.length - 1;
	    }
	
	    if (delimiters) {
	      delimiters = delimiters.split(" ");
	      otag = delimiters[0];
	      ctag = delimiters[1];
	    }
	
	    for (i = 0; i < len; i++) {
	      if (state == IN_TEXT) {
	        if (tagChange(otag, text, i)) {
	          --i;
	          addBuf();
	          state = IN_TAG_TYPE;
	        } else {
	          if (text.charAt(i) == "\n") {
	            filterLine(seenTag);
	          } else {
	            buf += text.charAt(i);
	          }
	        }
	      } else if (state == IN_TAG_TYPE) {
	        i += otag.length - 1;
	        tag = Hogan.tags[text.charAt(i + 1)];
	        tagType = tag ? text.charAt(i + 1) : "_v";
	        if (tagType == "=") {
	          i = changeDelimiters(text, i);
	          state = IN_TEXT;
	        } else {
	          if (tag) {
	            i++;
	          }
	          state = IN_TAG;
	        }
	        seenTag = i;
	      } else {
	        if (tagChange(ctag, text, i)) {
	          tokens.push({ tag: tagType, n: trim(buf), otag: otag, ctag: ctag,
	            i: (tagType == "/") ? seenTag - otag.length : i + ctag.length });
	          buf = "";
	          i += ctag.length - 1;
	          state = IN_TEXT;
	          if (tagType == "{") {
	            if (ctag == "}}") {
	              i++;
	            } else {
	              cleanTripleStache(tokens[tokens.length - 1]);
	            }
	          }
	        } else {
	          buf += text.charAt(i);
	        }
	      }
	    }
	
	    filterLine(seenTag, true);
	
	    return tokens;
	  };
	
	  function cleanTripleStache(token) {
	    if (token.n.substr(token.n.length - 1) === "}") {
	      token.n = token.n.substring(0, token.n.length - 1);
	    }
	  }
	
	  function trim(s) {
	    if (s.trim) {
	      return s.trim();
	    }
	
	    return s.replace(/^\s*|\s*$/g, "");
	  }
	
	  function tagChange(tag, text, index) {
	    if (text.charAt(index) != tag.charAt(0)) {
	      return false;
	    }
	
	    for (var i = 1, l = tag.length; i < l; i++) {
	      if (text.charAt(index + i) != tag.charAt(i)) {
	        return false;
	      }
	    }
	
	    return true;
	  }
	
	  // the tags allowed inside super templates
	  var allowedInSuper = { _t: true, "\n": true, $: true, "/": true };
	
	  function buildTree(tokens, kind, stack, customTags) {
	    var instructions = [], opener = null, tail = null, token = null;
	
	    tail = stack[stack.length - 1];
	
	    while (tokens.length > 0) {
	      token = tokens.shift();
	
	      if (tail && tail.tag == "<" && !(token.tag in allowedInSuper)) {
	        throw new Error("Illegal content in < super tag.");
	      }
	
	      if (Hogan.tags[token.tag] <= Hogan.tags.$ || isOpener(token, customTags)) {
	        stack.push(token);
	        token.nodes = buildTree(tokens, token.tag, stack, customTags);
	      } else if (token.tag == "/") {
	        if (stack.length === 0) {
	          throw new Error("Closing tag without opener: /" + token.n);
	        }
	        opener = stack.pop();
	        if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
	          throw new Error("Nesting error: " + opener.n + " vs. " + token.n);
	        }
	        opener.end = token.i;
	        return instructions;
	      } else if (token.tag == "\n") {
	        token.last = (tokens.length == 0) || (tokens[0].tag == "\n");
	      }
	
	      instructions.push(token);
	    }
	
	    if (stack.length > 0) {
	      throw new Error("missing closing tag: " + stack.pop().n);
	    }
	
	    return instructions;
	  }
	
	  function isOpener(token, tags) {
	    for (var i = 0, l = tags.length; i < l; i++) {
	      if (tags[i].o == token.n) {
	        token.tag = "#";
	        return true;
	      }
	    }
	  }
	
	  function isCloser(close, open, tags) {
	    for (var i = 0, l = tags.length; i < l; i++) {
	      if (tags[i].c == close && tags[i].o == open) {
	        return true;
	      }
	    }
	  }
	
	  function stringifySubstitutions(obj) {
	    var items = [];
	    for (var key in obj) {
	      items.push("\"" + esc(key) + "\": function(c,p,t,i) {" + obj[key] + "}");
	    }
	    return "{ " + items.join(",") + " }";
	  }
	
	  function stringifyPartials(codeObj) {
	    var partials = [];
	    for (var key in codeObj.partials) {
	      partials.push("\"" + esc(key) + "\":{name:\"" + esc(codeObj.partials[key].name) + "\", " + stringifyPartials(codeObj.partials[key]) + "}");
	    }
	    return "partials: {" + partials.join(",") + "}, subs: " + stringifySubstitutions(codeObj.subs);
	  }
	
	  Hogan.stringify = function (codeObj, text, options) {
	    return "{code: function (c,p,i) { " + Hogan.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) + "}";
	  };
	
	  var serialNo = 0;
	  Hogan.generate = function (tree, text, options) {
	    serialNo = 0;
	    var context = { code: "", subs: {}, partials: {} };
	    Hogan.walk(tree, context);
	
	    if (options.asString) {
	      return this.stringify(context, text, options);
	    }
	
	    return this.makeTemplate(context, text, options);
	  };
	
	  Hogan.wrapMain = function (code) {
	    return "var t=this;t.b(i=i||\"\");" + code + "return t.fl();";
	  };
	
	  Hogan.template = Hogan.Template;
	
	  Hogan.makeTemplate = function (codeObj, text, options) {
	    var template = this.makePartials(codeObj);
	    template.code = new Function("c", "p", "i", this.wrapMain(codeObj.code));
	    return new this.template(template, text, this, options);
	  };
	
	  Hogan.makePartials = function (codeObj) {
	    var key, template = { subs: {}, partials: codeObj.partials, name: codeObj.name };
	    for (key in template.partials) {
	      template.partials[key] = this.makePartials(template.partials[key]);
	    }
	    for (key in codeObj.subs) {
	      template.subs[key] = new Function("c", "p", "t", "i", codeObj.subs[key]);
	    }
	    return template;
	  };
	
	  function esc(s) {
	    return s.replace(rSlash, "\\\\").replace(rQuot, "\\\"").replace(rNewline, "\\n").replace(rCr, "\\r").replace(rLineSep, "\\u2028").replace(rParagraphSep, "\\u2029");
	  }
	
	  function chooseMethod(s) {
	    return (~s.indexOf(".")) ? "d" : "f";
	  }
	
	  function createPartial(node, context) {
	    var prefix = "<" + (context.prefix || "");
	    var sym = prefix + node.n + serialNo++;
	    context.partials[sym] = { name: node.n, partials: {} };
	    context.code += "t.b(t.rp(\"" + esc(sym) + "\",c,p,\"" + (node.indent || "") + "\"));";
	    return sym;
	  }
	
	  Hogan.codegen = {
	    "#": function (node, context) {
	      context.code += "if(t.s(t." + chooseMethod(node.n) + "(\"" + esc(node.n) + "\",c,p,1)," + "c,p,0," + node.i + "," + node.end + ",\"" + node.otag + " " + node.ctag + "\")){" + "t.rs(c,p," + "function(c,p,t){";
	      Hogan.walk(node.nodes, context);
	      context.code += "});c.pop();}";
	    },
	
	    "^": function (node, context) {
	      context.code += "if(!t.s(t." + chooseMethod(node.n) + "(\"" + esc(node.n) + "\",c,p,1),c,p,1,0,0,\"\")){";
	      Hogan.walk(node.nodes, context);
	      context.code += "};";
	    },
	
	    ">": createPartial,
	    "<": function (node, context) {
	      var ctx = { partials: {}, code: "", subs: {}, inPartial: true };
	      Hogan.walk(node.nodes, ctx);
	      var template = context.partials[createPartial(node, context)];
	      template.subs = ctx.subs;
	      template.partials = ctx.partials;
	    },
	
	    $: function (node, context) {
	      var ctx = { subs: {}, code: "", partials: context.partials, prefix: node.n };
	      Hogan.walk(node.nodes, ctx);
	      context.subs[node.n] = ctx.code;
	      if (!context.inPartial) {
	        context.code += "t.sub(\"" + esc(node.n) + "\",c,p,i);";
	      }
	    },
	
	    "\n": function (node, context) {
	      context.code += write("\"\\n\"" + (node.last ? "" : " + i"));
	    },
	
	    _v: function (node, context) {
	      context.code += "t.b(t.v(t." + chooseMethod(node.n) + "(\"" + esc(node.n) + "\",c,p,0)));";
	    },
	
	    _t: function (node, context) {
	      context.code += write("\"" + esc(node.text) + "\"");
	    },
	
	    "{": tripleStache,
	
	    "&": tripleStache
	  };
	
	  function tripleStache(node, context) {
	    context.code += "t.b(t.t(t." + chooseMethod(node.n) + "(\"" + esc(node.n) + "\",c,p,0)));";
	  }
	
	  function write(s) {
	    return "t.b(" + s + ");";
	  }
	
	  Hogan.walk = function (nodelist, context) {
	    var func;
	    for (var i = 0, l = nodelist.length; i < l; i++) {
	      func = Hogan.codegen[nodelist[i].tag];
	      func && func(nodelist[i], context);
	    }
	    return context;
	  };
	
	  Hogan.parse = function (tokens, text, options) {
	    options = options || {};
	    return buildTree(tokens, "", [], options.sectionTags || []);
	  };
	
	  Hogan.cache = {};
	
	  Hogan.cacheKey = function (text, options) {
	    return [text, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join("||");
	  };
	
	  Hogan.compile = function (text, options) {
	    options = options || {};
	    var key = Hogan.cacheKey(text, options);
	    var template = this.cache[key];
	
	    if (template) {
	      var partials = template.partials;
	      for (var name in partials) {
	        delete partials[name].instance;
	      }
	      return template;
	    }
	
	    template = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
	    return this.cache[key] = template;
	  };
	})(true ? exports : Hogan);

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */
	
	var Hogan = {};
	
	(function (Hogan) {
	  Hogan.Template = function (codeObj, text, compiler, options) {
	    codeObj = codeObj || {};
	    this.r = codeObj.code || this.r;
	    this.c = compiler;
	    this.options = options || {};
	    this.text = text || "";
	    this.partials = codeObj.partials || {};
	    this.subs = codeObj.subs || {};
	    this.buf = "";
	  };
	
	  Hogan.Template.prototype = {
	    // render: replaced by generated code.
	    r: function (context, partials, indent) {
	      return "";
	    },
	
	    // variable escaping
	    v: hoganEscape,
	
	    // triple stache
	    t: coerceToString,
	
	    render: function render(context, partials, indent) {
	      return this.ri([context], partials || {}, indent);
	    },
	
	    // render internal -- a hook for overrides that catches partials too
	    ri: function (context, partials, indent) {
	      return this.r(context, partials, indent);
	    },
	
	    // ensurePartial
	    ep: function (symbol, partials) {
	      var partial = this.partials[symbol];
	
	      // check to see that if we've instantiated this partial before
	      var template = partials[partial.name];
	      if (partial.instance && partial.base == template) {
	        return partial.instance;
	      }
	
	      if (typeof template == "string") {
	        if (!this.c) {
	          throw new Error("No compiler available.");
	        }
	        template = this.c.compile(template, this.options);
	      }
	
	      if (!template) {
	        return null;
	      }
	
	      // We use this to check whether the partials dictionary has changed
	      this.partials[symbol].base = template;
	
	      if (partial.subs) {
	        // Make sure we consider parent template now
	        if (!partials.stackText) partials.stackText = {};
	        for (key in partial.subs) {
	          if (!partials.stackText[key]) {
	            partials.stackText[key] = (this.activeSub !== undefined && partials.stackText[this.activeSub]) ? partials.stackText[this.activeSub] : this.text;
	          }
	        }
	        template = createSpecializedPartial(template, partial.subs, partial.partials, this.stackSubs, this.stackPartials, partials.stackText);
	      }
	      this.partials[symbol].instance = template;
	
	      return template;
	    },
	
	    // tries to find a partial in the current scope and render it
	    rp: function (symbol, context, partials, indent) {
	      var partial = this.ep(symbol, partials);
	      if (!partial) {
	        return "";
	      }
	
	      return partial.ri(context, partials, indent);
	    },
	
	    // render a section
	    rs: function (context, partials, section) {
	      var tail = context[context.length - 1];
	
	      if (!isArray(tail)) {
	        section(context, partials, this);
	        return;
	      }
	
	      for (var i = 0; i < tail.length; i++) {
	        context.push(tail[i]);
	        section(context, partials, this);
	        context.pop();
	      }
	    },
	
	    // maybe start a section
	    s: function (val, ctx, partials, inverted, start, end, tags) {
	      var pass;
	
	      if (isArray(val) && val.length === 0) {
	        return false;
	      }
	
	      if (typeof val == "function") {
	        val = this.ms(val, ctx, partials, inverted, start, end, tags);
	      }
	
	      pass = !!val;
	
	      if (!inverted && pass && ctx) {
	        ctx.push((typeof val == "object") ? val : ctx[ctx.length - 1]);
	      }
	
	      return pass;
	    },
	
	    // find values with dotted names
	    d: function (key, ctx, partials, returnFound) {
	      var found, names = key.split("."), val = this.f(names[0], ctx, partials, returnFound), doModelGet = this.options.modelGet, cx = null;
	
	      if (key === "." && isArray(ctx[ctx.length - 2])) {
	        val = ctx[ctx.length - 1];
	      } else {
	        for (var i = 1; i < names.length; i++) {
	          found = findInScope(names[i], val, doModelGet);
	          if (found !== undefined) {
	            cx = val;
	            val = found;
	          } else {
	            val = "";
	          }
	        }
	      }
	
	      if (returnFound && !val) {
	        return false;
	      }
	
	      if (!returnFound && typeof val == "function") {
	        ctx.push(cx);
	        val = this.mv(val, ctx, partials);
	        ctx.pop();
	      }
	
	      return val;
	    },
	
	    // find values with normal names
	    f: function (key, ctx, partials, returnFound) {
	      var val = false, v = null, found = false, doModelGet = this.options.modelGet;
	
	      for (var i = ctx.length - 1; i >= 0; i--) {
	        v = ctx[i];
	        val = findInScope(key, v, doModelGet);
	        if (val !== undefined) {
	          found = true;
	          break;
	        }
	      }
	
	      if (!found) {
	        return (returnFound) ? false : "";
	      }
	
	      if (!returnFound && typeof val == "function") {
	        val = this.mv(val, ctx, partials);
	      }
	
	      return val;
	    },
	
	    // higher order templates
	    ls: function (func, cx, partials, text, tags) {
	      var oldTags = this.options.delimiters;
	
	      this.options.delimiters = tags;
	      this.b(this.ct(coerceToString(func.call(cx, text)), cx, partials));
	      this.options.delimiters = oldTags;
	
	      return false;
	    },
	
	    // compile text
	    ct: function (text, cx, partials) {
	      if (this.options.disableLambda) {
	        throw new Error("Lambda features disabled.");
	      }
	      return this.c.compile(text, this.options).render(cx, partials);
	    },
	
	    // template result buffering
	    b: function (s) {
	      this.buf += s;
	    },
	
	    fl: function () {
	      var r = this.buf;this.buf = "";return r;
	    },
	
	    // method replace section
	    ms: function (func, ctx, partials, inverted, start, end, tags) {
	      var textSource, cx = ctx[ctx.length - 1], result = func.call(cx);
	
	      if (typeof result == "function") {
	        if (inverted) {
	          return true;
	        } else {
	          textSource = (this.activeSub && this.subsText && this.subsText[this.activeSub]) ? this.subsText[this.activeSub] : this.text;
	          return this.ls(result, cx, partials, textSource.substring(start, end), tags);
	        }
	      }
	
	      return result;
	    },
	
	    // method replace variable
	    mv: function (func, ctx, partials) {
	      var cx = ctx[ctx.length - 1];
	      var result = func.call(cx);
	
	      if (typeof result == "function") {
	        return this.ct(coerceToString(result.call(cx)), cx, partials);
	      }
	
	      return result;
	    },
	
	    sub: function (name, context, partials, indent) {
	      var f = this.subs[name];
	      if (f) {
	        this.activeSub = name;
	        f(context, partials, this, indent);
	        this.activeSub = false;
	      }
	    }
	
	  };
	
	  //Find a key in an object
	  function findInScope(key, scope, doModelGet) {
	    var val;
	
	    if (scope && typeof scope == "object") {
	      if (scope[key] !== undefined) {
	        val = scope[key];
	
	        // try lookup with get for backbone or similar model data
	      } else if (doModelGet && scope.get && typeof scope.get == "function") {
	        val = scope.get(key);
	      }
	    }
	
	    return val;
	  }
	
	  function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {
	    function PartialTemplate() {};
	    PartialTemplate.prototype = instance;
	    function Substitutions() {};
	    Substitutions.prototype = instance.subs;
	    var key;
	    var partial = new PartialTemplate();
	    partial.subs = new Substitutions();
	    partial.subsText = {}; //hehe. substext.
	    partial.buf = "";
	
	    stackSubs = stackSubs || {};
	    partial.stackSubs = stackSubs;
	    partial.subsText = stackText;
	    for (key in subs) {
	      if (!stackSubs[key]) stackSubs[key] = subs[key];
	    }
	    for (key in stackSubs) {
	      partial.subs[key] = stackSubs[key];
	    }
	
	    stackPartials = stackPartials || {};
	    partial.stackPartials = stackPartials;
	    for (key in partials) {
	      if (!stackPartials[key]) stackPartials[key] = partials[key];
	    }
	    for (key in stackPartials) {
	      partial.partials[key] = stackPartials[key];
	    }
	
	    return partial;
	  }
	
	  var rAmp = /&/g, rLt = /</g, rGt = />/g, rApos = /\'/g, rQuot = /\"/g, hChars = /[&<>\"\']/;
	
	  function coerceToString(val) {
	    return String((val === null || val === undefined) ? "" : val);
	  }
	
	  function hoganEscape(str) {
	    str = coerceToString(str);
	    return hChars.test(str) ? str.replace(rAmp, "&amp;").replace(rLt, "&lt;").replace(rGt, "&gt;").replace(rApos, "&#39;").replace(rQuot, "&quot;") : str;
	  }
	
	  var isArray = Array.isArray || function (a) {
	    return Object.prototype.toString.call(a) === "[object Array]";
	  };
	})(true ? exports : Hogan);

/***/ }
/******/ ])
});

//# sourceMappingURL=TweenTime.Editor.js.map