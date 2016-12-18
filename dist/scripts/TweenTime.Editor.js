(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("signals"), require("lodash"), require("d3"), require("jquery"), require("draggable-number.js"), require("spectrum-colorpicker"), require("file-saver"));
	else if(typeof define === 'function' && define.amd)
		define(["signals", "lodash", "d3", "jquery", "DraggableNumber", "spectrum", "file-saver"], factory);
	else if(typeof exports === 'object')
		exports["Editor"] = factory(require("signals"), require("lodash"), require("d3"), require("jquery"), require("draggable-number.js"), require("spectrum-colorpicker"), require("file-saver"));
	else
		root["TweenTime"] = root["TweenTime"] || {}, root["TweenTime"]["Editor"] = factory(root["signals"], root["_"], root["d3"], root["$"], root["DraggableNumber"], root["spectrum"], root["saveAs"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_10__, __WEBPACK_EXTERNAL_MODULE_13__, __WEBPACK_EXTERNAL_MODULE_22__, __WEBPACK_EXTERNAL_MODULE_26__, __WEBPACK_EXTERNAL_MODULE_32__, __WEBPACK_EXTERNAL_MODULE_42__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _Timeline = __webpack_require__(7);\n\nvar _Timeline2 = _interopRequireDefault(_Timeline);\n\nvar _PropertiesEditor = __webpack_require__(17);\n\nvar _PropertiesEditor2 = _interopRequireDefault(_PropertiesEditor);\n\nvar _EditorMenu = __webpack_require__(33);\n\nvar _EditorMenu2 = _interopRequireDefault(_EditorMenu);\n\nvar _EditorControls = __webpack_require__(35);\n\nvar _EditorControls2 = _interopRequireDefault(_EditorControls);\n\nvar _SelectionManager = __webpack_require__(36);\n\nvar _SelectionManager2 = _interopRequireDefault(_SelectionManager);\n\nvar _Exporter = __webpack_require__(37);\n\nvar _Exporter2 = _interopRequireDefault(_Exporter);\n\nvar _UndoManager = __webpack_require__(38);\n\nvar _UndoManager2 = _interopRequireDefault(_UndoManager);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar tpl_timeline = __webpack_require__(39);\n\nvar Signals = __webpack_require__(3);\n\nvar Editor = function () {\n  function Editor(tweenTime) {\n    var _this = this;\n\n    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];\n\n    _classCallCheck(this, Editor);\n\n    this.tweenTime = tweenTime;\n    this.options = options;\n    this.timer = this.tweenTime.timer;\n    this.lastTime = -1;\n\n    this.onKeyAdded = this.onKeyAdded.bind(this);\n    this.onKeyRemoved = this.onKeyRemoved.bind(this);\n\n    this.forceItemsRender = this.forceItemsRender.bind(this);\n\n    var el = options.el || $('body');\n    this.el = el;\n    this.$timeline = $(tpl_timeline());\n    el.append(this.$timeline);\n    el.addClass('has-editor');\n\n    this.selectionManager = new _SelectionManager2.default(this.tweenTime);\n    this.exporter = new _Exporter2.default(this);\n    this.timeline = new _Timeline2.default(this, options);\n\n    this.propertiesEditor = new _PropertiesEditor2.default(this, this.selectionManager);\n    this.propertiesEditor.keyAdded.add(this.onKeyAdded);\n    this.propertiesEditor.keyRemoved.add(this.onKeyRemoved);\n\n    this.menu = new _EditorMenu2.default(this.tweenTime, this.$timeline, this);\n    if (this.options.onMenuCreated !== undefined) {\n      this.options.onMenuCreated(this.$timeline.find('.timeline__menu'), this);\n    }\n\n    this.controls = new _EditorControls2.default(this.tweenTime, this.$timeline);\n    this.undoManager = new _UndoManager2.default(this);\n\n    // Public events.\n    this.onSelect = new Signals.Signal();\n    var self = this;\n    this.selectionManager.onSelect.add(function (selection, addToSelection) {\n      // Propagate the event.\n      self.onSelect.dispatch(selection, addToSelection);\n    });\n\n    // Will help resize the canvas to correct size (minus sidebar and timeline)\n    window.editorEnabled = true;\n    window.dispatchEvent(new Event('resize'));\n    window.requestAnimationFrame(function () {\n      return _this.update();\n    });\n  }\n\n  _createClass(Editor, [{\n    key: 'forceItemsRender',\n    value: function forceItemsRender() {\n      this.timeline._isDirty = true;\n    }\n  }, {\n    key: 'select',\n    value: function select(item) {\n      var addToSelection = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];\n\n      this.selectionManager.select(item, addToSelection);\n    }\n  }, {\n    key: 'getSelection',\n    value: function getSelection() {\n      return this.selectionManager.getSelection();\n    }\n  }, {\n    key: 'onKeyAdded',\n    value: function onKeyAdded() {\n      this.undoManager.addState();\n      this.render(false, false, true);\n    }\n  }, {\n    key: 'onKeyRemoved',\n    value: function onKeyRemoved(item) {\n      this.selectionManager.removeItem(item._id);\n      this.undoManager.addState();\n      if (this.selectionManager.selection.length) {\n        this.selectionManager.triggerSelect();\n      }\n      this.render(false, false, true);\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      var time = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];\n      var time_changed = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];\n      var force = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];\n\n      var time2 = time;\n      if (time2 === false) {\n        time2 = this.timer.time[0];\n      }\n      if (force) {\n        this.timeline._isDirty = true;\n      }\n      this.timeline.render(time2, time_changed);\n      this.controls.render(time2, time_changed);\n      this.propertiesEditor.render(time2, time_changed);\n    }\n  }, {\n    key: 'update',\n    value: function update() {\n      var _this2 = this;\n\n      var time = this.timer.time[0];\n      var time_changed = this.lastTime === time ? false : true;\n\n      this.render(time, time_changed);\n      this.lastTime = this.timer.time[0];\n      window.requestAnimationFrame(function () {\n        return _this2.update();\n      });\n    }\n  }]);\n\n  return Editor;\n}();\n\nmodule.exports = Editor;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9FZGl0b3IuanM/ZmY5NiJdLCJuYW1lcyI6WyJ0cGxfdGltZWxpbmUiLCJyZXF1aXJlIiwiU2lnbmFscyIsIkVkaXRvciIsInR3ZWVuVGltZSIsIm9wdGlvbnMiLCJ0aW1lciIsImxhc3RUaW1lIiwib25LZXlBZGRlZCIsImJpbmQiLCJvbktleVJlbW92ZWQiLCJmb3JjZUl0ZW1zUmVuZGVyIiwiZWwiLCIkIiwiJHRpbWVsaW5lIiwiYXBwZW5kIiwiYWRkQ2xhc3MiLCJzZWxlY3Rpb25NYW5hZ2VyIiwiZXhwb3J0ZXIiLCJ0aW1lbGluZSIsInByb3BlcnRpZXNFZGl0b3IiLCJrZXlBZGRlZCIsImFkZCIsImtleVJlbW92ZWQiLCJtZW51Iiwib25NZW51Q3JlYXRlZCIsInVuZGVmaW5lZCIsImZpbmQiLCJjb250cm9scyIsInVuZG9NYW5hZ2VyIiwib25TZWxlY3QiLCJTaWduYWwiLCJzZWxmIiwic2VsZWN0aW9uIiwiYWRkVG9TZWxlY3Rpb24iLCJkaXNwYXRjaCIsIndpbmRvdyIsImVkaXRvckVuYWJsZWQiLCJkaXNwYXRjaEV2ZW50IiwiRXZlbnQiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJ1cGRhdGUiLCJfaXNEaXJ0eSIsIml0ZW0iLCJzZWxlY3QiLCJnZXRTZWxlY3Rpb24iLCJhZGRTdGF0ZSIsInJlbmRlciIsInJlbW92ZUl0ZW0iLCJfaWQiLCJsZW5ndGgiLCJ0cmlnZ2VyU2VsZWN0IiwidGltZSIsInRpbWVfY2hhbmdlZCIsImZvcmNlIiwidGltZTIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBUEEsSUFBSUEsZUFBZSxtQkFBQUMsQ0FBUSxFQUFSLENBQW5COztBQVFBLElBQUlDLFVBQVUsbUJBQUFELENBQVEsQ0FBUixDQUFkOztJQUVNRSxNO0FBQ0osa0JBQVlDLFNBQVosRUFBcUM7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bEIsR0FBeUIsS0FBekIsR0FBaUMsSUFBcEQ7O0FBRUEsV0FBS0wsTUFBTCxDQUFZSyxJQUFaLEVBQWtCQyxZQUFsQjtBQUNBLFdBQUs5QyxRQUFMLEdBQWdCLEtBQUtELEtBQUwsQ0FBVzhDLElBQVgsQ0FBZ0IsQ0FBaEIsQ0FBaEI7QUFDQWhCLGFBQU9JLHFCQUFQLENBQTZCO0FBQUEsZUFBTSxPQUFLQyxNQUFMLEVBQU47QUFBQSxPQUE3QjtBQUNEOzs7Ozs7QUFHSGUsT0FBT0MsT0FBUCxHQUFpQnRELE1BQWpCIiwiZmlsZSI6IjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdHBsX3RpbWVsaW5lID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMvdGltZWxpbmUudHBsLmh0bWwnKTtcbmltcG9ydCBUaW1lbGluZSBmcm9tICcuL2dyYXBoL1RpbWVsaW5lJztcbmltcG9ydCBQcm9wZXJ0aWVzRWRpdG9yIGZyb20gJy4vZWRpdG9yL1Byb3BlcnRpZXNFZGl0b3InO1xuaW1wb3J0IEVkaXRvck1lbnUgZnJvbSAnLi9lZGl0b3IvRWRpdG9yTWVudSc7XG5pbXBvcnQgRWRpdG9yQ29udHJvbHMgZnJvbSAnLi9lZGl0b3IvRWRpdG9yQ29udHJvbHMnO1xuaW1wb3J0IFNlbGVjdGlvbk1hbmFnZXIgZnJvbSAnLi9lZGl0b3IvU2VsZWN0aW9uTWFuYWdlcic7XG5pbXBvcnQgRXhwb3J0ZXIgZnJvbSAnLi9lZGl0b3IvRXhwb3J0ZXInO1xuaW1wb3J0IFVuZG9NYW5hZ2VyIGZyb20gJy4vZWRpdG9yL1VuZG9NYW5hZ2VyJztcbmxldCBTaWduYWxzID0gcmVxdWlyZSgnanMtc2lnbmFscycpO1xuXG5jbGFzcyBFZGl0b3Ige1xuICBjb25zdHJ1Y3Rvcih0d2VlblRpbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMudHdlZW5UaW1lID0gdHdlZW5UaW1lO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy50aW1lciA9IHRoaXMudHdlZW5UaW1lLnRpbWVyO1xuICAgIHRoaXMubGFzdFRpbWUgPSAtMTtcblxuICAgIHRoaXMub25LZXlBZGRlZCA9IHRoaXMub25LZXlBZGRlZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25LZXlSZW1vdmVkID0gdGhpcy5vbktleVJlbW92ZWQuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuZm9yY2VJdGVtc1JlbmRlciA9IHRoaXMuZm9yY2VJdGVtc1JlbmRlci5iaW5kKHRoaXMpO1xuXG4gICAgdmFyIGVsID0gb3B0aW9ucy5lbCB8fCAkKCdib2R5Jyk7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMuJHRpbWVsaW5lID0gJCh0cGxfdGltZWxpbmUoKSk7XG4gICAgZWwuYXBwZW5kKHRoaXMuJHRpbWVsaW5lKTtcbiAgICBlbC5hZGRDbGFzcygnaGFzLWVkaXRvcicpO1xuXG4gICAgdGhpcy5zZWxlY3Rpb25NYW5hZ2VyID0gbmV3IFNlbGVjdGlvbk1hbmFnZXIodGhpcy50d2VlblRpbWUpO1xuICAgIHRoaXMuZXhwb3J0ZXIgPSBuZXcgRXhwb3J0ZXIodGhpcyk7XG4gICAgdGhpcy50aW1lbGluZSA9IG5ldyBUaW1lbGluZSh0aGlzLCBvcHRpb25zKTtcblxuICAgIHRoaXMucHJvcGVydGllc0VkaXRvciA9IG5ldyBQcm9wZXJ0aWVzRWRpdG9yKHRoaXMsIHRoaXMuc2VsZWN0aW9uTWFuYWdlcik7XG4gICAgdGhpcy5wcm9wZXJ0aWVzRWRpdG9yLmtleUFkZGVkLmFkZCh0aGlzLm9uS2V5QWRkZWQpO1xuICAgIHRoaXMucHJvcGVydGllc0VkaXRvci5rZXlSZW1vdmVkLmFkZCh0aGlzLm9uS2V5UmVtb3ZlZCk7XG5cbiAgICB0aGlzLm1lbnUgPSBuZXcgRWRpdG9yTWVudSh0aGlzLnR3ZWVuVGltZSwgdGhpcy4kdGltZWxpbmUsIHRoaXMpO1xuICAgIGlmICh0aGlzLm9wdGlvbnMub25NZW51Q3JlYXRlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLm9wdGlvbnMub25NZW51Q3JlYXRlZCh0aGlzLiR0aW1lbGluZS5maW5kKCcudGltZWxpbmVfX21lbnUnKSwgdGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy5jb250cm9scyA9IG5ldyBFZGl0b3JDb250cm9scyh0aGlzLnR3ZWVuVGltZSwgdGhpcy4kdGltZWxpbmUpO1xuICAgIHRoaXMudW5kb01hbmFnZXIgPSBuZXcgVW5kb01hbmFnZXIodGhpcyk7XG5cbiAgICAvLyBQdWJsaWMgZXZlbnRzLlxuICAgIHRoaXMub25TZWxlY3QgPSBuZXcgU2lnbmFscy5TaWduYWwoKTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5zZWxlY3Rpb25NYW5hZ2VyLm9uU2VsZWN0LmFkZChmdW5jdGlvbihzZWxlY3Rpb24sIGFkZFRvU2VsZWN0aW9uKSB7XG4gICAgICAvLyBQcm9wYWdhdGUgdGhlIGV2ZW50LlxuICAgICAgc2VsZi5vblNlbGVjdC5kaXNwYXRjaChzZWxlY3Rpb24sIGFkZFRvU2VsZWN0aW9uKTtcbiAgICB9KTtcblxuICAgIC8vIFdpbGwgaGVscCByZXNpemUgdGhlIGNhbnZhcyB0byBjb3JyZWN0IHNpemUgKG1pbnVzIHNpZGViYXIgYW5kIHRpbWVsaW5lKVxuICAgIHdpbmRvdy5lZGl0b3JFbmFibGVkID0gdHJ1ZTtcbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ3Jlc2l6ZScpKTtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMudXBkYXRlKCkpO1xuICB9XG5cbiAgZm9yY2VJdGVtc1JlbmRlcigpIHtcbiAgICB0aGlzLnRpbWVsaW5lLl9pc0RpcnR5ID0gdHJ1ZTtcbiAgfVxuXG4gIHNlbGVjdChpdGVtLCBhZGRUb1NlbGVjdGlvbiA9IGZhbHNlKSB7XG4gICAgdGhpcy5zZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdChpdGVtLCBhZGRUb1NlbGVjdGlvbik7XG4gIH1cblxuICBnZXRTZWxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uTWFuYWdlci5nZXRTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIG9uS2V5QWRkZWQoKSB7XG4gICAgdGhpcy51bmRvTWFuYWdlci5hZGRTdGF0ZSgpO1xuICAgIHRoaXMucmVuZGVyKGZhbHNlLCBmYWxzZSwgdHJ1ZSk7XG4gIH1cblxuICBvbktleVJlbW92ZWQoaXRlbSkge1xuICAgIHRoaXMuc2VsZWN0aW9uTWFuYWdlci5yZW1vdmVJdGVtKGl0ZW0uX2lkKTtcbiAgICB0aGlzLnVuZG9NYW5hZ2VyLmFkZFN0YXRlKCk7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uTWFuYWdlci5zZWxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbk1hbmFnZXIudHJpZ2dlclNlbGVjdCgpO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcihmYWxzZSwgZmFsc2UsIHRydWUpO1xuICB9XG5cbiAgcmVuZGVyKHRpbWUgPSBmYWxzZSwgdGltZV9jaGFuZ2VkID0gZmFsc2UsIGZvcmNlID0gZmFsc2UpIHtcbiAgICBsZXQgdGltZTIgPSB0aW1lO1xuICAgIGlmICh0aW1lMiA9PT0gZmFsc2UpIHtcbiAgICAgIHRpbWUyID0gdGhpcy50aW1lci50aW1lWzBdO1xuICAgIH1cbiAgICBpZiAoZm9yY2UpIHtcbiAgICAgIHRoaXMudGltZWxpbmUuX2lzRGlydHkgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLnRpbWVsaW5lLnJlbmRlcih0aW1lMiwgdGltZV9jaGFuZ2VkKTtcbiAgICB0aGlzLmNvbnRyb2xzLnJlbmRlcih0aW1lMiwgdGltZV9jaGFuZ2VkKTtcbiAgICB0aGlzLnByb3BlcnRpZXNFZGl0b3IucmVuZGVyKHRpbWUyLCB0aW1lX2NoYW5nZWQpO1xuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHZhciB0aW1lID0gdGhpcy50aW1lci50aW1lWzBdO1xuICAgIHZhciB0aW1lX2NoYW5nZWQgPSB0aGlzLmxhc3RUaW1lID09PSB0aW1lID8gZmFsc2UgOiB0cnVlO1xuXG4gICAgdGhpcy5yZW5kZXIodGltZSwgdGltZV9jaGFuZ2VkKTtcbiAgICB0aGlzLmxhc3RUaW1lID0gdGhpcy50aW1lci50aW1lWzBdO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy51cGRhdGUoKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFZGl0b3I7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL0VkaXRvci5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");
=======
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Timeline = __webpack_require__(11);
	
	var _Timeline2 = _interopRequireDefault(_Timeline);
	
	var _PropertiesEditor = __webpack_require__(21);
	
	var _PropertiesEditor2 = _interopRequireDefault(_PropertiesEditor);
	
	var _EditorMenu = __webpack_require__(41);
	
	var _EditorMenu2 = _interopRequireDefault(_EditorMenu);
	
	var _EditorControls = __webpack_require__(43);
	
	var _EditorControls2 = _interopRequireDefault(_EditorControls);
	
	var _SelectionManager = __webpack_require__(44);
	
	var _SelectionManager2 = _interopRequireDefault(_SelectionManager);
	
	var _Exporter = __webpack_require__(45);
	
	var _Exporter2 = _interopRequireDefault(_Exporter);
	
	var _UndoManager = __webpack_require__(46);
	
	var _UndoManager2 = _interopRequireDefault(_UndoManager);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var tpl_timeline = __webpack_require__(47);
	
	var Signals = __webpack_require__(5);
	
	var Editor = function () {
	  function Editor(tweenTime) {
	    var _this = this;
	
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    _classCallCheck(this, Editor);
	
	    this.tweenTime = tweenTime;
	    this.options = options;
	    this.timer = this.tweenTime.timer;
	    this.lastTime = -1;
	
	    this.onKeyAdded = this.onKeyAdded.bind(this);
	    this.onKeyRemoved = this.onKeyRemoved.bind(this);
	
	    var el = options.el || $('body');
	    this.el = el;
	    this.$timeline = $(tpl_timeline());
	    el.append(this.$timeline);
	    el.addClass('has-editor');
	
	    this.selectionManager = new _SelectionManager2.default(this.tweenTime);
	    this.exporter = new _Exporter2.default(this);
	    this.timeline = new _Timeline2.default(this, options);
	
	    this.propertiesEditor = new _PropertiesEditor2.default(this, this.selectionManager);
	    this.propertiesEditor.keyAdded.add(this.onKeyAdded);
	    this.propertiesEditor.keyRemoved.add(this.onKeyRemoved);
	
	    this.menu = new _EditorMenu2.default(this.tweenTime, this.$timeline, this);
	    if (this.options.onMenuCreated !== undefined) {
	      this.options.onMenuCreated(this.$timeline.find('.timeline__menu'), this);
	    }
	
	    this.controls = new _EditorControls2.default(this.tweenTime, this.$timeline);
	    this.undoManager = new _UndoManager2.default(this);
	
	    // Public events.
	    this.onSelect = new Signals.Signal();
	    var self = this;
	    this.selectionManager.onSelect.add(function (selection, addToSelection) {
	      // Propagate the event.
	      self.onSelect.dispatch(selection, addToSelection);
	    });
	
	    // Will help resize the canvas to correct size (minus sidebar and timeline)
	    window.editorEnabled = true;
	    window.dispatchEvent(new Event('resize'));
	    window.requestAnimationFrame(function () {
	      return _this.update();
	    });
	  }
	
	  _createClass(Editor, [{
	    key: 'select',
	    value: function select(item) {
	      var addToSelection = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
	      this.selectionManager.select(item, addToSelection);
	    }
	  }, {
	    key: 'getSelection',
	    value: function getSelection() {
	      return this.selectionManager.getSelection();
	    }
	  }, {
	    key: 'onKeyAdded',
	    value: function onKeyAdded() {
	      this.undoManager.addState();
	      this.render(false, false, true);
	    }
	  }, {
	    key: 'onKeyRemoved',
	    value: function onKeyRemoved(item) {
	      this.selectionManager.removeItem(item._id);
	      this.undoManager.addState();
	      if (this.selectionManager.selection.length) {
	        this.selectionManager.triggerSelect();
	      }
	      this.render(false, false, true);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var time = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	      var time_changed = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	      var force = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	
	      var time2 = time;
	      if (time2 === false) {
	        time2 = this.timer.time[0];
	      }
	      if (force) {
	        this.timeline._isDirty = true;
	      }
	      this.timeline.render(time2, time_changed);
	      this.controls.render(time2, time_changed);
	      this.propertiesEditor.render(time2, time_changed);
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var _this2 = this;
	
	      var time = this.timer.time[0];
	      var time_changed = this.lastTime === time ? false : true;
	
	      this.render(time, time_changed);
	      this.lastTime = this.timer.time[0];
	      window.requestAnimationFrame(function () {
	        return _this2.update();
	      });
	    }
	  }]);
	
	  return Editor;
	}();
	
	module.exports = Editor;
>>>>>>> master

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Utils = function () {\n  function Utils() {\n    _classCallCheck(this, Utils);\n  }\n\n  _createClass(Utils, null, [{\n    key: 'formatMinutes',\n    value: function formatMinutes(d) {\n      // convert milliseconds to seconds\n      var seconds = d / 1000;\n      var hours = Math.floor(seconds / 3600);\n      var minutes = Math.floor((seconds - hours * 3600) / 60);\n      seconds = seconds - minutes * 60;\n      var output = seconds + 's';\n      if (minutes) {\n        output = minutes + 'm ' + output;\n      }\n      if (hours) {\n        output = hours + 'h ' + output;\n      }\n      return output;\n    }\n  }, {\n    key: 'getClosestTime',\n    value: function getClosestTime(data, time) {\n      var objectId = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];\n      var property_name = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];\n      var timer = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];\n      var tolerance = arguments.length <= 5 || arguments[5] === undefined ? 0.1 : arguments[5];\n\n      if (timer) {\n        var timer_time = timer.getCurrentTime() / 1000;\n        if (Math.abs(timer_time - time) <= tolerance) {\n          return timer_time;\n        }\n      }\n\n      if (objectId || property_name) {\n        for (var i = 0; i < data.length; i++) {\n          var item = data[i];\n          // Don't match item with itself, but allow property to match item start/end.\n          if (item.id !== objectId || property_name) {\n            // First check start & end.\n            if (Math.abs(item.start - time) <= tolerance) {\n              return item.start;\n            }\n\n            if (Math.abs(item.end - time) <= tolerance) {\n              return item.end;\n            }\n          }\n\n          // Test properties keys\n          for (var j = 0; j < item.properties.length; j++) {\n            var prop = item.properties[j];\n\n            // Don't match property with itself.\n            if (prop.keys && (item.id !== objectId || prop.name !== property_name)) {\n              for (var k = 0; k < prop.keys.length; k++) {\n                var key = prop.keys[k];\n                if (Math.abs(key.time - time) <= tolerance) {\n                  return key.time;\n                }\n              }\n            }\n          }\n        }\n      }\n      return false;\n    }\n  }, {\n    key: 'getPreviousKey',\n    value: function getPreviousKey(keys, time) {\n      var prevKey = false;\n      for (var i = 0; i < keys.length; i++) {\n        var key = keys[i];\n        if (key.time < time) {\n          prevKey = key;\n        } else {\n          return prevKey;\n        }\n      }\n      return prevKey;\n    }\n  }, {\n    key: 'sortKeys',\n    value: function sortKeys(keys) {\n      var compare = function compare(a, b) {\n        if (a.time < b.time) {\n          return -1;\n        }\n        if (a.time > b.time) {\n          return 1;\n        }\n        return 0;\n      };\n      return keys.sort(compare);\n    }\n  }, {\n    key: 'guid',\n    value: function guid() {\n      var s4 = function s4() {\n        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);\n      };\n      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();\n    }\n  }]);\n\n  return Utils;\n}();\n\nexports.default = Utils;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb3JlL1V0aWxzLmpzPzhkMmYiXSwibmFtZXMiOlsiVXRpbHMiLCJkIiwic2Vjb25kcyIsImhvdXJzIiwiTWF0aCIsImZsb29yIiwibWludXRlcyIsIm91dHB1dCIsImRhdGEiLCJ0aW1lIiwib2JqZWN0SWQiLCJwcm9wZXJ0eV9uYW1lIiwidGltZXIiLCJ0b2xlcmFuY2UiLCJ0aW1lcl90aW1lIiwiZ2V0Q3VycmVudFRpbWUiLCJhYnMiLCJpIiwibGVuZ3RoIiwiaXRlbSIsImlkIiwic3RhcnQiLCJlbmQiLCJqIiwicHJvcGVydGllcyIsInByb3AiLCJrZXlzIiwibmFtZSIsImsiLCJrZXkiLCJwcmV2S2V5IiwiY29tcGFyZSIsImEiLCJiIiwic29ydCIsInM0IiwicmFuZG9tIiwidG9TdHJpbmciLCJzdWJzdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBcUJBLEs7Ozs7Ozs7a0NBQ0VDLEMsRUFBRztBQUN0QjtBQUNBLFVBQUlDLFVBQVVELElBQUksSUFBbEI7QUFDQSxVQUFJRSxRQUFRQyxLQUFLQyxLQUFMLENBQVdILFVBQVUsSUFBckIsQ0FBWjtBQUNBLFVBQUlJLFVBQVVGLEtBQUtDLEtBQUwsQ0FBVyxDQUFDSCxVQUFVQyxRQUFRLElBQW5CLElBQTJCLEVBQXRDLENBQWQ7QUFDQUQsZ0JBQVVBLFVBQVVJLFVBQVUsRUFBOUI7QUFDQSxVQUFJQyxTQUFTTCxVQUFVLEdBQXZCO0FBQ0EsVUFBSUksT0FBSixFQUFhO0FBQ1hDLGlCQUFTRCxVQUFVLElBQVYsR0FBaUJDLE1BQTFCO0FBQ0Q7QUFDRCxVQUFJSixLQUFKLEVBQVc7QUFDVEksaUJBQVNKLFFBQVEsSUFBUixHQUFlSSxNQUF4QjtBQUNEO0FBQ0QsYUFBT0EsTUFBUDtBQUNEOzs7bUNBRXFCQyxJLEVBQU1DLEksRUFBK0U7QUFBQSxVQUF6RUMsUUFBeUUseURBQTlELEtBQThEO0FBQUEsVUFBdkRDLGFBQXVELHlEQUF2QyxLQUF1QztBQUFBLFVBQWhDQyxL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QyxDQUFtRCxFQUFuRCxFQUF1REMsU0FBdkQsQ0FBaUUsQ0FBakUsQ0FBUDtBQUNELE9BRkQ7QUFHQSxhQUFPSCxPQUFPQSxJQUFQLEdBQWMsR0FBZCxHQUFvQkEsSUFBcEIsR0FBMkIsR0FBM0IsR0FBaUNBLElBQWpDLEdBQXdDLEdBQXhDLEdBQThDQSxJQUE5QyxHQUFxRCxHQUFyRCxHQUEyREEsSUFBM0QsR0FBa0VBLElBQWxFLEdBQXlFQSxJQUFoRjtBQUNEOzs7Ozs7a0JBM0ZrQm5DLEsiLCJmaWxlIjoiMS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIFV0aWxzIHtcbiAgc3RhdGljIGZvcm1hdE1pbnV0ZXMoZCkge1xuICAgIC8vIGNvbnZlcnQgbWlsbGlzZWNvbmRzIHRvIHNlY29uZHNcbiAgICBsZXQgc2Vjb25kcyA9IGQgLyAxMDAwO1xuICAgIGxldCBob3VycyA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcigoc2Vjb25kcyAtIGhvdXJzICogMzYwMCkgLyA2MCk7XG4gICAgc2Vjb25kcyA9IHNlY29uZHMgLSBtaW51dGVzICogNjA7XG4gICAgbGV0IG91dHB1dCA9IHNlY29uZHMgKyAncyc7XG4gICAgaWYgKG1pbnV0ZXMpIHtcbiAgICAgIG91dHB1dCA9IG1pbnV0ZXMgKyAnbSAnICsgb3V0cHV0O1xuICAgIH1cbiAgICBpZiAoaG91cnMpIHtcbiAgICAgIG91dHB1dCA9IGhvdXJzICsgJ2ggJyArIG91dHB1dDtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIHN0YXRpYyBnZXRDbG9zZXN0VGltZShkYXRhLCB0aW1lLCBvYmplY3RJZCA9IGZhbHNlLCBwcm9wZXJ0eV9uYW1lID0gZmFsc2UsIHRpbWVyID0gZmFsc2UsIHRvbGVyYW5jZSA9IDAuMSkge1xuICAgIGlmICh0aW1lcikge1xuICAgICAgdmFyIHRpbWVyX3RpbWUgPSB0aW1lci5nZXRDdXJyZW50VGltZSgpIC8gMTAwMDtcbiAgICAgIGlmIChNYXRoLmFicyh0aW1lcl90aW1lIC0gdGltZSkgPD0gdG9sZXJhbmNlKSB7XG4gICAgICAgIHJldHVybiB0aW1lcl90aW1lO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvYmplY3RJZCB8fCBwcm9wZXJ0eV9uYW1lKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgICAvLyBEb24ndCBtYXRjaCBpdGVtIHdpdGggaXRzZWxmLCBidXQgYWxsb3cgcHJvcGVydHkgdG8gbWF0Y2ggaXRlbSBzdGFydC9lbmQuXG4gICAgICAgIGlmIChpdGVtLmlkICE9PSBvYmplY3RJZCB8fCBwcm9wZXJ0eV9uYW1lKSB7XG4gICAgICAgICAgLy8gRmlyc3QgY2hlY2sgc3RhcnQgJiBlbmQuXG4gICAgICAgICAgaWYgKE1hdGguYWJzKGl0ZW0uc3RhcnQgLSB0aW1lKSA8PSB0b2xlcmFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLnN0YXJ0O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChNYXRoLmFicyhpdGVtLmVuZCAtIHRpbWUpIDw9IHRvbGVyYW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uZW5kO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRlc3QgcHJvcGVydGllcyBrZXlzXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaXRlbS5wcm9wZXJ0aWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgdmFyIHByb3AgPSBpdGVtLnByb3BlcnRpZXNbal07XG5cbiAgICAgICAgICAvLyBEb24ndCBtYXRjaCBwcm9wZXJ0eSB3aXRoIGl0c2VsZi5cbiAgICAgICAgICBpZiAocHJvcC5rZXlzICYmIChpdGVtLmlkICE9PSBvYmplY3RJZCB8fCBwcm9wLm5hbWUgIT09IHByb3BlcnR5X25hbWUpKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHByb3Aua2V5cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICB2YXIga2V5ID0gcHJvcC5rZXlzW2tdO1xuICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoa2V5LnRpbWUgLSB0aW1lKSA8PSB0b2xlcmFuY2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5LnRpbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3RhdGljIGdldFByZXZpb3VzS2V5KGtleXMsIHRpbWUpIHtcbiAgICB2YXIgcHJldktleSA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoa2V5LnRpbWUgPCB0aW1lKSB7XG4gICAgICAgIHByZXZLZXkgPSBrZXk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHByZXZLZXk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwcmV2S2V5O1xuICB9XG5cbiAgc3RhdGljIHNvcnRLZXlzKGtleXMpIHtcbiAgICB2YXIgY29tcGFyZSA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIGlmIChhLnRpbWUgPCBiLnRpbWUpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgaWYgKGEudGltZSA+IGIudGltZSkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH07XG4gICAgcmV0dXJuIGtleXMuc29ydChjb21wYXJlKTtcbiAgfVxuXG4gIHN0YXRpYyBndWlkKCkge1xuICAgIHZhciBzNCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMSk7XG4gICAgfTtcbiAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XG4gIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vY29yZS9VdGlscy5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports) {

<<<<<<< HEAD
	eval("module.exports = __WEBPACK_EXTERNAL_MODULE_3__;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wicm9vdFwiOlwic2lnbmFsc1wiLFwiY29tbW9uanNcIjpcInNpZ25hbHNcIixcImNvbW1vbmpzMlwiOlwic2lnbmFsc1wiLFwiYW1kXCI6XCJzaWduYWxzXCJ9PzkwMzgiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiMy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8zX187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCB7XCJyb290XCI6XCJzaWduYWxzXCIsXCJjb21tb25qc1wiOlwic2lnbmFsc1wiLFwiY29tbW9uanMyXCI6XCJzaWduYWxzXCIsXCJhbWRcIjpcInNpZ25hbHNcIn1cbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");
=======
	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;
>>>>>>> master

/***/ },
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ function(module, exports) {

<<<<<<< HEAD
	eval("module.exports = __WEBPACK_EXTERNAL_MODULE_6__;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wicm9vdFwiOlwiX1wiLFwiY29tbW9uanNcIjpcImxvZGFzaFwiLFwiY29tbW9uanMyXCI6XCJsb2Rhc2hcIixcImFtZFwiOlwibG9kYXNoXCJ9PzU1ZDAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiNi5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV82X187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCB7XCJyb290XCI6XCJfXCIsXCJjb21tb25qc1wiOlwibG9kYXNoXCIsXCJjb21tb25qczJcIjpcImxvZGFzaFwiLFwiYW1kXCI6XCJsb2Rhc2hcIn1cbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");
=======
	module.exports = __WEBPACK_EXTERNAL_MODULE_10__;
>>>>>>> master

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _Utils = __webpack_require__(1);\n\nvar _Utils2 = _interopRequireDefault(_Utils);\n\nvar _Header = __webpack_require__(8);\n\nvar _Header2 = _interopRequireDefault(_Header);\n\nvar _TimeIndicator = __webpack_require__(10);\n\nvar _TimeIndicator2 = _interopRequireDefault(_TimeIndicator);\n\nvar _Items = __webpack_require__(11);\n\nvar _Items2 = _interopRequireDefault(_Items);\n\nvar _KeysPreview = __webpack_require__(12);\n\nvar _KeysPreview2 = _interopRequireDefault(_KeysPreview);\n\nvar _Properties = __webpack_require__(13);\n\nvar _Properties2 = _interopRequireDefault(_Properties);\n\nvar _Keys = __webpack_require__(14);\n\nvar _Keys2 = _interopRequireDefault(_Keys);\n\nvar _Errors = __webpack_require__(15);\n\nvar _Errors2 = _interopRequireDefault(_Errors);\n\nvar _Selection = __webpack_require__(16);\n\nvar _Selection2 = _interopRequireDefault(_Selection);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar d3 = __webpack_require__(9);\n\nvar Timeline = function () {\n  function Timeline(editor, options) {\n    var _this = this;\n\n    _classCallCheck(this, Timeline);\n\n    this.editor = editor;\n    this.tweenTime = this.editor.tweenTime;\n    this.timer = this.tweenTime.timer;\n    this.selectionManager = this.editor.selectionManager;\n\n    this._isDirty = true;\n    this.timer = this.tweenTime.timer;\n    this.currentTime = this.timer.time; // used in timeindicator.\n\n    this.onUpdate = this.onUpdate.bind(this);\n\n    // Make the domain cover 20% of the totalDuation by default.\n    this.initialDomain = [];\n    this.initialDomain[0] = options.domainStart || 0;\n    this.initialDomain[1] = options.domainEnd || this.timer.totalDuration * 0.2;\n\n    // Adapt time to be greater or equal to domainStart.\n    if (this.initialDomain[0] > this.timer.getCurrentTime()) {\n      this.timer.time[0] = this.initialDomain[0];\n    }\n\n    var margin = { top: 6, right: 20, bottom: 0, left: 265 };\n    this.margin = margin;\n\n    var width = window.innerWidth - margin.left - margin.right;\n    var height = 270 - margin.top - margin.bottom - 40;\n    this.lineHeight = 20;\n    this.label_position_x = -margin.left + 20;\n\n    this.x = d3.time.scale().domain(this.initialDomain).range([0, width]);\n\n    this.xAxis = d3.svg.axis().scale(this.x).orient('top').tickSize(-height, 0).tickFormat(_Utils2.default.formatMinutes);\n\n    this.svg = d3.select(editor.$timeline.get(0)).select('.timeline__main').append('svg').attr('width', width + margin.left + margin.right).attr('height', 600);\n\n    this.svgContainer = this.svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');\n\n    this.svgContainerTime = this.svg.append('g').attr('transform', 'translate(' + margin.left + ',0)');\n\n    this.linesContainer = this.svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');\n\n    this.header = new _Header2.default(editor, this.timer, this.initialDomain, this.tweenTime, width, margin);\n    this.timeIndicator = new _TimeIndicator2.default(this, this.svgContainerTime);\n\n    this.selection = new _Selection2.default(this, this.svg, margin);\n\n    this.items = new _Items2.default(this, this.linesContainer);\n    this.items.onUpdate.add(this.onUpdate);\n    this.keysPreview = new _KeysPreview2.default(this, this.linesContainer);\n\n    this.properties = new _Properties2.default(this);\n    this.properties.onKeyAdded.add(function (newKey, keyContainer) {\n      _this._isDirty = true;\n      // render the timeline directly so that we can directly select\n      // the new key with it's domElement.\n      _this.render(0, false);\n      _this.keys.selectNewKey(newKey, keyContainer);\n    });\n    this.errors = new _Errors2.default(this);\n    this.keys = new _Keys2.default(this);\n    this.keys.onKeyUpdated.add(function () {\n      _this.onUpdate();\n    });\n\n    this.xAxisGrid = d3.svg.axis().scale(this.x).ticks(100).tickSize(-this.items.dy, 0).tickFormat('').orient('top');\n\n    this.xGrid = this.svgContainer.append('g').attr('class', 'x axis grid').attr('transform', 'translate(0,' + margin.top + ')').call(this.xAxisGrid);\n\n    this.xAxisElement = this.svgContainer.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + margin.top + ')').call(this.xAxis);\n\n    this.header.onBrush.add(function (extent) {\n      _this.x.domain(extent);\n      _this.xGrid.call(_this.xAxisGrid);\n      _this.xAxisElement.call(_this.xAxis);\n      _this._isDirty = true;\n    });\n\n    // First render\n    window.requestAnimationFrame(function () {\n      _this.render();\n    });\n\n    window.onresize = function () {\n      var INNER_WIDTH = window.innerWidth;\n      var width2 = INNER_WIDTH - margin.left - margin.right;\n      _this.svg.attr('width', width2 + margin.left + margin.right);\n      _this.svg.selectAll('.timeline__right-mask').attr('width', INNER_WIDTH);\n      _this.x.range([0, width2]);\n\n      _this._isDirty = true;\n      _this.header.resize(INNER_WIDTH);\n      _this.render();\n    };\n  }\n\n  _createClass(Timeline, [{\n    key: 'onUpdate',\n    value: function onUpdate() {\n      this.editor.render(false, false, true);\n    }\n  }, {\n    key: 'render',\n    value: function render(time, time_changed) {\n      if (time_changed) {\n        var domainLength;\n        // Update current domain when playing to keep time indicator in view.\n        var margin_ms = 16;\n        if (this.timer.getCurrentTime() > this.initialDomain[1]) {\n          domainLength = this.initialDomain[1] - this.initialDomain[0];\n          this.initialDomain[0] += domainLength - margin_ms;\n          this.initialDomain[1] += domainLength - margin_ms;\n          this.header.setDomain(this.initialDomain);\n        }\n        if (this.timer.getCurrentTime() < this.initialDomain[0]) {\n          domainLength = this.initialDomain[1] - this.initialDomain[0];\n          this.initialDomain[0] = this.timer.getCurrentTime();\n          this.initialDomain[1] = this.initialDomain[0] + domainLength;\n          this.header.setDomain(this.initialDomain);\n        }\n      }\n\n      if (this._isDirty || time_changed) {\n        // Render header and time indicator everytime the time changed.\n        this.header.render();\n        this.timeIndicator.render();\n      }\n\n      if (this._isDirty) {\n        // No need to call this on each frames, but only on brush, key drag, ...\n        var bar = this.items.render();\n        this.keysPreview.render(bar);\n        var properties = this.properties.render(bar);\n        this.errors.render(properties);\n        this.keys.render(properties);\n        this._isDirty = false;\n\n        // Adapt the timeline height.\n        var height = Math.max(this.items.dy + 30, 230);\n        this.xAxis.tickSize(-height, 0);\n        this.xAxisGrid.tickSize(-height, 0);\n        this.xGrid.call(this.xAxisGrid);\n        this.xAxisElement.call(this.xAxis);\n        this.svg.attr('height', height);\n        this.timeIndicator.updateHeight(height);\n      }\n    }\n  }]);\n\n  return Timeline;\n}();\n\nexports.default = Timeline;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ncmFwaC9UaW1lbGluZS5qcz8xZmNiIl0sIm5hbWVzIjpbImQzIiwicmVxdWlyZSIsIlRpbWVsaW5lIiwiZWRpdG9yIiwib3B0aW9ucyIsInR3ZWVuVGltZSIsInRpbWVyIiwic2VsZWN0aW9uTWFuYWdlciIsIl9pc0RpcnR5IiwiY3VycmVudFRpbWUiLCJ0aW1lIiwib25VcGRhdGUiLCJiaW5kIiwiaW5pdGlhbERvbWFpbiIsImRvbWFpblN0YXJ0IiwiZG9tYWluRW5kIiwidG90YWxEdXJhdGlvbiIsImdldEN1cnJlbnRUaW1lIiwibWFyZ2luIiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0Iiwid2lkdGgiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaGVpZ2h0IiwibGluZUhlaWdodCIsImxhYmVsX3Bvc2l0aW9uX3giLCJ4Iiwic2NhbGUiLCJkb21haW4iLCJyYW5nZSIsInhBeGlzIiwic3ZnIiwiYXhpcyIsIm9yaWVudCIsInRpY2tTaXplIiwidGlja0Zvcm1hdCIsImZvcm1hdE1pbnV0ZXMiLCJzZWxlY3QiLCIkdGltZWxpbmUiLCJnZXQiLCJhcHBlbmQiLCJhdHRyIiwic3ZnQ29udGFpbmVyIiwic3ZnQ29udGFpbmVyVGltZSIsImxpbmVzQ29udGFpbmVyIiwiaGVhZGVyIiwidGltZUluZGljYXRvciIsInNlbGVjdGlvbiIsIml0ZW1zIiwiYWRkIiwia2V5c1ByZXZpZXciLCJwcm9wZXJ0aWVzIiwib25LZXlBZGRlZCIsIm5ld0tleSIsImtleUNvbnRhaW5lciIsInJlbmRlciIsImtleXMiLCJzZWxlY3ROZXdLZXkiLCJlcnJvcnMiLCJvbktleVVwZGF0ZWQiLCJ4QXhpc0dyaWQiLCJ0aWNrcyIsImR5IiwieEdyaWQiLCJjYWxsIiwieEF4aXNFbGVtZW50Iiwib25CcnVzaCIsImV4dGVudCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm9ucmVzaXplIiwiSU5ORVJfV0lEVEgiLCJ3aWR0aDIiLCJzZWxlY3RBbGwiLCJyZXNpemUiLCJ0aW1lX2NoYW5nZWQiLCJkb21haW5MZW5ndGgiLCJtYXJnaW5fbXMiLCJzZXREb21haW4iLCJiYXIiLCJNYXRoIiwibWF4IiwidXBkYXRlSGVpZ2h0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFWQSxJQUFJQSxLQUFLLG1CQUFBQyxDQUFRLENBQVIsQ0FBVDs7SUFZcUJDLFE7QUFDbkIsb0JBQVlDLE1BQVosRUFBb0JDLE9BQXBCLEVBQTZCO0FBQUE7O0FBQUE7O0FBQzNCLFNBQUtELE1BQUwsR0FBY0EsTUFBZDtBQUNBLFNBQUtFLFNBQUwsR0FBaUIsS0FBS0YsTUFBTCxDQUFZRSxTQUE3QjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxLQUFLRCxTQUFMLENBQWVDLEtBQTVCO0FBQ0EsU0FBS0MsZ0JBQUwsR0FBd0IsS0FBS0osTUFBTCxDQUFZSSxnQkFBcEM7O0FBRUEsU0FBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUNBLFNBQUtGLEtBQUwsR0FBYSxLQUFLRCxTQUFMLENBQWVDLEtBQTVCO0FBQ0EsU0FBS0csV0FBTCxHQUFtQixLQUFLSCxLQUFMLENBQVdJLElBQTlCLENBUjJCLENBUVM7O0FBRXBDLFNBQUtDLFFBQUwsR0FBZ0IsS0FBS0EsUUFBTCxDQUFjQyxJQUFkLENBQW1CLElBQW5CLENBQWhCOztBQUVBO0FBQ0EsU0FBS0MsYUFBTCxHQUFxQixFQUFyQjtBQUNBLFNBQUtBLGFBQUwsQ0FBbUIsQ0FBbkIsSUFBd0JULFFBQVFVLFdBQVIsSUFBdUIsQ0FBL0M7QUFDQSxTQUFLRCxhQUFMLENBQW1CLENBQW5CLElBQXdCVCxRQUFRVyxTQUFSLElBQXFCLEtBQUtULEtBQUwsQ0FBV1UsYUFBWCxHQUEyQixHQUF4RTs7QUFFQTtBQUNBLFFBQUksS0FBS0gsYUFBTCxDQUFtQixDQUFuQixJQUF3QixLQUFLUCxLQUFMLENBQVdXLGNBQVgsRUFBNUIsRUFBeUQ7QUFDdkQsV0FBS1gsS0FBTCxDQUFXSSxJQUFYLENBQWdCLENBQWhCLElBQXFCLEtBQUtHLGFBQUwsQ0FBbUIsQ0FBbkIsQ0FBckI7QUFDRDs7QUFFRCxRQUFJSyxTQUFTLEVBQUNDLEtBQUssQ0FBTixFQUFTQyxPQUFPLEVBQWhCLEVBQW9CQyxRQUFRLENBQTVCLEVBQStCQyxNQUFNLEdBQXJDLEVBQWI7QUFDQSxTQUFLSixNQUFMLEdBQWNBLE1BQWQ7O0FBRUEsUUFBSUssUUFBUUMsT0FBT0MsVUFBUCxHQUFvQlAsT0FBT0ksSUFBM0IsR0FBa0NKLE9BQU9FLEtBQXJEO0FBQ0EsUUFBSU0sU0FBUyxNQUFNUixPQUFPQyxHQUFiLEdBQW1CRCxPQUFPRyxNQUExQixHQUFtQyxFQUFoRDtBQUNBLFNBQUtNLFVBQUwsR0FBa0IsRUFBbEI7QUFDQSxTQUFLQyxnQkFBTCxHQUF3QixDQUFDVixPQUFPSSxJQUFSLEdBQWUsRUFBdkM7O0FBRUEsU0FBS08sQ0FBTCxHQUFTN0IsR0FBR1UsSUFBSCxDQUFRb0IsS0FBUixHQUNOQyxNQURNLENBQ0MsS0FBS2xCLGFBRE4sRUFFTm1CLEtBRk0sQ0FFQSxDQUFDLENBQUQsRUFBSVQsS0FBSixDQUZBLENBQVQ7O0FBSUEsU0FBS1UsS0FBTCxHQUFhakMsR0FBR2tDLEdBQUgsQ0FBT0MsSUFBUCxHQUNWTCxLQURVLENBQ0osS0FBS0QsQ0FERCxFQUVWTyxNQUZVLENBRUgsS0FGRyxFQUdWQyxRQUhVLENBR0QsQ0FBQ1gsTUFIQSxFQUdRLENBSFIsRUFJVlksVUFKVSxDQUlDLGdCQUFNQyxhQUpQLENBQWI7O0FBTUEsU0FBS0wsR0FBTCxHQUFXbEMsR0FBR3dDLE1BQUgsQ0FBVXJDLE9BQU9zQyxTQUFQLENBQWlCQyxHQUFqQixDQUFxQixDQUFyQixDQUFWLEVBQW1DRixNQUFuQyxDQUEwQyxpQkFBMUMsRUFBNkRHLE1BQTdELENBQW9FLEtBQXBFLEVBQ1JDLElBRFEsQ0FDSCxPQURHLEVBQ01yQixRQUFRTCxPQUFPSSxJQUFmLEdBQXNCSixPQUFPRSxLQURuQyxFQUVSd0IsSUFGUSxDQUVILFFBRkcsRUFFTyxHQUZQLENBQVg7O0FBSUEsU0FBS0MsWUFBTCxHQUFvQixLQUFLWCxHQUFMLENBQVNTLE1BQVQsQ0FBZ0IsR0FBaEIsRUFDakJDLElBRGlCLENBQ1osV0FEWSxFQUNDLGVBQWUxQixPQUFPSSxJQUF0QixHQUE2QixHQUE3QixHQUFtQ0osT0FBT0MsR0FBMUMsR0FBZ0QsR0FEakQsQ0FBcEI7O0FBR0EsU0FBSzJCLGdCQUFMLEdBQXdCLEtBQUtaLEdBQUwsQ0FBU1MsTUFBVCxDQUFnQixHQUFoQixFQUNyQkMsSUFEcUIsQ0FDaEIsV0FEZ0IsRUFDSCxlQUFlMUIsT0FBT0ksSUFBdEIsR0FBNkIsS0FEMUIsQ0FBeEI7O0FBR0EsU0FBS3lCLGNBQUwsR0FBc0IsS0FBS2IsR0FBTCxDQUFTUyxNQUFULENBQWdCLEdBQWhCLEVBQ25CQyxJQURtQixDQUNkLFdBRGMsRUFDRCxlQUFlMUIsT0FBT0ksSUFBdEIsR0FBNkIsR0FBN0IsR0FBbUNKLE9BQU9DLEdBQTFDLEdBQWdELEdBRC9DLENBQXRCOztBQUdBLFNBQUs2QixNQUFMLEdBQWMscUJBQVc3QyxNQUFYLEVBQW1CLEtBQUtHLEtBQXhCLEVBQStCLEtBQUtPLGFBQXBDLEVBQW1ELEtBQUtSLFNBQXhELEVBQW1Fa0IsS0FBbkUsRUFBMEVMLE1BQTFFLENBQWQ7QUFDQSxTQUFLK0IsYUFBTCxHQUFxQiw0QkFBa0IsSUFBbEIsRUFBd0IsS0FBS0gsZ0JBQTdCLENBQXJCOztBQUVBLFNBQUtJLFNBQUwsR0FBaUIsd0JBQWMsSUFBZCxFQUFvQixLQUFLaEIsR0FBekIsRUFBOEJoQixNQUE5QixDQUFqQjs7QUFFQSxTQUFLaUMsS0FBTCxHQUFhLG9CQUFVLElBQVYsRUFBZ0IsS0FBS0osY0FBckIsQ0FBYjtBQUNBLFNBQUtJLEtBQUwsQ0FBV3hDLFFBQVgsQ0FBb0J5QyxHQUFwQixDQUF3QixLQUFLekMsUUFBN0I7QUFDQSxTQUFLMEMsV0FBTCxHQUFtQiwwQkFBZ0IsSUFBaEIsRUFBc0IsS0FBS04sY0FBM0IsQ0FBbkI7O0FBRUEsU0FBS08sVUFBTCxHQUFrQix5QkFBZSxJQUFmLENBQWxCO0FBQ0EsU0FBS0EsVUFBTCxDQUFnQkMsVUFBaEIsQ0FBMkJILEdBQTNCLENBQStCLFVBQUNJLE1BQUQsRUFBU0MsWUFBVCxFQUEwQjtBQUN2RCxZQUFLakQsUUFBTCxHQUFnQixJQUFoQjtBQUNBO0FBQ0E7QUFDQSxZQUFLa0QsTUFBTCxDQUFZLENBQVosRUFBZSxLQUFmO0FBQ0EsWUFBS0MsSUFBTCxDQUFVQyxZQUFWLENBQXVCSixNQUF2QixFQUErQkMsWUFBL0I7QUFDRCxLQU5EO0FBT0EsU0FBS0ksTUFBTCxHQUFjLHFCQUFXLElBQVgsQ0FBZDtBQUNBLFNBQUtGLElBQUwsR0FBWSxtQkFBUyxJQUFULENBQVo7QUFDQSxTQUFLQSxJQUFMLENBQVVHLFlBQVYsQ0FBdUJWLEdBQXZCLENBQTJCLFlBQU07QUFDL0IsWUFBS3pDLFFBQUw7QUFDRCxLQUZEOztBQUlBLFNBQUtvRCxTQUFMLEdBQWlCL0QsR0FBR2tDLEdBQUgsQ0FBT0MsSUFBUCxHQUNkTCxLQURjLENBQ1IsS0FBS0QsQ0FERyxFQUVkbUMsS0FGYyxDQUVSLEdBRlEsRUFHZDNCLFFBSGMsQ0FHTCxDQUFDLEtBQUtjLEtBQUwsQ0FBV2MsRUFIUCxFQUdXLENBSFgsRUFJZDNCLFVBSmMsQ0FJSCxFQUpHLEVBS2RGLE1BTGMsQ0FLUCxLQUxPLENBQWpCOztBQU9BLFNBQUs4QixLQUFMLEdBQWEsS0FBS3JCLFlBQUwsQ0FBa0JGLE1BQWxCLENBQXlCLEdBQXpCLEVBQ1ZDLElBRFUsQ0FDTCxPQURLLEVBQ0ksYUFESixFQUVWQSxJQUZVLENBRUwsV0FGSyxFQUVRLGlCQUFpQjFCLE9BQU9DLEdBQXhCLEdBQThCLEdBRnRDLEVBR1ZnRCxJQUhVLENBR0wsS0FBS0osU0FIQSxDQUFiOztBQUtBLFNBQUtLLFlBQUwsR0FBb0IsS0FBS3ZCLFlBQUwsQ0FBa0JGLE1BQWxCLENBQXlCLEdBQXpCLEVBQ2pCQyxJQURpQixDQUNaLE9BRFksRUFDSCxRQURHLEVBRWpCQSxJQUZpQixDQUVaLFdBRlksRUFFQyxpQkFBaUIxQixPQUFPQyxHQUF4QixHQUE4QixHQUYvQixFQUdqQmdELElBSGlCLENBR1osS0FBS2xDLEtBSE8sQ0FBcEI7O0FBS0EsU0FBS2UsTUFBTCxDQUFZcUIsT0FBWixDQUFvQmpCLEdBQXBCLENBQXdCLFVBQUNrQixNQUFELEVBQVk7QUFDbEMsWUFBS3pDLENBQUwsQ0FBT0UsTUFBUCxDQUFjdUMsTUFBZDtBQUNBLFlBQUtKLEtBQUwsQ0FBV0MsSUFBWCxDQUFnQixNQUFLSixTQUFyQjtBQUNBLFlBQUtLLFlBQUwsQ0FBa0JELElBQWxCLENBQXVCLE1BQUtsQyxLQUE1QjtBQUNBLFlBQUt6QixRQUFMLEdBQWdCLElBQWhCO0FBQ0QsS0FMRDs7QUFPQTtBQUNBZ0IsV0FBTytDLHFCQUFQLENBQTZCLFlBQU07QUFBQyxZQUFLYixNQUFMO0FBQWUsS0FBbkQ7O0FBRUFsQyxXQUFPZ0QsUUFBUCxHQUFrQixZQUFNO0FBQ3RCLFVBQUlDLGNBQWNqRCxPQUFPQyxVQUF6QjtBQUNBLFVBQUlpRCxTQUFTRCxjQUFjdkQsT0FBT0ksSUFBckIsR0FBNEJKLE9BQU9FLEtBQWhEO0FBQ0EsWUFBS2MsR0FBTCxDQUFTVSxJQUFULENBQWMsT0FBZCxFQUF1QjhCLFNBQVN4RCxPQUFPSSxJQUFoQixHQUF1QkosT0FBT0UsS0FBckQ7QUFDQSxZQUFLYyxHQUFMLENBQVN5QyxTQUFULENBQW1CLHVCQUFuQixFQUNHL0IsSUFESCxDQUNRLE9BRFIsRUFDaUI2QixXQURqQjtBQUVBLFlBQUs1QyxDQUFMLENBQU9HLEtBQVAsQ0FBYSxDQUFDLENBQUQsRUFBSTBDLE1BQUosQ0FBYjs7QUFFQSxZQUFLbEUsUUFBTCxHQUFnQixJQUFoQjtBQUNBLFlBQUt3QyxNQUFMLENBQVk0QixNQUFaLENBQW1CSCxXQUFuQjtBQUNBLFlBQUtmLE1BQUw7QUFDRCxLQVhEO0FBWUQ7Ozs7K0JBRVU7QUFDVCxXQUFLdkQsTUFBTCxDQUFZdUQsTUFBWixDQUFtQixLQUFuQixFQUEwQixLQUExQixFQUFpQyxJQUFqQztBQUNEOzs7MkJBRU1oRCxJLEVBQU1tRSxZLEVBQWM7QUFDekIsVUFBSUEsWUFBSixFQUFrQjtBQUNoQixZQUFJQyxZQUFKO0FBQ0E7QUFDQSxZQUFJQyxZQUFZLEVBQWhCO0FBQ0EsWUFBSSxLQUFLekUsS0FBTCxDQUFXVyxjQUFYLEtBQThCLEtBQUtKLGFBQUwsQ0FBbUIsQ0FBbkIsQ0FBbEMsRUFBeUQ7QUFDdkRpRSx5QkFBZSxLQUFLakUsYUFBTCxDQUFtQixDQUFuQixJQUF3QixLQUFLQSxhQUFMLENBQW1CLENBQW5CLENBQXZDO0FBQ0EsZUFBS0EsYUFBTCxDQUFtQixDQUFuQixLQUF5QmlFLGVBQWVDLFNBQXhDO0FBQ0EsZUFBS2xFLGFBQUwsQ0FBbUIsQ0FBbkIsS0FBeUJpRSxlQUFlQyxTQUF4QztBQUNBLGVBQUsvQixNQUFMLENBQVlnQyxTQUFaLENBQXNCLEtBQUtuRSxhQUEzQjtBQUNEO0FBQ0QsWUFBSSxLQUFLUCxLQUFMLENBQVdXLGNBQVgsS0FBOEIsS0FBS0osYUFBTCxDQUFtQixDQUFuQixDQUFsQyxFQUF5RDtBQUN2RGlFLHlCQUFlLEtBQUtqRSxhQUFMLENBQW1CLENBQW5CLElBQXdCLEtBQUtBLGFBQUwsQ0FBbUIsQ0FBbkIsQ0FBdkM7QUFDQSxlQUFLQSxhQUFMLENBQW1CLENBQW5CLElBQXdCLEtBQUtQLEtBQUwsQ0FBV1csY0FBWCxFQUF4QjtBQUNBLGVBQUtKLGFBQUwsQ0FBbUIsQ0FBbkIsSUFBd0IsS0FBS0EsYUFBTCxDQUFtQixDQUFuQixJQUF3QmlFLFlBQWhEO0FBQ0EsZUFBSzlCLE1BQUwsQ0FBWWdDLFNBQVosQ0FBc0IsS0FBS25FLGFBQTNCO0FBQ0Q7QUFDRjs7QUFFRCxVQUFJLEtBQUtMLFFBQUwsSUFBaUJxRSxZQUFyQixFQUFtQztBQUNqQztBQUNBLGFBQUs3QixNQUFMLENBQVlVLE1BQVo7QUFDQSxhQUFLVCxhQUFMLENBQW1CUyxNQUFuQjtBQUNEOztBQUVELFVBQUksS0FBS2xELFFBQVQsRUFBbUI7QUFDakI7QUFDQSxZQUFJeUUsTUFBTSxLQUFLOUIsS0FBTCxDQUFXTyxNQUFYLEVBQVY7QUFDQSxhQUFLTCxXQUFMLENBQWlCSyxNQUFqQixDQUF3QnVCLEdBQXhCO0FBQ0EsWUFBSTNCLGFBQWEsS0FBS0EsVUFBTCxDQUFnQkksTUFBaEIsQ0FBdUJ1QixHQUF2QixDQUFqQjtBQUNBLGFBQUtwQixNQUFMLENBQVlILE1BQVosQ0FBbUJKLFVBQW5CO0FBQ0EsYUFBS0ssSUFBTCxDQUFVRCxNQUFWLENBQWlCSixVQUFqQjtBQUNBLGFBQUs5QyxRQUFMLEdBQWdCLEtBQWhCOztBQUVBO0FBQ0EsWUFBSWtCLFNBQVN3RCxLQUFLQyxHQUFMLENBQVMsS0FBS2hDLEtBQUwsQ0FBV2MsRUFBWCxHQUFnQixFQUF6QixFQUE2QixHQUE3QixDQUFiO0FBQ0EsYUFBS2hDLEtBQUwsQ0FBV0ksUUFBWCxDQUFvQixDQUFDWCxNQUFyQixFQUE2QixDQUE3QjtBQUNBLGFBQUtxQyxTQUFMLENBQWUxQixRQUFmLENBQXdCLENBQUNYLE1BQXpCLEVBQWlDLENBQWpDO0FBQ0EsYUFBS3dDLEtBQUwsQ0FBV0MsSUFBWCxDQUFnQixLQUFLSixTQUFyQjtBQUNBLGFBQUtLLFlBQUwsQ0FBa0JELElBQWxCLENBQXVCLEtBQUtsQyxLQUE1QjtBQUNBLGFBQUtDLEdBQUwsQ0FBU1UsSUFBVCxDQUFjLFFBQWQsRUFBd0JsQixNQUF4QjtBQUNBLGFBQUt1QixhQUFMLENBQW1CbUMsWUFBbkIsQ0FBZ0MxRCxNQUFoQztBQUNEO0FBQ0Y7Ozs7OztrQkFyS2tCeEIsUSIsImZpbGUiOiI3LmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGQzID0gcmVxdWlyZSgnZDMnKTtcblxuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2NvcmUvVXRpbHMnO1xuaW1wb3J0IEhlYWRlciBmcm9tICcuL0hlYWRlcic7XG5pbXBvcnQgVGltZUluZGljYXRvciBmcm9tICcuL1RpbWVJbmRpY2F0b3InO1xuaW1wb3J0IEl0ZW1zIGZyb20gJy4vSXRlbXMnO1xuaW1wb3J0IEtleXNQcmV2aWV3IGZyb20gJy4vS2V5c1ByZXZpZXcnO1xuaW1wb3J0IFByb3BlcnRpZXMgZnJvbSAnLi9Qcm9wZXJ0aWVzJztcbmltcG9ydCBLZXlzIGZyb20gJy4vS2V5cyc7XG5pbXBvcnQgRXJyb3JzIGZyb20gJy4vRXJyb3JzJztcbmltcG9ydCBTZWxlY3Rpb24gZnJvbSAnLi9TZWxlY3Rpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lbGluZSB7XG4gIGNvbnN0cnVjdG9yKGVkaXRvciwgb3B0aW9ucykge1xuICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgIHRoaXMudHdlZW5UaW1lID0gdGhpcy5lZGl0b3IudHdlZW5UaW1lO1xuICAgIHRoaXMudGltZXIgPSB0aGlzLnR3ZWVuVGltZS50aW1lcjtcbiAgICB0aGlzLnNlbGVjdGlvbk1hbmFnZXIgPSB0aGlzLmVkaXRvci5zZWxlY3Rpb25NYW5hZ2VyO1xuXG4gICAgdGhpcy5faXNEaXJ0eSA9IHRydWU7XG4gICAgdGhpcy50aW1lciA9IHRoaXMudHdlZW5UaW1lLnRpbWVyO1xuICAgIHRoaXMuY3VycmVudFRpbWUgPSB0aGlzLnRpbWVyLnRpbWU7IC8vIHVzZWQgaW4gdGltZWluZGljYXRvci5cblxuICAgIHRoaXMub25VcGRhdGUgPSB0aGlzLm9uVXBkYXRlLmJpbmQodGhpcyk7XG5cbiAgICAvLyBNYWtlIHRoZSBkb21haW4gY292ZXIgMjAlIG9mIHRoZSB0b3RhbER1YXRpb24gYnkgZGVmYXVsdC5cbiAgICB0aGlzLmluaXRpYWxEb21haW4gPSBbXTtcbiAgICB0aGlzLmluaXRpYWxEb21haW5bMF0gPSBvcHRpb25zLmRvbWFpblN0YXJ0IHx8IDA7XG4gICAgdGhpcy5pbml0aWFsRG9tYWluWzFdID0gb3B0aW9ucy5kb21haW5FbmQgfHwgdGhpcy50aW1lci50b3RhbER1cmF0aW9uICogMC4yO1xuXG4gICAgLy8gQWRhcHQgdGltZSB0byBiZSBncmVhdGVyIG9yIGVxdWFsIHRvIGRvbWFpblN0YXJ0LlxuICAgIGlmICh0aGlzLmluaXRpYWxEb21haW5bMF0gPiB0aGlzLnRpbWVyLmdldEN1cnJlbnRUaW1lKCkpIHtcbiAgICAgIHRoaXMudGltZXIudGltZVswXSA9IHRoaXMuaW5pdGlhbERvbWFpblswXTtcbiAgICB9XG5cbiAgICB2YXIgbWFyZ2luID0ge3RvcDogNiwgcmlnaHQ6IDIwLCBib3R0b206IDAsIGxlZnQ6IDI2NX07XG4gICAgdGhpcy5tYXJnaW4gPSBtYXJnaW47XG5cbiAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xuICAgIHZhciBoZWlnaHQgPSAyNzAgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbSAtIDQwO1xuICAgIHRoaXMubGluZUhlaWdodCA9IDIwO1xuICAgIHRoaXMubGFiZWxfcG9zaXRpb25feCA9IC1tYXJnaW4ubGVmdCArIDIwO1xuXG4gICAgdGhpcy54ID0gZDMudGltZS5zY2FsZSgpXG4gICAgICAuZG9tYWluKHRoaXMuaW5pdGlhbERvbWFpbilcbiAgICAgIC5yYW5nZShbMCwgd2lkdGhdKTtcblxuICAgIHRoaXMueEF4aXMgPSBkMy5zdmcuYXhpcygpXG4gICAgICAuc2NhbGUodGhpcy54KVxuICAgICAgLm9yaWVudCgndG9wJylcbiAgICAgIC50aWNrU2l6ZSgtaGVpZ2h0LCAwKVxuICAgICAgLnRpY2tGb3JtYXQoVXRpbHMuZm9ybWF0TWludXRlcyk7XG5cbiAgICB0aGlzLnN2ZyA9IGQzLnNlbGVjdChlZGl0b3IuJHRpbWVsaW5lLmdldCgwKSkuc2VsZWN0KCcudGltZWxpbmVfX21haW4nKS5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCB3aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIDYwMCk7XG5cbiAgICB0aGlzLnN2Z0NvbnRhaW5lciA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgbWFyZ2luLmxlZnQgKyAnLCcgKyBtYXJnaW4udG9wICsgJyknKTtcblxuICAgIHRoaXMuc3ZnQ29udGFpbmVyVGltZSA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgbWFyZ2luLmxlZnQgKyAnLDApJyk7XG5cbiAgICB0aGlzLmxpbmVzQ29udGFpbmVyID0gdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBtYXJnaW4ubGVmdCArICcsJyArIG1hcmdpbi50b3AgKyAnKScpO1xuXG4gICAgdGhpcy5oZWFkZXIgPSBuZXcgSGVhZGVyKGVkaXRvciwgdGhpcy50aW1lciwgdGhpcy5pbml0aWFsRG9tYWluLCB0aGlzLnR3ZWVuVGltZSwgd2lkdGgsIG1hcmdpbik7XG4gICAgdGhpcy50aW1lSW5kaWNhdG9yID0gbmV3IFRpbWVJbmRpY2F0b3IodGhpcywgdGhpcy5zdmdDb250YWluZXJUaW1lKTtcblxuICAgIHRoaXMuc2VsZWN0aW9uID0gbmV3IFNlbGVjdGlvbih0aGlzLCB0aGlzLnN2ZywgbWFyZ2luKTtcblxuICAgIHRoaXMuaXRlbXMgPSBuZXcgSXRlbXModGhpcywgdGhpcy5saW5lc0NvbnRhaW5lcik7XG4gICAgdGhpcy5pdGVtcy5vblVwZGF0ZS5hZGQodGhpcy5vblVwZGF0ZSk7XG4gICAgdGhpcy5rZXlzUHJldmlldyA9IG5ldyBLZXlzUHJldmlldyh0aGlzLCB0aGlzLmxpbmVzQ29udGFpbmVyKTtcblxuICAgIHRoaXMucHJvcGVydGllcyA9IG5ldyBQcm9wZXJ0aWVzKHRoaXMpO1xuICAgIHRoaXMucHJvcGVydGllcy5vbktleUFkZGVkLmFkZCgobmV3S2V5LCBrZXlDb250YWluZXIpID0+IHtcbiAgICAgIHRoaXMuX2lzRGlydHkgPSB0cnVlO1xuICAgICAgLy8gcmVuZGVyIHRoZSB0aW1lbGluZSBkaXJlY3RseSBzbyB0aGF0IHdlIGNhbiBkaXJlY3RseSBzZWxlY3RcbiAgICAgIC8vIHRoZSBuZXcga2V5IHdpdGggaXQncyBkb21FbGVtZW50LlxuICAgICAgdGhpcy5yZW5kZXIoMCwgZmFsc2UpO1xuICAgICAgdGhpcy5rZXlzLnNlbGVjdE5ld0tleShuZXdLZXksIGtleUNvbnRhaW5lcik7XG4gICAgfSk7XG4gICAgdGhpcy5lcnJvcnMgPSBuZXcgRXJyb3JzKHRoaXMpO1xuICAgIHRoaXMua2V5cyA9IG5ldyBLZXlzKHRoaXMpO1xuICAgIHRoaXMua2V5cy5vbktleVVwZGF0ZWQuYWRkKCgpID0+IHtcbiAgICAgIHRoaXMub25VcGRhdGUoKTtcbiAgICB9KTtcblxuICAgIHRoaXMueEF4aXNHcmlkID0gZDMuc3ZnLmF4aXMoKVxuICAgICAgLnNjYWxlKHRoaXMueClcbiAgICAgIC50aWNrcygxMDApXG4gICAgICAudGlja1NpemUoLXRoaXMuaXRlbXMuZHksIDApXG4gICAgICAudGlja0Zvcm1hdCgnJylcbiAgICAgIC5vcmllbnQoJ3RvcCcpO1xuXG4gICAgdGhpcy54R3JpZCA9IHRoaXMuc3ZnQ29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAneCBheGlzIGdyaWQnKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnICsgbWFyZ2luLnRvcCArICcpJylcbiAgICAgIC5jYWxsKHRoaXMueEF4aXNHcmlkKTtcblxuICAgIHRoaXMueEF4aXNFbGVtZW50ID0gdGhpcy5zdmdDb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICd4IGF4aXMnKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnICsgbWFyZ2luLnRvcCArICcpJylcbiAgICAgIC5jYWxsKHRoaXMueEF4aXMpO1xuXG4gICAgdGhpcy5oZWFkZXIub25CcnVzaC5hZGQoKGV4dGVudCkgPT4ge1xuICAgICAgdGhpcy54LmRvbWFpbihleHRlbnQpO1xuICAgICAgdGhpcy54R3JpZC5jYWxsKHRoaXMueEF4aXNHcmlkKTtcbiAgICAgIHRoaXMueEF4aXNFbGVtZW50LmNhbGwodGhpcy54QXhpcyk7XG4gICAgICB0aGlzLl9pc0RpcnR5ID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIC8vIEZpcnN0IHJlbmRlclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge3RoaXMucmVuZGVyKCk7fSk7XG5cbiAgICB3aW5kb3cub25yZXNpemUgPSAoKSA9PiB7XG4gICAgICB2YXIgSU5ORVJfV0lEVEggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIHZhciB3aWR0aDIgPSBJTk5FUl9XSURUSCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xuICAgICAgdGhpcy5zdmcuYXR0cignd2lkdGgnLCB3aWR0aDIgKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodCk7XG4gICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoJy50aW1lbGluZV9fcmlnaHQtbWFzaycpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIElOTkVSX1dJRFRIKTtcbiAgICAgIHRoaXMueC5yYW5nZShbMCwgd2lkdGgyXSk7XG5cbiAgICAgIHRoaXMuX2lzRGlydHkgPSB0cnVlO1xuICAgICAgdGhpcy5oZWFkZXIucmVzaXplKElOTkVSX1dJRFRIKTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfTtcbiAgfVxuXG4gIG9uVXBkYXRlKCkge1xuICAgIHRoaXMuZWRpdG9yLnJlbmRlcihmYWxzZSwgZmFsc2UsIHRydWUpO1xuICB9XG5cbiAgcmVuZGVyKHRpbWUsIHRpbWVfY2hhbmdlZCkge1xuICAgIGlmICh0aW1lX2NoYW5nZWQpIHtcbiAgICAgIHZhciBkb21haW5MZW5ndGg7XG4gICAgICAvLyBVcGRhdGUgY3VycmVudCBkb21haW4gd2hlbiBwbGF5aW5nIHRvIGtlZXAgdGltZSBpbmRpY2F0b3IgaW4gdmlldy5cbiAgICAgIHZhciBtYXJnaW5fbXMgPSAxNjtcbiAgICAgIGlmICh0aGlzLnRpbWVyLmdldEN1cnJlbnRUaW1lKCkgPiB0aGlzLmluaXRpYWxEb21haW5bMV0pIHtcbiAgICAgICAgZG9tYWluTGVuZ3RoID0gdGhpcy5pbml0aWFsRG9tYWluWzFdIC0gdGhpcy5pbml0aWFsRG9tYWluWzBdO1xuICAgICAgICB0aGlzLmluaXRpYWxEb21haW5bMF0gKz0gZG9tYWluTGVuZ3RoIC0gbWFyZ2luX21zO1xuICAgICAgICB0aGlzLmluaXRpYWxEb21haW5bMV0gKz0gZG9tYWluTGVuZ3RoIC0gbWFyZ2luX21zO1xuICAgICAgICB0aGlzLmhlYWRlci5zZXREb21haW4odGhpcy5pbml0aWFsRG9tYWluKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnRpbWVyLmdldEN1cnJlbnRUaW1lKCkgPCB0aGlzLmluaXRpYWxEb21haW5bMF0pIHtcbiAgICAgICAgZG9tYWluTGVuZ3RoID0gdGhpcy5pbml0aWFsRG9tYWluWzFdIC0gdGhpcy5pbml0aWFsRG9tYWluWzBdO1xuICAgICAgICB0aGlzLmluaXRpYWxEb21haW5bMF0gPSB0aGlzLnRpbWVyLmdldEN1cnJlbnRUaW1lKCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbERvbWFpblsxXSA9IHRoaXMuaW5pdGlhbERvbWFpblswXSArIGRvbWFpbkxlbmd0aDtcbiAgICAgICAgdGhpcy5oZWFkZXIuc2V0RG9tYWluKHRoaXMuaW5pdGlhbERvbWFpbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2lzRGlydHkgfHwgdGltZV9jaGFuZ2VkKSB7XG4gICAgICAvLyBSZW5kZXIgaGVhZGVyIGFuZCB0aW1lIGluZGljYXRvciBldmVyeXRpbWUgdGhlIHRpbWUgY2hhbmdlZC5cbiAgICAgIHRoaXMuaGVhZGVyLnJlbmRlcigpO1xuICAgICAgdGhpcy50aW1lSW5kaWNhdG9yLnJlbmRlcigpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9pc0RpcnR5KSB7XG4gICAgICAvLyBObyBuZWVkIHRvIGNhbGwgdGhpcyBvbiBlYWNoIGZyYW1lcywgYnV0IG9ubHkgb24gYnJ1c2gsIGtleSBkcmFnLCAuLi5cbiAgICAgIHZhciBiYXIgPSB0aGlzLml0ZW1zLnJlbmRlcigpO1xuICAgICAgdGhpcy5rZXlzUHJldmlldy5yZW5kZXIoYmFyKTtcbiAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5wcm9wZXJ0aWVzLnJlbmRlcihiYXIpO1xuICAgICAgdGhpcy5lcnJvcnMucmVuZGVyKHByb3BlcnRpZXMpO1xuICAgICAgdGhpcy5rZXlzLnJlbmRlcihwcm9wZXJ0aWVzKTtcbiAgICAgIHRoaXMuX2lzRGlydHkgPSBmYWxzZTtcblxuICAgICAgLy8gQWRhcHQgdGhlIHRpbWVsaW5lIGhlaWdodC5cbiAgICAgIHZhciBoZWlnaHQgPSBNYXRoLm1heCh0aGlzLml0ZW1zLmR5ICsgMzAsIDIzMCk7XG4gICAgICB0aGlzLnhBeGlzLnRpY2tTaXplKC1oZWlnaHQsIDApO1xuICAgICAgdGhpcy54QXhpc0dyaWQudGlja1NpemUoLWhlaWdodCwgMCk7XG4gICAgICB0aGlzLnhHcmlkLmNhbGwodGhpcy54QXhpc0dyaWQpO1xuICAgICAgdGhpcy54QXhpc0VsZW1lbnQuY2FsbCh0aGlzLnhBeGlzKTtcbiAgICAgIHRoaXMuc3ZnLmF0dHIoJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgICB0aGlzLnRpbWVJbmRpY2F0b3IudXBkYXRlSGVpZ2h0KGhlaWdodCk7XG4gICAgfVxuICB9XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2dyYXBoL1RpbWVsaW5lLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");
=======
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Utils = __webpack_require__(1);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	var _Header = __webpack_require__(12);
	
	var _Header2 = _interopRequireDefault(_Header);
	
	var _TimeIndicator = __webpack_require__(14);
	
	var _TimeIndicator2 = _interopRequireDefault(_TimeIndicator);
	
	var _Items = __webpack_require__(15);
	
	var _Items2 = _interopRequireDefault(_Items);
	
	var _KeysPreview = __webpack_require__(16);
	
	var _KeysPreview2 = _interopRequireDefault(_KeysPreview);
	
	var _Properties = __webpack_require__(17);
	
	var _Properties2 = _interopRequireDefault(_Properties);
	
	var _Keys = __webpack_require__(18);
	
	var _Keys2 = _interopRequireDefault(_Keys);
	
	var _Errors = __webpack_require__(19);
	
	var _Errors2 = _interopRequireDefault(_Errors);
	
	var _Selection = __webpack_require__(20);
	
	var _Selection2 = _interopRequireDefault(_Selection);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var d3 = __webpack_require__(13);
	
	var Timeline = function () {
	  function Timeline(editor, options) {
	    var _this = this;
	
	    _classCallCheck(this, Timeline);
	
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
	
	    this.xAxis = d3.svg.axis().scale(this.x).orient('top').tickSize(-height, 0).tickFormat(_Utils2.default.formatMinutes);
	
	    this.svg = d3.select(editor.$timeline.get(0)).select('.timeline__main').append('svg').attr('width', width + margin.left + margin.right).attr('height', 600);
	
	    this.svgContainer = this.svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	
	    this.svgContainerTime = this.svg.append('g').attr('transform', 'translate(' + margin.left + ',0)');
	
	    this.linesContainer = this.svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	
	    this.header = new _Header2.default(editor, this.timer, this.initialDomain, this.tweenTime, width, margin);
	    this.timeIndicator = new _TimeIndicator2.default(this, this.svgContainerTime);
	
	    this.selection = new _Selection2.default(this, this.svg, margin);
	
	    this.items = new _Items2.default(this, this.linesContainer);
	    this.items.onUpdate.add(this.onUpdate);
	    this.keysPreview = new _KeysPreview2.default(this, this.linesContainer);
	
	    this.properties = new _Properties2.default(this);
	    this.properties.onKeyAdded.add(function (newKey, keyContainer) {
	      _this._isDirty = true;
	      // render the timeline directly so that we can directly select
	      // the new key with it's domElement.
	      _this.render(0, false);
	      _this.keys.selectNewKey(newKey, keyContainer);
	    });
	    this.errors = new _Errors2.default(this);
	    this.keys = new _Keys2.default(this);
	    this.keys.onKeyUpdated.add(function () {
	      _this.onUpdate();
	    });
	
	    this.xAxisGrid = d3.svg.axis().scale(this.x).ticks(100).tickSize(-this.items.dy, 0).tickFormat('').orient('top');
	
	    this.xGrid = this.svgContainer.append('g').attr('class', 'x axis grid').attr('transform', 'translate(0,' + margin.top + ')').call(this.xAxisGrid);
	
	    this.xAxisElement = this.svgContainer.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + margin.top + ')').call(this.xAxis);
	
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
	      var width2 = INNER_WIDTH - margin.left - margin.right;
	      _this.svg.attr('width', width2 + margin.left + margin.right);
	      _this.svg.selectAll('.timeline__right-mask').attr('width', INNER_WIDTH);
	      _this.x.range([0, width2]);
	
	      _this._isDirty = true;
	      _this.header.resize(INNER_WIDTH);
	      _this.render();
	    };
	  }
	
	  _createClass(Timeline, [{
	    key: 'onUpdate',
	    value: function onUpdate() {
	      this.editor.render(false, false, true);
	    }
	  }, {
	    key: 'render',
	    value: function render(time, time_changed) {
	      if (time_changed) {
	        var domainLength;
	        // Update current domain when playing to keep time indicator in view.
	        var margin_ms = 16;
	        if (this.timer.getCurrentTime() > this.initialDomain[1]) {
	          domainLength = this.initialDomain[1] - this.initialDomain[0];
	          this.initialDomain[0] += domainLength - margin_ms;
	          this.initialDomain[1] += domainLength - margin_ms;
	          this.header.setDomain(this.initialDomain);
	        }
	        if (this.timer.getCurrentTime() < this.initialDomain[0]) {
	          domainLength = this.initialDomain[1] - this.initialDomain[0];
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
	        this.svg.attr('height', height);
	        this.timeIndicator.updateHeight(height);
	      }
	    }
	  }]);
	
	  return Timeline;
	}();
	
	exports.default = Timeline;
>>>>>>> master

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _Utils = __webpack_require__(1);\n\nvar _Utils2 = _interopRequireDefault(_Utils);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar d3 = __webpack_require__(9);\n\nvar Signals = __webpack_require__(3);\n\nvar Header = function () {\n  function Header(editor, timer, initialDomain, tweenTime, width, margin) {\n    _classCallCheck(this, Header);\n\n    this.timer = timer;\n    this.initialDomain = initialDomain;\n    this.tweenTime = tweenTime;\n\n    this.onBrush = new Signals.Signal();\n    this.margin = { top: 10, right: 20, bottom: 0, left: margin.left };\n    this.height = 50 - this.margin.top - this.margin.bottom + 20;\n\n    this.currentTime = this.timer.time;\n    this.x = d3.time.scale().range([0, width]);\n    this.x.domain([0, this.timer.totalDuration]);\n\n    // Same as this.x from timeline\n    this.xDisplayed = d3.time.scale().range([0, width]);\n    this.xDisplayed.domain(this.initialDomain);\n\n    this.xAxis = d3.svg.axis().scale(this.x).orient('top').tickSize(-5, 0).tickFormat(_Utils2.default.formatMinutes);\n\n    this.svg = d3.select(editor.$timeline.get(0)).select('.timeline__header').append('svg').attr('width', width + this.margin.left + this.margin.right).attr('height', 56);\n\n    this.svgContainer = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');\n\n    this.createBrushHandle();\n    this.createTimeHandle();\n    this.timer.durationChanged.add(this.onDurationChanged);\n  }\n\n  _createClass(Header, [{\n    key: 'adaptDomainToDuration',\n    value: function adaptDomainToDuration(domain, seconds) {\n      var ms = seconds * 1000;\n      var new_domain = [domain[0], domain[1]];\n      // Make the domain smaller or equal to ms.\n      new_domain[0] = Math.min(new_domain[0], ms);\n      new_domain[1] = Math.min(new_domain[1], ms);\n      // Should not go below 0.\n      new_domain[0] = Math.max(new_domain[0], 0);\n\n      return new_domain;\n    }\n  }, {\n    key: 'setDomain',\n    value: function setDomain() {\n      this.brush.x(this.x).extent(this.initialDomain);\n      this.svgContainer.select('.brush').call(this.brush);\n      // Same as onBrush\n      this.onBrush.dispatch(this.initialDomain);\n      this.render();\n      this.xDisplayed.domain(this.initialDomain);\n    }\n  }, {\n    key: 'onDurationChanged',\n    value: function onDurationChanged(seconds) {\n      this.x.domain([0, this.timer.totalDuration]);\n      this.xAxisElement.call(this.xAxis);\n      this.initialDomain = this.adaptDomainToDuration(this.initialDomain, seconds);\n      this.setDomain(this.initialDomain);\n    }\n  }, {\n    key: 'createBrushHandle',\n    value: function createBrushHandle() {\n      var _this = this;\n\n      this.xAxisElement = this.svgContainer.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + (this.margin.top + 7) + ')').call(this.xAxis);\n\n      var onBrush = function onBrush() {\n        var extent0 = _this.brush.extent();\n        // Get domain as milliseconds and not date.\n        var start = extent0[0].getTime();\n        var end = extent0[1].getTime();\n        // Set the initial domain.\n        _this.initialDomain[0] = start;\n        _this.initialDomain[1] = end;\n        _this.setDomain(_this.initialDomain);\n      };\n\n      this.brush = d3.svg.brush().x(this.x).extent(this.initialDomain).on('brush', onBrush);\n\n      this.gBrush = this.svgContainer.append('g').attr('class', 'brush').call(this.brush).selectAll('rect').attr('height', 20);\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      var timeSelection = this.svgContainer.selectAll('.time-indicator');\n      timeSelection.attr('transform', 'translate(' + this.xDisplayed(this.currentTime[0]) + ', 25)');\n    }\n  }, {\n    key: 'createTimeHandle',\n    value: function createTimeHandle() {\n      var self = this;\n\n      var dragTimeMove = function dragTimeMove() {\n        var event = d3.event.sourceEvent;\n        event.stopPropagation();\n        var tweenTime = self.tweenTime;\n        var event_x = event.x !== undefined ? event.x : event.clientX;\n        var dx = self.xDisplayed.invert(event_x - self.margin.left);\n        dx = dx.getTime();\n        dx = Math.max(0, dx);\n\n        var timeMatch = false;\n        if (event.shiftKey) {\n          var time = dx / 1000;\n          timeMatch = _Utils2.default.getClosestTime(tweenTime.data, time, '---non-existant', false, false, 0.3);\n          if (timeMatch !== false) {\n            timeMatch = timeMatch * 1000;\n          }\n        }\n        if (timeMatch === false) {\n          timeMatch = dx;\n        }\n        self.timer.seek([timeMatch]);\n      };\n\n      var dragTime = d3.behavior.drag().origin(function (d) {\n        return d;\n      }).on('drag', dragTimeMove);\n\n      var timeSelection = this.svgContainer.selectAll('.time-indicator').data(this.currentTime);\n\n      timeSelection.enter().append('rect').attr('x', 0).attr('y', 20).attr('width', self.xDisplayed(self.timer.totalDuration)).attr('height', 50).attr('fill-opacity', 0).on('click', function () {\n        var mouse = d3.mouse(this);\n        var dx = self.xDisplayed.invert(mouse[0]);\n        dx = dx.getTime();\n        dx = Math.max(0, dx);\n        self.timer.seek([dx]);\n      });\n\n      var timeGrp = timeSelection.enter().append('g').attr('class', 'time-indicator').attr('transform', 'translate(-0.5,' + 30 + ')').call(dragTime);\n\n      timeGrp.append('rect').attr('class', 'time-indicator__line').attr('x', -0.5).attr('y', 0).attr('width', 1).attr('height', 1000);\n\n      timeGrp.append('path').attr('class', 'time-indicator__handle').attr('d', 'M -5 -3 L -5 5 L 0 10 L 5 5 L 5 -3 L -5 -3');\n\n      // Mask time indicator\n      // todo: remove the mask.\n      this.svgContainer.append('rect').attr('class', 'graph-mask').attr('x', -self.margin.left).attr('y', -self.margin.top).attr('width', self.margin.left - 5).attr('height', self.height);\n    }\n  }, {\n    key: 'resize',\n    value: function resize(width) {\n      var width2 = width - this.margin.left - this.margin.right;\n      this.svg.attr('width', width2 + this.margin.left + this.margin.right);\n\n      this.x.range([0, width2]);\n      this.xDisplayed.range([0, width2]);\n      this.xAxisElement.call(this.xAxis);\n    }\n  }]);\n\n  return Header;\n}();\n\nexports.default = Header;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ncmFwaC9IZWFkZXIuanM/YWU2OSJdLCJuYW1lcyI6WyJkMyIsInJlcXVpcmUiLCJTaWduYWxzIiwiSGVhZGVyIiwiZWRpdG9yIiwidGltZXIiLCJpbml0aWFsRG9tYWluIiwidHdlZW5UaW1lIiwid2lkdGgiLCJtYXJnaW4iLCJvbkJydXNoIiwiU2lnbmFsIiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0IiwiaGVpZ2h0IiwiY3VycmVudFRpbWUiLCJ0aW1lIiwieCIsInNjYWxlIiwicmFuZ2UiLCJkb21haW4iLCJ0b3RhbER1cmF0aW9uIiwieERpc3BsYXllZCIsInhBeGlzIiwic3ZnIiwiYXhpcyIsIm9yaWVudCIsInRpY2tTaXplIiwidGlja0Zvcm1hdCIsImZvcm1hdE1pbnV0ZXMiLCJzZWxlY3QiLCIkdGltZWxpbmUiLCJnZXQiLCJhcHBlbmQiLCJhdHRyIiwic3ZnQ29udGFpbmVyIiwiY3JlYXRlQnJ1c2hIYW5kbGUiLCJjcmVhdGVUaW1lSGFuZGxlIiwiZHVyYXRpb25DaGFuZ2VkIiwiYWRkIiwib25EdXJhdGlvbkNoYW5nZWQiLCJzZWNvbmRzIiwibXMiLCJuZXdfZG9tYWluIiwiTWF0aCIsIm1pbiIsIm1heCIsImJydXNoIiwiZXh0ZW50IiwiY2FsbCIsImRpc3BhdGNoIiwicmVuZGVyIiwieEF4aXNFbGVtZW50IiwiYWRhcHREb21haW5Ub0R1cmF0aW9uIiwic2V0RG9tYWluIiwiZXh0ZW50MCIsInN0YXJ0IiwiZ2V0VGltZSIsImVuZCIsIm9uIiwiZ0JydXNoIiwic2VsZWN0QWxsIiwidGltZVNlbGVjdGlvbiIsInNlbGYiLCJkcmFnVGltZU1vdmUiLCJldmVudCIsInNvdXJjZUV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwiZXZlbnRfeCIsInVuZGVmaW5lZCIsImNsaWVudFgiLCJkeCIsImludmVydCIsInRpbWVNYXRjaCIsInNoaWZ0S2V5IiwiZ2V0Q2xvc2VzdFRpbWUiLCJkYXRhIiwic2VlayIsImRyYWdUaW1lIiwiYmVoYXZpb3IiLCJkcmFnIiwib3JpZ2luIiwiZCIsImVudGVyIiwibW91c2UiLCJ0aW1lR3JwIiwid2lkdGgyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUdBOzs7Ozs7OztBQUhBLElBQUlBLEtBQUssbUJBQUFDLENBQVEsQ0FBUixDQUFUOztBQUVBLElBQUlDLFVBQVUsbUJBQUFELENBQVEsQ0FBUixDQUFkOztJQUdxQkUsTTtBQUNuQixrQkFBWUMsTUFBWixFQUFvQkMsS0FBcEIsRUFBMkJDLGFBQTNCLEVBQTBDQyxTQUExQyxFQUFxREMsS0FBckQsRUFBNERDLE1BQTVELEVBQW9FO0FBQUE7O0FBQ2xFLFNBQUtKLEtBQUwsR0FBYUEsS0FBYjtBQUNBLFNBQUtDLGFBQUwsR0FBcUJBLGFBQXJCO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQkEsU0FBakI7O0FBRUEsU0FBS0csT0FBTCxHQUFlLElBQUlSLFFBQVFTLE1BQVosRUFBZjtBQUNBLFNBQUtGLE1BQUwsR0FBYyxFQUFDRyxLQUFLLEVBQU4sRUFBVUMsT0FBTyxFQUFqQixFQUFxQkMsUUFBUSxDQUE3QixFQUFnQ0MsTUFBTU4sT0FBT00sSUFBN0MsRUFBZDtBQUNBLFNBQUtDLE1BQUwsR0FBYyxLQUFLLEtBQUtQLE1BQUwsQ0FBWUcsR0FBakIsR0FBdUIsS0FBS0gsTUFBTCxDQUFZSyxNQUFuQyxHQUE0QyxFQUExRDs7QUFFQSxTQUFLRyxXQUFMLEdBQW1CLEtBQUtaLEtBQUwsQ0FBV2EsSUFBOUI7QUFDQSxTQUFLQyxDQUFMLEdBQVNuQixHQUFHa0IsSUFBSCxDQUFRRSxLQUFSLEdBQWdCQyxLQUFoQixDQUFzQixDQUFDLENBQUQsRUFBSWIsS0FBSixDQUF0QixDQUFUO0FBQ0EsU0FBS1csQ0FBTCxDQUFPRyxNQUFQLENBQWMsQ0FBQyxDQUFELEVBQUksS0FBS2pCLEtBQUwsQ0FBV2tCLGFBQWYsQ0FBZDs7QUFFQTtBQUNBLFNBQUtDLFVBQUwsR0FBa0J4QixHQUFHa0IsSUFBSCxDQUFRRSxLQUFSLEdBQWdCQyxLQUFoQixDQUFzQixD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V0FBS2xDLFlBQUwsQ0FBa0JILElBQWxCLENBQXVCLEtBQUsxQixLQUE1QjtBQUNEOzs7Ozs7a0JBbkxrQnRCLE0iLCJmaWxlIjoiOC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBkMyA9IHJlcXVpcmUoJ2QzJyk7XG5cbmxldCBTaWduYWxzID0gcmVxdWlyZSgnanMtc2lnbmFscycpO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2NvcmUvVXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkZXIge1xuICBjb25zdHJ1Y3RvcihlZGl0b3IsIHRpbWVyLCBpbml0aWFsRG9tYWluLCB0d2VlblRpbWUsIHdpZHRoLCBtYXJnaW4pIHtcbiAgICB0aGlzLnRpbWVyID0gdGltZXI7XG4gICAgdGhpcy5pbml0aWFsRG9tYWluID0gaW5pdGlhbERvbWFpbjtcbiAgICB0aGlzLnR3ZWVuVGltZSA9IHR3ZWVuVGltZTtcblxuICAgIHRoaXMub25CcnVzaCA9IG5ldyBTaWduYWxzLlNpZ25hbCgpO1xuICAgIHRoaXMubWFyZ2luID0ge3RvcDogMTAsIHJpZ2h0OiAyMCwgYm90dG9tOiAwLCBsZWZ0OiBtYXJnaW4ubGVmdH07XG4gICAgdGhpcy5oZWlnaHQgPSA1MCAtIHRoaXMubWFyZ2luLnRvcCAtIHRoaXMubWFyZ2luLmJvdHRvbSArIDIwO1xuXG4gICAgdGhpcy5jdXJyZW50VGltZSA9IHRoaXMudGltZXIudGltZTtcbiAgICB0aGlzLnggPSBkMy50aW1lLnNjYWxlKCkucmFuZ2UoWzAsIHdpZHRoXSk7XG4gICAgdGhpcy54LmRvbWFpbihbMCwgdGhpcy50aW1lci50b3RhbER1cmF0aW9uXSk7XG5cbiAgICAvLyBTYW1lIGFzIHRoaXMueCBmcm9tIHRpbWVsaW5lXG4gICAgdGhpcy54RGlzcGxheWVkID0gZDMudGltZS5zY2FsZSgpLnJhbmdlKFswLCB3aWR0aF0pO1xuICAgIHRoaXMueERpc3BsYXllZC5kb21haW4odGhpcy5pbml0aWFsRG9tYWluKTtcblxuICAgIHRoaXMueEF4aXMgPSBkMy5zdmcuYXhpcygpXG4gICAgICAuc2NhbGUodGhpcy54KVxuICAgICAgLm9yaWVudCgndG9wJylcbiAgICAgIC50aWNrU2l6ZSgtNSwgMClcbiAgICAgIC50aWNrRm9ybWF0KFV0aWxzLmZvcm1hdE1pbnV0ZXMpO1xuXG4gICAgdGhpcy5zdmcgPSBkMy5zZWxlY3QoZWRpdG9yLiR0aW1lbGluZS5nZXQoMCkpLnNlbGVjdCgnLnRpbWVsaW5lX19oZWFkZXInKS5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCB3aWR0aCArIHRoaXMubWFyZ2luLmxlZnQgKyB0aGlzLm1hcmdpbi5yaWdodClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCA1Nik7XG5cbiAgICB0aGlzLnN2Z0NvbnRhaW5lciA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgdGhpcy5tYXJnaW4ubGVmdCArICcsJyArIHRoaXMubWFyZ2luLnRvcCArICcpJyk7XG5cbiAgICB0aGlzLmNyZWF0ZUJydXNoSGFuZGxlKCk7XG4gICAgdGhpcy5jcmVhdGVUaW1lSGFuZGxlKCk7XG4gICAgdGhpcy50aW1lci5kdXJhdGlvbkNoYW5nZWQuYWRkKHRoaXMub25EdXJhdGlvbkNoYW5nZWQpO1xuICB9XG5cbiAgYWRhcHREb21haW5Ub0R1cmF0aW9uKGRvbWFpbiwgc2Vjb25kcykge1xuICAgIHZhciBtcyA9IHNlY29uZHMgKiAxMDAwO1xuICAgIHZhciBuZXdfZG9tYWluID0gW2RvbWFpblswXSwgZG9tYWluWzFdXTtcbiAgICAvLyBNYWtlIHRoZSBkb21haW4gc21hbGxlciBvciBlcXVhbCB0byBtcy5cbiAgICBuZXdfZG9tYWluWzBdID0gTWF0aC5taW4obmV3X2RvbWFpblswXSwgbXMpO1xuICAgIG5ld19kb21haW5bMV0gPSBNYXRoLm1pbihuZXdfZG9tYWluWzFdLCBtcyk7XG4gICAgLy8gU2hvdWxkIG5vdCBnbyBiZWxvdyAwLlxuICAgIG5ld19kb21haW5bMF0gPSBNYXRoLm1heChuZXdfZG9tYWluWzBdLCAwKTtcblxuICAgIHJldHVybiBuZXdfZG9tYWluO1xuICB9XG5cbiAgc2V0RG9tYWluKCkge1xuICAgIHRoaXMuYnJ1c2gueCh0aGlzLngpLmV4dGVudCh0aGlzLmluaXRpYWxEb21haW4pO1xuICAgIHRoaXMuc3ZnQ29udGFpbmVyLnNlbGVjdCgnLmJydXNoJykuY2FsbCh0aGlzLmJydXNoKTtcbiAgICAvLyBTYW1lIGFzIG9uQnJ1c2hcbiAgICB0aGlzLm9uQnJ1c2guZGlzcGF0Y2godGhpcy5pbml0aWFsRG9tYWluKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRoaXMueERpc3BsYXllZC5kb21haW4odGhpcy5pbml0aWFsRG9tYWluKTtcbiAgfVxuXG4gIG9uRHVyYXRpb25DaGFuZ2VkKHNlY29uZHMpIHtcbiAgICB0aGlzLnguZG9tYWluKFswLCB0aGlzLnRpbWVyLnRvdGFsRHVyYXRpb25dKTtcbiAgICB0aGlzLnhBeGlzRWxlbWVudC5jYWxsKHRoaXMueEF4aXMpO1xuICAgIHRoaXMuaW5pdGlhbERvbWFpbiA9IHRoaXMuYWRhcHREb21haW5Ub0R1cmF0aW9uKHRoaXMuaW5pdGlhbERvbWFpbiwgc2Vjb25kcyk7XG4gICAgdGhpcy5zZXREb21haW4odGhpcy5pbml0aWFsRG9tYWluKTtcbiAgfVxuXG4gIGNyZWF0ZUJydXNoSGFuZGxlKCkge1xuICAgIHRoaXMueEF4aXNFbGVtZW50ID0gdGhpcy5zdmdDb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICd4IGF4aXMnKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnICsgKHRoaXMubWFyZ2luLnRvcCArIDcpICsgJyknKVxuICAgICAgLmNhbGwodGhpcy54QXhpcyk7XG5cbiAgICB2YXIgb25CcnVzaCA9ICgpID0+IHtcbiAgICAgIHZhciBleHRlbnQwID0gdGhpcy5icnVzaC5leHRlbnQoKTtcbiAgICAgIC8vIEdldCBkb21haW4gYXMgbWlsbGlzZWNvbmRzIGFuZCBub3QgZGF0ZS5cbiAgICAgIHZhciBzdGFydCA9IGV4dGVudDBbMF0uZ2V0VGltZSgpO1xuICAgICAgdmFyIGVuZCA9IGV4dGVudDBbMV0uZ2V0VGltZSgpO1xuICAgICAgLy8gU2V0IHRoZSBpbml0aWFsIGRvbWFpbi5cbiAgICAgIHRoaXMuaW5pdGlhbERvbWFpblswXSA9IHN0YXJ0O1xuICAgICAgdGhpcy5pbml0aWFsRG9tYWluWzFdID0gZW5kO1xuICAgICAgdGhpcy5zZXREb21haW4odGhpcy5pbml0aWFsRG9tYWluKTtcbiAgICB9O1xuXG4gICAgdGhpcy5icnVzaCA9IGQzLnN2Zy5icnVzaCgpXG4gICAgICAueCh0aGlzLngpXG4gICAgICAuZXh0ZW50KHRoaXMuaW5pdGlhbERvbWFpbilcbiAgICAgIC5vbignYnJ1c2gnLCBvbkJydXNoKTtcblxuICAgIHRoaXMuZ0JydXNoID0gdGhpcy5zdmdDb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdicnVzaCcpXG4gICAgICAuY2FsbCh0aGlzLmJydXNoKVxuICAgICAgLnNlbGVjdEFsbCgncmVjdCcpXG4gICAgICAuYXR0cignaGVpZ2h0JywgMjApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciB0aW1lU2VsZWN0aW9uID0gdGhpcy5zdmdDb250YWluZXIuc2VsZWN0QWxsKCcudGltZS1pbmRpY2F0b3InKTtcbiAgICB0aW1lU2VsZWN0aW9uLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIHRoaXMueERpc3BsYXllZCh0aGlzLmN1cnJlbnRUaW1lWzBdKSArICcsIDI1KScpO1xuICB9XG5cbiAgY3JlYXRlVGltZUhhbmRsZSgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgZHJhZ1RpbWVNb3ZlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZXZlbnQgPSBkMy5ldmVudC5zb3VyY2VFdmVudDtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgdmFyIHR3ZWVuVGltZSA9IHNlbGYudHdlZW5UaW1lO1xuICAgICAgdmFyIGV2ZW50X3ggPSBldmVudC54ICE9PSB1bmRlZmluZWQgPyBldmVudC54IDogZXZlbnQuY2xpZW50WDtcbiAgICAgIHZhciBkeCA9IHNlbGYueERpc3BsYXllZC5pbnZlcnQoZXZlbnRfeCAtIHNlbGYubWFyZ2luLmxlZnQpO1xuICAgICAgZHggPSBkeC5nZXRUaW1lKCk7XG4gICAgICBkeCA9IE1hdGgubWF4KDAsIGR4KTtcblxuICAgICAgdmFyIHRpbWVNYXRjaCA9IGZhbHNlO1xuICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIHZhciB0aW1lID0gZHggLyAxMDAwO1xuICAgICAgICB0aW1lTWF0Y2ggPSBVdGlscy5nZXRDbG9zZXN0VGltZSh0d2VlblRpbWUuZGF0YSwgdGltZSwgJy0tLW5vbi1leGlzdGFudCcsIGZhbHNlLCBmYWxzZSwgMC4zKTtcbiAgICAgICAgaWYgKHRpbWVNYXRjaCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICB0aW1lTWF0Y2ggPSB0aW1lTWF0Y2ggKiAxMDAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGltZU1hdGNoID09PSBmYWxzZSkge1xuICAgICAgICB0aW1lTWF0Y2ggPSBkeDtcbiAgICAgIH1cbiAgICAgIHNlbGYudGltZXIuc2VlayhbdGltZU1hdGNoXSk7XG4gICAgfTtcblxuICAgIHZhciBkcmFnVGltZSA9IGQzLmJlaGF2aW9yLmRyYWcoKVxuICAgICAgLm9yaWdpbihmdW5jdGlvbihkKSB7XG4gICAgICAgIHJldHVybiBkO1xuICAgICAgfSlcbiAgICAgIC5vbignZHJhZycsIGRyYWdUaW1lTW92ZSk7XG5cbiAgICB2YXIgdGltZVNlbGVjdGlvbiA9IHRoaXMuc3ZnQ29udGFpbmVyLnNlbGVjdEFsbCgnLnRpbWUtaW5kaWNhdG9yJykuZGF0YSh0aGlzLmN1cnJlbnRUaW1lKTtcblxuICAgIHRpbWVTZWxlY3Rpb24uZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ3gnLCAwKVxuICAgICAgLmF0dHIoJ3knLCAyMClcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHNlbGYueERpc3BsYXllZChzZWxmLnRpbWVyLnRvdGFsRHVyYXRpb24pKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIDUwKVxuICAgICAgLmF0dHIoJ2ZpbGwtb3BhY2l0eScsIDApXG4gICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtb3VzZSA9IGQzLm1vdXNlKHRoaXMpO1xuICAgICAgICB2YXIgZHggPSBzZWxmLnhEaXNwbGF5ZWQuaW52ZXJ0KG1vdXNlWzBdKTtcbiAgICAgICAgZHggPSBkeC5nZXRUaW1lKCk7XG4gICAgICAgIGR4ID0gTWF0aC5tYXgoMCwgZHgpO1xuICAgICAgICBzZWxmLnRpbWVyLnNlZWsoW2R4XSk7XG4gICAgICB9KTtcblxuICAgIHZhciB0aW1lR3JwID0gdGltZVNlbGVjdGlvbi5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAndGltZS1pbmRpY2F0b3InKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoLTAuNSwnICsgMzAgKyAnKScpXG4gICAgICAuY2FsbChkcmFnVGltZSk7XG5cbiAgICB0aW1lR3JwLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAndGltZS1pbmRpY2F0b3JfX2xpbmUnKVxuICAgICAgLmF0dHIoJ3gnLCAtMC41KVxuICAgICAgLmF0dHIoJ3knLCAwKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgMSlcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCAxMDAwKTtcblxuICAgIHRpbWVHcnAuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICd0aW1lLWluZGljYXRvcl9faGFuZGxlJylcbiAgICAgIC5hdHRyKCdkJywgJ00gLTUgLTMgTCAtNSA1IEwgMCAxMCBMIDUgNSBMIDUgLTMgTCAtNSAtMycpO1xuXG4gICAgLy8gTWFzayB0aW1lIGluZGljYXRvclxuICAgIC8vIHRvZG86IHJlbW92ZSB0aGUgbWFzay5cbiAgICB0aGlzLnN2Z0NvbnRhaW5lci5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dyYXBoLW1hc2snKVxuICAgICAgLmF0dHIoJ3gnLCAtc2VsZi5tYXJnaW4ubGVmdClcbiAgICAgIC5hdHRyKCd5JywgLXNlbGYubWFyZ2luLnRvcClcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHNlbGYubWFyZ2luLmxlZnQgLSA1KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIHNlbGYuaGVpZ2h0KTtcbiAgfVxuXG4gIHJlc2l6ZSh3aWR0aCkge1xuICAgIGxldCB3aWR0aDIgPSB3aWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodDtcbiAgICB0aGlzLnN2Zy5hdHRyKCd3aWR0aCcsIHdpZHRoMiArIHRoaXMubWFyZ2luLmxlZnQgKyB0aGlzLm1hcmdpbi5yaWdodCk7XG5cbiAgICB0aGlzLngucmFuZ2UoWzAsIHdpZHRoMl0pO1xuICAgIHRoaXMueERpc3BsYXllZC5yYW5nZShbMCwgd2lkdGgyXSk7XG4gICAgdGhpcy54QXhpc0VsZW1lbnQuY2FsbCh0aGlzLnhBeGlzKTtcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9ncmFwaC9IZWFkZXIuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9");
=======
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Utils = __webpack_require__(1);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var d3 = __webpack_require__(13);
	
	var Signals = __webpack_require__(5);
	
	var Header = function () {
	  function Header(editor, timer, initialDomain, tweenTime, width, margin) {
	    _classCallCheck(this, Header);
	
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
	
	    this.xAxis = d3.svg.axis().scale(this.x).orient('top').tickSize(-5, 0).tickFormat(_Utils2.default.formatMinutes);
	
	    this.svg = d3.select(editor.$timeline.get(0)).select('.timeline__header').append('svg').attr('width', width + this.margin.left + this.margin.right).attr('height', 56);
	
	    this.svgContainer = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
	
	    this.createBrushHandle();
	    this.createTimeHandle();
	    this.timer.durationChanged.add(this.onDurationChanged.bind(this));
	  }
	
	  _createClass(Header, [{
	    key: 'adaptDomainToDuration',
	    value: function adaptDomainToDuration(domain, seconds) {
	      var ms = seconds * 1000;
	      var new_domain = [domain[0], domain[1]];
	      // Make the domain smaller or equal to ms.
	      new_domain[0] = Math.min(new_domain[0], ms);
	      new_domain[1] = Math.min(new_domain[1], ms);
	      // Should not go below 0.
	      new_domain[0] = Math.max(new_domain[0], 0);
	
	      return new_domain;
	    }
	  }, {
	    key: 'setDomain',
	    value: function setDomain() {
	      this.brush.x(this.x).extent(this.initialDomain);
	      this.svgContainer.select('.brush').call(this.brush);
	      // Same as onBrush
	      this.onBrush.dispatch(this.initialDomain);
	      this.render();
	      this.xDisplayed.domain(this.initialDomain);
	    }
	  }, {
	    key: 'onDurationChanged',
	    value: function onDurationChanged(seconds) {
	      this.x.domain([0, this.timer.totalDuration]);
	      this.xAxisElement.call(this.xAxis);
	      this.initialDomain = this.adaptDomainToDuration(this.initialDomain, seconds);
	      this.setDomain(this.initialDomain);
	    }
	  }, {
	    key: 'createBrushHandle',
	    value: function createBrushHandle() {
	      var _this = this;
	
	      this.xAxisElement = this.svgContainer.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + (this.margin.top + 7) + ')').call(this.xAxis);
	
	      var onBrush = function onBrush() {
	        var extent0 = _this.brush.extent();
	        // Get domain as milliseconds and not date.
	        var start = extent0[0].getTime();
	        var end = extent0[1].getTime();
	        // Set the initial domain.
	        _this.initialDomain[0] = start;
	        _this.initialDomain[1] = end;
	        _this.setDomain(_this.initialDomain);
	      };
	
	      this.brush = d3.svg.brush().x(this.x).extent(this.initialDomain).on('brush', onBrush);
	
	      this.gBrush = this.svgContainer.append('g').attr('class', 'brush').call(this.brush).selectAll('rect').attr('height', 20);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var timeSelection = this.svgContainer.selectAll('.time-indicator');
	      timeSelection.attr('transform', 'translate(' + this.xDisplayed(this.currentTime[0]) + ', 25)');
	    }
	  }, {
	    key: 'createTimeHandle',
	    value: function createTimeHandle() {
	      var self = this;
	
	      var dragTimeMove = function dragTimeMove() {
	        var event = d3.event.sourceEvent;
	        event.stopPropagation();
	        var tweenTime = self.tweenTime;
	        var event_x = event.x !== undefined ? event.x : event.clientX;
	        var dx = self.xDisplayed.invert(event_x - self.margin.left);
	        dx = dx.getTime();
	        dx = Math.max(0, dx);
	
	        var timeMatch = false;
	        if (event.shiftKey) {
	          var time = dx / 1000;
	          timeMatch = _Utils2.default.getClosestTime(tweenTime.data, time, '---non-existant', false, false, 0.3);
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
	      }).on('drag', dragTimeMove);
	
	      var timeSelection = this.svgContainer.selectAll('.time-indicator').data(this.currentTime);
	
	      timeSelection.enter().append('rect').attr('x', 0).attr('y', 20).attr('width', self.xDisplayed(self.timer.totalDuration)).attr('height', 50).attr('fill-opacity', 0).on('click', function () {
	        var mouse = d3.mouse(this);
	        var dx = self.xDisplayed.invert(mouse[0]);
	        dx = dx.getTime();
	        dx = Math.max(0, dx);
	        self.timer.seek([dx]);
	      });
	
	      var timeGrp = timeSelection.enter().append('g').attr('class', 'time-indicator').attr('transform', 'translate(-0.5,' + 30 + ')').call(dragTime);
	
	      timeGrp.append('rect').attr('class', 'time-indicator__line').attr('x', -0.5).attr('y', 0).attr('width', 1).attr('height', 1000);
	
	      timeGrp.append('path').attr('class', 'time-indicator__handle').attr('d', 'M -5 -3 L -5 5 L 0 10 L 5 5 L 5 -3 L -5 -3');
	
	      // Mask time indicator
	      // todo: remove the mask.
	      this.svgContainer.append('rect').attr('class', 'graph-mask').attr('x', -self.margin.left).attr('y', -self.margin.top).attr('width', self.margin.left - 5).attr('height', self.height);
	    }
	  }, {
	    key: 'resize',
	    value: function resize(width) {
	      var width2 = width - this.margin.left - this.margin.right;
	      this.svg.attr('width', width2 + this.margin.left + this.margin.right);
	
	      this.x.range([0, width2]);
	      this.xDisplayed.range([0, width2]);
	      this.xAxisElement.call(this.xAxis);
	    }
	  }]);
	
	  return Header;
	}();
	
	exports.default = Header;
>>>>>>> master

/***/ },
/* 13 */
/***/ function(module, exports) {

<<<<<<< HEAD
	eval("module.exports = __WEBPACK_EXTERNAL_MODULE_9__;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJkM1wiP2MwYzQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiOS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV85X187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImQzXCJcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9");
=======
	module.exports = __WEBPACK_EXTERNAL_MODULE_13__;
>>>>>>> master

/***/ },
/* 14 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar TimeIndicator = function () {\n  function TimeIndicator(timeline, container) {\n    _classCallCheck(this, TimeIndicator);\n\n    this.timeline = timeline;\n    this.container = container;\n    this.timeSelection = this.container.selectAll('.time-indicator').data(this.timeline.currentTime);\n    this.timeGrp = this.timeSelection.enter().append('svg').attr('class', 'time-indicator timeline__right-mask').attr('width', window.innerWidth - this.timeline.label_position_x).attr('height', 442);\n\n    this.timeSelection = this.timeGrp.append('rect').attr('class', 'time-indicator__line').attr('x', 0).attr('y', -this.timeline.margin.top - 5).attr('width', 1).attr('height', 1000);\n\n    this.timeSelection = this.container.selectAll('.time-indicator rect');\n  }\n\n  _createClass(TimeIndicator, [{\n    key: 'updateHeight',\n    value: function updateHeight(height) {\n      this.timeGrp.attr('height', height);\n      this.timeSelection.attr('height', height + this.timeline.margin.top + 5);\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      this.timeSelection.attr('transform', 'translate(' + (this.timeline.x(this.timeline.currentTime[0]) - 0.5) + ',0)');\n    }\n  }]);\n\n  return TimeIndicator;\n}();\n\nexports.default = TimeIndicator;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ncmFwaC9UaW1lSW5kaWNhdG9yLmpzP2JjODYiXSwibmFtZXMiOlsiVGltZUluZGljYXRvciIsInRpbWVsaW5lIiwiY29udGFpbmVyIiwidGltZVNlbGVjdGlvbiIsInNlbGVjdEFsbCIsImRhdGEiLCJjdXJyZW50VGltZSIsInRpbWVHcnAiLCJlbnRlciIsImFwcGVuZCIsImF0dHIiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwibGFiZWxfcG9zaXRpb25feCIsIm1hcmdpbiIsInRvcCIsImhlaWdodCIsIngiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBcUJBLGE7QUFDbkIseUJBQVlDLFFBQVosRUFBc0JDLFNBQXRCLEVBQWlDO0FBQUE7O0FBQy9CLFNBQUtELFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxTQUFLQyxhQUFMLEdBQXFCLEtBQUtELFNBQUwsQ0FBZUUsU0FBZixDQUF5QixpQkFBekIsRUFBNENDLElBQTVDLENBQWlELEtBQUtKLFFBQUwsQ0FBY0ssV0FBL0QsQ0FBckI7QUFDQSxTQUFLQyxPQUFMLEdBQWUsS0FBS0osYUFBTCxDQUFtQkssS0FBbkIsR0FBMkJDLE1BQTNCLENBQWtDLEtBQWxDLEVBQ1pDLElBRFksQ0FDUCxPQURPLEVBQ0UscUNBREYsRUFFWkEsSUFGWSxDQUVQLE9BRk8sRUFFRUMsT0FBT0MsVUFBUCxHQUFvQixLQUFLWCxRQUFMLENBQWNZLGdCQUZwQyxFQUdaSCxJQUhZLENBR1AsUUFITyxFQUdHLEdBSEgsQ0FBZjs7QUFLQSxTQUFLUCxhQUFMLEdBQXFCLEtBQUtJLE9BQUwsQ0FBYUUsTUFBYixDQUFvQixNQUFwQixFQUNsQkMsSUFEa0IsQ0FDYixPQURhLEVBQ0osc0JBREksRUFFbEJBLElBRmtCLENBRWIsR0FGYSxFQUVSLENBRlEsRUFHbEJBLElBSGtCLENBR2IsR0FIYSxFQUdSLENBQUMsS0FBS1QsUUFBTCxDQUFjYSxNQUFkLENBQXFCQyxHQUF0QixHQUE0QixDQUhwQixFQUlsQkwsSUFKa0IsQ0FJYixPQUphLEVBSUosQ0FKSSxFQUtsQkEsSUFMa0IsQ0FLYixRQUxhLEVBS0gsSUFMRyxDQUFyQjs7QUFPQSxTQUFLUCxhQUFMLEdBQXFCLEtBQUtELFNBQUwsQ0FBZUUsU0FBZixDQUF5QixzQkFBekIsQ0FBckI7QUFDRDs7OztpQ0FFWVksTSxFQUFRO0FBQ25CLFdBQUtULE9BQUwsQ0FBYUcsSUFBYixDQUFrQixRQUFsQixFQUE0Qk0sTUFBNUI7QUFDQSxXQUFLYixhQUFMLENBQW1CTyxJQUFuQixDQUF3QixRQUF4QixFQUFrQ00sU0FBUyxLQUFLZixRQUFMLENBQWNhLE1BQWQsQ0FBcUJDLEdBQTlCLEdBQW9DLENBQXRFO0FBQ0Q7Ozs2QkFFUTtBQUNQLFdBQUtaLGFBQUwsQ0FBbUJPLElBQW5CLENBQXdCLFdBQXhCLEVBQXFDLGdCQUFnQixLQUFLVCxRQUFMLENBQWNnQixDQUFkLENBQWdCLEtBQUtoQixRQUFMLENBQWNLLFdBQWQsQ0FBMEIsQ0FBMUIsQ0FBaEIsSUFBZ0QsR0FBaEUsSUFBdUUsS0FBNUc7QUFDRDs7Ozs7O2tCQTNCa0JOLGEiLCJmaWxlIjoiMTAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lSW5kaWNhdG9yIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUsIGNvbnRhaW5lcikge1xuICAgIHRoaXMudGltZWxpbmUgPSB0aW1lbGluZTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLnRpbWVTZWxlY3Rpb24gPSB0aGlzLmNvbnRhaW5lci5zZWxlY3RBbGwoJy50aW1lLWluZGljYXRvcicpLmRhdGEodGhpcy50aW1lbGluZS5jdXJyZW50VGltZSk7XG4gICAgdGhpcy50aW1lR3JwID0gdGhpcy50aW1lU2VsZWN0aW9uLmVudGVyKCkuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpbWUtaW5kaWNhdG9yIHRpbWVsaW5lX19yaWdodC1tYXNrJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHdpbmRvdy5pbm5lcldpZHRoIC0gdGhpcy50aW1lbGluZS5sYWJlbF9wb3NpdGlvbl94KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIDQ0Mik7XG5cbiAgICB0aGlzLnRpbWVTZWxlY3Rpb24gPSB0aGlzLnRpbWVHcnAuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICd0aW1lLWluZGljYXRvcl9fbGluZScpXG4gICAgICAuYXR0cigneCcsIDApXG4gICAgICAuYXR0cigneScsIC10aGlzLnRpbWVsaW5lLm1hcmdpbi50b3AgLSA1KVxuICAgICAgLmF0dHIoJ3dpZHRoJywgMSlcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCAxMDAwKTtcblxuICAgIHRoaXMudGltZVNlbGVjdGlvbiA9IHRoaXMuY29udGFpbmVyLnNlbGVjdEFsbCgnLnRpbWUtaW5kaWNhdG9yIHJlY3QnKTtcbiAgfVxuXG4gIHVwZGF0ZUhlaWdodChoZWlnaHQpIHtcbiAgICB0aGlzLnRpbWVHcnAuYXR0cignaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICB0aGlzLnRpbWVTZWxlY3Rpb24uYXR0cignaGVpZ2h0JywgaGVpZ2h0ICsgdGhpcy50aW1lbGluZS5tYXJnaW4udG9wICsgNSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdGhpcy50aW1lU2VsZWN0aW9uLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArICh0aGlzLnRpbWVsaW5lLngodGhpcy50aW1lbGluZS5jdXJyZW50VGltZVswXSkgLSAwLjUpICsgJywwKScpO1xuICB9XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2dyYXBoL1RpbWVJbmRpY2F0b3IuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _Utils = __webpack_require__(1);\n\nvar _Utils2 = _interopRequireDefault(_Utils);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar d3 = __webpack_require__(9);\nvar Signals = __webpack_require__(3);\nvar _ = __webpack_require__(6);\n\nvar Items = function () {\n  function Items(timeline, container) {\n    _classCallCheck(this, Items);\n\n    this.timeline = timeline;\n    this.container = container;\n    this.dy = 10 + this.timeline.margin.top;\n    this.onUpdate = new Signals.Signal();\n  }\n\n  _createClass(Items, [{\n    key: 'render',\n    value: function render() {\n      var self = this;\n      var tweenTime = self.timeline.tweenTime;\n\n      var selectBar = function selectBar() {\n        var data = d3.select(this).datum();\n        self.timeline.selectionManager.select(data);\n      };\n\n      var dragmove = function dragmove(d) {\n        var dx = self.timeline.x.invert(d3.event.x).getTime() / 1000;\n        var diff = dx - d.start;\n        d.start += diff;\n        d.end += diff;\n        if (d.properties) {\n          for (var prop_key = 0; prop_key < d.properties.length; prop_key++) {\n            var prop = d.properties[prop_key];\n            for (var i = 0; i < prop.keys.length; i++) {\n              var key = prop.keys[i];\n              key.time += diff;\n            }\n          }\n        }\n        d._isDirty = true;\n        self.onUpdate.dispatch();\n      };\n\n      var dragmoveLeft = function dragmoveLeft(d) {\n        d3.event.sourceEvent.stopPropagation();\n        var sourceEvent = d3.event.sourceEvent;\n        var dx = self.timeline.x.invert(d3.event.x).getTime() / 1000;\n        var timeMatch = false;\n        if (sourceEvent.shiftKey) {\n          timeMatch = _Utils2.default.getClosestTime(tweenTime.data, dx, d.id, false, tweenTime.timer);\n        }\n        if (!timeMatch) {\n          var diff = dx - d.start;\n          timeMatch = d.start + diff;\n        }\n        d.start = timeMatch;\n        d._isDirty = true;\n        self.onUpdate.dispatch();\n      };\n\n      var dragmoveRight = function dragmoveRight(d) {\n        d3.event.sourceEvent.stopPropagation();\n        var sourceEvent = d3.event.sourceEvent;\n        var dx = self.timeline.x.invert(d3.event.x).getTime() / 1000;\n        var timeMatch = false;\n        if (sourceEvent.shiftKey) {\n          timeMatch = _Utils2.default.getClosestTime(tweenTime.data, dx, false, false, tweenTime.timer);\n        }\n        if (!timeMatch) {\n          var diff = dx - d.end;\n          timeMatch = d.end + diff;\n        }\n        d.end = timeMatch;\n        d._isDirty = true;\n        self.onUpdate.dispatch();\n      };\n\n      var dragLeft = d3.behavior.drag().origin(function () {\n        var t = d3.select(this);\n        return { x: t.attr('x'), y: t.attr('y') };\n      }).on('drag', dragmoveLeft);\n\n      var dragRight = d3.behavior.drag().origin(function () {\n        var t = d3.select(this);\n        return { x: t.attr('x'), y: t.attr('y') };\n      }).on('drag', dragmoveRight);\n\n      var drag = d3.behavior.drag().origin(function () {\n        var t = d3.select(this);\n        return { x: t.attr('x'), y: t.attr('y') };\n      }).on('drag', dragmove);\n\n      var bar_border = 1;\n      var bar = this.container.selectAll('.line-grp').data(this.timeline.tweenTime.data, function (d) {\n        return d.id;\n      });\n\n      var barEnter = bar.enter().append('g').attr('class', 'line-grp');\n\n      var barContainerRight = barEnter.append('svg').attr('class', 'timeline__right-mask').attr('width', window.innerWidth - self.timeline.label_position_x).attr('height', self.timeline.lineHeight);\n\n      barContainerRight.append('rect').attr('class', 'bar')\n      // Add a unique id for SelectionManager.removeDuplicates\n      .attr('id', function () {\n        return _Utils2.default.guid();\n      }).attr('y', 3).attr('height', 14);\n\n      barContainerRight.append('rect').attr('class', 'bar-anchor bar-anchor--left').attr('y', 2).attr('height', 16).attr('width', 6).call(dragLeft);\n\n      barContainerRight.append('rect').attr('class', 'bar-anchor bar-anchor--right').attr('y', 2).attr('height', 16).attr('width', 6).call(dragRight);\n\n      self.dy = 10 + this.timeline.margin.top;\n      bar.attr('transform', function (d) {\n        var y = self.dy;\n        self.dy += self.timeline.lineHeight;\n        if (!d.collapsed) {\n          var numProperties = 0;\n          if (d.properties) {\n            var visibleProperties = _.filter(d.properties, function (prop) {\n              return prop.keys.length;\n            });\n            numProperties = visibleProperties.length;\n          }\n          self.dy += numProperties * self.timeline.lineHeight;\n        }\n        return 'translate(0,' + y + ')';\n      });\n\n      var barWithStartAndEnd = function barWithStartAndEnd(d) {\n        if (d.start !== undefined && d.end !== undefined) {\n          return true;\n        }\n        return false;\n      };\n\n      bar.selectAll('.bar-anchor--left').filter(barWithStartAndEnd).attr('x', function (d) {\n        return self.timeline.x(d.start * 1000) - 1;\n      }).on('mousedown', function () {\n        // Don't trigger mousedown on linescontainer else\n        // it create the selection rectangle\n        d3.event.stopPropagation();\n      });\n\n      bar.selectAll('.bar-anchor--right').filter(barWithStartAndEnd).attr('x', function (d) {\n        return self.timeline.x(d.end * 1000) - 1;\n      }).on('mousedown', function () {\n        // Don't trigger mousedown on linescontainer else\n        // it create the selection rectangle\n        d3.event.stopPropagation();\n      });\n\n      bar.selectAll('.bar').filter(barWithStartAndEnd).attr('x', function (d) {\n        return self.timeline.x(d.start * 1000) + bar_border;\n      }).attr('width', function (d) {\n        return Math.max(0, (self.timeline.x(d.end) - self.timeline.x(d.start)) * 1000 - bar_border);\n      }).call(drag).on('click', selectBar).on('mousedown', function () {\n        // Don't trigger mousedown on linescontainer else\n        // it create the selection rectangle\n        d3.event.stopPropagation();\n      });\n\n      barEnter.append('text').attr('class', 'line-label').attr('x', self.timeline.label_position_x + 10).attr('y', 16).text(function (d) {\n        return d.label;\n      }).on('click', selectBar).on('mousedown', function () {\n        // Don't trigger mousedown on linescontainer else\n        // it create the selection rectangle\n        d3.event.stopPropagation();\n      });\n\n      barEnter.append('text').attr('class', 'line__toggle').attr('x', self.timeline.label_position_x - 10).attr('y', 16).on('click', function (d) {\n        d.collapsed = !d.collapsed;\n        self.onUpdate.dispatch();\n      });\n\n      bar.selectAll('.line__toggle').text(function (d) {\n        if (d.collapsed) {\n          return '▸';\n        }\n        return '▾';\n      });\n\n      barEnter.append('line').attr('class', 'line-separator').attr('x1', -self.timeline.margin.left).attr('x2', self.timeline.x(self.timeline.timer.totalDuration + 100)).attr('y1', self.timeline.lineHeight).attr('y2', self.timeline.lineHeight);\n\n      bar.exit().remove();\n\n      return bar;\n    }\n  }]);\n\n  return Items;\n}();\n\nexports.default = Items;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ncmFwaC9JdGVtcy5qcz84NGQ0Il0sIm5hbWVzIjpbImQzIiwicmVxdWlyZSIsIlNpZ25hbHMiLCJfIiwiSXRlbXMiLCJ0aW1lbGluZSIsImNvbnRhaW5lciIsImR5IiwibWFyZ2luIiwidG9wIiwib25VcGRhdGUiLCJTaWduYWwiLCJzZWxmIiwidHdlZW5UaW1lIiwic2VsZWN0QmFyIiwiZGF0YSIsInNlbGVjdCIsImRhdHVtIiwic2VsZWN0aW9uTWFuYWdlciIsImRyYWdtb3ZlIiwiZCIsImR4IiwieCIsImludmVydCIsImV2ZW50IiwiZ2V0VGltZSIsImRpZmYiLCJzdGFydCIsImVuZCIsInByb3BlcnRpZXMiLCJwcm9wX2tleSIsImxlbmd0aCIsInByb3AiLCJpIiwia2V5cyIsImtleSIsInRpbWUiLCJfaXNEaXJ0eSIsImRpc3BhdGNoIiwiZHJhZ21vdmVMZWZ0Iiwic291cmNlRXZlbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJ0aW1lTWF0Y2giLCJzaGlmdEtleSIsImdldENsb3Nlc3RUaW1lIiwiaWQiLCJ0aW1lciIsImRyYWdtb3ZlUmlnaHQiLCJkcmFnTGVmdCIsImJlaGF2aW9yIiwiZHJhZyIsIm9yaWdpbiIsInQiLCJhdHRyIiwieSIsIm9uIiwiZHJhZ1JpZ2h0IiwiYmFyX2JvcmRlciIsImJhciIsInNlbGVjdEFsbCIsImJhckVudGVyIiwiZW50ZXIiLCJhcHBlbmQiLCJiYXJDb250YWluZXJSaWdodCIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJsYWJlbF9wb3NpdGlvbl94IiwibGluZUhlaWdodCIsImd1aWQiLCJjYWxsIiwiY29sbGFwc2VkIiwibnVtUHJvcGVydGllcyIsInZpc2libGVQcm9wZXJ0aWVzIiwiZmlsdGVyIiwiYmFyV2l0aFN0YXJ0QW5kRW5kIiwidW5kZWZpbmVkIiwiTWF0aCIsIm1heCIsInRleHQiLCJsYWJlbCIsImxlZnQiLCJ0b3RhbER1cmF0aW9uIiwiZXhpdCIsInJlbW92ZSJdLCJtYXBwaW5n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Q0FLUSxJQUxSLEVBS2N6QyxLQUFLUCxRQUFMLENBQWM4RCxVQUw1Qjs7QUFPQVQsVUFBSXdCLElBQUosR0FBV0MsTUFBWDs7QUFFQSxhQUFPekIsR0FBUDtBQUNEOzs7Ozs7a0JBek5rQnRELEsiLCJmaWxlIjoiMTEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgZDMgPSByZXF1aXJlKCdkMycpO1xubGV0IFNpZ25hbHMgPSByZXF1aXJlKCdqcy1zaWduYWxzJyk7XG5sZXQgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2NvcmUvVXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJdGVtcyB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lLCBjb250YWluZXIpIHtcbiAgICB0aGlzLnRpbWVsaW5lID0gdGltZWxpbmU7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5keSA9IDEwICsgdGhpcy50aW1lbGluZS5tYXJnaW4udG9wO1xuICAgIHRoaXMub25VcGRhdGUgPSBuZXcgU2lnbmFscy5TaWduYWwoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHR3ZWVuVGltZSA9IHNlbGYudGltZWxpbmUudHdlZW5UaW1lO1xuXG4gICAgdmFyIHNlbGVjdEJhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRhdGEgPSBkMy5zZWxlY3QodGhpcykuZGF0dW0oKTtcbiAgICAgIHNlbGYudGltZWxpbmUuc2VsZWN0aW9uTWFuYWdlci5zZWxlY3QoZGF0YSk7XG4gICAgfTtcblxuICAgIHZhciBkcmFnbW92ZSA9IGZ1bmN0aW9uKGQpIHtcbiAgICAgIHZhciBkeCA9IHNlbGYudGltZWxpbmUueC5pbnZlcnQoZDMuZXZlbnQueCkuZ2V0VGltZSgpIC8gMTAwMDtcbiAgICAgIHZhciBkaWZmID0gZHggLSBkLnN0YXJ0O1xuICAgICAgZC5zdGFydCArPSBkaWZmO1xuICAgICAgZC5lbmQgKz0gZGlmZjtcbiAgICAgIGlmIChkLnByb3BlcnRpZXMpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcF9rZXkgPSAwOyBwcm9wX2tleSA8IGQucHJvcGVydGllcy5sZW5ndGg7IHByb3Bfa2V5KyspIHtcbiAgICAgICAgICB2YXIgcHJvcCA9IGQucHJvcGVydGllc1twcm9wX2tleV07XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wLmtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBwcm9wLmtleXNbaV07XG4gICAgICAgICAgICBrZXkudGltZSArPSBkaWZmO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZC5faXNEaXJ0eSA9IHRydWU7XG4gICAgICBzZWxmLm9uVXBkYXRlLmRpc3BhdGNoKCk7XG4gICAgfTtcblxuICAgIHZhciBkcmFnbW92ZUxlZnQgPSBmdW5jdGlvbihkKSB7XG4gICAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHZhciBzb3VyY2VFdmVudCA9IGQzLmV2ZW50LnNvdXJjZUV2ZW50O1xuICAgICAgdmFyIGR4ID0gc2VsZi50aW1lbGluZS54LmludmVydChkMy5ldmVudC54KS5nZXRUaW1lKCkgLyAxMDAwO1xuICAgICAgdmFyIHRpbWVNYXRjaCA9IGZhbHNlO1xuICAgICAgaWYgKHNvdXJjZUV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIHRpbWVNYXRjaCA9IFV0aWxzLmdldENsb3Nlc3RUaW1lKHR3ZWVuVGltZS5kYXRhLCBkeCwgZC5pZCwgZmFsc2UsIHR3ZWVuVGltZS50aW1lcik7XG4gICAgICB9XG4gICAgICBpZiAoIXRpbWVNYXRjaCkge1xuICAgICAgICB2YXIgZGlmZiA9IGR4IC0gZC5zdGFydDtcbiAgICAgICAgdGltZU1hdGNoID0gZC5zdGFydCArIGRpZmY7XG4gICAgICB9XG4gICAgICBkLnN0YXJ0ID0gdGltZU1hdGNoO1xuICAgICAgZC5faXNEaXJ0eSA9IHRydWU7XG4gICAgICBzZWxmLm9uVXBkYXRlLmRpc3BhdGNoKCk7XG4gICAgfTtcblxuICAgIHZhciBkcmFnbW92ZVJpZ2h0ID0gZnVuY3Rpb24oZCkge1xuICAgICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB2YXIgc291cmNlRXZlbnQgPSBkMy5ldmVudC5zb3VyY2VFdmVudDtcbiAgICAgIHZhciBkeCA9IHNlbGYudGltZWxpbmUueC5pbnZlcnQoZDMuZXZlbnQueCkuZ2V0VGltZSgpIC8gMTAwMDtcbiAgICAgIHZhciB0aW1lTWF0Y2ggPSBmYWxzZTtcbiAgICAgIGlmIChzb3VyY2VFdmVudC5zaGlmdEtleSkge1xuICAgICAgICB0aW1lTWF0Y2ggPSBVdGlscy5nZXRDbG9zZXN0VGltZSh0d2VlblRpbWUuZGF0YSwgZHgsIGZhbHNlLCBmYWxzZSwgdHdlZW5UaW1lLnRpbWVyKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGltZU1hdGNoKSB7XG4gICAgICAgIHZhciBkaWZmID0gZHggLSBkLmVuZDtcbiAgICAgICAgdGltZU1hdGNoID0gZC5lbmQgKyBkaWZmO1xuICAgICAgfVxuICAgICAgZC5lbmQgPSB0aW1lTWF0Y2g7XG4gICAgICBkLl9pc0RpcnR5ID0gdHJ1ZTtcbiAgICAgIHNlbGYub25VcGRhdGUuZGlzcGF0Y2goKTtcbiAgICB9O1xuXG4gICAgdmFyIGRyYWdMZWZ0ID0gZDMuYmVoYXZpb3IuZHJhZygpXG4gICAgICAub3JpZ2luKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdCA9IGQzLnNlbGVjdCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHt4OiB0LmF0dHIoJ3gnKSwgeTogdC5hdHRyKCd5Jyl9O1xuICAgICAgfSlcbiAgICAgIC5vbignZHJhZycsIGRyYWdtb3ZlTGVmdCk7XG5cbiAgICB2YXIgZHJhZ1JpZ2h0ID0gZDMuYmVoYXZpb3IuZHJhZygpXG4gICAgICAub3JpZ2luKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdCA9IGQzLnNlbGVjdCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHt4OiB0LmF0dHIoJ3gnKSwgeTogdC5hdHRyKCd5Jyl9O1xuICAgICAgfSlcbiAgICAgIC5vbignZHJhZycsIGRyYWdtb3ZlUmlnaHQpO1xuXG4gICAgdmFyIGRyYWcgPSBkMy5iZWhhdmlvci5kcmFnKClcbiAgICAgIC5vcmlnaW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0ID0gZDMuc2VsZWN0KHRoaXMpO1xuICAgICAgICByZXR1cm4ge3g6IHQuYXR0cigneCcpLCB5OiB0LmF0dHIoJ3knKX07XG4gICAgICB9KVxuICAgICAgLm9uKCdkcmFnJywgZHJhZ21vdmUpO1xuXG4gICAgdmFyIGJhcl9ib3JkZXIgPSAxO1xuICAgIHZhciBiYXIgPSB0aGlzLmNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWdycCcpXG4gICAgICAuZGF0YSh0aGlzLnRpbWVsaW5lLnR3ZWVuVGltZS5kYXRhLCAoZCkgPT4ge3JldHVybiBkLmlkO30pO1xuXG4gICAgdmFyIGJhckVudGVyID0gYmFyLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdsaW5lLWdycCcpO1xuXG4gICAgdmFyIGJhckNvbnRhaW5lclJpZ2h0ID0gYmFyRW50ZXIuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpbWVsaW5lX19yaWdodC1tYXNrJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHdpbmRvdy5pbm5lcldpZHRoIC0gc2VsZi50aW1lbGluZS5sYWJlbF9wb3NpdGlvbl94KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIHNlbGYudGltZWxpbmUubGluZUhlaWdodCk7XG5cbiAgICBiYXJDb250YWluZXJSaWdodC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2JhcicpXG4gICAgICAvLyBBZGQgYSB1bmlxdWUgaWQgZm9yIFNlbGVjdGlvbk1hbmFnZXIucmVtb3ZlRHVwbGljYXRlc1xuICAgICAgLmF0dHIoJ2lkJywgKCkgPT4ge3JldHVybiBVdGlscy5ndWlkKCk7fSlcbiAgICAgIC5hdHRyKCd5JywgMylcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCAxNCk7XG5cbiAgICBiYXJDb250YWluZXJSaWdodC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2Jhci1hbmNob3IgYmFyLWFuY2hvci0tbGVmdCcpXG4gICAgICAuYXR0cigneScsIDIpXG4gICAgICAuYXR0cignaGVpZ2h0JywgMTYpXG4gICAgICAuYXR0cignd2lkdGgnLCA2KVxuICAgICAgLmNhbGwoZHJhZ0xlZnQpO1xuXG4gICAgYmFyQ29udGFpbmVyUmlnaHQuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdiYXItYW5jaG9yIGJhci1hbmNob3ItLXJpZ2h0JylcbiAgICAgIC5hdHRyKCd5JywgMilcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCAxNilcbiAgICAgIC5hdHRyKCd3aWR0aCcsIDYpXG4gICAgICAuY2FsbChkcmFnUmlnaHQpO1xuXG4gICAgc2VsZi5keSA9IDEwICsgdGhpcy50aW1lbGluZS5tYXJnaW4udG9wO1xuICAgIGJhci5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkKSB7XG4gICAgICB2YXIgeSA9IHNlbGYuZHk7XG4gICAgICBzZWxmLmR5ICs9IHNlbGYudGltZWxpbmUubGluZUhlaWdodDtcbiAgICAgIGlmICghZC5jb2xsYXBzZWQpIHtcbiAgICAgICAgdmFyIG51bVByb3BlcnRpZXMgPSAwO1xuICAgICAgICBpZiAoZC5wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgdmFyIHZpc2libGVQcm9wZXJ0aWVzID0gXy5maWx0ZXIoZC5wcm9wZXJ0aWVzLCBmdW5jdGlvbihwcm9wKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvcC5rZXlzLmxlbmd0aDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBudW1Qcm9wZXJ0aWVzID0gdmlzaWJsZVByb3BlcnRpZXMubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuZHkgKz0gbnVtUHJvcGVydGllcyAqIHNlbGYudGltZWxpbmUubGluZUhlaWdodDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAndHJhbnNsYXRlKDAsJyArIHkgKyAnKSc7XG4gICAgfSk7XG5cbiAgICB2YXIgYmFyV2l0aFN0YXJ0QW5kRW5kID0gZnVuY3Rpb24oZCkge1xuICAgICAgaWYgKGQuc3RhcnQgIT09IHVuZGVmaW5lZCAmJiBkLmVuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICBiYXIuc2VsZWN0QWxsKCcuYmFyLWFuY2hvci0tbGVmdCcpXG4gICAgICAuZmlsdGVyKGJhcldpdGhTdGFydEFuZEVuZClcbiAgICAgIC5hdHRyKCd4JywgKGQpID0+IHtyZXR1cm4gc2VsZi50aW1lbGluZS54KGQuc3RhcnQgKiAxMDAwKSAtIDE7fSlcbiAgICAgIC5vbignbW91c2Vkb3duJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIERvbid0IHRyaWdnZXIgbW91c2Vkb3duIG9uIGxpbmVzY29udGFpbmVyIGVsc2VcbiAgICAgICAgLy8gaXQgY3JlYXRlIHRoZSBzZWxlY3Rpb24gcmVjdGFuZ2xlXG4gICAgICAgIGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfSk7XG5cbiAgICBiYXIuc2VsZWN0QWxsKCcuYmFyLWFuY2hvci0tcmlnaHQnKVxuICAgICAgLmZpbHRlcihiYXJXaXRoU3RhcnRBbmRFbmQpXG4gICAgICAuYXR0cigneCcsIChkKSA9PiB7cmV0dXJuIHNlbGYudGltZWxpbmUueChkLmVuZCAqIDEwMDApIC0gMTt9KVxuICAgICAgLm9uKCdtb3VzZWRvd24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gRG9uJ3QgdHJpZ2dlciBtb3VzZWRvd24gb24gbGluZXNjb250YWluZXIgZWxzZVxuICAgICAgICAvLyBpdCBjcmVhdGUgdGhlIHNlbGVjdGlvbiByZWN0YW5nbGVcbiAgICAgICAgZDMuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9KTtcblxuICAgIGJhci5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmZpbHRlcihiYXJXaXRoU3RhcnRBbmRFbmQpXG4gICAgICAuYXR0cigneCcsIChkKSA9PiB7cmV0dXJuIHNlbGYudGltZWxpbmUueChkLnN0YXJ0ICogMTAwMCkgKyBiYXJfYm9yZGVyO30pXG4gICAgICAuYXR0cignd2lkdGgnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCgwLCAoc2VsZi50aW1lbGluZS54KGQuZW5kKSAtIHNlbGYudGltZWxpbmUueChkLnN0YXJ0KSkgKiAxMDAwIC0gYmFyX2JvcmRlcik7XG4gICAgICB9KVxuICAgICAgLmNhbGwoZHJhZylcbiAgICAgIC5vbignY2xpY2snLCBzZWxlY3RCYXIpXG4gICAgICAub24oJ21vdXNlZG93bicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBEb24ndCB0cmlnZ2VyIG1vdXNlZG93biBvbiBsaW5lc2NvbnRhaW5lciBlbHNlXG4gICAgICAgIC8vIGl0IGNyZWF0ZSB0aGUgc2VsZWN0aW9uIHJlY3RhbmdsZVxuICAgICAgICBkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH0pO1xuXG4gICAgYmFyRW50ZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdsaW5lLWxhYmVsJylcbiAgICAgIC5hdHRyKCd4Jywgc2VsZi50aW1lbGluZS5sYWJlbF9wb3NpdGlvbl94ICsgMTApXG4gICAgICAuYXR0cigneScsIDE2KVxuICAgICAgLnRleHQoKGQpID0+IHtyZXR1cm4gZC5sYWJlbDt9KVxuICAgICAgLm9uKCdjbGljaycsIHNlbGVjdEJhcilcbiAgICAgIC5vbignbW91c2Vkb3duJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIERvbid0IHRyaWdnZXIgbW91c2Vkb3duIG9uIGxpbmVzY29udGFpbmVyIGVsc2VcbiAgICAgICAgLy8gaXQgY3JlYXRlIHRoZSBzZWxlY3Rpb24gcmVjdGFuZ2xlXG4gICAgICAgIGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfSk7XG5cbiAgICBiYXJFbnRlci5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xpbmVfX3RvZ2dsZScpXG4gICAgICAuYXR0cigneCcsIHNlbGYudGltZWxpbmUubGFiZWxfcG9zaXRpb25feCAtIDEwKVxuICAgICAgLmF0dHIoJ3knLCAxNilcbiAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbihkKSB7XG4gICAgICAgIGQuY29sbGFwc2VkID0gIWQuY29sbGFwc2VkO1xuICAgICAgICBzZWxmLm9uVXBkYXRlLmRpc3BhdGNoKCk7XG4gICAgICB9KTtcblxuICAgIGJhci5zZWxlY3RBbGwoJy5saW5lX190b2dnbGUnKS50ZXh0KGZ1bmN0aW9uKGQpIHtcbiAgICAgIGlmIChkLmNvbGxhcHNlZCkge1xuICAgICAgICByZXR1cm4gJ+KWuCc7XG4gICAgICB9XG4gICAgICByZXR1cm4gJ+KWvic7XG4gICAgfSk7XG5cbiAgICBiYXJFbnRlci5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xpbmUtc2VwYXJhdG9yJylcbiAgICAgIC5hdHRyKCd4MScsIC1zZWxmLnRpbWVsaW5lLm1hcmdpbi5sZWZ0KVxuICAgICAgLmF0dHIoJ3gyJywgc2VsZi50aW1lbGluZS54KHNlbGYudGltZWxpbmUudGltZXIudG90YWxEdXJhdGlvbiArIDEwMCkpXG4gICAgICAuYXR0cigneTEnLCBzZWxmLnRpbWVsaW5lLmxpbmVIZWlnaHQpXG4gICAgICAuYXR0cigneTInLCBzZWxmLnRpbWVsaW5lLmxpbmVIZWlnaHQpO1xuXG4gICAgYmFyLmV4aXQoKS5yZW1vdmUoKTtcblxuICAgIHJldHVybiBiYXI7XG4gIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vZ3JhcGgvSXRlbXMuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9");
=======
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Utils = __webpack_require__(1);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var d3 = __webpack_require__(13);
	var Signals = __webpack_require__(5);
	var _ = __webpack_require__(10);
	
	var Items = function () {
	  function Items(timeline, container) {
	    _classCallCheck(this, Items);
	
	    this.timeline = timeline;
	    this.container = container;
	    this.dy = 10 + this.timeline.margin.top;
	    this.onUpdate = new Signals.Signal();
	  }
	
	  _createClass(Items, [{
	    key: 'render',
	    value: function render() {
	      var self = this;
	      var tweenTime = self.timeline.tweenTime;
	
	      var selectBar = function selectBar() {
	        var data = d3.select(this).datum();
	        self.timeline.selectionManager.select(data);
	      };
	
	      var dragmove = function dragmove(d) {
	        var dx = self.timeline.x.invert(d3.event.x).getTime() / 1000;
	        var diff = dx - d.start;
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
	
	      var dragmoveLeft = function dragmoveLeft(d) {
	        d3.event.sourceEvent.stopPropagation();
	        var sourceEvent = d3.event.sourceEvent;
	        var dx = self.timeline.x.invert(d3.event.x).getTime() / 1000;
	        var timeMatch = false;
	        if (sourceEvent.shiftKey) {
	          timeMatch = _Utils2.default.getClosestTime(tweenTime.data, dx, d.id, false, tweenTime.timer);
	        }
	        if (!timeMatch) {
	          var diff = dx - d.start;
	          timeMatch = d.start + diff;
	        }
	        d.start = timeMatch;
	        d._isDirty = true;
	        self.onUpdate.dispatch();
	      };
	
	      var dragmoveRight = function dragmoveRight(d) {
	        d3.event.sourceEvent.stopPropagation();
	        var sourceEvent = d3.event.sourceEvent;
	        var dx = self.timeline.x.invert(d3.event.x).getTime() / 1000;
	        var timeMatch = false;
	        if (sourceEvent.shiftKey) {
	          timeMatch = _Utils2.default.getClosestTime(tweenTime.data, dx, false, false, tweenTime.timer);
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
	        return { x: t.attr('x'), y: t.attr('y') };
	      }).on('drag', dragmoveLeft);
	
	      var dragRight = d3.behavior.drag().origin(function () {
	        var t = d3.select(this);
	        return { x: t.attr('x'), y: t.attr('y') };
	      }).on('drag', dragmoveRight);
	
	      var drag = d3.behavior.drag().origin(function () {
	        var t = d3.select(this);
	        return { x: t.attr('x'), y: t.attr('y') };
	      }).on('drag', dragmove);
	
	      var bar_border = 1;
	      var bar = this.container.selectAll('.line-grp').data(this.timeline.tweenTime.data, function (d) {
	        return d.id;
	      });
	
	      var barEnter = bar.enter().append('g').attr('class', 'line-grp');
	
	      var barContainerRight = barEnter.append('svg').attr('class', 'timeline__right-mask').attr('width', window.innerWidth - self.timeline.label_position_x).attr('height', self.timeline.lineHeight);
	
	      barContainerRight.append('rect').attr('class', 'bar')
	      // Add a unique id for SelectionManager.removeDuplicates
	      .attr('id', function () {
	        return _Utils2.default.guid();
	      }).attr('y', 3).attr('height', 14);
	
	      barContainerRight.append('rect').attr('class', 'bar-anchor bar-anchor--left').attr('y', 2).attr('height', 16).attr('width', 6).call(dragLeft);
	
	      barContainerRight.append('rect').attr('class', 'bar-anchor bar-anchor--right').attr('y', 2).attr('height', 16).attr('width', 6).call(dragRight);
	
	      self.dy = 10 + this.timeline.margin.top;
	      bar.attr('transform', function (d) {
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
	        return 'translate(0,' + y + ')';
	      });
	
	      var barWithStartAndEnd = function barWithStartAndEnd(d) {
	        if (d.start !== undefined && d.end !== undefined) {
	          return true;
	        }
	        return false;
	      };
	
	      bar.selectAll('.bar-anchor--left').filter(barWithStartAndEnd).attr('x', function (d) {
	        return self.timeline.x(d.start * 1000) - 1;
	      }).on('mousedown', function () {
	        // Don't trigger mousedown on linescontainer else
	        // it create the selection rectangle
	        d3.event.stopPropagation();
	      });
	
	      bar.selectAll('.bar-anchor--right').filter(barWithStartAndEnd).attr('x', function (d) {
	        return self.timeline.x(d.end * 1000) - 1;
	      }).on('mousedown', function () {
	        // Don't trigger mousedown on linescontainer else
	        // it create the selection rectangle
	        d3.event.stopPropagation();
	      });
	
	      bar.selectAll('.bar').filter(barWithStartAndEnd).attr('x', function (d) {
	        return self.timeline.x(d.start * 1000) + bar_border;
	      }).attr('width', function (d) {
	        return Math.max(0, (self.timeline.x(d.end) - self.timeline.x(d.start)) * 1000 - bar_border);
	      }).call(drag).on('click', selectBar).on('mousedown', function () {
	        // Don't trigger mousedown on linescontainer else
	        // it create the selection rectangle
	        d3.event.stopPropagation();
	      });
	
	      barEnter.append('text').attr('class', 'line-label').attr('x', self.timeline.label_position_x + 10).attr('y', 16).text(function (d) {
	        return d.label;
	      }).on('click', selectBar).on('mousedown', function () {
	        // Don't trigger mousedown on linescontainer else
	        // it create the selection rectangle
	        d3.event.stopPropagation();
	      });
	
	      barEnter.append('text').attr('class', 'line__toggle').attr('x', self.timeline.label_position_x - 10).attr('y', 16).on('click', function (d) {
	        d.collapsed = !d.collapsed;
	        self.onUpdate.dispatch();
	      });
	
	      bar.selectAll('.line__toggle').text(function (d) {
	        if (d.collapsed) {
	          return '▸';
	        }
	        return '▾';
	      });
	
	      barEnter.append('line').attr('class', 'line-separator').attr('x1', -self.timeline.margin.left).attr('x2', self.timeline.x(self.timeline.timer.totalDuration + 100)).attr('y1', self.timeline.lineHeight).attr('y2', self.timeline.lineHeight);
	
	      bar.exit().remove();
	
	      return bar;
	    }
	  }]);
	
	  return Items;
	}();
	
	exports.default = Items;
>>>>>>> master

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar d3 = __webpack_require__(9);\n\nvar KeysPreview = function () {\n  function KeysPreview(timeline, container) {\n    _classCallCheck(this, KeysPreview);\n\n    this.timeline = timeline;\n    this.container = container;\n  }\n\n  _createClass(KeysPreview, [{\n    key: 'render',\n    value: function render(bar) {\n      var self = this;\n\n      var propVal = function propVal(d) {\n        if (d.properties) {\n          return d.properties;\n        }\n\n        return [];\n      };\n      var propKey = function propKey(d) {\n        return d.name;\n      };\n\n      var properties = bar.selectAll('.keys-preview').data(propVal, propKey);\n\n      properties.enter().append('svg').attr('class', 'keys-preview timeline__right-mask').attr('width', window.innerWidth - self.timeline.label_position_x).attr('height', self.timeline.lineHeight);\n\n      var setItemStyle = function setItemStyle() {\n        var item = d3.select(this.parentNode.parentNode);\n        var bar_data = item.datum();\n        if (bar_data.collapsed === true) {\n          return '';\n        }\n        // Show only when item is collapsed\n        return 'display: none;';\n      };\n\n      properties.selectAll('.key--preview').attr('style', setItemStyle);\n\n      var keyValue = function keyValue(d) {\n        return d.keys;\n      };\n      var keyKey = function keyKey(d) {\n        return d.time;\n      };\n      var keys = properties.selectAll('.key--preview').data(keyValue, keyKey);\n\n      keys.enter().append('path').attr('class', 'key--preview').attr('style', setItemStyle).attr('d', 'M 0 -4 L 4 0 L 0 4 L -4 0');\n\n      keys.attr('transform', function (d) {\n        var dx = self.timeline.x(d.time * 1000);\n        dx = parseInt(dx, 10);\n        var dy = 11;\n        return 'translate(' + dx + ',' + dy + ')';\n      });\n\n      keys.exit().remove();\n    }\n  }]);\n\n  return KeysPreview;\n}();\n\nexports.default = KeysPreview;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ncmFwaC9LZXlzUHJldmlldy5qcz9mYWM3Il0sIm5hbWVzIjpbImQzIiwicmVxdWlyZSIsIktleXNQcmV2aWV3IiwidGltZWxpbmUiLCJjb250YWluZXIiLCJiYXIiLCJzZWxmIiwicHJvcFZhbCIsImQiLCJwcm9wZXJ0aWVzIiwicHJvcEtleSIsIm5hbWUiLCJzZWxlY3RBbGwiLCJkYXRhIiwiZW50ZXIiLCJhcHBlbmQiLCJhdHRyIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImxhYmVsX3Bvc2l0aW9uX3giLCJsaW5lSGVpZ2h0Iiwic2V0SXRlbVN0eWxlIiwiaXRlbSIsInNlbGVjdCIsInBhcmVudE5vZGUiLCJiYXJfZGF0YSIsImRhdHVtIiwiY29sbGFwc2VkIiwia2V5VmFsdWUiLCJrZXlzIiwia2V5S2V5IiwidGltZSIsImR4IiwieCIsInBhcnNlSW50IiwiZHkiLCJleGl0IiwicmVtb3ZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBSUEsS0FBSyxtQkFBQUMsQ0FBUSxDQUFSLENBQVQ7O0lBRXFCQyxXO0FBQ25CLHVCQUFZQyxRQUFaLEVBQXNCQyxTQUF0QixFQUFpQztBQUFBOztBQUMvQixTQUFLRCxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLFNBQUtDLFNBQUwsR0FBaUJBLFNBQWpCO0FBQ0Q7Ozs7MkJBRU1DLEcsRUFBSztBQUNWLFVBQUlDLE9BQU8sSUFBWDs7QUFFQSxVQUFJQyxVQUFVLFNBQVZBLE9BQVUsQ0FBU0MsQ0FBVCxFQUFZO0FBQ3hCLFlBQUlBLEVBQUVDLFVBQU4sRUFBa0I7QUFDaEIsaUJBQU9ELEVBQUVDLFVBQVQ7QUFDRDs7QUFFRCxlQUFPLEVBQVA7QUFDRCxPQU5EO0FBT0EsVUFBSUMsVUFBVSxTQUFWQSxPQUFVLENBQVNGLENBQVQsRUFBWTtBQUN4QixlQUFPQSxFQUFFRyxJQUFUO0FBQ0QsT0FGRDs7QUFJQSxVQUFJRixhQUFhSixJQUFJTyxTQUFKLENBQWMsZUFBZCxFQUErQkMsSUFBL0IsQ0FBb0NOLE9BQXBDLEVBQTZDRyxPQUE3QyxDQUFqQjs7QUFFQUQsaUJBQVdLLEtBQVgsR0FDR0MsTUFESCxDQUNVLEtBRFYsRUFFR0MsSUFGSCxDQUVRLE9BRlIsRUFFaUIsbUNBRmpCLEVBR0dBLElBSEgsQ0FHUSxPQUhSLEVBR2lCQyxPQUFPQyxVQUFQLEdBQW9CWixLQUFLSCxRQUFMLENBQWNnQixnQkFIbkQsRUFJR0gsSUFKSCxDQUlRLFFBSlIsRUFJa0JWLEtBQUtILFFBQUwsQ0FBY2lCLFVBSmhDOztBQU1BLFVBQUlDLGVBQWUsU0FBZkEsWUFBZSxHQUFXO0FBQzVCLFlBQUlDLE9BQU90QixHQUFHdUIsTUFBSCxDQUFVLEtBQUtDLFVBQUwsQ0FBZ0JBLFVBQTFCLENBQVg7QUFDQSxZQUFJQyxXQUFXSCxLQUFLSSxLQUFMLEVBQWY7QUFDQSxZQUFJRCxTQUFTRSxTQUFULEtBQXVCLElBQTNCLEVBQWlDO0FBQy9CLGlCQUFPLEVBQVA7QUFDRDtBQUNEO0FBQ0EsZUFBTyxnQkFBUDtBQUNELE9BUkQ7O0FBVUFsQixpQkFBV0csU0FBWCxDQUFxQixlQUFyQixFQUNHSSxJQURILENBQ1EsT0FEUixFQUNpQkssWUFEakI7O0FBR0EsVUFBSU8sV0FBVyxTQUFYQSxRQUFXLENBQVNwQixDQUFULEVBQVk7QUFDekIsZUFBT0EsRUFBRXFCLElBQVQ7QUFDRCxPQUZEO0FBR0EsVUFBSUMsU0FBUyxTQUFUQSxNQUFTLENBQVN0QixDQUFULEVBQVk7QUFDdkIsZUFBT0EsRUFBRXVCLElBQVQ7QUFDRCxPQUZEO0FBR0EsVUFBSUYsT0FBT3BCLFdBQVdHLFNBQVgsQ0FBcUIsZUFBckIsRUFBc0NDLElBQXRDLENBQTJDZSxRQUEzQyxFQUFxREUsTUFBckQsQ0FBWDs7QUFFQUQsV0FBS2YsS0FBTCxHQUNHQyxNQURILENBQ1UsTUFEVixFQUVHQyxJQUZILENBRVEsT0FGUixFQUVpQixjQUZqQixFQUdHQSxJQUhILENBR1EsT0FIUixFQUdpQkssWUFIakIsRUFJR0wsSUFKSCxDQUlRLEdBSlIsRUFJYSwyQkFKYjs7QUFNQWEsV0FBS2IsSUFBTCxDQUFVLFdBQVYsRUFBdUIsVUFBU1IsQ0FBVCxFQUFZO0FBQ2pDLFlBQUl3QixLQUFLMUIsS0FBS0gsUUFBTCxDQUFjOEIsQ0FBZCxDQUFnQnpCLEVBQUV1QixJQUFGLEdBQVMsSUFBekIsQ0FBVDtBQUNBQyxhQUFLRSxTQUFTRixFQUFULEVBQWEsRUFBYixDQUFMO0FBQ0EsWUFBSUcsS0FBSyxFQUFUO0FBQ0EsZUFBTyxlQUFlSCxFQUFmLEdBQW9CLEdBQXBCLEdBQTBCRyxFQUExQixHQUErQixHQUF0QztBQUNELE9BTEQ7O0FBT0FOLFdBQUtPLElBQUwsR0FBWUMsTUFBWjtBQUNEOzs7Ozs7a0JBL0RrQm5DLFciLCJmaWxlIjoiMTIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgZDMgPSByZXF1aXJlKCdkMycpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLZXlzUHJldmlldyB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lLCBjb250YWluZXIpIHtcbiAgICB0aGlzLnRpbWVsaW5lID0gdGltZWxpbmU7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gIH1cblxuICByZW5kZXIoYmFyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIHByb3BWYWwgPSBmdW5jdGlvbihkKSB7XG4gICAgICBpZiAoZC5wcm9wZXJ0aWVzKSB7XG4gICAgICAgIHJldHVybiBkLnByb3BlcnRpZXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbXTtcbiAgICB9O1xuICAgIHZhciBwcm9wS2V5ID0gZnVuY3Rpb24oZCkge1xuICAgICAgcmV0dXJuIGQubmFtZTtcbiAgICB9O1xuXG4gICAgdmFyIHByb3BlcnRpZXMgPSBiYXIuc2VsZWN0QWxsKCcua2V5cy1wcmV2aWV3JykuZGF0YShwcm9wVmFsLCBwcm9wS2V5KTtcblxuICAgIHByb3BlcnRpZXMuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdrZXlzLXByZXZpZXcgdGltZWxpbmVfX3JpZ2h0LW1hc2snKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgd2luZG93LmlubmVyV2lkdGggLSBzZWxmLnRpbWVsaW5lLmxhYmVsX3Bvc2l0aW9uX3gpXG4gICAgICAuYXR0cignaGVpZ2h0Jywgc2VsZi50aW1lbGluZS5saW5lSGVpZ2h0KTtcblxuICAgIHZhciBzZXRJdGVtU3R5bGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpdGVtID0gZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlKTtcbiAgICAgIHZhciBiYXJfZGF0YSA9IGl0ZW0uZGF0dW0oKTtcbiAgICAgIGlmIChiYXJfZGF0YS5jb2xsYXBzZWQgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgICAgLy8gU2hvdyBvbmx5IHdoZW4gaXRlbSBpcyBjb2xsYXBzZWRcbiAgICAgIHJldHVybiAnZGlzcGxheTogbm9uZTsnO1xuICAgIH07XG5cbiAgICBwcm9wZXJ0aWVzLnNlbGVjdEFsbCgnLmtleS0tcHJldmlldycpXG4gICAgICAuYXR0cignc3R5bGUnLCBzZXRJdGVtU3R5bGUpO1xuXG4gICAgdmFyIGtleVZhbHVlID0gZnVuY3Rpb24oZCkge1xuICAgICAgcmV0dXJuIGQua2V5cztcbiAgICB9O1xuICAgIHZhciBrZXlLZXkgPSBmdW5jdGlvbihkKSB7XG4gICAgICByZXR1cm4gZC50aW1lO1xuICAgIH07XG4gICAgdmFyIGtleXMgPSBwcm9wZXJ0aWVzLnNlbGVjdEFsbCgnLmtleS0tcHJldmlldycpLmRhdGEoa2V5VmFsdWUsIGtleUtleSk7XG5cbiAgICBrZXlzLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2tleS0tcHJldmlldycpXG4gICAgICAuYXR0cignc3R5bGUnLCBzZXRJdGVtU3R5bGUpXG4gICAgICAuYXR0cignZCcsICdNIDAgLTQgTCA0IDAgTCAwIDQgTCAtNCAwJyk7XG5cbiAgICBrZXlzLmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgIGxldCBkeCA9IHNlbGYudGltZWxpbmUueChkLnRpbWUgKiAxMDAwKTtcbiAgICAgIGR4ID0gcGFyc2VJbnQoZHgsIDEwKTtcbiAgICAgIGxldCBkeSA9IDExO1xuICAgICAgcmV0dXJuICd0cmFuc2xhdGUoJyArIGR4ICsgJywnICsgZHkgKyAnKSc7XG4gICAgfSk7XG5cbiAgICBrZXlzLmV4aXQoKS5yZW1vdmUoKTtcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9ncmFwaC9LZXlzUHJldmlldy5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");
=======
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var d3 = __webpack_require__(13);
	
	var KeysPreview = function () {
	  function KeysPreview(timeline, container) {
	    _classCallCheck(this, KeysPreview);
	
	    this.timeline = timeline;
	    this.container = container;
	  }
	
	  _createClass(KeysPreview, [{
	    key: 'render',
	    value: function render(bar) {
	      var self = this;
	
	      var propVal = function propVal(d) {
	        if (d.properties) {
	          return d.properties;
	        }
	
	        return [];
	      };
	      var propKey = function propKey(d) {
	        return d.name;
	      };
	
	      var properties = bar.selectAll('.keys-preview').data(propVal, propKey);
	
	      properties.enter().append('svg').attr('class', 'keys-preview timeline__right-mask').attr('width', window.innerWidth - self.timeline.label_position_x).attr('height', self.timeline.lineHeight);
	
	      var setItemStyle = function setItemStyle() {
	        var item = d3.select(this.parentNode.parentNode);
	        var bar_data = item.datum();
	        if (bar_data.collapsed === true) {
	          return '';
	        }
	        // Show only when item is collapsed
	        return 'display: none;';
	      };
	
	      properties.selectAll('.key--preview').attr('style', setItemStyle);
	
	      var keyValue = function keyValue(d) {
	        return d.keys;
	      };
	      var keyKey = function keyKey(d) {
	        return d.time;
	      };
	      var keys = properties.selectAll('.key--preview').data(keyValue, keyKey);
	
	      keys.enter().append('path').attr('class', 'key--preview').attr('style', setItemStyle).attr('d', 'M 0 -4 L 4 0 L 0 4 L -4 0');
	
	      keys.attr('transform', function (d) {
	        var dx = self.timeline.x(d.time * 1000);
	        dx = parseInt(dx, 10);
	        var dy = 11;
	        return 'translate(' + dx + ',' + dy + ')';
	      });
	
	      keys.exit().remove();
	    }
	  }]);
	
	  return KeysPreview;
	}();
	
	exports.default = KeysPreview;
>>>>>>> master

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _Utils = __webpack_require__(1);\n\nvar _Utils2 = _interopRequireDefault(_Utils);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar d3 = __webpack_require__(9);\nvar Signals = __webpack_require__(3);\n\nvar Properties = function () {\n  function Properties(timeline) {\n    _classCallCheck(this, Properties);\n\n    this.timeline = timeline;\n    this.onKeyAdded = new Signals.Signal();\n    this.subGrp = false;\n  }\n\n  _createClass(Properties, [{\n    key: 'render',\n    value: function render(bar) {\n      var self = this;\n      var editor = this.timeline.editor;\n      var core = editor.tweenTime;\n\n      var propVal = function propVal(d) {\n        if (d.properties) {\n          return d.properties.filter(function (prop) {\n            return prop.keys.length;\n          });\n        }\n        return [];\n      };\n      var propKey = function propKey(d) {\n        return d.name;\n      };\n\n      var properties = bar.selectAll('.line-item').data(propVal, propKey);\n      var subGrp = properties.enter().append('g').attr('class', 'line-item');\n\n      // Save subGrp in a variable for use in Errors.coffee\n      self.subGrp = subGrp;\n\n      properties.attr('transform', function (d, i) {\n        var sub_height = (i + 1) * self.timeline.lineHeight;\n        return 'translate(0,' + sub_height + ')';\n      });\n\n      subGrp.append('rect').attr('class', 'click-handler click-handler--property').attr('x', 0).attr('y', 0).attr('width', self.timeline.x(self.timeline.timer.totalDuration + 100)).attr('height', self.timeline.lineHeight).on('dblclick', function (d) {\n        var lineObject = this.parentNode.parentNode;\n        var lineValue = d3.select(lineObject).datum();\n        var def = d.default ? d.default : 0;\n        var mouse = d3.mouse(this);\n        var dx = self.timeline.x.invert(mouse[0]);\n        dx = dx.getTime() / 1000;\n        var prevKey = _Utils2.default.getPreviousKey(d.keys, dx);\n        // set the value to match the previous key if we found one\n        if (prevKey) {\n          def = prevKey.val;\n        }\n        d._line = lineValue;\n        var newKey = {\n          time: dx,\n          val: def,\n          _property: d\n        };\n        if (core.options.defaultEase) {\n          newKey.ease = core.options.defaultEase;\n        }\n\n        d.keys.push(newKey);\n        // Sort the keys for tweens creation\n        d.keys = _Utils2.default.sortKeys(d.keys);\n        lineValue._isDirty = true;\n\n        lineValue._isDirty = true;\n        var keyContainer = this.parentNode;\n        self.onKeyAdded.dispatch(newKey, keyContainer);\n      });\n\n      // Mask\n      subGrp.append('svg').attr('class', 'line-item__keys timeline__right-mask').attr('width', window.innerWidth - self.timeline.label_position_x).attr('height', self.timeline.lineHeight).attr('fill', '#f00');\n\n      subGrp.append('text').attr('class', 'line-label line-label--small').attr('x', self.timeline.label_position_x + 10).attr('y', 15).text(function (d) {\n        return d.name;\n      });\n\n      subGrp.append('line').attr('class', 'line-separator--secondary').attr('x1', -self.timeline.margin.left).attr('x2', self.timeline.x(self.timeline.timer.totalDuration + 100)).attr('y1', self.timeline.lineHeight).attr('y2', self.timeline.lineHeight);\n\n      bar.selectAll('.line-item').attr('display', function () {\n        var lineObject = this.parentNode;\n        var lineValue = d3.select(lineObject).datum();\n        if (!lineValue.collapsed) {\n          return 'block';\n        }\n        return 'none';\n      });\n\n      properties.exit().remove();\n\n      return properties;\n    }\n  }]);\n\n  return Properties;\n}();\n\nexports.default = Properties;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ncmFwaC9Qcm9wZXJ0aWVzLmpzP2E3MjciXSwibmFtZXMiOlsiZDMiLCJyZXF1aXJlIiwiU2lnbmFscyIsIlByb3BlcnRpZXMiLCJ0aW1lbGluZSIsIm9uS2V5QWRkZWQiLCJTaWduYWwiLCJzdWJHcnAiLCJiYXIiLCJzZWxmIiwiZWRpdG9yIiwiY29yZSIsInR3ZWVuVGltZSIsInByb3BWYWwiLCJkIiwicHJvcGVydGllcyIsImZpbHRlciIsInByb3AiLCJrZXlzIiwibGVuZ3RoIiwicHJvcEtleSIsIm5hbWUiLCJzZWxlY3RBbGwiLCJkYXRhIiwiZW50ZXIiLCJhcHBlbmQiLCJhdHRyIiwiaSIsInN1Yl9oZWlnaHQiLCJsaW5lSGVpZ2h0IiwieCIsInRpbWVyIiwidG90YWxEdXJhdGlvbiIsIm9uIiwibGluZU9iamVjdCIsInBhcmVudE5vZGUiLCJsaW5lVmFsdWUiLCJzZWxlY3QiLCJkYXR1bSIsImRlZiIsImRlZmF1bHQiLCJtb3VzZSIsImR4IiwiaW52ZXJ0IiwiZ2V0VGltZSIsInByZXZLZXkiLCJnZXRQcmV2aW91c0tleSIsInZhbCIsIl9saW5lIiwibmV3S2V5IiwidGltZSIsIl9wcm9wZXJ0eSIsIm9wdGlvbnMiLCJkZWZhdWx0RWFzZSIsImVhc2UiLCJwdXNoIiwic29ydEtleXMiLCJfaXNEaXJ0eSIsImtleUNvbnRhaW5lciIsImRpc3BhdGNoIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImxhYmVsX3Bvc2l0aW9uX3giLCJ0ZXh0IiwibWFyZ2luIiwibGVmdCIsImNvbGxhcHNlZCIsImV4aXQiLCJyZW1vdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7Ozs7O0FBRkEsSUFBSUEsS0FBSyxtQkFBQUMsQ0FBUSxDQUFSLENBQVQ7QUFDQSxJQUFJQyxVQUFVLG1CQUFBRCxDQUFRLENBQVIsQ0FBZDs7SUFHcUJFLFU7QUFDbkIsc0JBQVlDLFFBQVosRUFBc0I7QUFBQTs7QUFDcEIsU0FBS0EsUUFBTCxHQUFnQkEs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R3ZDLElBSEgsQ0FHUSxJQUhSLEVBR2NqQixLQUFLTCxRQUFMLENBQWMwQixDQUFkLENBQWdCckIsS0FBS0wsUUFBTCxDQUFjMkIsS0FBZCxDQUFvQkMsYUFBcEIsR0FBb0MsR0FBcEQsQ0FIZCxFQUlHTixJQUpILENBSVEsSUFKUixFQUljakIsS0FBS0wsUUFBTCxDQUFjeUIsVUFKNUIsRUFLR0gsSUFMSCxDQUtRLElBTFIsRUFLY2pCLEtBQUtMLFFBQUwsQ0FBY3lCLFVBTDVCOztBQU9BckIsVUFBSWMsU0FBSixDQUFjLFlBQWQsRUFBNEJJLElBQTVCLENBQWlDLFNBQWpDLEVBQTRDLFlBQVc7QUFDckQsWUFBSVEsYUFBYSxLQUFLQyxVQUF0QjtBQUNBLFlBQUlDLFlBQVlwQyxHQUFHcUMsTUFBSCxDQUFVSCxVQUFWLEVBQXNCSSxLQUF0QixFQUFoQjtBQUNBLFlBQUksQ0FBQ0YsVUFBVThCLFNBQWYsRUFBMEI7QUFDeEIsaUJBQU8sT0FBUDtBQUNEO0FBQ0QsZUFBTyxNQUFQO0FBQ0QsT0FQRDs7QUFTQW5ELGlCQUFXb0QsSUFBWCxHQUFrQkMsTUFBbEI7O0FBRUEsYUFBT3JELFVBQVA7QUFDRDs7Ozs7O2tCQTNHa0JaLFUiLCJmaWxlIjoiMTMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgZDMgPSByZXF1aXJlKCdkMycpO1xubGV0IFNpZ25hbHMgPSByZXF1aXJlKCdqcy1zaWduYWxzJyk7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vY29yZS9VdGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb3BlcnRpZXMge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHRoaXMudGltZWxpbmUgPSB0aW1lbGluZTtcbiAgICB0aGlzLm9uS2V5QWRkZWQgPSBuZXcgU2lnbmFscy5TaWduYWwoKTtcbiAgICB0aGlzLnN1YkdycCA9IGZhbHNlO1xuICB9XG5cbiAgcmVuZGVyKGJhcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZWRpdG9yID0gdGhpcy50aW1lbGluZS5lZGl0b3I7XG4gICAgdmFyIGNvcmUgPSBlZGl0b3IudHdlZW5UaW1lO1xuXG4gICAgdmFyIHByb3BWYWwgPSBmdW5jdGlvbihkKSB7XG4gICAgICBpZiAoZC5wcm9wZXJ0aWVzKSB7XG4gICAgICAgIHJldHVybiBkLnByb3BlcnRpZXMuZmlsdGVyKChwcm9wKSA9PiB7cmV0dXJuIHByb3Aua2V5cy5sZW5ndGg7fSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gW107XG4gICAgfTtcbiAgICB2YXIgcHJvcEtleSA9IGZ1bmN0aW9uKGQpIHtcbiAgICAgIHJldHVybiBkLm5hbWU7XG4gICAgfTtcblxuICAgIHZhciBwcm9wZXJ0aWVzID0gYmFyLnNlbGVjdEFsbCgnLmxpbmUtaXRlbScpLmRhdGEocHJvcFZhbCwgcHJvcEtleSk7XG4gICAgdmFyIHN1YkdycCA9IHByb3BlcnRpZXMuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbGluZS1pdGVtJyk7XG5cbiAgICAvLyBTYXZlIHN1YkdycCBpbiBhIHZhcmlhYmxlIGZvciB1c2UgaW4gRXJyb3JzLmNvZmZlZVxuICAgIHNlbGYuc3ViR3JwID0gc3ViR3JwO1xuXG4gICAgcHJvcGVydGllcy5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICBsZXQgc3ViX2hlaWdodCA9IChpICsgMSkgKiBzZWxmLnRpbWVsaW5lLmxpbmVIZWlnaHQ7XG4gICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgwLCcgKyBzdWJfaGVpZ2h0ICsgJyknO1xuICAgIH0pO1xuXG4gICAgc3ViR3JwLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnY2xpY2staGFuZGxlciBjbGljay1oYW5kbGVyLS1wcm9wZXJ0eScpXG4gICAgICAuYXR0cigneCcsIDApXG4gICAgICAuYXR0cigneScsIDApXG4gICAgICAuYXR0cignd2lkdGgnLCBzZWxmLnRpbWVsaW5lLngoc2VsZi50aW1lbGluZS50aW1lci50b3RhbER1cmF0aW9uICsgMTAwKSlcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCBzZWxmLnRpbWVsaW5lLmxpbmVIZWlnaHQpXG4gICAgICAub24oJ2RibGNsaWNrJywgZnVuY3Rpb24oZCkge1xuICAgICAgICB2YXIgbGluZU9iamVjdCA9IHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgICAgICB2YXIgbGluZVZhbHVlID0gZDMuc2VsZWN0KGxpbmVPYmplY3QpLmRhdHVtKCk7XG4gICAgICAgIHZhciBkZWYgPSBkLmRlZmF1bHQgPyBkLmRlZmF1bHQgOiAwO1xuICAgICAgICB2YXIgbW91c2UgPSBkMy5tb3VzZSh0aGlzKTtcbiAgICAgICAgdmFyIGR4ID0gc2VsZi50aW1lbGluZS54LmludmVydChtb3VzZVswXSk7XG4gICAgICAgIGR4ID0gZHguZ2V0VGltZSgpIC8gMTAwMDtcbiAgICAgICAgdmFyIHByZXZLZXkgPSBVdGlscy5nZXRQcmV2aW91c0tleShkLmtleXMsIGR4KTtcbiAgICAgICAgLy8gc2V0IHRoZSB2YWx1ZSB0byBtYXRjaCB0aGUgcHJldmlvdXMga2V5IGlmIHdlIGZvdW5kIG9uZVxuICAgICAgICBpZiAocHJldktleSkge1xuICAgICAgICAgIGRlZiA9IHByZXZLZXkudmFsO1xuICAgICAgICB9XG4gICAgICAgIGQuX2xpbmUgPSBsaW5lVmFsdWU7XG4gICAgICAgIHZhciBuZXdLZXkgPSB7XG4gICAgICAgICAgdGltZTogZHgsXG4gICAgICAgICAgdmFsOiBkZWYsXG4gICAgICAgICAgX3Byb3BlcnR5OiBkXG4gICAgICAgIH07XG4gICAgICAgIGlmIChjb3JlLm9wdGlvbnMuZGVmYXVsdEVhc2UpIHtcbiAgICAgICAgICBuZXdLZXkuZWFzZSA9IGNvcmUub3B0aW9ucy5kZWZhdWx0RWFzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGQua2V5cy5wdXNoKG5ld0tleSk7XG4gICAgICAgIC8vIFNvcnQgdGhlIGtleXMgZm9yIHR3ZWVucyBjcmVhdGlvblxuICAgICAgICBkLmtleXMgPSBVdGlscy5zb3J0S2V5cyhkLmtleXMpO1xuICAgICAgICBsaW5lVmFsdWUuX2lzRGlydHkgPSB0cnVlO1xuXG4gICAgICAgIGxpbmVWYWx1ZS5faXNEaXJ0eSA9IHRydWU7XG4gICAgICAgIHZhciBrZXlDb250YWluZXIgPSB0aGlzLnBhcmVudE5vZGU7XG4gICAgICAgIHNlbGYub25LZXlBZGRlZC5kaXNwYXRjaChuZXdLZXksIGtleUNvbnRhaW5lcik7XG4gICAgICB9KTtcblxuICAgIC8vIE1hc2tcbiAgICBzdWJHcnAuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xpbmUtaXRlbV9fa2V5cyB0aW1lbGluZV9fcmlnaHQtbWFzaycpXG4gICAgICAuYXR0cignd2lkdGgnLCB3aW5kb3cuaW5uZXJXaWR0aCAtIHNlbGYudGltZWxpbmUubGFiZWxfcG9zaXRpb25feClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCBzZWxmLnRpbWVsaW5lLmxpbmVIZWlnaHQpXG4gICAgICAuYXR0cignZmlsbCcsICcjZjAwJyk7XG5cbiAgICBzdWJHcnAuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdsaW5lLWxhYmVsIGxpbmUtbGFiZWwtLXNtYWxsJylcbiAgICAgIC5hdHRyKCd4Jywgc2VsZi50aW1lbGluZS5sYWJlbF9wb3NpdGlvbl94ICsgMTApXG4gICAgICAuYXR0cigneScsIDE1KVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCkge1xuICAgICAgICByZXR1cm4gZC5uYW1lO1xuICAgICAgfSk7XG5cbiAgICBzdWJHcnAuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdsaW5lLXNlcGFyYXRvci0tc2Vjb25kYXJ5JylcbiAgICAgIC5hdHRyKCd4MScsIC1zZWxmLnRpbWVsaW5lLm1hcmdpbi5sZWZ0KVxuICAgICAgLmF0dHIoJ3gyJywgc2VsZi50aW1lbGluZS54KHNlbGYudGltZWxpbmUudGltZXIudG90YWxEdXJhdGlvbiArIDEwMCkpXG4gICAgICAuYXR0cigneTEnLCBzZWxmLnRpbWVsaW5lLmxpbmVIZWlnaHQpXG4gICAgICAuYXR0cigneTInLCBzZWxmLnRpbWVsaW5lLmxpbmVIZWlnaHQpO1xuXG4gICAgYmFyLnNlbGVjdEFsbCgnLmxpbmUtaXRlbScpLmF0dHIoJ2Rpc3BsYXknLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsaW5lT2JqZWN0ID0gdGhpcy5wYXJlbnROb2RlO1xuICAgICAgdmFyIGxpbmVWYWx1ZSA9IGQzLnNlbGVjdChsaW5lT2JqZWN0KS5kYXR1bSgpO1xuICAgICAgaWYgKCFsaW5lVmFsdWUuY29sbGFwc2VkKSB7XG4gICAgICAgIHJldHVybiAnYmxvY2snO1xuICAgICAgfVxuICAgICAgcmV0dXJuICdub25lJztcbiAgICB9KTtcblxuICAgIHByb3BlcnRpZXMuZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgcmV0dXJuIHByb3BlcnRpZXM7XG4gIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vZ3JhcGgvUHJvcGVydGllcy5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");
=======
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Utils = __webpack_require__(1);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var d3 = __webpack_require__(13);
	var Signals = __webpack_require__(5);
	
	var Properties = function () {
	  function Properties(timeline) {
	    _classCallCheck(this, Properties);
	
	    this.timeline = timeline;
	    this.onKeyAdded = new Signals.Signal();
	    this.subGrp = false;
	  }
	
	  _createClass(Properties, [{
	    key: 'render',
	    value: function render(bar) {
	      var self = this;
	      var editor = this.timeline.editor;
	      var core = editor.tweenTime;
	
	      var propVal = function propVal(d) {
	        if (d.properties) {
	          if (editor.options.showEmptyProperties) {
	            return d.properties;
	          } else {
	            return d.properties.filter(function (prop) {
	              return prop.keys.length;
	            });
	          }
	        }
	        return [];
	      };
	      var propKey = function propKey(d) {
	        return d.name;
	      };
	
	      var properties = bar.selectAll('.line-item').data(propVal, propKey);
	      var subGrp = properties.enter().append('g').attr('class', 'line-item');
	
	      // Save subGrp in a variable for use in Errors.coffee
	      self.subGrp = subGrp;
	
	      properties.attr('transform', function (d, i) {
	        var sub_height = (i + 1) * self.timeline.lineHeight;
	        return 'translate(0,' + sub_height + ')';
	      });
	
	      subGrp.append('rect').attr('class', 'click-handler click-handler--property').attr('x', 0).attr('y', 0).attr('width', self.timeline.x(self.timeline.timer.totalDuration + 100)).attr('height', self.timeline.lineHeight).on('dblclick', function (d) {
	        var lineObject = this.parentNode.parentNode;
	        var lineValue = d3.select(lineObject).datum();
	        var def = d.default ? d.default : 0;
	        var mouse = d3.mouse(this);
	        var dx = self.timeline.x.invert(mouse[0]);
	        dx = dx.getTime() / 1000;
	        var prevKey = _Utils2.default.getPreviousKey(d.keys, dx);
	        // set the value to match the previous key if we found one
	        if (prevKey) {
	          def = prevKey.val;
	        }
	        d._line = lineValue;
	        var newKey = {
	          time: dx,
	          val: def,
	          _property: d
	        };
	        if (core.options.defaultEase) {
	          newKey.ease = core.options.defaultEase;
	        }
	
	        d.keys.push(newKey);
	        // Sort the keys for tweens creation
	        d.keys = _Utils2.default.sortKeys(d.keys);
	        lineValue._isDirty = true;
	
	        lineValue._isDirty = true;
	        var keyContainer = this.parentNode;
	        self.onKeyAdded.dispatch(newKey, keyContainer);
	      });
	
	      // Mask
	      subGrp.append('svg').attr('class', 'line-item__keys timeline__right-mask').attr('width', window.innerWidth - self.timeline.label_position_x).attr('height', self.timeline.lineHeight).attr('fill', '#f00');
	
	      subGrp.append('text').attr('class', 'line-label line-label--small').attr('x', self.timeline.label_position_x + 10).attr('y', 15).text(function (d) {
	        return d.name;
	      });
	
	      subGrp.append('line').attr('class', 'line-separator--secondary').attr('x1', -self.timeline.margin.left).attr('x2', self.timeline.x(self.timeline.timer.totalDuration + 100)).attr('y1', self.timeline.lineHeight).attr('y2', self.timeline.lineHeight);
	
	      bar.selectAll('.line-item').attr('display', function () {
	        var lineObject = this.parentNode;
	        var lineValue = d3.select(lineObject).datum();
	        if (!lineValue.collapsed) {
	          return 'block';
	        }
	        return 'none';
	      });
	
	      properties.exit().remove();
	
	      return properties;
	    }
	  }]);
	
	  return Properties;
	}();
	
	exports.default = Properties;
>>>>>>> master

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _Utils = __webpack_require__(1);\n\nvar _Utils2 = _interopRequireDefault(_Utils);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar d3 = __webpack_require__(9);\nvar Signals = __webpack_require__(3);\n\nvar _ = __webpack_require__(6);\n\nvar Keys = function () {\n  function Keys(timeline) {\n    _classCallCheck(this, Keys);\n\n    this.timeline = timeline;\n    this.onKeyUpdated = new Signals.Signal();\n  }\n\n  _createClass(Keys, [{\n    key: 'selectNewKey',\n    value: function selectNewKey(data, container) {\n      var self = this;\n      var key = d3.select(container).selectAll('.key').filter(function (item) {\n        return item.time === data.time;\n      });\n      if (key.length) {\n        d3.selectAll('.key--selected').classed('key--selected', false);\n        key.classed('key--selected', true);\n        key = key[0][0];\n        data._dom = key;\n        self.timeline.selectionManager.select(data);\n      }\n    }\n  }, {\n    key: 'render',\n    value: function render(properties) {\n      var self = this;\n      var tweenTime = self.timeline.tweenTime;\n\n      var dragmove = function dragmove(d) {\n        var sourceEvent = d3.event.sourceEvent;\n        var propertyObject = this.parentNode;\n        var lineObject = propertyObject.parentNode.parentNode;\n        var propertyData = d3.select(propertyObject).datum();\n        var lineData = d3.select(lineObject).datum();\n        var key_data = d;\n\n        var currentDomainStart = self.timeline.x.domain()[0];\n        var mouse = d3.mouse(this);\n        var old_time = d.time;\n        var dx = self.timeline.x.invert(mouse[0]);\n        dx = dx.getTime();\n        dx = dx / 1000 - currentDomainStart / 1000;\n        dx = d.time + dx;\n\n        var selection = self.timeline.selectionManager.getSelection();\n        var selection_first_time = false;\n        var selection_last_time = false;\n        if (selection.length) {\n          selection_first_time = selection[0].time;\n          selection_last_time = selection[selection.length - 1].time;\n        }\n\n        selection = _.filter(selection, function (item) {\n          return _.isEqual(item, key_data) === false;\n        });\n\n        var timeMatch = false;\n        if (sourceEvent.shiftKey) {\n          timeMatch = _Utils2.default.getClosestTime(tweenTime.data, dx, lineData.id, propertyData.name, tweenTime.timer);\n        }\n        if (timeMatch === false) {\n          timeMatch = dx;\n        }\n\n        d.time = timeMatch;\n        // Sort the keys of the current selected item.\n        propertyData.keys = _Utils2.default.sortKeys(propertyData.keys);\n        var time_offset = d.time - old_time;\n\n        var updateKeyItem = function updateKeyItem(item) {\n          var property = item._property;\n          property._line._isDirty = true;\n          property.keys = _Utils2.default.sortKeys(property.keys);\n        };\n\n        var key_scale = false;\n        var is_first = false;\n        if (selection.length) {\n          if (sourceEvent.altKey && selection_first_time !== false && selection_last_time !== false) {\n            is_first = selection_first_time === old_time;\n            if (is_first) {\n              key_scale = (selection_last_time - d.time) / (selection_last_time - old_time);\n            } else {\n              key_scale = (d.time - selection_first_time) / (old_time - selection_first_time);\n            }\n          }\n\n          for (var i = 0; i < selection.length; i++) {\n            var data = selection[i];\n            if (key_scale === false) {\n              data.time += time_offset;\n            } else {\n              if (is_first) {\n                data.time = selection_last_time - (selection_last_time - data.time) * key_scale;\n              } else {\n                data.time = selection_first_time + (data.time - selection_first_time) * key_scale;\n              }\n            }\n            updateKeyItem(data);\n          }\n        }\n\n        lineData._isDirty = true;\n        self.onKeyUpdated.dispatch();\n      };\n\n      var propValue = function propValue(d) {\n        return d.keys;\n      };\n      var propKey = function propKey(d) {\n        if (!d._id) {\n          d._id = _Utils2.default.guid();\n        }\n        return d._id;\n      };\n      var keys = properties.select('.line-item__keys').selectAll('.key').data(propValue, propKey);\n\n      // selectKey is triggered by dragstart event\n      var selectKey = function selectKey() {\n        var event = d3.event;\n        // with dragstart event the mousevent is is inside the event.sourcEvent\n        if (event.sourceEvent) {\n          event = event.sourceEvent;\n        }\n\n        var addToSelection = event.shiftKey;\n        // if element is already selectionned and we are on\n        // the dragstart event, we stop there since it is already selected.\n        if (d3.event.type && d3.event.type === 'dragstart') {\n          if (d3.select(this).classed('key--selected')) {\n            return;\n          }\n        }\n        var key_data = d3.select(this).datum();\n\n        // Also keep a reference to the key dom element.\n        key_data._dom = this;\n\n        self.timeline.selectionManager.select(key_data, addToSelection);\n      };\n\n      var dragend = function dragend() {\n        self.timeline.editor.undoManager.addState();\n      };\n\n      var drag = d3.behavior.drag().origin(function (d) {\n        return d;\n      }).on('drag', dragmove).on('dragstart', selectKey).on('dragend', dragend);\n\n      var key_grp = keys.enter().append('g').attr('class', 'key')\n      // Use the unique id added in propKey above for the dom element id.\n      .attr('id', function (d) {\n        return d._id;\n      }).on('mousedown', function () {\n        // Don't trigger mousedown on linescontainer else\n        // it create the selection rectangle\n        d3.event.stopPropagation();\n      }).call(drag);\n\n      properties.selectAll('.key').attr('class', function (d) {\n        var cls = 'key';\n        // keep selected class\n        if (d3.select(this).classed('key--selected')) {\n          cls += ' key--selected';\n        }\n        if (d.ease) {\n          var ease = d.ease.split('.');\n          if (ease.length === 2) {\n            cls += ' ' + ease[1];\n          }\n        } else {\n          // If no easing specified, the it's the default Quad.easeOut\n          cls += ' easeOut';\n        }\n        return cls;\n      });\n\n      var grp_linear = key_grp.append('g').attr('class', 'ease-linear');\n      grp_linear.append('path').attr('class', 'key__shape-arrow').attr('d', 'M 0 -6 L 6 0 L 0 6');\n      grp_linear.append('path').attr('class', 'key__shape-arrow').attr('d', 'M 0 -6 L -6 0 L 0 6');\n\n      var grp_in = key_grp.append('g').attr('class', 'ease-in');\n      grp_in.append('path').attr('class', 'key__shape-rect').attr('d', 'M 0 -6 L 0 6 L 4 5 L 1 0 L 4 -5');\n      grp_in.append('path').attr('class', 'key__shape-arrow').attr('d', 'M 0 -6 L -6 0 L 0 6');\n\n      var grp_out = key_grp.append('g').attr('class', 'ease-out');\n      grp_out.append('path').attr('class', 'key__shape-rect').attr('d', 'M 0 -6 L 0 6 L -4 5 L -1 0 L -4 -5');\n      grp_out.append('path').attr('class', 'key__shape-arrow').attr('d', 'M 0 -6 L 6 0 L 0 6');\n\n      var grp_inout = key_grp.append('g').attr('class', 'ease-inout');\n      grp_inout.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 5);\n\n      keys.attr('transform', function (d) {\n        var dx = self.timeline.x(d.time * 1000);\n        dx = parseInt(dx, 10);\n        var dy = 10;\n        return 'translate(' + dx + ',' + dy + ')';\n      });\n\n      keys.exit().remove();\n    }\n  }]);\n\n  return Keys;\n}();\n\nexports.default = Keys;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ncmFwaC9LZXlzLmpzPzIzM2IiXSwibmFtZXMiOlsiZDMiLCJyZXF1aXJlIiwiU2lnbmFscyIsIl8iLCJLZXlzIiwidGltZWxpbmUiLCJvbktleVVwZGF0ZWQiLCJTaWduYWwiLCJkYXRhIiwiY29udGFpbmVyIiwic2VsZiIsImtleSIsInNlbGVjdCIsInNlbGVjdEFsbCIsImZpbHRlciIsIml0ZW0iLCJ0aW1lIiwibGVuZ3RoIiwiY2xhc3NlZCIsIl9kb20iLCJzZWxlY3Rpb25NYW5hZ2VyIiwicHJvcGVydGllcyIsInR3ZWVuVGltZSIsImRyYWdtb3ZlIiwiZCIsInNvdXJjZUV2ZW50IiwiZXZlbnQiLCJwcm9wZXJ0eU9iamVjdCIsInBhcmVudE5vZGUiLCJsaW5lT2JqZWN0IiwicHJvcGVydHlEYXRhIiwiZGF0dW0iLCJsaW5lRGF0YSIsImtleV9kYXRhIiwiY3VycmVudERvbWFpblN0YXJ0IiwieCIsImRvbWFpbiIsIm1vdXNlIiwib2xkX3RpbWUiLCJkeCIsImludmVydCIsImdldFRpbWUiLCJzZWxlY3Rpb24iLCJnZXRTZWxlY3Rpb24iLCJzZWxlY3Rpb25fZmlyc3RfdGltZSIsInNlbGVjdGlvbl9sYXN0X3RpbWUiLCJpc0VxdWFsIiwidGltZU1hdGNoIiwic2hpZnRLZXkiLCJnZXRDbG9zZXN0VGltZSIsImlkIiwibmFtZSIsInRpbWVyIiwia2V5cyIsInNvcnRLZXlzIiwidGltZV9vZmZzZXQiLCJ1cGRhdGVLZXlJdGVtIiwicHJvcGVydHkiLCJfcHJvcGVydHkiLCJfbGluZSIsIl9pc0RpcnR5Iiwia2V5X3NjYWxlIiwiaXNfZmlyc3QiLCJhbHRLZXkiLCJpIiwiZGlzcGF0Y2giLCJwcm9wVmFsdWUiLCJwcm9wS2V5IiwiX2lkIiwiZ3VpZCIsInNlbGVjdEtleSIsImFkZFRvU2VsZWN0aW9uIiwidHlwZSIsImRyYWdlbmQiLCJlZGl0b3IiLCJ1bmRvTWFuYWdlciIsImFkZFN0YXRlIiwiZHJhZyIsImJlaGF2aW9yIiwib3JpZ2luIiwib24iLCJrZXlfZ3JwIiwiZW50ZXIiLCJhcHBlbmQiLCJhdHRyIiwic3RvcFByb3BhZ2F0aW9uIiwiY2FsbCIsImNscyIsImVhc2UiLCJzcGxpdCIsImdycF9saW5lYXIiLCJncnBfaW4iLCJncnBfb3V0IiwiZ3JwX2lub3V0IiwicGFyc2VJbnQiLCJkeSIsImV4aXQiLCJyZW1vdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUE7Ozs7Ozs7O0FBRkEsSUFBSUEsS0FBSyxtQkFBQUMsQ0FBUSxDQUFSLENBQVQ7QUFDQSxJQUFJQyxVQUFVLG1CQUFBRCxDQUFRLENBQVIsQ0FBZDs7QUFFQSxJQUFJRSxJQUFJLG1CQUFBRixDQUFRLENBQVIsQ0FBUjs7SUFFcUJHLEk7QUFDbkIsZ0JBQVlDLFFBQVosRUFBc0I7QUFBQTs7QUFDcEIsU0FBS0EsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxTQUFLQyxZQUFMLEdBQW9CLElBQUlKLFFBQVFLLE1BQVosRUFBcEI7QUFDRDs7OztpQ0FFWUMsSSxFQUFNQyxTLEVBQVc7QUFDNUIsVUFBSUMsT0FBTyxJQUFYO0FBQ0EsVUFBSUMsTUFBTVgsR0FBR1ksTUFBSCxDQUFVSCxTQUFWLEVBQXFCSSxTQUFyQixDQUErQixNQUEvQixFQUF1Q0MsTUFBdkMsQ0FBOEMsVUFBU0MsSUFBVCxFQUFlO0FBQ3JFLGVBQU9BLEtBQUtDLElBQUwsS0FBY1IsS0FBS1EsSUFBMUI7QUFDRCxPQUZTLENBQVY7QUFHQSxVQUFJTCxJQUFJTSxNQUFSLEVBQWdCO0FBQ2RqQixXQUFHYSxTQUFILENBQWEsZ0JBQWIsRUFBK0JLLE9BQS9CLENBQXVDLGVBQXZDLEVBQXdELEtBQXhEO0FBQ0FQLFlBQUlPLE9BQUosQ0FBWSxlQUFaLEVBQTZCLElBQTdCO0FBQ0FQLGNBQU1BLElBQUksQ0FBSixFQUFPLENBQVAsQ0FBTjtBQUNBSCxhQUFLVyxJQUFMLEdBQVlSLEdBQVo7QUFDQUQsYUFBS0wsUUFBTCxDQUFjZSxnQkFBZCxDQUErQlIsTUFBL0IsQ0FBc0NKLElBQXRDO0FBQ0Q7QUFD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R2EsQ0FIYjs7QUFLQS9CLFdBQUsrQixJQUFMLENBQVUsV0FBVixFQUF1QixVQUFTNUQsQ0FBVCxFQUFZO0FBQ2pDLFlBQUllLEtBQUs3QixLQUFLTCxRQUFMLENBQWM4QixDQUFkLENBQWdCWCxFQUFFUixJQUFGLEdBQVMsSUFBekIsQ0FBVDtBQUNBdUIsYUFBS3VELFNBQVN2RCxFQUFULEVBQWEsRUFBYixDQUFMO0FBQ0EsWUFBSXdELEtBQUssRUFBVDtBQUNBLGVBQU8sZUFBZXhELEVBQWYsR0FBb0IsR0FBcEIsR0FBMEJ3RCxFQUExQixHQUErQixHQUF0QztBQUNELE9BTEQ7O0FBT0ExQyxXQUFLMkMsSUFBTCxHQUFZQyxNQUFaO0FBQ0Q7Ozs7OztrQkE5TmtCN0YsSSIsImZpbGUiOiIxNC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBkMyA9IHJlcXVpcmUoJ2QzJyk7XG5sZXQgU2lnbmFscyA9IHJlcXVpcmUoJ2pzLXNpZ25hbHMnKTtcbmltcG9ydCBVdGlscyBmcm9tICcuLi9jb3JlL1V0aWxzJztcbmxldCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtleXMge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHRoaXMudGltZWxpbmUgPSB0aW1lbGluZTtcbiAgICB0aGlzLm9uS2V5VXBkYXRlZCA9IG5ldyBTaWduYWxzLlNpZ25hbCgpO1xuICB9XG5cbiAgc2VsZWN0TmV3S2V5KGRhdGEsIGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIga2V5ID0gZDMuc2VsZWN0KGNvbnRhaW5lcikuc2VsZWN0QWxsKCcua2V5JykuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLnRpbWUgPT09IGRhdGEudGltZTtcbiAgICB9KTtcbiAgICBpZiAoa2V5Lmxlbmd0aCkge1xuICAgICAgZDMuc2VsZWN0QWxsKCcua2V5LS1zZWxlY3RlZCcpLmNsYXNzZWQoJ2tleS0tc2VsZWN0ZWQnLCBmYWxzZSk7XG4gICAgICBrZXkuY2xhc3NlZCgna2V5LS1zZWxlY3RlZCcsIHRydWUpO1xuICAgICAga2V5ID0ga2V5WzBdWzBdO1xuICAgICAgZGF0YS5fZG9tID0ga2V5O1xuICAgICAgc2VsZi50aW1lbGluZS5zZWxlY3Rpb25NYW5hZ2VyLnNlbGVjdChkYXRhKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIocHJvcGVydGllcykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgdHdlZW5UaW1lID0gc2VsZi50aW1lbGluZS50d2VlblRpbWU7XG5cbiAgICB2YXIgZHJhZ21vdmUgPSBmdW5jdGlvbihkKSB7XG4gICAgICB2YXIgc291cmNlRXZlbnQgPSBkMy5ldmVudC5zb3VyY2VFdmVudDtcbiAgICAgIHZhciBwcm9wZXJ0eU9iamVjdCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgICAgIHZhciBsaW5lT2JqZWN0ID0gcHJvcGVydHlPYmplY3QucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgICAgdmFyIHByb3BlcnR5RGF0YSA9IGQzLnNlbGVjdChwcm9wZXJ0eU9iamVjdCkuZGF0dW0oKTtcbiAgICAgIHZhciBsaW5lRGF0YSA9IGQzLnNlbGVjdChsaW5lT2JqZWN0KS5kYXR1bSgpO1xuICAgICAgdmFyIGtleV9kYXRhID0gZDtcblxuICAgICAgdmFyIGN1cnJlbnREb21haW5TdGFydCA9IHNlbGYudGltZWxpbmUueC5kb21haW4oKVswXTtcbiAgICAgIHZhciBtb3VzZSA9IGQzLm1vdXNlKHRoaXMpO1xuICAgICAgdmFyIG9sZF90aW1lID0gZC50aW1lO1xuICAgICAgdmFyIGR4ID0gc2VsZi50aW1lbGluZS54LmludmVydChtb3VzZVswXSk7XG4gICAgICBkeCA9IGR4LmdldFRpbWUoKTtcbiAgICAgIGR4ID0gZHggLyAxMDAwIC0gY3VycmVudERvbWFpblN0YXJ0IC8gMTAwMDtcbiAgICAgIGR4ID0gZC50aW1lICsgZHg7XG5cbiAgICAgIHZhciBzZWxlY3Rpb24gPSBzZWxmLnRpbWVsaW5lLnNlbGVjdGlvbk1hbmFnZXIuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICB2YXIgc2VsZWN0aW9uX2ZpcnN0X3RpbWUgPSBmYWxzZTtcbiAgICAgIHZhciBzZWxlY3Rpb25fbGFzdF90aW1lID0gZmFsc2U7XG4gICAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCkge1xuICAgICAgICBzZWxlY3Rpb25fZmlyc3RfdGltZSA9IHNlbGVjdGlvblswXS50aW1lO1xuICAgICAgICBzZWxlY3Rpb25fbGFzdF90aW1lID0gc2VsZWN0aW9uW3NlbGVjdGlvbi5sZW5ndGggLSAxXS50aW1lO1xuICAgICAgfVxuXG4gICAgICBzZWxlY3Rpb24gPSBfLmZpbHRlcihzZWxlY3Rpb24sIChpdGVtKSA9PiB7cmV0dXJuIF8uaXNFcXVhbChpdGVtLCBrZXlfZGF0YSkgPT09IGZhbHNlO30pO1xuXG4gICAgICB2YXIgdGltZU1hdGNoID0gZmFsc2U7XG4gICAgICBpZiAoc291cmNlRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgdGltZU1hdGNoID0gVXRpbHMuZ2V0Q2xvc2VzdFRpbWUodHdlZW5UaW1lLmRhdGEsIGR4LCBsaW5lRGF0YS5pZCwgcHJvcGVydHlEYXRhLm5hbWUsIHR3ZWVuVGltZS50aW1lcik7XG4gICAgICB9XG4gICAgICBpZiAodGltZU1hdGNoID09PSBmYWxzZSkge1xuICAgICAgICB0aW1lTWF0Y2ggPSBkeDtcbiAgICAgIH1cblxuICAgICAgZC50aW1lID0gdGltZU1hdGNoO1xuICAgICAgLy8gU29ydCB0aGUga2V5cyBvZiB0aGUgY3VycmVudCBzZWxlY3RlZCBpdGVtLlxuICAgICAgcHJvcGVydHlEYXRhLmtleXMgPSBVdGlscy5zb3J0S2V5cyhwcm9wZXJ0eURhdGEua2V5cyk7XG4gICAgICB2YXIgdGltZV9vZmZzZXQgPSBkLnRpbWUgLSBvbGRfdGltZTtcblxuICAgICAgdmFyIHVwZGF0ZUtleUl0ZW0gPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHZhciBwcm9wZXJ0eSA9IGl0ZW0uX3Byb3BlcnR5O1xuICAgICAgICBwcm9wZXJ0eS5fbGluZS5faXNEaXJ0eSA9IHRydWU7XG4gICAgICAgIHByb3BlcnR5LmtleXMgPSBVdGlscy5zb3J0S2V5cyhwcm9wZXJ0eS5rZXlzKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBrZXlfc2NhbGUgPSBmYWxzZTtcbiAgICAgIHZhciBpc19maXJzdCA9IGZhbHNlO1xuICAgICAgaWYgKHNlbGVjdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHNvdXJjZUV2ZW50LmFsdEtleSAmJiBzZWxlY3Rpb25fZmlyc3RfdGltZSAhPT0gZmFsc2UgJiYgc2VsZWN0aW9uX2xhc3RfdGltZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBpc19maXJzdCA9IHNlbGVjdGlvbl9maXJzdF90aW1lID09PSBvbGRfdGltZTtcbiAgICAgICAgICBpZiAoaXNfZmlyc3QpIHtcbiAgICAgICAgICAgIGtleV9zY2FsZSA9IChzZWxlY3Rpb25fbGFzdF90aW1lIC0gZC50aW1lKSAvIChzZWxlY3Rpb25fbGFzdF90aW1lIC0gb2xkX3RpbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGtleV9zY2FsZSA9IChkLnRpbWUgLSBzZWxlY3Rpb25fZmlyc3RfdGltZSkgLyAob2xkX3RpbWUgLSBzZWxlY3Rpb25fZmlyc3RfdGltZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxlY3Rpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgZGF0YSA9IHNlbGVjdGlvbltpXTtcbiAgICAgICAgICBpZiAoa2V5X3NjYWxlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZGF0YS50aW1lICs9IHRpbWVfb2Zmc2V0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpc19maXJzdCkge1xuICAgICAgICAgICAgICBkYXRhLnRpbWUgPSBzZWxlY3Rpb25fbGFzdF90aW1lIC0gKHNlbGVjdGlvbl9sYXN0X3RpbWUgLSBkYXRhLnRpbWUpICoga2V5X3NjYWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIGRhdGEudGltZSA9IHNlbGVjdGlvbl9maXJzdF90aW1lICsgKGRhdGEudGltZSAtIHNlbGVjdGlvbl9maXJzdF90aW1lKSAqIGtleV9zY2FsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdXBkYXRlS2V5SXRlbShkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsaW5lRGF0YS5faXNEaXJ0eSA9IHRydWU7XG4gICAgICBzZWxmLm9uS2V5VXBkYXRlZC5kaXNwYXRjaCgpO1xuICAgIH07XG5cbiAgICB2YXIgcHJvcFZhbHVlID0gZnVuY3Rpb24oZCkge1xuICAgICAgcmV0dXJuIGQua2V5cztcbiAgICB9O1xuICAgIHZhciBwcm9wS2V5ID0gZnVuY3Rpb24oZCkge1xuICAgICAgaWYgKCFkLl9pZCkge1xuICAgICAgICBkLl9pZCA9IFV0aWxzLmd1aWQoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkLl9pZDtcbiAgICB9O1xuICAgIHZhciBrZXlzID0gcHJvcGVydGllcy5zZWxlY3QoJy5saW5lLWl0ZW1fX2tleXMnKS5zZWxlY3RBbGwoJy5rZXknKS5kYXRhKHByb3BWYWx1ZSwgcHJvcEtleSk7XG5cbiAgICAvLyBzZWxlY3RLZXkgaXMgdHJpZ2dlcmVkIGJ5IGRyYWdzdGFydCBldmVudFxuICAgIHZhciBzZWxlY3RLZXkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBldmVudCA9IGQzLmV2ZW50O1xuICAgICAgLy8gd2l0aCBkcmFnc3RhcnQgZXZlbnQgdGhlIG1vdXNldmVudCBpcyBpcyBpbnNpZGUgdGhlIGV2ZW50LnNvdXJjRXZlbnRcbiAgICAgIGlmIChldmVudC5zb3VyY2VFdmVudCkge1xuICAgICAgICBldmVudCA9IGV2ZW50LnNvdXJjZUV2ZW50O1xuICAgICAgfVxuXG4gICAgICB2YXIgYWRkVG9TZWxlY3Rpb24gPSBldmVudC5zaGlmdEtleTtcbiAgICAgIC8vIGlmIGVsZW1lbnQgaXMgYWxyZWFkeSBzZWxlY3Rpb25uZWQgYW5kIHdlIGFyZSBvblxuICAgICAgLy8gdGhlIGRyYWdzdGFydCBldmVudCwgd2Ugc3RvcCB0aGVyZSBzaW5jZSBpdCBpcyBhbHJlYWR5IHNlbGVjdGVkLlxuICAgICAgaWYgKGQzLmV2ZW50LnR5cGUgJiYgZDMuZXZlbnQudHlwZSA9PT0gJ2RyYWdzdGFydCcpIHtcbiAgICAgICAgaWYgKGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCdrZXktLXNlbGVjdGVkJykpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBrZXlfZGF0YSA9IGQzLnNlbGVjdCh0aGlzKS5kYXR1bSgpO1xuXG4gICAgICAvLyBBbHNvIGtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIGtleSBkb20gZWxlbWVudC5cbiAgICAgIGtleV9kYXRhLl9kb20gPSB0aGlzO1xuXG4gICAgICBzZWxmLnRpbWVsaW5lLnNlbGVjdGlvbk1hbmFnZXIuc2VsZWN0KGtleV9kYXRhLCBhZGRUb1NlbGVjdGlvbik7XG4gICAgfTtcblxuICAgIHZhciBkcmFnZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICBzZWxmLnRpbWVsaW5lLmVkaXRvci51bmRvTWFuYWdlci5hZGRTdGF0ZSgpO1xuICAgIH07XG5cbiAgICB2YXIgZHJhZyA9IGQzLmJlaGF2aW9yLmRyYWcoKVxuICAgICAgLm9yaWdpbigoZCkgPT4ge3JldHVybiBkO30pXG4gICAgICAub24oJ2RyYWcnLCBkcmFnbW92ZSlcbiAgICAgIC5vbignZHJhZ3N0YXJ0Jywgc2VsZWN0S2V5KVxuICAgICAgLm9uKCdkcmFnZW5kJywgZHJhZ2VuZCk7XG5cbiAgICB2YXIga2V5X2dycCA9IGtleXMuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAna2V5JylcbiAgICAgIC8vIFVzZSB0aGUgdW5pcXVlIGlkIGFkZGVkIGluIHByb3BLZXkgYWJvdmUgZm9yIHRoZSBkb20gZWxlbWVudCBpZC5cbiAgICAgIC5hdHRyKCdpZCcsIChkKSA9PiB7cmV0dXJuIGQuX2lkO30pXG4gICAgICAub24oJ21vdXNlZG93bicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBEb24ndCB0cmlnZ2VyIG1vdXNlZG93biBvbiBsaW5lc2NvbnRhaW5lciBlbHNlXG4gICAgICAgIC8vIGl0IGNyZWF0ZSB0aGUgc2VsZWN0aW9uIHJlY3RhbmdsZVxuICAgICAgICBkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH0pXG4gICAgICAuY2FsbChkcmFnKTtcblxuICAgIHByb3BlcnRpZXMuc2VsZWN0QWxsKCcua2V5JylcbiAgICAgIC5hdHRyKCdjbGFzcycsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgdmFyIGNscyA9ICdrZXknO1xuICAgICAgICAvLyBrZWVwIHNlbGVjdGVkIGNsYXNzXG4gICAgICAgIGlmIChkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgna2V5LS1zZWxlY3RlZCcpKSB7XG4gICAgICAgICAgY2xzICs9ICcga2V5LS1zZWxlY3RlZCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGQuZWFzZSkge1xuICAgICAgICAgIHZhciBlYXNlID0gZC5lYXNlLnNwbGl0KCcuJyk7XG4gICAgICAgICAgaWYgKGVhc2UubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICBjbHMgKz0gJyAnICsgZWFzZVsxXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgLy8gSWYgbm8gZWFzaW5nIHNwZWNpZmllZCwgdGhlIGl0J3MgdGhlIGRlZmF1bHQgUXVhZC5lYXNlT3V0XG4gICAgICAgICAgY2xzICs9ICcgZWFzZU91dCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNscztcbiAgICAgIH0pO1xuXG4gICAgdmFyIGdycF9saW5lYXIgPSBrZXlfZ3JwLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnZWFzZS1saW5lYXInKTtcbiAgICBncnBfbGluZWFyLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAna2V5X19zaGFwZS1hcnJvdycpXG4gICAgICAuYXR0cignZCcsICdNIDAgLTYgTCA2IDAgTCAwIDYnKTtcbiAgICBncnBfbGluZWFyLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAna2V5X19zaGFwZS1hcnJvdycpXG4gICAgICAuYXR0cignZCcsICdNIDAgLTYgTCAtNiAwIEwgMCA2Jyk7XG5cbiAgICB2YXIgZ3JwX2luID0ga2V5X2dycC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2Vhc2UtaW4nKTtcbiAgICBncnBfaW4uYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdrZXlfX3NoYXBlLXJlY3QnKVxuICAgICAgLmF0dHIoJ2QnLCAnTSAwIC02IEwgMCA2IEwgNCA1IEwgMSAwIEwgNCAtNScpO1xuICAgIGdycF9pbi5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2tleV9fc2hhcGUtYXJyb3cnKVxuICAgICAgLmF0dHIoJ2QnLCAnTSAwIC02IEwgLTYgMCBMIDAgNicpO1xuXG4gICAgdmFyIGdycF9vdXQgPSBrZXlfZ3JwLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnZWFzZS1vdXQnKTtcbiAgICBncnBfb3V0LmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAna2V5X19zaGFwZS1yZWN0JylcbiAgICAgIC5hdHRyKCdkJywgJ00gMCAtNiBMIDAgNiBMIC00IDUgTCAtMSAwIEwgLTQgLTUnKTtcbiAgICBncnBfb3V0LmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAna2V5X19zaGFwZS1hcnJvdycpXG4gICAgICAuYXR0cignZCcsICdNIDAgLTYgTCA2IDAgTCAwIDYnKTtcblxuICAgIHZhciBncnBfaW5vdXQgPSBrZXlfZ3JwLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnZWFzZS1pbm91dCcpO1xuICAgIGdycF9pbm91dC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0cignY3gnLCAwKVxuICAgICAgLmF0dHIoJ2N5JywgMClcbiAgICAgIC5hdHRyKCdyJywgNSk7XG5cbiAgICBrZXlzLmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgIHZhciBkeCA9IHNlbGYudGltZWxpbmUueChkLnRpbWUgKiAxMDAwKTtcbiAgICAgIGR4ID0gcGFyc2VJbnQoZHgsIDEwKTtcbiAgICAgIHZhciBkeSA9IDEwO1xuICAgICAgcmV0dXJuICd0cmFuc2xhdGUoJyArIGR4ICsgJywnICsgZHkgKyAnKSc7XG4gICAgfSk7XG5cbiAgICBrZXlzLmV4aXQoKS5yZW1vdmUoKTtcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9ncmFwaC9LZXlzLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");
=======
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Utils = __webpack_require__(1);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var d3 = __webpack_require__(13);
	var Signals = __webpack_require__(5);
	
	var _ = __webpack_require__(10);
	
	var Keys = function () {
	  function Keys(timeline) {
	    _classCallCheck(this, Keys);
	
	    this.timeline = timeline;
	    this.onKeyUpdated = new Signals.Signal();
	  }
	
	  _createClass(Keys, [{
	    key: 'selectNewKey',
	    value: function selectNewKey(data, container) {
	      var self = this;
	      var key = d3.select(container).selectAll('.key').filter(function (item) {
	        return item.time === data.time;
	      });
	      if (key.length) {
	        d3.selectAll('.key--selected').classed('key--selected', false);
	        key.classed('key--selected', true);
	        key = key[0][0];
	        data._dom = key;
	        self.timeline.selectionManager.select(data);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render(properties) {
	      var self = this;
	      var tweenTime = self.timeline.tweenTime;
	
	      var dragmove = function dragmove(d) {
	        var sourceEvent = d3.event.sourceEvent;
	        var propertyObject = this.parentNode;
	        var lineObject = propertyObject.parentNode.parentNode;
	        var propertyData = d3.select(propertyObject).datum();
	        var lineData = d3.select(lineObject).datum();
	        var key_data = d;
	
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
	          selection_first_time = selection[0].time;
	          selection_last_time = selection[selection.length - 1].time;
	        }
	
	        selection = _.filter(selection, function (item) {
	          return _.isEqual(item, key_data) === false;
	        });
	
	        var timeMatch = false;
	        if (sourceEvent.shiftKey) {
	          timeMatch = _Utils2.default.getClosestTime(tweenTime.data, dx, lineData.id, propertyData.name, tweenTime.timer);
	        }
	        if (timeMatch === false) {
	          timeMatch = dx;
	        }
	
	        d.time = timeMatch;
	        // Sort the keys of the current selected item.
	        propertyData.keys = _Utils2.default.sortKeys(propertyData.keys);
	        var time_offset = d.time - old_time;
	
	        var updateKeyItem = function updateKeyItem(item) {
	          var property = item._property;
	          property._line._isDirty = true;
	          property.keys = _Utils2.default.sortKeys(property.keys);
	        };
	
	        var key_scale = false;
	        var is_first = false;
	        if (selection.length) {
	          if (sourceEvent.altKey && selection_first_time !== false && selection_last_time !== false) {
	            is_first = selection_first_time === old_time;
	            if (is_first) {
	              key_scale = (selection_last_time - d.time) / (selection_last_time - old_time);
	            } else {
	              key_scale = (d.time - selection_first_time) / (old_time - selection_first_time);
	            }
	          }
	
	          for (var i = 0; i < selection.length; i++) {
	            var data = selection[i];
	            if (key_scale === false) {
	              data.time += time_offset;
	            } else {
	              if (is_first) {
	                data.time = selection_last_time - (selection_last_time - data.time) * key_scale;
	              } else {
	                data.time = selection_first_time + (data.time - selection_first_time) * key_scale;
	              }
	            }
	            updateKeyItem(data);
	          }
	        }
	
	        lineData._isDirty = true;
	        self.onKeyUpdated.dispatch();
	      };
	
	      var propValue = function propValue(d) {
	        return d.keys;
	      };
	      var propKey = function propKey(d) {
	        if (!d._id) {
	          d._id = _Utils2.default.guid();
	        }
	        return d._id;
	      };
	      var keys = properties.select('.line-item__keys').selectAll('.key').data(propValue, propKey);
	
	      // selectKey is triggered by dragstart event
	      var selectKey = function selectKey() {
	        var event = d3.event;
	        // with dragstart event the mousevent is is inside the event.sourcEvent
	        if (event.sourceEvent) {
	          event = event.sourceEvent;
	        }
	
	        var addToSelection = event.shiftKey;
	        // if element is already selectionned and we are on
	        // the dragstart event, we stop there since it is already selected.
	        if (d3.event.type && d3.event.type === 'dragstart') {
	          if (d3.select(this).classed('key--selected')) {
	            return;
	          }
	        }
	        var key_data = d3.select(this).datum();
	
	        // Also keep a reference to the key dom element.
	        key_data._dom = this;
	
	        self.timeline.selectionManager.select(key_data, addToSelection);
	      };
	
	      var dragend = function dragend() {
	        self.timeline.editor.undoManager.addState();
	      };
	
	      var drag = d3.behavior.drag().origin(function (d) {
	        return d;
	      }).on('drag', dragmove).on('dragstart', selectKey).on('dragend', dragend);
	
	      var key_grp = keys.enter().append('g').attr('class', 'key')
	      // Use the unique id added in propKey above for the dom element id.
	      .attr('id', function (d) {
	        return d._id;
	      }).on('mousedown', function () {
	        // Don't trigger mousedown on linescontainer else
	        // it create the selection rectangle
	        d3.event.stopPropagation();
	      }).call(drag);
	
	      properties.selectAll('.key').attr('class', function (d) {
	        var cls = 'key';
	        // keep selected class
	        if (d3.select(this).classed('key--selected')) {
	          cls += ' key--selected';
	        }
	        if (d.ease) {
	          var ease = d.ease.split('.');
	          if (ease.length === 2) {
	            cls += ' ' + ease[1];
	          }
	        } else {
	          // If no easing specified, the it's the default Quad.easeOut
	          cls += ' easeOut';
	        }
	        return cls;
	      });
	
	      var grp_linear = key_grp.append('g').attr('class', 'ease-linear');
	      grp_linear.append('path').attr('class', 'key__shape-arrow').attr('d', 'M 0 -6 L 6 0 L 0 6');
	      grp_linear.append('path').attr('class', 'key__shape-arrow').attr('d', 'M 0 -6 L -6 0 L 0 6');
	
	      var grp_in = key_grp.append('g').attr('class', 'ease-in');
	      grp_in.append('path').attr('class', 'key__shape-rect').attr('d', 'M 0 -6 L 0 6 L 4 5 L 1 0 L 4 -5');
	      grp_in.append('path').attr('class', 'key__shape-arrow').attr('d', 'M 0 -6 L -6 0 L 0 6');
	
	      var grp_out = key_grp.append('g').attr('class', 'ease-out');
	      grp_out.append('path').attr('class', 'key__shape-rect').attr('d', 'M 0 -6 L 0 6 L -4 5 L -1 0 L -4 -5');
	      grp_out.append('path').attr('class', 'key__shape-arrow').attr('d', 'M 0 -6 L 6 0 L 0 6');
	
	      var grp_inout = key_grp.append('g').attr('class', 'ease-inout');
	      grp_inout.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 5);
	
	      keys.attr('transform', function (d) {
	        var dx = self.timeline.x(d.time * 1000);
	        dx = parseInt(dx, 10);
	        var dy = 10;
	        return 'translate(' + dx + ',' + dy + ')';
	      });
	
	      keys.exit().remove();
	    }
	  }]);
	
	  return Keys;
	}();
	
	exports.default = Keys;
>>>>>>> master

/***/ },
/* 19 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Errors = function () {\n  function Errors(timeline) {\n    _classCallCheck(this, Errors);\n\n    this.timeline = timeline;\n  }\n\n  _createClass(Errors, [{\n    key: 'render',\n    value: function render(properties) {\n      var self = this;\n      var subGrp = self.timeline.properties.subGrp;\n      var propertiesWithError = function propertiesWithError(d) {\n        return d.errors !== undefined;\n      };\n      // use insert with :first-child to prepend.\n      subGrp.insert('svg', ':first-child').attr('class', 'line-item__errors').attr('width', window.innerWidth - self.timeline.label_position_x).attr('height', self.timeline.lineHeight);\n\n      var errorsValue = function errorsValue(d) {\n        return d.errors;\n      };\n      var errorTime = function errorTime(d) {\n        return d.time;\n      };\n\n      var errors = properties.filter(propertiesWithError).select('.line-item__errors').selectAll('.error').data(errorsValue, errorTime);\n\n      errors.enter().append('rect').attr('class', 'error').attr('width', 4).attr('height', self.timeline.lineHeight - 1).attr('y', '1');\n\n      properties.selectAll('.error').attr('x', function (d) {\n        var dx;\n        dx = self.timeline.x(d.time * 1000);\n        return dx;\n      });\n\n      errors.exit().remove();\n    }\n  }]);\n\n  return Errors;\n}();\n\nexports.default = Errors;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ncmFwaC9FcnJvcnMuanM/OWVmMSJdLCJuYW1lcyI6WyJFcnJvcnMiLCJ0aW1lbGluZSIsInByb3BlcnRpZXMiLCJzZWxmIiwic3ViR3JwIiwicHJvcGVydGllc1dpdGhFcnJvciIsImQiLCJlcnJvcnMiLCJ1bmRlZmluZWQiLCJpbnNlcnQiLCJhdHRyIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImxhYmVsX3Bvc2l0aW9uX3giLCJsaW5lSGVpZ2h0IiwiZXJyb3JzVmFsdWUiLCJlcnJvclRpbWUiLCJ0aW1lIiwiZmlsdGVyIiwic2VsZWN0Iiwic2VsZWN0QWxsIiwiZGF0YSIsImVudGVyIiwiYXBwZW5kIiwiZHgiLCJ4IiwiZXhpdCIsInJlbW92ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFxQkEsTTtBQUNuQixrQkFBWUMsUUFBWixFQUFzQjtBQUFBOztBQUNwQixTQUFLQSxRQUFMLEdBQWdCQSxRQUFoQjtBQUNEOzs7OzJCQUVNQyxVLEVBQVk7QUFDakIsVUFBSUMsT0FBTyxJQUFYO0FBQ0EsVUFBSUMsU0FBU0QsS0FBS0YsUUFBTCxDQUFjQyxVQUFkLENBQXlCRSxNQUF0QztBQUNBLFVBQUlDLHNCQUFzQixTQUF0QkEsbUJBQXNCLENBQVNDLENBQVQsRUFBWTtBQUNwQyxlQUFPQSxFQUFFQyxNQUFGLEtBQWFDLFNBQXBCO0FBQ0QsT0FGRDtBQUdBO0FBQ0FKLGFBQU9LLE1BQVAsQ0FBYyxLQUFkLEVBQXFCLGNBQXJCLEVBQ0dDLElBREgsQ0FDUSxPQURSLEVBQ2lCLG1CQURqQixFQUVHQSxJQUZILENBRVEsT0FGUixFQUVpQkMsT0FBT0MsVUFBUCxHQUFvQlQsS0FBS0YsUUFBTCxDQUFjWSxnQkFGbkQsRUFHR0gsSUFISCxDQUdRLFFBSFIsRUFHa0JQLEtBQUtGLFFBQUwsQ0FBY2EsVUFIaEM7O0FBS0EsVUFBSUMsY0FBYyxTQUFkQSxXQUFjLENBQVNULENBQVQsRUFBWTtBQUM1QixlQUFPQSxFQUFFQyxNQUFUO0FBQ0QsT0FGRDtBQUdBLFVBQUlTLFlBQVksU0FBWkEsU0FBWSxDQUFTVixDQUFULEVBQVk7QUFDMUIsZUFBT0EsRUFBRVcsSUFBVDtBQUNELE9BRkQ7O0FBSUEsVUFBSVYsU0FBU0wsV0FBV2dCLE1BQVgsQ0FBa0JiLG1CQUFsQixFQUNWYyxNQURVLENBQ0gsb0JBREcsRUFDbUJDLFNBRG5CLENBQzZCLFFBRDdCLEVBRVZDLElBRlUsQ0FFTE4sV0FGSyxFQUVRQyxTQUZSLENBQWI7O0FBSUFULGFBQU9lLEtBQVAsR0FBZUMsTUFBZixDQUFzQixNQUF0QixFQUNHYixJQURILENBQ1EsT0FEUixFQUNpQixPQURqQixFQUVHQSxJQUZILENBRVEsT0FGUixFQUVpQixDQUZqQixFQUdHQSxJQUhILENBR1EsUUFIUixFQUdrQlAsS0FBS0YsUUFBTCxDQUFjYSxVQUFkLEdBQTJCLENBSDdDLEVBSUdKLElBSkgsQ0FJUSxHQUpSLEVBSWEsR0FKYjs7QUFNQVIsaUJBQVdrQixTQUFYLENBQXFCLFFBQXJCLEVBQStCVixJQUEvQixDQUFvQyxHQUFwQyxFQUF5QyxVQUFTSixDQUFULEVBQVk7QUFDbkQsWUFBSWtCLEVBQUo7QUFDQUEsYUFBS3JCLEtBQUtGLFFBQUwsQ0FBY3dCLENBQWQsQ0FBZ0JuQixFQUFFVyxJQUFGLEdBQVMsSUFBekIsQ0FBTDtBQUNBLGVBQU9PLEVBQVA7QUFDRCxPQUpEOztBQU1BakIsYUFBT21CLElBQVAsR0FBY0MsTUFBZDtBQUNEOzs7Ozs7a0JBekNrQjNCLE0iLCJmaWxlIjoiMTUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBFcnJvcnMge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHRoaXMudGltZWxpbmUgPSB0aW1lbGluZTtcbiAgfVxuXG4gIHJlbmRlcihwcm9wZXJ0aWVzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBzdWJHcnAgPSBzZWxmLnRpbWVsaW5lLnByb3BlcnRpZXMuc3ViR3JwO1xuICAgIHZhciBwcm9wZXJ0aWVzV2l0aEVycm9yID0gZnVuY3Rpb24oZCkge1xuICAgICAgcmV0dXJuIGQuZXJyb3JzICE9PSB1bmRlZmluZWQ7XG4gICAgfTtcbiAgICAvLyB1c2UgaW5zZXJ0IHdpdGggOmZpcnN0LWNoaWxkIHRvIHByZXBlbmQuXG4gICAgc3ViR3JwLmluc2VydCgnc3ZnJywgJzpmaXJzdC1jaGlsZCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbGluZS1pdGVtX19lcnJvcnMnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgd2luZG93LmlubmVyV2lkdGggLSBzZWxmLnRpbWVsaW5lLmxhYmVsX3Bvc2l0aW9uX3gpXG4gICAgICAuYXR0cignaGVpZ2h0Jywgc2VsZi50aW1lbGluZS5saW5lSGVpZ2h0KTtcblxuICAgIHZhciBlcnJvcnNWYWx1ZSA9IGZ1bmN0aW9uKGQpIHtcbiAgICAgIHJldHVybiBkLmVycm9ycztcbiAgICB9O1xuICAgIHZhciBlcnJvclRpbWUgPSBmdW5jdGlvbihkKSB7XG4gICAgICByZXR1cm4gZC50aW1lO1xuICAgIH07XG5cbiAgICB2YXIgZXJyb3JzID0gcHJvcGVydGllcy5maWx0ZXIocHJvcGVydGllc1dpdGhFcnJvcilcbiAgICAgIC5zZWxlY3QoJy5saW5lLWl0ZW1fX2Vycm9ycycpLnNlbGVjdEFsbCgnLmVycm9yJylcbiAgICAgIC5kYXRhKGVycm9yc1ZhbHVlLCBlcnJvclRpbWUpO1xuXG4gICAgZXJyb3JzLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdlcnJvcicpXG4gICAgICAuYXR0cignd2lkdGgnLCA0KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIHNlbGYudGltZWxpbmUubGluZUhlaWdodCAtIDEpXG4gICAgICAuYXR0cigneScsICcxJyk7XG5cbiAgICBwcm9wZXJ0aWVzLnNlbGVjdEFsbCgnLmVycm9yJykuYXR0cigneCcsIGZ1bmN0aW9uKGQpIHtcbiAgICAgIHZhciBkeDtcbiAgICAgIGR4ID0gc2VsZi50aW1lbGluZS54KGQudGltZSAqIDEwMDApO1xuICAgICAgcmV0dXJuIGR4O1xuICAgIH0pO1xuXG4gICAgZXJyb3JzLmV4aXQoKS5yZW1vdmUoKTtcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9ncmFwaC9FcnJvcnMuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar d3 = __webpack_require__(9);\n\nvar Selection = function () {\n  function Selection(timeline, svg, margin) {\n    _classCallCheck(this, Selection);\n\n    this.timeline = timeline;\n    this.svg = svg;\n    this.margin = margin;\n\n    this.onMouseUp = this.onMouseUp.bind(this);\n    this.init();\n  }\n\n  _createClass(Selection, [{\n    key: 'onMouseUp',\n    value: function onMouseUp() {\n      this.svg.selectAll('.selection').remove();\n      // Enable again the default browser text selection.\n      // Disabled this because is was causing problems with text higlhlighting\n      // $('body').css({\n      //   'user-select': 'all'\n      // });\n    }\n  }, {\n    key: 'init',\n    value: function init() {\n      var self = this;\n      this.svg.on('mousedown', function () {\n        var p = d3.mouse(this);\n        // Only init selection if we click on the timeline and not on the labels.\n        if (p[0] < self.timeline.margin.left) {\n          return;\n        }\n        self.svg.append('rect').attr({\n          class: 'selection',\n          x: p[0],\n          y: p[1],\n          width: 0,\n          height: 0\n        });\n        // Unselect items.\n        self.timeline.selectionManager.reset();\n        // Prevent default browser text selection.\n        $('body').css({\n          'user-select': 'none'\n        });\n      }).on('mousemove', function () {\n        var s = self.svg.select('.selection');\n        if (s.empty()) {\n          return;\n        }\n        var p = d3.mouse(this);\n        var d = {\n          x: parseInt(s.attr('x'), 10),\n          y: parseInt(s.attr('y'), 10),\n          width: parseInt(s.attr('width'), 10),\n          height: parseInt(s.attr('height'), 10)\n        };\n        // Apply margin to mouse selection.\n        p[0] = Math.max(self.margin.left, p[0]);\n\n        var move = {\n          x: p[0] - d.x,\n          y: p[1] - d.y\n        };\n        if (move.x < 1 || move.x * 2 < d.width) {\n          d.x = p[0];\n          d.width -= move.x;\n        } else {\n          d.width = move.x;\n        }\n\n        if (move.y < 1 || move.y * 2 < d.height) {\n          d.y = p[1];\n          d.height -= move.y;\n        } else {\n          d.height = move.y;\n        }\n\n        s.attr(d);\n\n        // remove margins from selection\n        d.x -= self.margin.left;\n        var key_width = 6;\n\n        d.timeStart = self.timeline.x.invert(d.x - key_width).getTime() / 1000;\n        d.timeEnd = self.timeline.x.invert(d.x + d.width + key_width).getTime() / 1000;\n        var containerBounding = self.svg[0][0].getBoundingClientRect();\n\n        // deselect all previously selected items\n        d3.selectAll('.key--selected').classed('key--selected', false);\n        self.timeline.selectionManager.reset();\n        var selection = [];\n        d3.selectAll('.key').each(function (state_data) {\n          var item_data = d3.select(this.parentNode.parentNode.parentNode).datum();\n          var key_data = d3.select(this).datum();\n\n          // Also keep a reference to the key dom element.\n          key_data._dom = this;\n\n          if (item_data.collapsed !== true) {\n            var itemBounding = d3.select(this)[0][0].getBoundingClientRect();\n            var y = itemBounding.top - containerBounding.top;\n            if (state_data.time >= d.timeStart && state_data.time <= d.timeEnd) {\n              // use or condition for top and bottom\n              if (y >= d.y && y <= d.y + d.height || y + 10 >= d.y && y + 10 <= d.y + d.height) {\n                d3.select(this).classed('key--selected', true);\n\n                selection.push(key_data);\n              }\n            }\n          }\n        });\n        self.timeline.selectionManager.select(selection);\n      });\n      // Attach the mouseup event to window so that it catch it event if\n      // mouseup happen outside of the browser window.\n      $(window).on('mouseup', this.onMouseUp);\n    }\n  }]);\n\n  return Selection;\n}();\n\nexports.default = Selection;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ncmFwaC9TZWxlY3Rpb24uanM/MzRhZiJdLCJuYW1lcyI6WyJkMyIsInJlcXVpcmUiLCJTZWxlY3Rpb24iLCJ0aW1lbGluZSIsInN2ZyIsIm1hcmdpbiIsIm9uTW91c2VVcCIsImJpbmQiLCJpbml0Iiwic2VsZWN0QWxsIiwicmVtb3ZlIiwic2VsZiIsIm9uIiwicCIsIm1vdXNlIiwibGVmdCIsImFwcGVuZCIsImF0dHIiLCJjbGFzcyIsIngiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiLCJzZWxlY3Rpb25NYW5hZ2VyIiwicmVzZXQiLCIkIiwiY3NzIiwicyIsInNlbGVjdCIsImVtcHR5IiwiZCIsInBhcnNlSW50IiwiTWF0aCIsIm1heCIsIm1vdmUiLCJrZXlfd2lkdGgiLCJ0aW1lU3RhcnQiLCJpbnZlcnQiLCJnZXRUaW1lIiwidGltZUVuZCIsImNvbnRhaW5lckJvdW5kaW5nIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xhc3NlZCIsInNlbGVjdGlvbiIsImVhY2giLCJzdGF0ZV9kYXRhIiwiaXRlbV9kYXRhIiwicGFyZW50Tm9kZSIsImRhdHVtIiwia2V5X2RhdGEiLCJfZG9tIiwiY29sbGFwc2VkIiwiaXRlbUJvdW5kaW5nIiwidG9wIiwidGltZSIsInB1c2giLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxLQUFLLG1CQUFBQyxDQUFRLENBQVIsQ0FBVDs7SUFFcUJDLFM7QUFDbkIscUJBQVlDLFFBQVosRUFBc0JDLEdBQXRCLEVBQTJCQyxNQUEzQixFQUFtQztBQUFBOztBQUNqQyxTQUFLRixRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLFNBQUtDLEdBQUwsR0FBV0EsR0FBWDtBQUNBLFNBQUtDLE1BQUwsR0FBY0EsTUFBZDs7QUFFQSxTQUFLQyxTQUFMLEdBQWlCLEtBQUtBLFNBQUwsQ0FBZUMsSUFBZixDQUFvQixJQUFwQixDQUFqQjtBQUNBLFNBQUtDLElBQUw7QUFDRDs7OztnQ0FFVztBQUNW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LElBQW1CeEIsRUFBRVMsT0FBM0QsRUFBb0U7QUFDbEU7QUFDQSxrQkFBSW5CLEtBQUtVLEVBQUVWLENBQVAsSUFBWUEsS0FBS1UsRUFBRVYsQ0FBRixHQUFNVSxFQUFFUixNQUF6QixJQUFtQ0YsSUFBSSxFQUFKLElBQVVVLEVBQUVWLENBQVosSUFBaUJBLElBQUksRUFBSixJQUFVVSxFQUFFVixDQUFGLEdBQU1VLEVBQUVSLE1BQTFFLEVBQWtGO0FBQ2hGdEIsbUJBQUc0QixNQUFILENBQVUsSUFBVixFQUFnQmMsT0FBaEIsQ0FBd0IsZUFBeEIsRUFBeUMsSUFBekM7O0FBRUFDLDBCQUFVWSxJQUFWLENBQWVOLFFBQWY7QUFDRDtBQUNGO0FBQ0Y7QUFDRixTQW5CRDtBQW9CQXRDLGFBQUtSLFFBQUwsQ0FBY29CLGdCQUFkLENBQStCSyxNQUEvQixDQUFzQ2UsU0FBdEM7QUFDRCxPQTFGRDtBQTJGQTtBQUNBO0FBQ0FsQixRQUFFK0IsTUFBRixFQUFVNUMsRUFBVixDQUFhLFNBQWIsRUFBd0IsS0FBS04sU0FBN0I7QUFDRDs7Ozs7O2tCQW5Ia0JKLFMiLCJmaWxlIjoiMTYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgZDMgPSByZXF1aXJlKCdkMycpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3Rpb24ge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSwgc3ZnLCBtYXJnaW4pIHtcbiAgICB0aGlzLnRpbWVsaW5lID0gdGltZWxpbmU7XG4gICAgdGhpcy5zdmcgPSBzdmc7XG4gICAgdGhpcy5tYXJnaW4gPSBtYXJnaW47XG5cbiAgICB0aGlzLm9uTW91c2VVcCA9IHRoaXMub25Nb3VzZVVwLmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBvbk1vdXNlVXAoKSB7XG4gICAgdGhpcy5zdmcuc2VsZWN0QWxsKCcuc2VsZWN0aW9uJykucmVtb3ZlKCk7XG4gICAgLy8gRW5hYmxlIGFnYWluIHRoZSBkZWZhdWx0IGJyb3dzZXIgdGV4dCBzZWxlY3Rpb24uXG4gICAgLy8gRGlzYWJsZWQgdGhpcyBiZWNhdXNlIGlzIHdhcyBjYXVzaW5nIHByb2JsZW1zIHdpdGggdGV4dCBoaWdsaGxpZ2h0aW5nXG4gICAgLy8gJCgnYm9keScpLmNzcyh7XG4gICAgLy8gICAndXNlci1zZWxlY3QnOiAnYWxsJ1xuICAgIC8vIH0pO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5zdmcub24oJ21vdXNlZG93bicsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHAgPSBkMy5tb3VzZSh0aGlzKTtcbiAgICAgIC8vIE9ubHkgaW5pdCBzZWxlY3Rpb24gaWYgd2UgY2xpY2sgb24gdGhlIHRpbWVsaW5lIGFuZCBub3Qgb24gdGhlIGxhYmVscy5cbiAgICAgIGlmIChwWzBdIDwgc2VsZi50aW1lbGluZS5tYXJnaW4ubGVmdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWxmLnN2Zy5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0cih7XG4gICAgICAgICAgY2xhc3M6ICdzZWxlY3Rpb24nLFxuICAgICAgICAgIHg6IHBbMF0sXG4gICAgICAgICAgeTogcFsxXSxcbiAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICBoZWlnaHQ6IDBcbiAgICAgICAgfSk7XG4gICAgICAvLyBVbnNlbGVjdCBpdGVtcy5cbiAgICAgIHNlbGYudGltZWxpbmUuc2VsZWN0aW9uTWFuYWdlci5yZXNldCgpO1xuICAgICAgLy8gUHJldmVudCBkZWZhdWx0IGJyb3dzZXIgdGV4dCBzZWxlY3Rpb24uXG4gICAgICAkKCdib2R5JykuY3NzKHtcbiAgICAgICAgJ3VzZXItc2VsZWN0JzogJ25vbmUnXG4gICAgICB9KTtcbiAgICB9KS5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcyA9IHNlbGYuc3ZnLnNlbGVjdCgnLnNlbGVjdGlvbicpO1xuICAgICAgaWYgKHMuZW1wdHkoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgcCA9IGQzLm1vdXNlKHRoaXMpO1xuICAgICAgdmFyIGQgPSB7XG4gICAgICAgIHg6IHBhcnNlSW50KHMuYXR0cigneCcpLCAxMCksXG4gICAgICAgIHk6IHBhcnNlSW50KHMuYXR0cigneScpLCAxMCksXG4gICAgICAgIHdpZHRoOiBwYXJzZUludChzLmF0dHIoJ3dpZHRoJyksIDEwKSxcbiAgICAgICAgaGVpZ2h0OiBwYXJzZUludChzLmF0dHIoJ2hlaWdodCcpLCAxMClcbiAgICAgIH07XG4gICAgICAvLyBBcHBseSBtYXJnaW4gdG8gbW91c2Ugc2VsZWN0aW9uLlxuICAgICAgcFswXSA9IE1hdGgubWF4KHNlbGYubWFyZ2luLmxlZnQsIHBbMF0pO1xuXG4gICAgICB2YXIgbW92ZSA9IHtcbiAgICAgICAgeDogcFswXSAtIGQueCxcbiAgICAgICAgeTogcFsxXSAtIGQueVxuICAgICAgfTtcbiAgICAgIGlmIChtb3ZlLnggPCAxIHx8IG1vdmUueCAqIDIgPCBkLndpZHRoKSB7XG4gICAgICAgIGQueCA9IHBbMF07XG4gICAgICAgIGQud2lkdGggLT0gbW92ZS54O1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGQud2lkdGggPSBtb3ZlLng7XG4gICAgICB9XG5cbiAgICAgIGlmIChtb3ZlLnkgPCAxIHx8IG1vdmUueSAqIDIgPCBkLmhlaWdodCkge1xuICAgICAgICBkLnkgPSBwWzFdO1xuICAgICAgICBkLmhlaWdodCAtPSBtb3ZlLnk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZC5oZWlnaHQgPSBtb3ZlLnk7XG4gICAgICB9XG5cbiAgICAgIHMuYXR0cihkKTtcblxuICAgICAgLy8gcmVtb3ZlIG1hcmdpbnMgZnJvbSBzZWxlY3Rpb25cbiAgICAgIGQueCAtPSBzZWxmLm1hcmdpbi5sZWZ0O1xuICAgICAgdmFyIGtleV93aWR0aCA9IDY7XG5cbiAgICAgIGQudGltZVN0YXJ0ID0gc2VsZi50aW1lbGluZS54LmludmVydChkLnggLSBrZXlfd2lkdGgpLmdldFRpbWUoKSAvIDEwMDA7XG4gICAgICBkLnRpbWVFbmQgPSBzZWxmLnRpbWVsaW5lLnguaW52ZXJ0KGQueCArIGQud2lkdGggKyBrZXlfd2lkdGgpLmdldFRpbWUoKSAvIDEwMDA7XG4gICAgICB2YXIgY29udGFpbmVyQm91bmRpbmcgPSBzZWxmLnN2Z1swXVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgLy8gZGVzZWxlY3QgYWxsIHByZXZpb3VzbHkgc2VsZWN0ZWQgaXRlbXNcbiAgICAgIGQzLnNlbGVjdEFsbCgnLmtleS0tc2VsZWN0ZWQnKS5jbGFzc2VkKCdrZXktLXNlbGVjdGVkJywgZmFsc2UpO1xuICAgICAgc2VsZi50aW1lbGluZS5zZWxlY3Rpb25NYW5hZ2VyLnJlc2V0KCk7XG4gICAgICB2YXIgc2VsZWN0aW9uID0gW107XG4gICAgICBkMy5zZWxlY3RBbGwoJy5rZXknKS5lYWNoKCBmdW5jdGlvbihzdGF0ZV9kYXRhKSB7XG4gICAgICAgIHZhciBpdGVtX2RhdGEgPSBkMy5zZWxlY3QodGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZSkuZGF0dW0oKTtcbiAgICAgICAgdmFyIGtleV9kYXRhID0gZDMuc2VsZWN0KHRoaXMpLmRhdHVtKCk7XG5cbiAgICAgICAgLy8gQWxzbyBrZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSBrZXkgZG9tIGVsZW1lbnQuXG4gICAgICAgIGtleV9kYXRhLl9kb20gPSB0aGlzO1xuXG4gICAgICAgIGlmIChpdGVtX2RhdGEuY29sbGFwc2VkICE9PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIGl0ZW1Cb3VuZGluZyA9IGQzLnNlbGVjdCh0aGlzKVswXVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICB2YXIgeSA9IGl0ZW1Cb3VuZGluZy50b3AgLSBjb250YWluZXJCb3VuZGluZy50b3A7XG4gICAgICAgICAgaWYgKHN0YXRlX2RhdGEudGltZSA+PSBkLnRpbWVTdGFydCAmJiBzdGF0ZV9kYXRhLnRpbWUgPD0gZC50aW1lRW5kKSB7XG4gICAgICAgICAgICAvLyB1c2Ugb3IgY29uZGl0aW9uIGZvciB0b3AgYW5kIGJvdHRvbVxuICAgICAgICAgICAgaWYgKHkgPj0gZC55ICYmIHkgPD0gZC55ICsgZC5oZWlnaHQgfHwgeSArIDEwID49IGQueSAmJiB5ICsgMTAgPD0gZC55ICsgZC5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ2tleS0tc2VsZWN0ZWQnLCB0cnVlKTtcblxuICAgICAgICAgICAgICBzZWxlY3Rpb24ucHVzaChrZXlfZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHNlbGYudGltZWxpbmUuc2VsZWN0aW9uTWFuYWdlci5zZWxlY3Qoc2VsZWN0aW9uKTtcbiAgICB9KTtcbiAgICAvLyBBdHRhY2ggdGhlIG1vdXNldXAgZXZlbnQgdG8gd2luZG93IHNvIHRoYXQgaXQgY2F0Y2ggaXQgZXZlbnQgaWZcbiAgICAvLyBtb3VzZXVwIGhhcHBlbiBvdXRzaWRlIG9mIHRoZSBicm93c2VyIHdpbmRvdy5cbiAgICAkKHdpbmRvdykub24oJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcCk7XG4gIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vZ3JhcGgvU2VsZWN0aW9uLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");
=======
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var d3 = __webpack_require__(13);
	
	var Selection = function () {
	  function Selection(timeline, svg, margin) {
	    _classCallCheck(this, Selection);
	
	    this.timeline = timeline;
	    this.svg = svg;
	    this.margin = margin;
	
	    this.onMouseUp = this.onMouseUp.bind(this);
	    this.init();
	  }
	
	  _createClass(Selection, [{
	    key: 'onMouseUp',
	    value: function onMouseUp() {
	      this.svg.selectAll('.selection').remove();
	      // Enable again the default browser text selection.
	      $('body').css({
	        'user-select': 'all'
	      });
	    }
	  }, {
	    key: 'init',
	    value: function init() {
	      var self = this;
	      this.svg.on('mousedown', function () {
	        var p = d3.mouse(this);
	        // Only init selection if we click on the timeline and not on the labels.
	        if (p[0] < self.timeline.margin.left) {
	          return;
	        }
	        self.svg.append('rect').attr({
	          class: 'selection',
	          x: p[0],
	          y: p[1],
	          width: 0,
	          height: 0
	        });
	        // Unselect items.
	        self.timeline.selectionManager.reset();
	        // Prevent default browser text selection.
	        $('body').css({
	          'user-select': 'none'
	        });
	      }).on('mousemove', function () {
	        var s = self.svg.select('.selection');
	        if (s.empty()) {
	          return;
	        }
	        var p = d3.mouse(this);
	        var d = {
	          x: parseInt(s.attr('x'), 10),
	          y: parseInt(s.attr('y'), 10),
	          width: parseInt(s.attr('width'), 10),
	          height: parseInt(s.attr('height'), 10)
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
	        d3.selectAll('.key--selected').classed('key--selected', false);
	        self.timeline.selectionManager.reset();
	        var selection = [];
	        d3.selectAll('.key').each(function (state_data) {
	          var item_data = d3.select(this.parentNode.parentNode.parentNode).datum();
	          var key_data = d3.select(this).datum();
	
	          // Also keep a reference to the key dom element.
	          key_data._dom = this;
	
	          if (item_data.collapsed !== true) {
	            var itemBounding = d3.select(this)[0][0].getBoundingClientRect();
	            var y = itemBounding.top - containerBounding.top;
	            if (state_data.time >= d.timeStart && state_data.time <= d.timeEnd) {
	              // use or condition for top and bottom
	              if (y >= d.y && y <= d.y + d.height || y + 10 >= d.y && y + 10 <= d.y + d.height) {
	                d3.select(this).classed('key--selected', true);
	
	                selection.push(key_data);
	              }
	            }
	          }
	        });
	        self.timeline.selectionManager.select(selection);
	      });
	      // Attach the mouseup event to window so that it catch it event if
	      // mouseup happen outside of the browser window.
	      $(window).on('mouseup', this.onMouseUp);
	    }
	  }]);
	
	  return Selection;
	}();
	
	exports.default = Selection;
>>>>>>> master

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\n__webpack_require__(18);\n\nvar _Property = __webpack_require__(19);\n\nvar _Property2 = _interopRequireDefault(_Property);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Signals = __webpack_require__(3);\n\n\nvar tpl_propertiesEditor = __webpack_require__(32);\n\nvar PropertiesEditor = function () {\n  function PropertiesEditor(editor) {\n    _classCallCheck(this, PropertiesEditor);\n\n    this.editor = editor;\n\n    this.render = this.render.bind(this);\n    this.addProperty = this.addProperty.bind(this);\n    this.onSelect = this.onSelect.bind(this);\n    this.onKeyAdded = this.onKeyAdded.bind(this);\n\n    this.timeline = this.editor.timeline;\n    this.timer = this.editor.timer;\n    this.selectionManager = editor.selectionManager;\n\n    this.$el = $(tpl_propertiesEditor());\n    this.$container = this.$el.find('.properties-editor__main');\n    // todo: rename keyAdded to updated\n    this.keyAdded = new Signals.Signal();\n    this.keyRemoved = new Signals.Signal();\n    this.items = [];\n\n    this.parentElement = editor.el;\n    // Close properties by default.\n    this.parentElement.addClass('properties-is-closed');\n    // Add the properties editor to the document.\n    this.parentElement.append(this.$el);\n\n    this.selectionManager.onSelect.add(this.onSelect);\n\n    // Stop event propagation to no play by accident.\n    this.$el.keypress(function (e) {\n      return e.stopPropagation();\n    });\n  }\n\n  _createClass(PropertiesEditor, [{\n    key: 'onKeyAdded',\n    value: function onKeyAdded() {\n      this.keyAdded.dispatch();\n    }\n  }, {\n    key: 'onSelect',\n    value: function onSelect() {\n      var data = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];\n\n      this.items.forEach(function (item) {\n        item.remove();\n      });\n      this.items = [];\n      this.$container.empty();\n      if (data instanceof Array) {\n        for (var i = 0; i < data.length; i++) {\n          this.addProperty(data[i]);\n        }\n      } else {\n        this.addProperty(data);\n      }\n\n      // When selecting anything, automatically display the properties editor.\n      if (this.items.length) {\n        this.parentElement.removeClass('properties-is-closed');\n      }\n    }\n  }, {\n    key: 'addProperty',\n    value: function addProperty(data) {\n      var prop = new _Property2.default(this.editor, this.$container, data);\n      prop.keyAdded.add(this.onKeyAdded);\n      this.items.push(prop);\n    }\n  }, {\n    key: 'render',\n    value: function render(time, time_changed) {\n      if (!time_changed) {\n        return;\n      }\n      this.items.forEach(function (prop) {\n        prop.update();\n      });\n    }\n  }]);\n\n  return PropertiesEditor;\n}();\n\nexports.default = PropertiesEditor;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lZGl0b3IvUHJvcGVydGllc0VkaXRvci5qcz9kNWQ4Il0sIm5hbWVzIjpbIlNpZ25hbHMiLCJyZXF1aXJlIiwidHBsX3Byb3BlcnRpZXNFZGl0b3IiLCJQcm9wZXJ0aWVzRWRpdG9yIiwiZWRpdG9yIiwicmVuZGVyIiwiYmluZCIsImFkZFByb3BlcnR5Iiwib25TZWxlY3QiLCJvbktleUFkZGVkIiwidGltZWxpbmUiLCJ0aW1lciIsInNlbGVjdGlvbk1hbmFnZXIiLCIkZWwiLCIkIiwiJGNvbnRhaW5lciIsImZpbmQiLCJrZXlBZGRlZCIsIlNpZ25hbCIsImtleVJlbW92ZWQiLCJpdGVtcyIsInBhcmVudEVsZW1lbnQiLCJlbCIsImFkZENsYXNzIiwiYXBwZW5kIiwiYWRkIiwia2V5cHJlc3MiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwiZGlzcGF0Y2giLCJkYXRhIiwiZm9yRWFjaCIsIml0ZW0iLCJyZW1vdmUiLCJlbXB0eSIsIkFycmF5IiwiaSIsImxlbmd0aCIsInJlbW92ZUNsYXNzIiwicHJvcCIsInB1c2giLCJ0aW1lIiwidGltZV9jaGFuZ2VkIiwidXBkYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUVBOzs7Ozs7OztBQURBLElBQUlBLFVBQVUsbUJBQUFDLENBQVEsQ0FBUixDQUFkOzs7QUFHQSxJQUFJQyx1QkFBdUIsbUJBQUFELENBQVEsRUFBUixDQUEzQjs7SUFFcUJFLGdCO0FBQ25CLDRCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCLFNBQUtBLE1BQUwsR0FBY0EsTUFBZDs7QUFFQSxTQUFLQyxNQUFMLEdBQWMsS0FBS0EsTUFBTCxDQUFZQyxJQUFaLENBQWlCLElBQWpCLENBQWQ7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLEtBQUtBLFdBQUwsQ0FBaUJELElBQWpCLENBQXNCLElBQXRCLENBQW5CO0FBQ0EsU0FBS0UsUUFBTCxHQUFnQixLQUFLQSxRQUFMLENBQWNGLElBQWQsQ0FBbUIsSUFBbkIsQ0FBaEI7QUFDQSxTQUFLRyxVQUFMLEdBQWtCLEtBQUtBLFVBQUwsQ0FBZ0JILElBQWhCLENBQXFCLElBQXJCLENBQWxCOztBQUVBLFNBQUtJLFFBQUwsR0FBZ0IsS0FBS04sTUFBTCxDQUFZTSxRQUE1QjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxLQUFLUCxNQUFMLENBQVlPLEtBQXpCO0FBQ0EsU0FBS0MsZ0JBQUwsR0FBd0JSLE9BQU9RLGdCQUEvQjs7QUFFQSxTQUFLQyxHQUFMLEdBQVdDLEVBQUVaLHNCQUFGLENBQVg7QUFDQSxTQUFLYSxVQUFMLEdBQWtCLEtBQUtGLEdBQUwsQ0FBU0csSUFBVCxDQUFjLDBCQUFkLENBQWxCO0FBQ0E7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLElBQUlqQixRQUFRa0IsTUFBWixFQUFoQjtBQUNBLFNBQUtDLFVBQUwsR0FBa0IsSUFBSW5CLFFBQVFrQixNQUFaLEVBQWxCO0FBQ0EsU0FBS0UsS0FBTCxHQUFhLEVBQWI7O0FBRUEsU0FBS0MsYUFBTCxHQUFxQmpCLE9BQU9rQixFQUE1QjtBQUNBO0FBQ0EsU0FBS0QsYUFBTCxDQUFtQkUsUUFBbkIsQ0FBNEIsc0JBQTVCO0FBQ0E7QUFDQSxTQUFLRixhQUFMLENBQW1CRyxNQUFuQixDQUEwQixLQUFLWCxHQUEvQjs7QUFFQSxTQUFLRCxnQkFBTCxDQUFzQkosUUFBdEIsQ0FBK0JpQixHQUEvQixDQUFtQyxLQUFLakIsUUFBeEM7O0FBRUE7QUFDQSxTQUFLSyxHQUFMLENBQVNhLFFBQVQsQ0FBa0IsVUFBU0MsQ0FBVCxFQUFZO0FBQzVCLGFBQU9BLEVBQUVDLGVBQUYsRUFBUDtBQUNELEtBRkQ7QUFHRDs7OztpQ0FFWTtBQUNYLFdBQUtYLFFBQUwsQ0FBY1ksUUFBZDtBQUNEOzs7K0JBRXNCO0FBQUEsVUFBZEMsSUFBYyx5REFBUCxLQUFPOztBQUNyQixXQUFLVixLQUFMLENBQVdXLE9BQVgsQ0FBbUIsVUFBQ0MsSUFBRCxFQUFVO0FBQUNBLGFBQUtDLE1BQUw7QUFBZSxPQUE3QztBQUNBLFdBQUtiLEtBQUwsR0FBYSxFQUFiO0FBQ0EsV0FBS0wsVUFBTCxDQUFnQm1CLEtBQWhCO0FBQ0EsVUFBSUosZ0JBQWdCSyxLQUFwQixFQUEyQjtBQUN6QixhQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSU4sS0FBS08sTUFBekIsRUFBaUNELEdBQWpDLEVBQXNDO0FBQ3BDLGVBQUs3QixXQUFMLENBQWlCdUIsS0FBS00sQ0FBTCxDQUFqQjtBQUNEO0FBQ0YsT0FKRCxNQUtLO0FBQ0gsYUFBSzdCLFdBQUwsQ0FBaUJ1QixJQUFqQjtBQUNEOztBQUVEO0FBQ0EsVUFBSSxLQUFLVixLQUFMLENBQVdpQixNQUFmLEVBQXVCO0FBQ3JCLGFBQUtoQixhQUFMLENBQW1CaUIsV0FBbkIsQ0FBK0Isc0JBQS9CO0FBQ0Q7QUFDRjs7O2dDQUVXUixJLEVBQU07QUFDaEIsVUFBSVMsT0FBTyx1QkFBYSxLQUFLbkMsTUFBbEIsRUFBMEIsS0FBS1csVUFBL0IsRUFBMkNlLElBQTNDLENBQVg7QUFDQVMsV0FBS3RCLFFBQUwsQ0FBY1EsR0FBZCxDQUFrQixLQUFLaEIsVUFBdkI7QUFDQSxXQUFLVyxLQUFMLENBQVdvQixJQUFYLENBQWdCRCxJQUFoQjtBQUNEOzs7MkJBRU1FLEksRUFBTUMsWSxFQUFjO0FBQ3pCLFVBQUksQ0FBQ0EsWUFBTCxFQUFtQjtBQUNqQjtBQUNEO0FBQ0QsV0FBS3RCLEtBQUwsQ0FBV1csT0FBWCxDQUFtQixVQUFDUSxJQUFELEVBQVU7QUFBQ0EsYUFBS0ksTUFBTDtBQUFlLE9BQTdDO0FBQ0Q7Ozs7OztrQkFwRWtCeEMsZ0IiLCJmaWxlIjoiMTcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ2pxdWVyeSc7XG5sZXQgU2lnbmFscyA9IHJlcXVpcmUoJ2pzLXNpZ25hbHMnKTtcbmltcG9ydCBQcm9wZXJ0eSBmcm9tICcuLi9lZGl0b3IvUHJvcGVydHknO1xuXG5sZXQgdHBsX3Byb3BlcnRpZXNFZGl0b3IgPSByZXF1aXJlKCcuLy4uL3RlbXBsYXRlcy9wcm9wZXJ0aWVzRWRpdG9yLnRwbC5odG1sJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb3BlcnRpZXNFZGl0b3Ige1xuICBjb25zdHJ1Y3RvcihlZGl0b3IpIHtcbiAgICB0aGlzLmVkaXRvciA9IGVkaXRvcjtcblxuICAgIHRoaXMucmVuZGVyID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLmFkZFByb3BlcnR5ID0gdGhpcy5hZGRQcm9wZXJ0eS5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25TZWxlY3QgPSB0aGlzLm9uU2VsZWN0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbktleUFkZGVkID0gdGhpcy5vbktleUFkZGVkLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnRpbWVsaW5lID0gdGhpcy5lZGl0b3IudGltZWxpbmU7XG4gICAgdGhpcy50aW1lciA9IHRoaXMuZWRpdG9yLnRpbWVyO1xuICAgIHRoaXMuc2VsZWN0aW9uTWFuYWdlciA9IGVkaXRvci5zZWxlY3Rpb25NYW5hZ2VyO1xuXG4gICAgdGhpcy4kZWwgPSAkKHRwbF9wcm9wZXJ0aWVzRWRpdG9yKCkpO1xuICAgIHRoaXMuJGNvbnRhaW5lciA9IHRoaXMuJGVsLmZpbmQoJy5wcm9wZXJ0aWVzLWVkaXRvcl9fbWFpbicpO1xuICAgIC8vIHRvZG86IHJlbmFtZSBrZXlBZGRlZCB0byB1cGRhdGVkXG4gICAgdGhpcy5rZXlBZGRlZCA9IG5ldyBTaWduYWxzLlNpZ25hbCgpO1xuICAgIHRoaXMua2V5UmVtb3ZlZCA9IG5ldyBTaWduYWxzLlNpZ25hbCgpO1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcblxuICAgIHRoaXMucGFyZW50RWxlbWVudCA9IGVkaXRvci5lbDtcbiAgICAvLyBDbG9zZSBwcm9wZXJ0aWVzIGJ5IGRlZmF1bHQuXG4gICAgdGhpcy5wYXJlbnRFbGVtZW50LmFkZENsYXNzKCdwcm9wZXJ0aWVzLWlzLWNsb3NlZCcpO1xuICAgIC8vIEFkZCB0aGUgcHJvcGVydGllcyBlZGl0b3IgdG8gdGhlIGRvY3VtZW50LlxuICAgIHRoaXMucGFyZW50RWxlbWVudC5hcHBlbmQodGhpcy4kZWwpO1xuXG4gICAgdGhpcy5zZWxlY3Rpb25NYW5hZ2VyLm9uU2VsZWN0LmFkZCh0aGlzLm9uU2VsZWN0KTtcblxuICAgIC8vIFN0b3AgZXZlbnQgcHJvcGFnYXRpb24gdG8gbm8gcGxheSBieSBhY2NpZGVudC5cbiAgICB0aGlzLiRlbC5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XG4gICAgICByZXR1cm4gZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uS2V5QWRkZWQoKSB7XG4gICAgdGhpcy5rZXlBZGRlZC5kaXNwYXRjaCgpO1xuICB9XG5cbiAgb25TZWxlY3QoZGF0YSA9IGZhbHNlKSB7XG4gICAgdGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7aXRlbS5yZW1vdmUoKTt9KTtcbiAgICB0aGlzLml0ZW1zID0gW107XG4gICAgdGhpcy4kY29udGFpbmVyLmVtcHR5KCk7XG4gICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuYWRkUHJvcGVydHkoZGF0YVtpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5hZGRQcm9wZXJ0eShkYXRhKTtcbiAgICB9XG5cbiAgICAvLyBXaGVuIHNlbGVjdGluZyBhbnl0aGluZywgYXV0b21hdGljYWxseSBkaXNwbGF5IHRoZSBwcm9wZXJ0aWVzIGVkaXRvci5cbiAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMucGFyZW50RWxlbWVudC5yZW1vdmVDbGFzcygncHJvcGVydGllcy1pcy1jbG9zZWQnKTtcbiAgICB9XG4gIH1cblxuICBhZGRQcm9wZXJ0eShkYXRhKSB7XG4gICAgdmFyIHByb3AgPSBuZXcgUHJvcGVydHkodGhpcy5lZGl0b3IsIHRoaXMuJGNvbnRhaW5lciwgZGF0YSk7XG4gICAgcHJvcC5rZXlBZGRlZC5hZGQodGhpcy5vbktleUFkZGVkKTtcbiAgICB0aGlzLml0ZW1zLnB1c2gocHJvcCk7XG4gIH1cblxuICByZW5kZXIodGltZSwgdGltZV9jaGFuZ2VkKSB7XG4gICAgaWYgKCF0aW1lX2NoYW5nZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5pdGVtcy5mb3JFYWNoKChwcm9wKSA9PiB7cHJvcC51cGRhdGUoKTt9KTtcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9lZGl0b3IvUHJvcGVydGllc0VkaXRvci5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");
=======
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	__webpack_require__(22);
	
	var _Property = __webpack_require__(23);
	
	var _Property2 = _interopRequireDefault(_Property);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Signals = __webpack_require__(5);
	
	
	var tpl_propertiesEditor = __webpack_require__(40);
	
	var PropertiesEditor = function () {
	  function PropertiesEditor(editor) {
	    _classCallCheck(this, PropertiesEditor);
	
	    this.editor = editor;
	
	    this.render = this.render.bind(this);
	    this.addProperty = this.addProperty.bind(this);
	    this.onSelect = this.onSelect.bind(this);
	    this.onKeyAdded = this.onKeyAdded.bind(this);
	
	    this.timeline = this.editor.timeline;
	    this.timer = this.editor.timer;
	    this.selectionManager = editor.selectionManager;
	
	    this.$el = $(tpl_propertiesEditor());
	    this.$container = this.$el.find('.properties-editor__main');
	    // todo: rename keyAdded to updated
	    this.keyAdded = new Signals.Signal();
	    this.keyRemoved = new Signals.Signal();
	    this.items = [];
	
	    this.parentElement = editor.el;
	    // Close properties by default.
	    this.parentElement.addClass('properties-is-closed');
	    // Add the properties editor to the document.
	    this.parentElement.append(this.$el);
	
	    this.selectionManager.onSelect.add(this.onSelect);
	
	    // Stop event propagation to no play by accident.
	    this.$el.keypress(function (e) {
	      return e.stopPropagation();
	    });
	  }
	
	  _createClass(PropertiesEditor, [{
	    key: 'onKeyAdded',
	    value: function onKeyAdded() {
	      this.keyAdded.dispatch();
	    }
	  }, {
	    key: 'onSelect',
	    value: function onSelect() {
	      var data = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
	      this.items.forEach(function (item) {
	        item.remove();
	      });
	      this.items = [];
	      this.$container.empty();
	      if (data instanceof Array) {
	        for (var i = 0; i < data.length; i++) {
	          this.addProperty(data[i]);
	        }
	      } else {
	        this.addProperty(data);
	      }
	
	      // When selecting anything, automatically display the properties editor.
	      if (this.items.length) {
	        this.parentElement.removeClass('properties-is-closed');
	      }
	    }
	  }, {
	    key: 'addProperty',
	    value: function addProperty(data) {
	      var prop = new _Property2.default(this.editor, this.$container, data);
	      prop.keyAdded.add(this.onKeyAdded);
	      this.items.push(prop);
	    }
	  }, {
	    key: 'render',
	    value: function render(time, time_changed) {
	      if (!time_changed) {
	        return;
	      }
	      this.items.forEach(function (prop) {
	        prop.update();
	      });
	    }
	  }]);
	
	  return PropertiesEditor;
	}();
	
	exports.default = PropertiesEditor;
>>>>>>> master

/***/ },
/* 22 */
/***/ function(module, exports) {

<<<<<<< HEAD
	eval("module.exports = __WEBPACK_EXTERNAL_MODULE_18__;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wicm9vdFwiOlwiJFwiLFwiY29tbW9uanNcIjpcImpxdWVyeVwiLFwiY29tbW9uanMyXCI6XCJqcXVlcnlcIixcImFtZFwiOlwianF1ZXJ5XCJ9PzI1M2YiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiMTguanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMThfXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIHtcInJvb3RcIjpcIiRcIixcImNvbW1vbmpzXCI6XCJqcXVlcnlcIixcImNvbW1vbmpzMlwiOlwianF1ZXJ5XCIsXCJhbWRcIjpcImpxdWVyeVwifVxuICoqIG1vZHVsZSBpZCA9IDE4XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9");
=======
	module.exports = __WEBPACK_EXTERNAL_MODULE_22__;
>>>>>>> master

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _PropertyNumber = __webpack_require__(20);\n\nvar _PropertyNumber2 = _interopRequireDefault(_PropertyNumber);\n\nvar _PropertyColor = __webpack_require__(27);\n\nvar _PropertyColor2 = _interopRequireDefault(_PropertyColor);\n\nvar _PropertyTween = __webpack_require__(30);\n\nvar _PropertyTween2 = _interopRequireDefault(_PropertyTween);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Signals = __webpack_require__(3);\n\nvar Property = function () {\n  function Property(editor, $el, data) {\n    _classCallCheck(this, Property);\n\n    this.editor = editor;\n    this.$el = $el;\n\n    this.onKeyAdded = this.onKeyAdded.bind(this);\n\n    this.timeline = editor.timeline;\n    this.timer = editor.timer;\n    this.selectionManager = editor.selectionManager;\n    this.keyAdded = new Signals.Signal();\n    this.items = [];\n    this.numberProp = false;\n    this.tweenProp = false;\n\n    var key_val = false;\n    // var propertyObject = false;\n    var propertyData = false;\n    // var lineObject = false;\n    var lineData = false;\n\n    // For keys the _property data should be defined.\n    if (data._property) {\n      propertyData = data._property;\n      lineData = propertyData._line;\n      key_val = data;\n    }\n\n    // Check if we selected a main item.\n    if (data.id) {\n      lineData = data;\n    }\n\n    // data and propertyData are defined on key select.\n    var property_name = false;\n    if (propertyData) {\n      property_name = propertyData.name;\n    }\n\n    // Get the property container.\n    var $container = this.getContainer(lineData);\n\n    var $tween_container = $container;\n\n    // Basic data, loop through properties.\n    for (var key in lineData.properties) {\n      if (lineData.properties.hasOwnProperty(key)) {\n        var instance_prop = lineData.properties[key];\n        // show all properties or only 1 if we selected a key.\n        if (!property_name || instance_prop.name === property_name) {\n          var $grp_container = this.getGroupContainer(instance_prop, $container);\n          var numberProp = this.addNumberProperty(instance_prop, lineData, key_val, $grp_container);\n          this.items.push(numberProp);\n          if (instance_prop.name === property_name) {\n            $tween_container = $grp_container;\n          }\n\n          if (property_name) {\n            // Add tween select if we are editing a key, so only if there is property_name.\n            var tweenProp = this.addTweenProperty(instance_prop, lineData, key_val, $tween_container, propertyData);\n            this.items.push(tweenProp);\n          }\n        }\n      }\n    }\n  }\n\n  _createClass(Property, [{\n    key: 'onKeyAdded',\n    value: function onKeyAdded() {\n      // propagate the event.\n      this.keyAdded.dispatch();\n    }\n  }, {\n    key: 'getGroupContainer',\n    value: function getGroupContainer(instance_prop, $container) {\n      var $existing;\n      var $grp;\n      var grp_class;\n      if (!instance_prop.group) {\n        grp_class = 'property-grp--general';\n        $existing = $container.find('.' + grp_class);\n        if ($existing.length) {\n          return $existing;\n        }\n\n        $grp = this.createGroupContainer(grp_class);\n        $container.append($grp);\n        return $grp;\n      }\n      // Replace all spaces to dash and make class lowercase\n      var group_name = instance_prop.group.replace(/\\s+/g, '-').toLowerCase();\n      grp_class = 'property-grp--' + group_name;\n      $existing = $container.find('.' + grp_class);\n      if ($existing.length) {\n        return $existing;\n      }\n      $grp = this.createGroupContainer(grp_class, instance_prop.group);\n      $container.append($grp);\n      return $grp;\n    }\n  }, {\n    key: 'createGroupContainer',\n    value: function createGroupContainer(grp_class) {\n      var label = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];\n\n      var $grp = $('<div class=\"property-grp ' + grp_class + '\"></div>');\n      if (label) {\n        $grp.append('<h3 class=\"property-grp__title\">' + label + '</h3>');\n      }\n      return $grp;\n    }\n  }, {\n    key: 'getContainer',\n    value: function getContainer(lineData) {\n      var $container = false;\n      if (lineData.id) {\n        $container = $('#property--' + lineData.id);\n        if (!$container.length) {\n          $container = $container = $('<div class=\"properties__wrapper\" id=\"property--' + lineData.id + '\"></div>');\n          this.$el.append($container);\n          if (lineData.label) {\n            $container.append('<h2 class=\"properties-editor__title\">' + lineData.label + '</h2>');\n          }\n        }\n      }\n      if ($container === false) {\n        $container = $('<div class=\"properties__wrapper\" id=\"no-item\"></div>');\n        this.$el.append($container);\n      }\n      return $container;\n    }\n  }, {\n    key: 'remove',\n    value: function remove() {\n      this.items.forEach(function (item) {\n        item.remove();\n      });\n      if (this.keyAdded) {\n        this.keyAdded.dispose();\n      }\n\n      delete this.editor;\n      delete this.$el;\n\n      delete this.timeline;\n      delete this.timer;\n      delete this.selectionManager;\n      delete this.keyAdded;\n      delete this.items;\n      delete this.numberProp;\n      delete this.tweenProp;\n    }\n  }, {\n    key: 'addNumberProperty',\n    value: function addNumberProperty(instance_prop, lineData, key_val, $container) {\n      var PropClass = _PropertyNumber2.default;\n      if (instance_prop.type && instance_prop.type === 'color') {\n        PropClass = _PropertyColor2.default;\n      }\n      var prop = new PropClass(instance_prop, lineData, this.editor, key_val);\n      prop.keyAdded.add(this.onKeyAdded);\n      $container.append(prop.$el);\n      return prop;\n    }\n  }, {\n    key: 'addTweenProperty',\n    value: function addTweenProperty(instance_prop, lineData, key_val, $container, propertyData) {\n      var _this = this;\n\n      var tween = new _PropertyTween2.default(instance_prop, lineData, this.editor, key_val, this.timeline);\n      $container.append(tween.$el);\n\n      // Add a remove key button\n      tween.$el.find('[data-action-remove]').click(function (e) {\n        e.preventDefault();\n        var index = propertyData.keys.indexOf(key_val);\n        if (index > -1) {\n          propertyData.keys.splice(index, 1);\n          if (key_val._dom) {\n            _this.editor.propertiesEditor.keyRemoved.dispatch(key_val);\n          }\n          lineData._isDirty = true;\n        }\n      });\n      return tween;\n    }\n  }, {\n    key: 'update',\n    value: function update() {\n      for (var i = 0; i < this.items.length; i++) {\n        var item = this.items[i];\n        item.update();\n      }\n    }\n  }]);\n\n  return Property;\n}();\n\nexports.default = Property;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lZGl0b3IvUHJvcGVydHkuanM/MmZhNyJdLCJuYW1lcyI6WyJTaWduYWxzIiwicmVxdWlyZSIsIlByb3BlcnR5IiwiZWRpdG9yIiwiJGVsIiwiZGF0YSIsIm9uS2V5QWRkZWQiLCJiaW5kIiwidGltZWxpbmUiLCJ0aW1lciIsInNlbGVjdGlvbk1hbmFnZXIiLCJrZXlBZGRlZCIsIlNpZ25hbCIsIml0ZW1zIiwibnVtYmVyUHJvcCIsInR3ZWVuUHJvcCIsImtleV92YWwiLCJwcm9wZXJ0eURhdGEiLCJsaW5lRGF0YSIsIl9wcm9wZXJ0eSIsIl9saW5lIiwiaWQiLCJwcm9wZXJ0eV9uYW1lIiwibmFtZSIsIiRjb250YWluZXIiLCJnZXRDb250YWluZXIiLCIkdHdlZW5fY29udGFpbmVyIiwia2V5IiwicHJvcGVydGllcyIsImhhc093blByb3BlcnR5IiwiaW5zdGFuY2VfcHJvcCIsIiRncnBfY29udGFpbmVyIiwiZ2V0R3JvdXBDb250YWluZXIiLCJhZGROdW1iZXJQcm9wZXJ0eSIsInB1c2giLCJhZGRUd2VlblByb3BlcnR5IiwiZGlzcGF0Y2giLCIkZXhpc3RpbmciLCIkZ3JwIiwiZ3JwX2NsYXNzIiwiZ3JvdXAiLCJmaW5kIiwibGVuZ3RoIiwiY3JlYXRlR3JvdXBDb250YWluZXIiLCJhcHBlbmQiLCJncm91cF9uYW1lIiwicmVwbGFjZSIsInRvTG93ZXJDYXNlIiwibGFiZWwiLCIkIiwiZm9yRWFjaCIsIml0ZW0iLCJyZW1vdmUiLCJkaXNwb3NlIiwiUHJvcENsYXNzIiwidHlwZSIsInByb3AiLCJhZGQiLCJ0d2VlbiIsImNsaWNrIiwiZSIsInByZXZlbnREZWZhdWx0IiwiaW5kZXgiLCJrZXlzIiwiaW5kZXhPZiIsInNwbGljZSIsIl9kb20iLCJwcm9wZXJ0aWVzRWRpdG9yIiwia2V5UmVtb3ZlZCIsIl9pc0RpcnR5IiwiaSIsInVwZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBSEEsSUFBSUEsVUFBVSxtQkFBQUMsQ0FBUSxDQUFSLENBQWQ7O0lBS3FCQyxRO0FBQ25CLG9CQUFZQyxNQUFaLEVBQW9CQyxHQUFwQixFQUF5QkMsSUFBekIsRUFBK0I7QUFBQTs7QUFDN0IsU0FBS0YsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsR0FBTCxHQUFXQSxHQUFYOztBQUVBLFNBQUtFLFVBQUwsR0FBa0IsS0FBS0EsVUFBTCxDQUFnQkMsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBbEI7O0FBRUEsU0FBS0MsUUFBTCxHQUFnQkwsT0FBT0ssUUFBdkI7QUFDQSxTQUFLQyxLQUFMLEdBQWFOLE9BQU9NLEtBQXBCO0FBQ0EsU0FBS0MsZ0JBQUwsR0FBd0JQLE9BQU9PLGdCQUEvQjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0IsSUFBSVgsUUFBUVksTUFBWixFQUFoQjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxFQUFiO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixLQUFsQjtBQUNBLFNBQUtDLFNBQUwsR0FBaUIsS0FBakI7O0FBRUEsUUFBSUMsVUFBVSxLQUFkO0FBQ0E7QUFDQSxRQUFJQyxlQUFlLEtBQW5CO0FBQ0E7QUFDQSxRQUFJQyxXQUFXLEtBQWY7O0FBRUE7QUFDQSxRQUFJYixLQUFLYyxTQUFULEVBQW9CO0FBQ2xCRixxQkFBZVosS0FBS2MsU0FBcEI7QUFDQUQsaUJBQVdELGFBQWFHLEtBQXhCO0FBQ0FKLGdCQUFVWCxJQUFWO0FBQ0Q7O0FBRUQ7QUFDQSxRQUFJQSxLQUFLZ0IsRUFBVCxFQUFhO0FBQ1hILGlCQUFXYixJQUFYO0FBQ0Q7O0FBRUQ7QUFDQSxRQUFJaUIsZ0JBQWdCLEtBQXBCO0FBQ0EsUUFBSUwsWUFBSixFQUFrQjtBQUNoQkssc0JBQWdCTCxhQUFhTSxJQUE3QjtBQUNEOztBQUVEO0FBQ0EsUUFBSUMsYUFBYSxLQUFLQyxZQUFMLENBQWtCUCxRQUFsQixDQUFqQjs7QUFFQSxRQUFJUSxtQkFBbUJGLFVBQXZCOztBQUVBO0FBQ0EsU0FBSyxJQUFJRyxHQUFULElBQWdCVCxTQUFTVSxVQUF6QixFQUFxQztBQUNuQyxVQUFJVixTQUFTVSxVQUFULENBQW9CQyxjQUFwQixDQUFtQ0YsR0FBbkMsQ0FBSixFQUE2QztBQUMzQyxZQUFJRyxnQkFBZ0JaLFNBQVNVLFVBQVQsQ0FBb0JELEdBQXBCLENBQXBCO0FBQ0E7QUFDQSxZQUFJLENBQUNMLGFBQUQsSUFBa0JRLGNBQWNQLElBQWQsS0FBdUJELGFBQTdDLEVBQTREO0FBQzFELGNBQUlTLGlCQUFpQixLQUFLQyxpQkFBTCxDQUF1QkYsYUFBdkIsRUFBc0NOLFVBQXRDLENBQXJCO0FBQ0EsY0FBSVYsYUFBYSxLQUFLbUIsaUJBQUwsQ0FBdUJILGFBQXZCLEVBQXNDWixRQUF0QyxFQUFnREYsT0FBaEQsRUFBeURlLGNBQXpELENBQWpCO0FBQ0EsZUFBS2xCLEtBQUwsQ0FBV3FCLElBQVgsQ0FBZ0JwQixVQUFoQjtBQUNBLGNBQUlnQixjQUFjUCxJQUFkLEtBQXVCRCxhQUEzQixFQUEwQztBQUN4Q0ksK0JBQW1CSyxjQUFuQjtBQUNEOztBQUVELGNBQUlULGFBQUosRUFBbUI7QUFDakI7QUFDQSxnQkFBSVAsWUFBWSxLQUFLb0IsZ0JBQUwsQ0FBc0JMLGFBQXRCLEVBQXFDWixRQUFyQyxFQUErQ0YsT0FBL0MsRUFBd0RVLGdCQUF4RCxFQUEwRVQsWUFBMUUsQ0FBaEI7QUFDQSxpQkFBS0osS0FBTCxDQUFXcUIsSUFBWCxDQUFnQm5CLFNBQWhCO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7QUFDRjs7OztpQ0FFWTtBQUNYO0FBQ0EsV0FBS0osUUFBTCxDQUFjeUIsUUFBZDtBQUNEOzs7c0NBRWlCTixhLEVBQWVOLFUsRUFBWTtBQUMzQyxVQUFJYSxTQUFKO0FBQ0EsVUFBSUMsSUFBSjtBQUNBLFVBQUlDLFNBQUo7QUFDQSxVQUFJLENBQUNULGNBQWNVLEtBQW5CLEVBQTBCO0FBQ3hCRCxvQkFBWSx1QkFBWjtBQUNBRixvQkFBWWIsV0FBV2lCLElBQVgsQ0FBZ0IsTUFBTUYsU0FBdEIsQ0FBWjtBQUNBLFlBQUlGLFVBQVVLLE1BQWQsRUFBc0I7QUFDcEIsaUJBQU9MLFNBQVA7QUFDRDs7QUFFREMsZUFBTyxLQUFLSyxvQkFBTCxDQUEwQkosU0FBMUIsQ0FBUDtBQUNBZixtQkFBV29CLE1BQVgsQ0FBa0JOLElBQWxCO0FBQ0EsZUFBT0EsSUFBUDtBQUNEO0FBQ0Q7QUFDQSxVQUFJTyxhQUFhZixjQUFjVSxLQUFkLENBQW9CTSxPQUFwQixDQUE0QixNQUE1QixFQUFvQyxHQUFwQyxFQUF5Q0MsV0FBekMsRUFBakI7QUFDQVIsa0JBQVksbUJBQW1CTSxVQUEvQjtBQUNBUixrQkFBWWIsV0FBV2lCLElBQVgsQ0FBZ0IsTUFBTUYsU0FBdEIsQ0FBWjtBQUNBLFVBQUlGLFVBQVVLLE1BQWQsRUFBc0I7QUFDcEIsZUFBT0wsU0FBUDtBQUNEO0FBQ0RDLGFBQU8sS0FBS0ssb0JBQUwsQ0FBMEJKLFNBQTFCLEVBQXFDVCxjQUFjVSxLQUFuRCxDQUFQO0FBQ0FoQixpQkFBV29CLE1BQVgsQ0FBa0JOLElBQWxCO0FBQ0EsYUFBT0EsSUFBUDtBQUNEOzs7eUNBRW9CQyxTLEVBQTBCO0FBQUEsVUFBZlMsS0FBZSx5REFBUCxLQUFPOztBQUM3QyxVQUFJVixPQUFPVyxFQUFFLDhCQUE4QlYsU0FBOUIsR0FBMEMsVUFBNUMsQ0FBWDtBQUNBLFVBQUlTLEtBQUosRUFBVztBQUNUVixhQUFLTSxNQUFMLENBQVkscUNBQXFDSSxLQUFyQyxHQUE2QyxPQUF6RDtBQUNEO0FBQ0QsYUFBT1YsSUFBUDtBQUNEOzs7aUNBRVlwQixRLEVBQVU7QUFDckIsVUFBSU0sYUFBYSxLQUFqQjtBQUNBLFVBQUlOLFNBQVNHLEVBQWIsRUFBaUI7QUFDZkcscUJBQWF5QixFQUFFLGdCQUFnQi9CLFNBQVNHLEVBQTNCLENBQWI7QUFDQSxZQUFJLENBQUNHLFdBQVdrQixNQUFoQixFQUF3QjtBQUN0QmxCLHVCQUFhQSxhQUFheUIsRUFBRSxvREFBb0QvQixTQUFTRyxFQUE3RCxHQUFrRSxVQUFwRSxDQUExQjtBQUNBLGVBQUtqQixHQUFMLENBQVN3QyxNQUFULENBQWdCcEIsVUFBaEI7QUFDQSxjQUFJTixTQUFTOEIsS0FBYixFQUFvQjtBQUNsQnhCLHVCQUFXb0IsTUFBWCxDQUFrQiwwQ0FBMEMxQixTQUFTOEIsS0FBbkQsR0FBMkQsT0FBN0U7QUFDRDtBQUNGO0FBQ0Y7QUFDRCxVQUFJeEIsZUFBZSxLQUFuQixFQUEwQjtBQUN4QkEscUJBQWF5QixFQUFFLHNEQUFGLENBQWI7QUFDQSxhQUFLN0MsR0FBTCxDQUFTd0MsTUFBVCxDQUFnQnBCLFVBQWhCO0FBQ0Q7QUFDRCxhQUFPQSxVQUFQO0FBQ0Q7Ozs2QkFFUTtBQUNQLFdBQUtYLEtBQUwsQ0FBV3FDLE9BQVgsQ0FBbUIsVUFBQ0MsSUFBRCxFQUFVO0FBQUNBLGFBQUtDLE1BQUw7QUFBZSxPQUE3QztBQUNBLFVBQUksS0FBS3pDLFFBQVQsRUFBbUI7QUFDakIsYUFBS0EsUUFBTCxDQUFjMEMsT0FBZDtBQUNEOztBQUVELGFBQU8sS0FBS2xELE1BQVo7QUFDQSxhQUFPLEtBQUtDLEdBQVo7O0FBRUEsYUFBTyxLQUFLSSxRQUFaO0FBQ0EsYUFBTyxLQUFLQyxLQUFaO0FBQ0EsYUFBTyxLQUFLQyxnQkFBWjtBQUNBLGFBQU8sS0FBS0MsUUFBWjtBQUNBLGFBQU8sS0FBS0UsS0FBWjtBQUNBLGFBQU8sS0FBS0MsVUFBWjtBQUNBLGFBQU8sS0FBS0MsU0FBWjtBQUNEOzs7c0NBRWlCZSxhLEVBQWVaLFEsRUFBVUYsTyxFQUFTUSxVLEVBQVk7QUFDOUQsVUFBSThCLG9DQUFKO0FBQ0EsVUFBSXhCLGNBQWN5QixJQUFkLElBQXNCekIsY0FBY3lCLElBQWQsS0FBdUIsT0FBakQsRUFBMEQ7QUFDeEREO0FBQ0Q7QUFDRCxVQUFJRSxPQUFPLElBQUlGLFNBQUosQ0FBY3hCLGFBQWQsRUFBNkJaLFFBQTdCLEVBQXVDLEtBQUtmLE1BQTVDLEVBQW9EYSxPQUFwRCxDQUFYO0FBQ0F3QyxXQUFLN0MsUUFBTCxDQUFjOEMsR0FBZCxDQUFrQixLQUFLbkQsVUFBdkI7QUFDQWtCLGlCQUFXb0IsTUFBWCxDQUFrQlksS0FBS3BELEdBQXZCO0FBQ0EsYUFBT29ELElBQVA7QUFDRDs7O3FDQUVnQjFCLGEsRUFBZVosUSxFQUFVRixPLEVBQVNRLFUsRUFBWVAsWSxFQUFjO0FBQUE7O0FBQzNFLFVBQUl5QyxRQUFRLDRCQUFrQjVCLGFBQWxCLEVBQWlDWixRQUFqQyxFQUEyQyxLQUFLZixNQUFoRCxFQUF3RGEsT0FBeEQsRUFBaUUsS0FBS1IsUUFBdEUsQ0FBWjtBQUNBZ0IsaUJBQVdvQixNQUFYLENBQWtCYyxNQUFNdEQsR0FBeEI7O0FBRUE7QUFDQXNELFlBQU10RCxHQUFOLENBQVVxQyxJQUFWLENBQWUsc0JBQWYsRUFBdUNrQixLQUF2QyxDQUE2QyxVQUFDQyxDQUFELEVBQU87QUFDbERBLFVBQUVDLGNBQUY7QUFDQSxZQUFJQyxRQUFRN0MsYUFBYThDLElBQWIsQ0FBa0JDLE9BQWxCLENBQTBCaEQsT0FBMUIsQ0FBWjtBQUNBLFlBQUk4QyxRQUFRLENBQUMsQ0FBYixFQUFnQjtBQUNkN0MsdUJBQWE4QyxJQUFiLENBQWtCRSxNQUFsQixDQUF5QkgsS0FBekIsRUFBZ0MsQ0FBaEM7QUFDQSxjQUFJOUMsUUFBUWtELElBQVosRUFBa0I7QUFDaEIsa0JBQUsvRCxNQUFMLENBQVlnRSxnQkFBWixDQUE2QkMsVUFBN0IsQ0FBd0NoQyxRQUF4QyxDQUFpRHBCLE9BQWpEO0FBQ0Q7QUFDREUsbUJBQVNtRCxRQUFULEdBQW9CLElBQXBCO0FBQ0Q7QUFDRixPQVZEO0FBV0EsYUFBT1gsS0FBUDtBQUNEOzs7NkJBRVE7QUFDUCxXQUFLLElBQUlZLElBQUksQ0FBYixFQUFnQkEsSUFBSSxLQUFLekQsS0FBTCxDQUFXNkIsTUFBL0IsRUFBdUM0QixHQUF2QyxFQUE0QztBQUMxQyxZQUFJbkIsT0FBTyxLQUFLdEMsS0FBTCxDQUFXeUQsQ0FBWCxDQUFYO0FBQ0FuQixhQUFLb0IsTUFBTDtBQUNEO0FBQ0Y7Ozs7OztrQkFuTGtCckUsUSIsImZpbGUiOiIxOS5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBTaWduYWxzID0gcmVxdWlyZSgnanMtc2lnbmFscycpO1xuaW1wb3J0IFByb3BlcnR5TnVtYmVyIGZyb20gJy4vUHJvcGVydHlOdW1iZXInO1xuaW1wb3J0IFByb3BlcnR5Q29sb3IgZnJvbSAnLi9Qcm9wZXJ0eUNvbG9yJztcbmltcG9ydCBQcm9wZXJ0eVR3ZWVuIGZyb20gJy4vUHJvcGVydHlUd2Vlbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb3BlcnR5IHtcbiAgY29uc3RydWN0b3IoZWRpdG9yLCAkZWwsIGRhdGEpIHtcbiAgICB0aGlzLmVkaXRvciA9IGVkaXRvcjtcbiAgICB0aGlzLiRlbCA9ICRlbDtcblxuICAgIHRoaXMub25LZXlBZGRlZCA9IHRoaXMub25LZXlBZGRlZC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy50aW1lbGluZSA9IGVkaXRvci50aW1lbGluZTtcbiAgICB0aGlzLnRpbWVyID0gZWRpdG9yLnRpbWVyO1xuICAgIHRoaXMuc2VsZWN0aW9uTWFuYWdlciA9IGVkaXRvci5zZWxlY3Rpb25NYW5hZ2VyO1xuICAgIHRoaXMua2V5QWRkZWQgPSBuZXcgU2lnbmFscy5TaWduYWwoKTtcbiAgICB0aGlzLml0ZW1zID0gW107XG4gICAgdGhpcy5udW1iZXJQcm9wID0gZmFsc2U7XG4gICAgdGhpcy50d2VlblByb3AgPSBmYWxzZTtcblxuICAgIHZhciBrZXlfdmFsID0gZmFsc2U7XG4gICAgLy8gdmFyIHByb3BlcnR5T2JqZWN0ID0gZmFsc2U7XG4gICAgdmFyIHByb3BlcnR5RGF0YSA9IGZhbHNlO1xuICAgIC8vIHZhciBsaW5lT2JqZWN0ID0gZmFsc2U7XG4gICAgdmFyIGxpbmVEYXRhID0gZmFsc2U7XG5cbiAgICAvLyBGb3Iga2V5cyB0aGUgX3Byb3BlcnR5IGRhdGEgc2hvdWxkIGJlIGRlZmluZWQuXG4gICAgaWYgKGRhdGEuX3Byb3BlcnR5KSB7XG4gICAgICBwcm9wZXJ0eURhdGEgPSBkYXRhLl9wcm9wZXJ0eTtcbiAgICAgIGxpbmVEYXRhID0gcHJvcGVydHlEYXRhLl9saW5lO1xuICAgICAga2V5X3ZhbCA9IGRhdGE7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgd2Ugc2VsZWN0ZWQgYSBtYWluIGl0ZW0uXG4gICAgaWYgKGRhdGEuaWQpIHtcbiAgICAgIGxpbmVEYXRhID0gZGF0YTtcbiAgICB9XG5cbiAgICAvLyBkYXRhIGFuZCBwcm9wZXJ0eURhdGEgYXJlIGRlZmluZWQgb24ga2V5IHNlbGVjdC5cbiAgICB2YXIgcHJvcGVydHlfbmFtZSA9IGZhbHNlO1xuICAgIGlmIChwcm9wZXJ0eURhdGEpIHtcbiAgICAgIHByb3BlcnR5X25hbWUgPSBwcm9wZXJ0eURhdGEubmFtZTtcbiAgICB9XG5cbiAgICAvLyBHZXQgdGhlIHByb3BlcnR5IGNvbnRhaW5lci5cbiAgICB2YXIgJGNvbnRhaW5lciA9IHRoaXMuZ2V0Q29udGFpbmVyKGxpbmVEYXRhKTtcblxuICAgIHZhciAkdHdlZW5fY29udGFpbmVyID0gJGNvbnRhaW5lcjtcblxuICAgIC8vIEJhc2ljIGRhdGEsIGxvb3AgdGhyb3VnaCBwcm9wZXJ0aWVzLlxuICAgIGZvciAodmFyIGtleSBpbiBsaW5lRGF0YS5wcm9wZXJ0aWVzKSB7XG4gICAgICBpZiAobGluZURhdGEucHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZV9wcm9wID0gbGluZURhdGEucHJvcGVydGllc1trZXldO1xuICAgICAgICAvLyBzaG93IGFsbCBwcm9wZXJ0aWVzIG9yIG9ubHkgMSBpZiB3ZSBzZWxlY3RlZCBhIGtleS5cbiAgICAgICAgaWYgKCFwcm9wZXJ0eV9uYW1lIHx8IGluc3RhbmNlX3Byb3AubmFtZSA9PT0gcHJvcGVydHlfbmFtZSkge1xuICAgICAgICAgIHZhciAkZ3JwX2NvbnRhaW5lciA9IHRoaXMuZ2V0R3JvdXBDb250YWluZXIoaW5zdGFuY2VfcHJvcCwgJGNvbnRhaW5lcik7XG4gICAgICAgICAgdmFyIG51bWJlclByb3AgPSB0aGlzLmFkZE51bWJlclByb3BlcnR5KGluc3RhbmNlX3Byb3AsIGxpbmVEYXRhLCBrZXlfdmFsLCAkZ3JwX2NvbnRhaW5lcik7XG4gICAgICAgICAgdGhpcy5pdGVtcy5wdXNoKG51bWJlclByb3ApO1xuICAgICAgICAgIGlmIChpbnN0YW5jZV9wcm9wLm5hbWUgPT09IHByb3BlcnR5X25hbWUpIHtcbiAgICAgICAgICAgICR0d2Vlbl9jb250YWluZXIgPSAkZ3JwX2NvbnRhaW5lcjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocHJvcGVydHlfbmFtZSkge1xuICAgICAgICAgICAgLy8gQWRkIHR3ZWVuIHNlbGVjdCBpZiB3ZSBhcmUgZWRpdGluZyBhIGtleSwgc28gb25seSBpZiB0aGVyZSBpcyBwcm9wZXJ0eV9uYW1lLlxuICAgICAgICAgICAgdmFyIHR3ZWVuUHJvcCA9IHRoaXMuYWRkVHdlZW5Qcm9wZXJ0eShpbnN0YW5jZV9wcm9wLCBsaW5lRGF0YSwga2V5X3ZhbCwgJHR3ZWVuX2NvbnRhaW5lciwgcHJvcGVydHlEYXRhKTtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaCh0d2VlblByb3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uS2V5QWRkZWQoKSB7XG4gICAgLy8gcHJvcGFnYXRlIHRoZSBldmVudC5cbiAgICB0aGlzLmtleUFkZGVkLmRpc3BhdGNoKCk7XG4gIH1cblxuICBnZXRHcm91cENvbnRhaW5lcihpbnN0YW5jZV9wcm9wLCAkY29udGFpbmVyKSB7XG4gICAgdmFyICRleGlzdGluZztcbiAgICB2YXIgJGdycDtcbiAgICB2YXIgZ3JwX2NsYXNzO1xuICAgIGlmICghaW5zdGFuY2VfcHJvcC5ncm91cCkge1xuICAgICAgZ3JwX2NsYXNzID0gJ3Byb3BlcnR5LWdycC0tZ2VuZXJhbCc7XG4gICAgICAkZXhpc3RpbmcgPSAkY29udGFpbmVyLmZpbmQoJy4nICsgZ3JwX2NsYXNzKTtcbiAgICAgIGlmICgkZXhpc3RpbmcubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiAkZXhpc3Rpbmc7XG4gICAgICB9XG5cbiAgICAgICRncnAgPSB0aGlzLmNyZWF0ZUdyb3VwQ29udGFpbmVyKGdycF9jbGFzcyk7XG4gICAgICAkY29udGFpbmVyLmFwcGVuZCgkZ3JwKTtcbiAgICAgIHJldHVybiAkZ3JwO1xuICAgIH1cbiAgICAvLyBSZXBsYWNlIGFsbCBzcGFjZXMgdG8gZGFzaCBhbmQgbWFrZSBjbGFzcyBsb3dlcmNhc2VcbiAgICB2YXIgZ3JvdXBfbmFtZSA9IGluc3RhbmNlX3Byb3AuZ3JvdXAucmVwbGFjZSgvXFxzKy9nLCAnLScpLnRvTG93ZXJDYXNlKCk7XG4gICAgZ3JwX2NsYXNzID0gJ3Byb3BlcnR5LWdycC0tJyArIGdyb3VwX25hbWU7XG4gICAgJGV4aXN0aW5nID0gJGNvbnRhaW5lci5maW5kKCcuJyArIGdycF9jbGFzcyk7XG4gICAgaWYgKCRleGlzdGluZy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiAkZXhpc3Rpbmc7XG4gICAgfVxuICAgICRncnAgPSB0aGlzLmNyZWF0ZUdyb3VwQ29udGFpbmVyKGdycF9jbGFzcywgaW5zdGFuY2VfcHJvcC5ncm91cCk7XG4gICAgJGNvbnRhaW5lci5hcHBlbmQoJGdycCk7XG4gICAgcmV0dXJuICRncnA7XG4gIH1cblxuICBjcmVhdGVHcm91cENvbnRhaW5lcihncnBfY2xhc3MsIGxhYmVsID0gZmFsc2UpIHtcbiAgICB2YXIgJGdycCA9ICQoJzxkaXYgY2xhc3M9XCJwcm9wZXJ0eS1ncnAgJyArIGdycF9jbGFzcyArICdcIj48L2Rpdj4nKTtcbiAgICBpZiAobGFiZWwpIHtcbiAgICAgICRncnAuYXBwZW5kKCc8aDMgY2xhc3M9XCJwcm9wZXJ0eS1ncnBfX3RpdGxlXCI+JyArIGxhYmVsICsgJzwvaDM+Jyk7XG4gICAgfVxuICAgIHJldHVybiAkZ3JwO1xuICB9XG5cbiAgZ2V0Q29udGFpbmVyKGxpbmVEYXRhKSB7XG4gICAgdmFyICRjb250YWluZXIgPSBmYWxzZTtcbiAgICBpZiAobGluZURhdGEuaWQpIHtcbiAgICAgICRjb250YWluZXIgPSAkKCcjcHJvcGVydHktLScgKyBsaW5lRGF0YS5pZCk7XG4gICAgICBpZiAoISRjb250YWluZXIubGVuZ3RoKSB7XG4gICAgICAgICRjb250YWluZXIgPSAkY29udGFpbmVyID0gJCgnPGRpdiBjbGFzcz1cInByb3BlcnRpZXNfX3dyYXBwZXJcIiBpZD1cInByb3BlcnR5LS0nICsgbGluZURhdGEuaWQgKyAnXCI+PC9kaXY+Jyk7XG4gICAgICAgIHRoaXMuJGVsLmFwcGVuZCgkY29udGFpbmVyKTtcbiAgICAgICAgaWYgKGxpbmVEYXRhLmxhYmVsKSB7XG4gICAgICAgICAgJGNvbnRhaW5lci5hcHBlbmQoJzxoMiBjbGFzcz1cInByb3BlcnRpZXMtZWRpdG9yX190aXRsZVwiPicgKyBsaW5lRGF0YS5sYWJlbCArICc8L2gyPicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgkY29udGFpbmVyID09PSBmYWxzZSkge1xuICAgICAgJGNvbnRhaW5lciA9ICQoJzxkaXYgY2xhc3M9XCJwcm9wZXJ0aWVzX193cmFwcGVyXCIgaWQ9XCJuby1pdGVtXCI+PC9kaXY+Jyk7XG4gICAgICB0aGlzLiRlbC5hcHBlbmQoJGNvbnRhaW5lcik7XG4gICAgfVxuICAgIHJldHVybiAkY29udGFpbmVyO1xuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge2l0ZW0ucmVtb3ZlKCk7fSk7XG4gICAgaWYgKHRoaXMua2V5QWRkZWQpIHtcbiAgICAgIHRoaXMua2V5QWRkZWQuZGlzcG9zZSgpO1xuICAgIH1cblxuICAgIGRlbGV0ZSB0aGlzLmVkaXRvcjtcbiAgICBkZWxldGUgdGhpcy4kZWw7XG5cbiAgICBkZWxldGUgdGhpcy50aW1lbGluZTtcbiAgICBkZWxldGUgdGhpcy50aW1lcjtcbiAgICBkZWxldGUgdGhpcy5zZWxlY3Rpb25NYW5hZ2VyO1xuICAgIGRlbGV0ZSB0aGlzLmtleUFkZGVkO1xuICAgIGRlbGV0ZSB0aGlzLml0ZW1zO1xuICAgIGRlbGV0ZSB0aGlzLm51bWJlclByb3A7XG4gICAgZGVsZXRlIHRoaXMudHdlZW5Qcm9wO1xuICB9XG5cbiAgYWRkTnVtYmVyUHJvcGVydHkoaW5zdGFuY2VfcHJvcCwgbGluZURhdGEsIGtleV92YWwsICRjb250YWluZXIpIHtcbiAgICB2YXIgUHJvcENsYXNzID0gUHJvcGVydHlOdW1iZXI7XG4gICAgaWYgKGluc3RhbmNlX3Byb3AudHlwZSAmJiBpbnN0YW5jZV9wcm9wLnR5cGUgPT09ICdjb2xvcicpIHtcbiAgICAgIFByb3BDbGFzcyA9IFByb3BlcnR5Q29sb3I7XG4gICAgfVxuICAgIHZhciBwcm9wID0gbmV3IFByb3BDbGFzcyhpbnN0YW5jZV9wcm9wLCBsaW5lRGF0YSwgdGhpcy5lZGl0b3IsIGtleV92YWwpO1xuICAgIHByb3Aua2V5QWRkZWQuYWRkKHRoaXMub25LZXlBZGRlZCk7XG4gICAgJGNvbnRhaW5lci5hcHBlbmQocHJvcC4kZWwpO1xuICAgIHJldHVybiBwcm9wO1xuICB9XG5cbiAgYWRkVHdlZW5Qcm9wZXJ0eShpbnN0YW5jZV9wcm9wLCBsaW5lRGF0YSwga2V5X3ZhbCwgJGNvbnRhaW5lciwgcHJvcGVydHlEYXRhKSB7XG4gICAgdmFyIHR3ZWVuID0gbmV3IFByb3BlcnR5VHdlZW4oaW5zdGFuY2VfcHJvcCwgbGluZURhdGEsIHRoaXMuZWRpdG9yLCBrZXlfdmFsLCB0aGlzLnRpbWVsaW5lKTtcbiAgICAkY29udGFpbmVyLmFwcGVuZCh0d2Vlbi4kZWwpO1xuXG4gICAgLy8gQWRkIGEgcmVtb3ZlIGtleSBidXR0b25cbiAgICB0d2Vlbi4kZWwuZmluZCgnW2RhdGEtYWN0aW9uLXJlbW92ZV0nKS5jbGljaygoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIGluZGV4ID0gcHJvcGVydHlEYXRhLmtleXMuaW5kZXhPZihrZXlfdmFsKTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHByb3BlcnR5RGF0YS5rZXlzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGlmIChrZXlfdmFsLl9kb20pIHtcbiAgICAgICAgICB0aGlzLmVkaXRvci5wcm9wZXJ0aWVzRWRpdG9yLmtleVJlbW92ZWQuZGlzcGF0Y2goa2V5X3ZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgbGluZURhdGEuX2lzRGlydHkgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0d2VlbjtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gdGhpcy5pdGVtc1tpXTtcbiAgICAgIGl0ZW0udXBkYXRlKCk7XG4gICAgfVxuICB9XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2VkaXRvci9Qcm9wZXJ0eS5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");
=======
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _PropertyNumber = __webpack_require__(24);
	
	var _PropertyNumber2 = _interopRequireDefault(_PropertyNumber);
	
	var _PropertyColor = __webpack_require__(31);
	
	var _PropertyColor2 = _interopRequireDefault(_PropertyColor);
	
	var _PropertyTween = __webpack_require__(34);
	
	var _PropertyTween2 = _interopRequireDefault(_PropertyTween);
	
	var _PropertyEvent = __webpack_require__(36);
	
	var _PropertyEvent2 = _interopRequireDefault(_PropertyEvent);
	
	var _PropertyFooter = __webpack_require__(38);
	
	var _PropertyFooter2 = _interopRequireDefault(_PropertyFooter);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Signals = __webpack_require__(5);
	
	var Property = function () {
	  function Property(editor, $el, data) {
	    _classCallCheck(this, Property);
	
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
	
	    var key_val = false;
	    // var propertyObject = false;
	    var propertyData = false;
	    // var lineObject = false;
	    var lineData = false;
	
	    // For keys the _property data should be defined.
	    if (data._property) {
	      propertyData = data._property;
	      lineData = propertyData._line;
	      key_val = data;
	    }
	
	    // Check if we selected a main item.
	    if (data.id) {
	      lineData = data;
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
	      if (lineData.properties.hasOwnProperty(key)) {
	        var instance_prop = lineData.properties[key];
	        // show all properties or only 1 if we selected a key.
	        if (!property_name || instance_prop.name === property_name) {
	          var $grp_container = this.getGroupContainer(instance_prop, $container);
	          var numberProp = this.addNumberProperty(instance_prop, lineData, key_val, $grp_container);
	          this.items.push(numberProp);
	          if (instance_prop.name === property_name) {
	            $tween_container = $grp_container;
	          }
	
	          if (property_name) {
	            if (instance_prop.type !== 'event') {
	              // Add tween select if we are editing a key, so only if there is property_name.
	              var tweenProp = this.addTweenProperty(instance_prop, lineData, key_val, $tween_container);
	              this.items.push(tweenProp);
	            }
	            var footerProp = this.addFooter(instance_prop, lineData, key_val, $tween_container, propertyData);
	            this.items.push(footerProp);
	          }
	        }
	      }
	    }
	  }
	
	  _createClass(Property, [{
	    key: 'onKeyAdded',
	    value: function onKeyAdded() {
	      // propagate the event.
	      this.keyAdded.dispatch();
	    }
	  }, {
	    key: 'getGroupContainer',
	    value: function getGroupContainer(instance_prop, $container) {
	      var $existing;
	      var $grp;
	      var grp_class;
	      if (!instance_prop.group) {
	        grp_class = 'property-grp--general';
	        $existing = $container.find('.' + grp_class);
	        if ($existing.length) {
	          return $existing;
	        }
	
	        $grp = this.createGroupContainer(grp_class);
	        $container.append($grp);
	        return $grp;
	      }
	      // Replace all spaces to dash and make class lowercase
	      var group_name = instance_prop.group.replace(/\s+/g, '-').toLowerCase();
	      grp_class = 'property-grp--' + group_name;
	      $existing = $container.find('.' + grp_class);
	      if ($existing.length) {
	        return $existing;
	      }
	      $grp = this.createGroupContainer(grp_class, instance_prop.group);
	      $container.append($grp);
	      return $grp;
	    }
	  }, {
	    key: 'createGroupContainer',
	    value: function createGroupContainer(grp_class) {
	      var label = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
	      var $grp = $('<div class="property-grp ' + grp_class + '"></div>');
	      if (label) {
	        $grp.append('<h3 class="property-grp__title">' + label + '</h3>');
	      }
	      return $grp;
	    }
	  }, {
	    key: 'getContainer',
	    value: function getContainer(lineData) {
	      var $container = false;
	      if (lineData.id) {
	        $container = $('#property--' + lineData.id);
	        if (!$container.length) {
	          $container = $container = $('<div class="properties__wrapper" id="property--' + lineData.id + '"></div>');
	          this.$el.append($container);
	          if (lineData.label) {
	            $container.append('<h2 class="properties-editor__title">' + lineData.label + '</h2>');
	          }
	        }
	      }
	      if ($container === false) {
	        $container = $('<div class="properties__wrapper" id="no-item"></div>');
	        this.$el.append($container);
	      }
	      return $container;
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
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
	    }
	  }, {
	    key: 'addNumberProperty',
	    value: function addNumberProperty(instance_prop, lineData, key_val, $container) {
	      var PropClass = _PropertyNumber2.default;
	      if (instance_prop.type === 'color') {
	        PropClass = _PropertyColor2.default;
	      } else if (instance_prop.type === 'event') {
	        PropClass = _PropertyEvent2.default;
	      }
	      var prop = new PropClass(instance_prop, lineData, this.editor, key_val);
	      prop.keyAdded.add(this.onKeyAdded);
	      $container.append(prop.$el);
	      return prop;
	    }
	  }, {
	    key: 'addTweenProperty',
	    value: function addTweenProperty(instance_prop, lineData, key_val, $container) {
	      var tween = new _PropertyTween2.default(instance_prop, lineData, this.editor, key_val, this.timeline);
	      $container.append(tween.$el);
	      return tween;
	    }
	  }, {
	    key: 'addFooter',
	    value: function addFooter(instance_prop, lineData, key_val, $container, propertyData) {
	      var _this = this;
	
	      var footer = new _PropertyFooter2.default(instance_prop, lineData, this.editor, key_val, this.timeline);
	      $container.append(footer.$el);
	
	      // Add a remove key button
	      footer.$el.find('[data-action-remove]').click(function (e) {
	        e.preventDefault();
	        var index = propertyData.keys.indexOf(key_val);
	        if (index > -1) {
	          propertyData.keys.splice(index, 1);
	          if (key_val._dom) {
	            _this.editor.propertiesEditor.keyRemoved.dispatch(key_val);
	          }
	          lineData._isDirty = true;
	        }
	      });
	      return footer;
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      for (var i = 0; i < this.items.length; i++) {
	        var item = this.items[i];
	        item.update();
	      }
	    }
	  }]);
	
	  return Property;
	}();
	
	exports.default = Property;
>>>>>>> master

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if (\"value\" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };\n\n__webpack_require__(18);\n\nvar _PropertyBase2 = __webpack_require__(21);\n\nvar _PropertyBase3 = _interopRequireDefault(_PropertyBase2);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar DraggableNumber = __webpack_require__(22);\n\nvar tpl_property = __webpack_require__(23);\n\nvar PropertyNumber = function (_PropertyBase) {\n  _inherits(PropertyNumber, _PropertyBase);\n\n  // instance_property: The current property on the data object.\n  // lineData: The line data object.\n  function PropertyNumber(instance_property, lineData, editor) {\n    var key_val = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];\n\n    _classCallCheck(this, PropertyNumber);\n\n    var _this = _possibleConstructorReturn(this, (PropertyNumber.__proto__ || Object.getPrototypeOf(PropertyNumber)).call(this, instance_property, lineData, editor, key_val));\n\n    _this.onInputChange = _this.onInputChange.bind(_this);\n    _this.$input = _this.$el.find('input');\n    return _this;\n  }\n\n  _createClass(PropertyNumber, [{\n    key: 'getInputVal',\n    value: function getInputVal() {\n      return parseFloat(this.$el.find('input').val());\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      var _this2 = this;\n\n      _get(PropertyNumber.prototype.__proto__ || Object.getPrototypeOf(PropertyNumber.prototype), 'render', this).call(this);\n      // By default assign the property default value\n      var val = this.getCurrentVal();\n\n      var data = {\n        id: this.instance_property.name, // \"circleRadius\" instead of \"circle radius\"\n        label: this.instance_property.label || this.instance_property.name,\n        val: val\n      };\n\n      var view = tpl_property(data);\n      this.$el = $(view);\n      this.$el.find('.property__key').click(this.onKeyClick);\n\n      var $input = this.$el.find('input');\n\n      var onChangeEnd = function onChangeEnd() {\n        _this2.editor.undoManager.addState();\n      };\n\n      var draggableOptions = {\n        changeCallback: function changeCallback() {\n          return _this2.onInputChange();\n        },\n        endCallback: function endCallback() {\n          return onChangeEnd();\n        }\n      };\n      // Set min & max if they are defined.\n      if ('min' in this.instance_property) {\n        draggableOptions.min = this.instance_property.min;\n      }\n      if ('max' in this.instance_property) {\n        draggableOptions.max = this.instance_property.max;\n      }\n\n      var draggable = new DraggableNumber($input.get(0), draggableOptions);\n      $input.data('draggable', draggable);\n      $input.change(this.onInputChange);\n    }\n  }, {\n    key: 'remove',\n    value: function remove() {\n      _get(PropertyNumber.prototype.__proto__ || Object.getPrototypeOf(PropertyNumber.prototype), 'render', this).call(this);\n      if (this.$input.data('draggable')) {\n        this.$input.data('draggable').destroy();\n      }\n\n      delete this.$input;\n      delete this.$el;\n    }\n  }, {\n    key: 'update',\n    value: function update() {\n      _get(PropertyNumber.prototype.__proto__ || Object.getPrototypeOf(PropertyNumber.prototype), 'render', this).call(this);\n      var val = this.getCurrentVal();\n      var draggable = this.$input.data('draggable');\n\n      if (draggable) {\n        draggable.set(val.toFixed(3));\n      } else {\n        this.$input.val(val.toFixed(3));\n      }\n    }\n  }]);\n\n  return PropertyNumber;\n}(_PropertyBase3.default);\n\nexports.default = PropertyNumber;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lZGl0b3IvUHJvcGVydHlOdW1iZXIuanM/N2UxMCJdLCJuYW1lcyI6WyJEcmFnZ2FibGVOdW1iZXIiLCJyZXF1aXJlIiwidHBsX3Byb3BlcnR5IiwiUHJvcGVydHlOdW1iZXIiLCJpbnN0YW5jZV9wcm9wZXJ0eSIsImxpbmVEYXRhIiwiZWRpdG9yIiwia2V5X3ZhbCIsIm9uSW5wdXRDaGFuZ2UiLCJiaW5kIiwiJGlucHV0IiwiJGVsIiwiZmluZCIsInBhcnNlRmxvYXQiLCJ2YWwiLCJnZXRDdXJyZW50VmFsIiwiZGF0YSIsImlkIiwibmFtZSIsImxhYmVsIiwidmlldyIsIiQiLCJjbGljayIsIm9uS2V5Q2xpY2siLCJvbkNoYW5nZUVuZCIsInVuZG9NYW5hZ2VyIiwiYWRkU3RhdGUiLCJkcmFnZ2FibGVPcHRpb25zIiwiY2hhbmdlQ2FsbGJhY2siLCJlbmRDYWxsYmFjayIsIm1pbiIsIm1heCIsImRyYWdnYWJsZSIsImdldCIsImNoYW5nZSIsImRlc3Ryb3kiLCJzZXQiLCJ0b0ZpeGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUNBLElBQUlBLGtCQUFrQixtQkFBQUMsQ0FBUSxFQUFSLENBQXRCOztBQUVBLElBQUlDLGVBQWUsbUJBQUFELENBQVEsRUFBUixDQUFuQjs7SUFFcUJFLGM7OztBQUNuQjtBQUNBO0FBQ0EsMEJBQVlDLGlCQUFaLEVBQStCQyxRQUEvQixFQUF5Q0MsTUFBekMsRUFBa0U7QUFBQSxRQUFqQkMsT0FBaUIseURBQVAsS0FBTzs7QUFBQTs7QUFBQSxnSUFDMURILGlCQUQwRCxFQUN2Q0MsUUFEdUMsRUFDN0JDLE1BRDZCLEVBQ3JCQyxPQURxQjs7QUFFaEUsVUFBS0MsYUFBTCxHQUFxQixNQUFLQSxhQUFMLENBQW1CQyxJQUFuQixPQUFyQjtBQUNBLFVBQUtDLE1BQUwsR0FBYyxNQUFLQyxHQUFMLENBQVNDLElBQVQsQ0FBYyxPQUFkLENBQWQ7QUFIZ0U7QUFJakU7Ozs7a0NBRWE7QUFDWixhQUFPQyxXQUFXLEtBQUtGLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLE9BQWQsRUFBdUJFLEdBQXZCLEVBQVgsQ0FBUDtBQUNEOzs7NkJBRVE7QUFBQTs7QUFDUDtBQUNBO0FBQ0EsVUFBSUEsTUFBTSxLQUFLQyxhQUFMLEVBQVY7O0FBRUEsVUFBSUMsT0FBTztBQUNUQyxZQUFJLEtBQUtiLGlCQUFMLENBQXVCYyxJQURsQixFQUN3QjtBQUNqQ0MsZUFBTyxLQUFLZixpQkFBTCxDQUF1QmUsS0FBdkIsSUFBZ0MsS0FBS2YsaUJBQUwsQ0FBdUJjLElBRnJEO0FBR1RKLGFBQUtBO0FBSEksT0FBWDs7QUFNQSxVQUFJTSxPQUFPbEIsYUFBYWMsSUFBYixDQUFYO0FBQ0EsV0FBS0wsR0FBTCxHQUFXVSxFQUFFRCxJQUFGLENBQVg7QUFDQSxXQUFLVCxHQUFMLENBQVNDLElBQVQsQ0FBYyxnQkFBZCxFQUFnQ1UsS0FBaEMsQ0FBc0MsS0FBS0MsVUFBM0M7O0FBRUEsVUFBSWIsU0FBUyxLQUFLQyxHQUFMLENBQVNDLElBQVQsQ0FBYyxPQUFkLENBQWI7O0FBRUEsVUFBSVksY0FBYyxTQUFkQSxXQUFjLEdBQU07QUFDdEIsZUFBS2xCLE1BQUwsQ0FBWW1CLFdBQVosQ0FBd0JDLFFBQXhCO0FBQ0QsT0FGRDs7QUFJQSxVQUFJQyxtQkFBbUI7QUFDckJDLHdCQUFnQjtBQUFBLGlCQUFNLE9BQUtwQixhQUFMLEVBQU47QUFBQSxTQURLO0FBRXJCcUIscUJBQWE7QUFBQSxpQkFBTUwsYUFBTjtBQUFBO0FBRlEsT0FBdkI7QUFJQTtBQUNBLFVBQUksU0FBUyxLQUFLcEIsaUJBQWxCLEVBQXFDO0FBQ25DdUIseUJBQWlCRyxHQUFqQixHQUF1QixLQUFLMUIsaUJBQUwsQ0FBdUIwQixHQUE5QztBQUNEO0FBQ0QsVUFBSSxTQUFTLEtBQUsxQixpQkFBbEIsRUFBcUM7QUFDbkN1Qix5QkFBaUJJLEdBQWpCLEdBQXVCLEtBQUszQixpQkFBTCxDQUF1QjJCLEdBQTlDO0FBQ0Q7O0FBRUQsVUFBSUMsWUFBWSxJQUFJaEMsZUFBSixDQUFvQlUsT0FBT3VCLEdBQVAsQ0FBVyxDQUFYLENBQXBCLEVBQW1DTixnQkFBbkMsQ0FBaEI7QUFDQWpCLGFBQU9NLElBQVAsQ0FBWSxXQUFaLEVBQXlCZ0IsU0FBekI7QUFDQXRCLGFBQU93QixNQUFQLENBQWMsS0FBSzFCLGFBQW5CO0FBQ0Q7Ozs2QkFFUTtBQUNQO0FBQ0EsVUFBSSxLQUFLRSxNQUFMLENBQVlNLElBQVosQ0FBaUIsV0FBakIsQ0FBSixFQUFtQztBQUNqQyxhQUFLTixNQUFMLENBQVlNLElBQVosQ0FBaUIsV0FBakIsRUFBOEJtQixPQUE5QjtBQUNEOztBQUVELGFBQU8sS0FBS3pCLE1BQVo7QUFDQSxhQUFPLEtBQUtDLEdBQVo7QUFDRDs7OzZCQUVRO0FBQ1A7QUFDQSxVQUFJRyxNQUFNLEtBQUtDLGFBQUwsRUFBVjtBQUNBLFVBQUlpQixZQUFZLEtBQUt0QixNQUFMLENBQVlNLElBQVosQ0FBaUIsV0FBakIsQ0FBaEI7O0FBRUEsVUFBSWdCLFNBQUosRUFBZTtBQUNiQSxrQkFBVUksR0FBVixDQUFjdEIsSUFBSXVCLE9BQUosQ0FBWSxDQUFaLENBQWQ7QUFDRCxPQUZELE1BR0s7QUFDSCxhQUFLM0IsTUFBTCxDQUFZSSxHQUFaLENBQWdCQSxJQUFJdUIsT0FBSixDQUFZLENBQVosQ0FBaEI7QUFDRDtBQUNGOzs7Ozs7a0JBeEVrQmxDLGMiLCJmaWxlIjoiMjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ2pxdWVyeSc7XG5pbXBvcnQgUHJvcGVydHlCYXNlIGZyb20gJy4vUHJvcGVydHlCYXNlJztcbmxldCBEcmFnZ2FibGVOdW1iZXIgPSByZXF1aXJlKCdkcmFnZ2FibGUtbnVtYmVyLmpzJyk7XG5cbmxldCB0cGxfcHJvcGVydHkgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvcHJvcGVydHlOdW1iZXIudHBsLmh0bWwnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvcGVydHlOdW1iZXIgZXh0ZW5kcyBQcm9wZXJ0eUJhc2Uge1xuICAvLyBpbnN0YW5jZV9wcm9wZXJ0eTogVGhlIGN1cnJlbnQgcHJvcGVydHkgb24gdGhlIGRhdGEgb2JqZWN0LlxuICAvLyBsaW5lRGF0YTogVGhlIGxpbmUgZGF0YSBvYmplY3QuXG4gIGNvbnN0cnVjdG9yKGluc3RhbmNlX3Byb3BlcnR5LCBsaW5lRGF0YSwgZWRpdG9yLCBrZXlfdmFsID0gZmFsc2UpIHtcbiAgICBzdXBlcihpbnN0YW5jZV9wcm9wZXJ0eSwgbGluZURhdGEsIGVkaXRvciwga2V5X3ZhbCk7XG4gICAgdGhpcy5vbklucHV0Q2hhbmdlID0gdGhpcy5vbklucHV0Q2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy4kaW5wdXQgPSB0aGlzLiRlbC5maW5kKCdpbnB1dCcpO1xuICB9XG5cbiAgZ2V0SW5wdXRWYWwoKSB7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQodGhpcy4kZWwuZmluZCgnaW5wdXQnKS52YWwoKSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgc3VwZXIucmVuZGVyKCk7XG4gICAgLy8gQnkgZGVmYXVsdCBhc3NpZ24gdGhlIHByb3BlcnR5IGRlZmF1bHQgdmFsdWVcbiAgICB2YXIgdmFsID0gdGhpcy5nZXRDdXJyZW50VmFsKCk7XG5cbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIGlkOiB0aGlzLmluc3RhbmNlX3Byb3BlcnR5Lm5hbWUsIC8vIFwiY2lyY2xlUmFkaXVzXCIgaW5zdGVhZCBvZiBcImNpcmNsZSByYWRpdXNcIlxuICAgICAgbGFiZWw6IHRoaXMuaW5zdGFuY2VfcHJvcGVydHkubGFiZWwgfHwgdGhpcy5pbnN0YW5jZV9wcm9wZXJ0eS5uYW1lLFxuICAgICAgdmFsOiB2YWxcbiAgICB9O1xuXG4gICAgdmFyIHZpZXcgPSB0cGxfcHJvcGVydHkoZGF0YSk7XG4gICAgdGhpcy4kZWwgPSAkKHZpZXcpO1xuICAgIHRoaXMuJGVsLmZpbmQoJy5wcm9wZXJ0eV9fa2V5JykuY2xpY2sodGhpcy5vbktleUNsaWNrKTtcblxuICAgIHZhciAkaW5wdXQgPSB0aGlzLiRlbC5maW5kKCdpbnB1dCcpO1xuXG4gICAgdmFyIG9uQ2hhbmdlRW5kID0gKCkgPT4ge1xuICAgICAgdGhpcy5lZGl0b3IudW5kb01hbmFnZXIuYWRkU3RhdGUoKTtcbiAgICB9O1xuXG4gICAgdmFyIGRyYWdnYWJsZU9wdGlvbnMgPSB7XG4gICAgICBjaGFuZ2VDYWxsYmFjazogKCkgPT4gdGhpcy5vbklucHV0Q2hhbmdlKCksXG4gICAgICBlbmRDYWxsYmFjazogKCkgPT4gb25DaGFuZ2VFbmQoKVxuICAgIH07XG4gICAgLy8gU2V0IG1pbiAmIG1heCBpZiB0aGV5IGFyZSBkZWZpbmVkLlxuICAgIGlmICgnbWluJyBpbiB0aGlzLmluc3RhbmNlX3Byb3BlcnR5KSB7XG4gICAgICBkcmFnZ2FibGVPcHRpb25zLm1pbiA9IHRoaXMuaW5zdGFuY2VfcHJvcGVydHkubWluO1xuICAgIH1cbiAgICBpZiAoJ21heCcgaW4gdGhpcy5pbnN0YW5jZV9wcm9wZXJ0eSkge1xuICAgICAgZHJhZ2dhYmxlT3B0aW9ucy5tYXggPSB0aGlzLmluc3RhbmNlX3Byb3BlcnR5Lm1heDtcbiAgICB9XG5cbiAgICB2YXIgZHJhZ2dhYmxlID0gbmV3IERyYWdnYWJsZU51bWJlcigkaW5wdXQuZ2V0KDApLCBkcmFnZ2FibGVPcHRpb25zKTtcbiAgICAkaW5wdXQuZGF0YSgnZHJhZ2dhYmxlJywgZHJhZ2dhYmxlKTtcbiAgICAkaW5wdXQuY2hhbmdlKHRoaXMub25JbnB1dENoYW5nZSk7XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgc3VwZXIucmVuZGVyKCk7XG4gICAgaWYgKHRoaXMuJGlucHV0LmRhdGEoJ2RyYWdnYWJsZScpKSB7XG4gICAgICB0aGlzLiRpbnB1dC5kYXRhKCdkcmFnZ2FibGUnKS5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgZGVsZXRlIHRoaXMuJGlucHV0O1xuICAgIGRlbGV0ZSB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICBzdXBlci5yZW5kZXIoKTtcbiAgICB2YXIgdmFsID0gdGhpcy5nZXRDdXJyZW50VmFsKCk7XG4gICAgdmFyIGRyYWdnYWJsZSA9IHRoaXMuJGlucHV0LmRhdGEoJ2RyYWdnYWJsZScpO1xuXG4gICAgaWYgKGRyYWdnYWJsZSkge1xuICAgICAgZHJhZ2dhYmxlLnNldCh2YWwudG9GaXhlZCgzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy4kaW5wdXQudmFsKHZhbC50b0ZpeGVkKDMpKTtcbiAgICB9XG4gIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vZWRpdG9yL1Byb3BlcnR5TnVtYmVyLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");
=======
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	__webpack_require__(22);
	
	var _PropertyBase2 = __webpack_require__(25);
	
	var _PropertyBase3 = _interopRequireDefault(_PropertyBase2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var DraggableNumber = __webpack_require__(26);
	
	var tpl_property = __webpack_require__(27);
	
	var PropertyNumber = function (_PropertyBase) {
	  _inherits(PropertyNumber, _PropertyBase);
	
	  // instance_property: The current property on the data object.
	  // lineData: The line data object.
	
	  function PropertyNumber(instance_property, lineData, editor) {
	    var key_val = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
	
	    _classCallCheck(this, PropertyNumber);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PropertyNumber).call(this, instance_property, lineData, editor, key_val));
	
	    _this.onInputChange = _this.onInputChange.bind(_this);
	    _this.$input = _this.$el.find('input');
	    return _this;
	  }
	
	  _createClass(PropertyNumber, [{
	    key: 'getInputVal',
	    value: function getInputVal() {
	      return parseFloat(this.$el.find('input').val());
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;
	
	      _get(Object.getPrototypeOf(PropertyNumber.prototype), 'render', this).call(this);
	      // By default assign the property default value
	      var val = this.getCurrentVal();
	
	      var data = {
	        id: this.instance_property.name, // "circleRadius" instead of "circle radius"
	        label: this.instance_property.label || this.instance_property.name,
	        val: val
	      };
	
	      var view = tpl_property(data);
	      this.$el = $(view);
	      this.$el.find('.property__key').click(this.onKeyClick);
	
	      var $input = this.$el.find('input');
	
	      var onChangeEnd = function onChangeEnd() {
	        _this2.editor.undoManager.addState();
	      };
	
	      var draggableOptions = {
	        changeCallback: function changeCallback() {
	          return _this2.onInputChange();
	        },
	        endCallback: function endCallback() {
	          return onChangeEnd();
	        }
	      };
	      // Set min & max if they are defined.
	      if ('min' in this.instance_property) {
	        draggableOptions.min = this.instance_property.min;
	      }
	      if ('max' in this.instance_property) {
	        draggableOptions.max = this.instance_property.max;
	      }
	
	      var draggable = new DraggableNumber($input.get(0), draggableOptions);
	      $input.data('draggable', draggable);
	      $input.change(this.onInputChange);
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      _get(Object.getPrototypeOf(PropertyNumber.prototype), 'render', this).call(this);
	      if (this.$input.data('draggable')) {
	        this.$input.data('draggable').destroy();
	      }
	
	      delete this.$input;
	      delete this.$el;
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      _get(Object.getPrototypeOf(PropertyNumber.prototype), 'render', this).call(this);
	      var val = this.getCurrentVal();
	      var draggable = this.$input.data('draggable');
	
	      if (draggable) {
	        draggable.set(val.toFixed(3));
	      } else {
	        this.$input.val(val.toFixed(3));
	      }
	    }
	  }]);
	
	  return PropertyNumber;
	}(_PropertyBase3.default);
	
	exports.default = PropertyNumber;
>>>>>>> master

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _Utils = __webpack_require__(1);\n\nvar _Utils2 = _interopRequireDefault(_Utils);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Signals = __webpack_require__(3);\nvar _ = __webpack_require__(6);\n\nvar PropertyBase = function () {\n  // @instance_property: The current property on the data object.\n  // @lineData: The line data object.\n  function PropertyBase(instance_property, lineData, editor) {\n    var key_val = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];\n\n    _classCallCheck(this, PropertyBase);\n\n    this.instance_property = instance_property;\n    this.lineData = lineData;\n    this.editor = editor;\n    this.key_val = key_val;\n\n    // this.update = this.update.bind(this);\n    this.onInputChange = this.onInputChange.bind(this);\n    this.onKeyClick = this.onKeyClick.bind(this);\n\n    this.timer = editor.timer;\n    this.keyAdded = new Signals.Signal();\n    this.render();\n\n    this.$key = this.$el.find('.property__key');\n  }\n\n  _createClass(PropertyBase, [{\n    key: 'onKeyClick',\n    value: function onKeyClick(e) {\n      e.preventDefault();\n      var currentValue = this.getCurrentVal();\n      this.addKey(currentValue);\n    }\n  }, {\n    key: 'getInputVal',\n    value: function getInputVal() {\n      return this.$el.find('input').val();\n    }\n  }, {\n    key: 'getCurrentVal',\n    value: function getCurrentVal() {\n      var val = this.instance_property.val;\n      var prop_name = this.instance_property.name;\n\n      // if we selected a key simply return it's value\n      if (this.key_val) {\n        return this.key_val.val;\n      }\n      if (this.lineData.values !== undefined && this.lineData.values[prop_name]) {\n        return this.lineData.values[prop_name];\n      }\n      return val;\n    }\n  }, {\n    key: 'onInputChange',\n    value: function onInputChange() {\n      var current_value = this.getInputVal();\n      var currentTime = this.timer.getCurrentTime() / 1000;\n\n      // if we selected a key simply get the time from it.\n      if (this.key_val) {\n        currentTime = this.key_val.time;\n      }\n\n      if (this.instance_property.keys && this.instance_property.keys.length) {\n        // Add a new key if there is no other key at same time\n        var current_key = _.find(this.instance_property.keys, function (key) {\n          return key.time === currentTime;\n        });\n\n        if (current_key) {\n          // if there is a key update it\n          current_key.val = current_value;\n        } else {\n          // add a new key\n          this.addKey(current_value);\n        }\n      } else {\n        // There is no keys, simply update the property value (for data saving)\n        this.instance_property.val = current_value;\n        // Also directly set the lineData value.\n        this.lineData.values[this.instance_property.name] = current_value;\n        // Simply update the custom object with new values.\n        if (this.lineData.object) {\n          currentTime = this.timer.getCurrentTime() / 1000;\n          // Set the property on the instance object.\n          this.lineData.object.update(currentTime - this.lineData.start);\n        }\n      }\n\n      // Something changed, make the lineData dirty to rebuild things. d\n      this.lineData._isDirty = true;\n    }\n  }, {\n    key: 'getCurrentKey',\n    value: function getCurrentKey() {\n      var time = this.timer.getCurrentTime() / 1000;\n      if (!this.instance_property || !this.instance_property.keys) {\n        return false;\n      }\n      if (this.instance_property.keys.length === 0) {\n        return false;\n      }\n      for (var i = 0; i < this.instance_property.keys.length; i++) {\n        var key = this.instance_property.keys[i];\n        if (key.time === time) {\n          return key;\n        }\n      }\n      return false;\n    }\n  }, {\n    key: 'addKey',\n    value: function addKey(val) {\n      var core = this.editor.tweenTime;\n      var currentTime = this.timer.getCurrentTime() / 1000;\n      var key = {\n        time: currentTime,\n        val: val\n      };\n      if (core.options.defaultEase) {\n        key.ease = core.options.defaultEase;\n      }\n      this.instance_property.keys.push(key);\n      this.instance_property.keys = _Utils2.default.sortKeys(this.instance_property.keys);\n      this.lineData._isDirty = true;\n      this.keyAdded.dispatch();\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      // current values are defined in @lineData.values\n      this.values = this.lineData.values !== undefined ? this.lineData.values : {};\n    }\n  }, {\n    key: 'update',\n    value: function update() {\n      var key = this.getCurrentKey();\n      this.$key.toggleClass('property__key--active', key);\n    }\n  }, {\n    key: 'remove',\n    value: function remove() {\n      if (this.keyAdded) {\n        this.keyAdded.dispose();\n      }\n      delete this.instance_property;\n      delete this.lineData;\n      delete this.editor;\n      delete this.key_val;\n\n      delete this.timer;\n      delete this.keyAdded;\n      delete this.$key;\n    }\n  }]);\n\n  return PropertyBase;\n}();\n\nexports.default = PropertyBase;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lZGl0b3IvUHJvcGVydHlCYXNlLmpzPzZjMGUiXSwibmFtZXMiOlsiU2lnbmFscyIsInJlcXVpcmUiLCJfIiwiUHJvcGVydHlCYXNlIiwiaW5zdGFuY2VfcHJvcGVydHkiLCJsaW5lRGF0YSIsImVkaXRvciIsImtleV92YWwiLCJvbklucHV0Q2hhbmdlIiwiYmluZCIsIm9uS2V5Q2xpY2siLCJ0aW1lciIsImtleUFkZGVkIiwiU2lnbmFsIiwicmVuZGVyIiwiJGtleSIsIiRlbCIsImZpbmQiLCJlIiwicHJldmVudERlZmF1bHQiLCJjdXJyZW50VmFsdWUiLCJnZXRDdXJyZW50VmFsIiwiYWRkS2V5IiwidmFsIiwicHJvcF9uYW1lIiwibmFtZSIsInZhbHVlcyIsInVuZGVmaW5lZCIsImN1cnJlbnRfdmFsdWUiLCJnZXRJbnB1dFZhbCIsImN1cnJlbnRUaW1lIiwiZ2V0Q3VycmVudFRpbWUiLCJ0aW1lIiwia2V5cyIsImxlbmd0aCIsImN1cnJlbnRfa2V5Iiwia2V5Iiwib2JqZWN0IiwidXBkYXRlIiwic3RhcnQiLCJfaXNEaXJ0eSIsImkiLCJjb3JlIiwidHdlZW5UaW1lIiwib3B0aW9ucyIsImRlZmF1bHRFYXNlIiwiZWFzZSIsInB1c2giLCJzb3J0S2V5cyIsImRpc3BhdGNoIiwiZ2V0Q3VycmVudEtleSIsInRvZ2dsZUNsYXNzIiwiZGlzcG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7QUFGQSxJQUFJQSxVQUFVLG1CQUFBQyxDQUFRLENBQVIsQ0FBZDtBQUNBLElBQUlDLElBQUksbUJBQUFELENBQVEsQ0FBUixDQUFSOztJQUdxQkUsWTtBQUNuQjtBQUNBO0FBQ0Esd0JBQVlDLGlCQUFaLEVBQStCQyxRQUEvQixFQUF5Q0MsTUFBekMsRUFBa0U7QUFBQSxRQUFqQkMsT0FBaUIseURBQVAsS0FBTzs7QUFBQTs7QUFDaEUsU0FBS0gsaUJBQUwsR0FBeUJBLGlCQUF6QjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0JB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QUF6QjtBQUNBLFdBQUs1QixRQUFMLENBQWNxQyxRQUFkO0FBQ0Q7Ozs2QkFFUTtBQUNQO0FBQ0EsV0FBS3ZCLE1BQUwsR0FBYyxLQUFLckIsUUFBTCxDQUFjcUIsTUFBZCxLQUF5QkMsU0FBekIsR0FBcUMsS0FBS3RCLFFBQUwsQ0FBY3FCLE1BQW5ELEdBQTRELEVBQTFFO0FBQ0Q7Ozs2QkFFUTtBQUNQLFVBQUlVLE1BQU0sS0FBS2MsYUFBTCxFQUFWO0FBQ0EsV0FBS25DLElBQUwsQ0FBVW9DLFdBQVYsQ0FBc0IsdUJBQXRCLEVBQStDZixHQUEvQztBQUNEOzs7NkJBRVE7QUFDUCxVQUFJLEtBQUt4QixRQUFULEVBQW1CO0FBQ2pCLGFBQUtBLFFBQUwsQ0FBY3dDLE9BQWQ7QUFDRDtBQUNELGFBQU8sS0FBS2hELGlCQUFaO0FBQ0EsYUFBTyxLQUFLQyxRQUFaO0FBQ0EsYUFBTyxLQUFLQyxNQUFaO0FBQ0EsYUFBTyxLQUFLQyxPQUFaOztBQUVBLGFBQU8sS0FBS0ksS0FBWjtBQUNBLGFBQU8sS0FBS0MsUUFBWjtBQUNBLGFBQU8sS0FBS0csSUFBWjtBQUNEOzs7Ozs7a0JBMUlrQlosWSIsImZpbGUiOiIyMS5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBTaWduYWxzID0gcmVxdWlyZSgnanMtc2lnbmFscycpO1xubGV0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbmltcG9ydCBVdGlscyBmcm9tICcuLi9jb3JlL1V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvcGVydHlCYXNlIHtcbiAgLy8gQGluc3RhbmNlX3Byb3BlcnR5OiBUaGUgY3VycmVudCBwcm9wZXJ0eSBvbiB0aGUgZGF0YSBvYmplY3QuXG4gIC8vIEBsaW5lRGF0YTogVGhlIGxpbmUgZGF0YSBvYmplY3QuXG4gIGNvbnN0cnVjdG9yKGluc3RhbmNlX3Byb3BlcnR5LCBsaW5lRGF0YSwgZWRpdG9yLCBrZXlfdmFsID0gZmFsc2UpIHtcbiAgICB0aGlzLmluc3RhbmNlX3Byb3BlcnR5ID0gaW5zdGFuY2VfcHJvcGVydHk7XG4gICAgdGhpcy5saW5lRGF0YSA9IGxpbmVEYXRhO1xuICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgIHRoaXMua2V5X3ZhbCA9IGtleV92YWw7XG5cbiAgICAvLyB0aGlzLnVwZGF0ZSA9IHRoaXMudXBkYXRlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbklucHV0Q2hhbmdlID0gdGhpcy5vbklucHV0Q2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbktleUNsaWNrID0gdGhpcy5vbktleUNsaWNrLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnRpbWVyID0gZWRpdG9yLnRpbWVyO1xuICAgIHRoaXMua2V5QWRkZWQgPSBuZXcgU2lnbmFscy5TaWduYWwoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgdGhpcy4ka2V5ID0gdGhpcy4kZWwuZmluZCgnLnByb3BlcnR5X19rZXknKTtcbiAgfVxuXG4gIG9uS2V5Q2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgY3VycmVudFZhbHVlID0gdGhpcy5nZXRDdXJyZW50VmFsKCk7XG4gICAgdGhpcy5hZGRLZXkoY3VycmVudFZhbHVlKTtcbiAgfVxuXG4gIGdldElucHV0VmFsKCkge1xuICAgIHJldHVybiB0aGlzLiRlbC5maW5kKCdpbnB1dCcpLnZhbCgpO1xuICB9XG5cbiAgZ2V0Q3VycmVudFZhbCgpIHtcbiAgICB2YXIgdmFsID0gdGhpcy5pbnN0YW5jZV9wcm9wZXJ0eS52YWw7XG4gICAgdmFyIHByb3BfbmFtZSA9IHRoaXMuaW5zdGFuY2VfcHJvcGVydHkubmFtZTtcblxuICAgIC8vIGlmIHdlIHNlbGVjdGVkIGEga2V5IHNpbXBseSByZXR1cm4gaXQncyB2YWx1ZVxuICAgIGlmICh0aGlzLmtleV92YWwpIHtcbiAgICAgIHJldHVybiB0aGlzLmtleV92YWwudmFsO1xuICAgIH1cbiAgICBpZiAodGhpcy5saW5lRGF0YS52YWx1ZXMgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmxpbmVEYXRhLnZhbHVlc1twcm9wX25hbWVdKSB7XG4gICAgICByZXR1cm4gdGhpcy5saW5lRGF0YS52YWx1ZXNbcHJvcF9uYW1lXTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIG9uSW5wdXRDaGFuZ2UoKSB7XG4gICAgdmFyIGN1cnJlbnRfdmFsdWUgPSB0aGlzLmdldElucHV0VmFsKCk7XG4gICAgdmFyIGN1cnJlbnRUaW1lID0gdGhpcy50aW1lci5nZXRDdXJyZW50VGltZSgpIC8gMTAwMDtcblxuICAgIC8vIGlmIHdlIHNlbGVjdGVkIGEga2V5IHNpbXBseSBnZXQgdGhlIHRpbWUgZnJvbSBpdC5cbiAgICBpZiAodGhpcy5rZXlfdmFsKSB7XG4gICAgICBjdXJyZW50VGltZSA9IHRoaXMua2V5X3ZhbC50aW1lO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmluc3RhbmNlX3Byb3BlcnR5LmtleXMgJiYgdGhpcy5pbnN0YW5jZV9wcm9wZXJ0eS5rZXlzLmxlbmd0aCkge1xuICAgICAgLy8gQWRkIGEgbmV3IGtleSBpZiB0aGVyZSBpcyBubyBvdGhlciBrZXkgYXQgc2FtZSB0aW1lXG4gICAgICB2YXIgY3VycmVudF9rZXkgPSBfLmZpbmQodGhpcy5pbnN0YW5jZV9wcm9wZXJ0eS5rZXlzLCAoa2V5KSA9PiBrZXkudGltZSA9PT0gY3VycmVudFRpbWUpO1xuXG4gICAgICBpZiAoY3VycmVudF9rZXkpIHtcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSBrZXkgdXBkYXRlIGl0XG4gICAgICAgIGN1cnJlbnRfa2V5LnZhbCA9IGN1cnJlbnRfdmFsdWU7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gYWRkIGEgbmV3IGtleVxuICAgICAgICB0aGlzLmFkZEtleShjdXJyZW50X3ZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBUaGVyZSBpcyBubyBrZXlzLCBzaW1wbHkgdXBkYXRlIHRoZSBwcm9wZXJ0eSB2YWx1ZSAoZm9yIGRhdGEgc2F2aW5nKVxuICAgICAgdGhpcy5pbnN0YW5jZV9wcm9wZXJ0eS52YWwgPSBjdXJyZW50X3ZhbHVlO1xuICAgICAgLy8gQWxzbyBkaXJlY3RseSBzZXQgdGhlIGxpbmVEYXRhIHZhbHVlLlxuICAgICAgdGhpcy5saW5lRGF0YS52YWx1ZXNbdGhpcy5pbnN0YW5jZV9wcm9wZXJ0eS5uYW1lXSA9IGN1cnJlbnRfdmFsdWU7XG4gICAgICAvLyBTaW1wbHkgdXBkYXRlIHRoZSBjdXN0b20gb2JqZWN0IHdpdGggbmV3IHZhbHVlcy5cbiAgICAgIGlmICh0aGlzLmxpbmVEYXRhLm9iamVjdCkge1xuICAgICAgICBjdXJyZW50VGltZSA9IHRoaXMudGltZXIuZ2V0Q3VycmVudFRpbWUoKSAvIDEwMDA7XG4gICAgICAgIC8vIFNldCB0aGUgcHJvcGVydHkgb24gdGhlIGluc3RhbmNlIG9iamVjdC5cbiAgICAgICAgdGhpcy5saW5lRGF0YS5vYmplY3QudXBkYXRlKGN1cnJlbnRUaW1lIC0gdGhpcy5saW5lRGF0YS5zdGFydCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU29tZXRoaW5nIGNoYW5nZWQsIG1ha2UgdGhlIGxpbmVEYXRhIGRpcnR5IHRvIHJlYnVpbGQgdGhpbmdzLiBkXG4gICAgdGhpcy5saW5lRGF0YS5faXNEaXJ0eSA9IHRydWU7XG4gIH1cblxuICBnZXRDdXJyZW50S2V5KCkge1xuICAgIHZhciB0aW1lID0gdGhpcy50aW1lci5nZXRDdXJyZW50VGltZSgpIC8gMTAwMDtcbiAgICBpZiAoIXRoaXMuaW5zdGFuY2VfcHJvcGVydHkgfHwgIXRoaXMuaW5zdGFuY2VfcHJvcGVydHkua2V5cykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodGhpcy5pbnN0YW5jZV9wcm9wZXJ0eS5rZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaW5zdGFuY2VfcHJvcGVydHkua2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IHRoaXMuaW5zdGFuY2VfcHJvcGVydHkua2V5c1tpXTtcbiAgICAgIGlmIChrZXkudGltZSA9PT0gdGltZSkge1xuICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhZGRLZXkodmFsKSB7XG4gICAgdmFyIGNvcmUgPSB0aGlzLmVkaXRvci50d2VlblRpbWU7XG4gICAgdmFyIGN1cnJlbnRUaW1lID0gdGhpcy50aW1lci5nZXRDdXJyZW50VGltZSgpIC8gMTAwMDtcbiAgICB2YXIga2V5ID0ge1xuICAgICAgdGltZTogY3VycmVudFRpbWUsXG4gICAgICB2YWw6IHZhbFxuICAgIH07XG4gICAgaWYgKGNvcmUub3B0aW9ucy5kZWZhdWx0RWFzZSkge1xuICAgICAga2V5LmVhc2UgPSBjb3JlLm9wdGlvbnMuZGVmYXVsdEVhc2U7XG4gICAgfVxuICAgIHRoaXMuaW5zdGFuY2VfcHJvcGVydHkua2V5cy5wdXNoKGtleSk7XG4gICAgdGhpcy5pbnN0YW5jZV9wcm9wZXJ0eS5rZXlzID0gVXRpbHMuc29ydEtleXModGhpcy5pbnN0YW5jZV9wcm9wZXJ0eS5rZXlzKTtcbiAgICB0aGlzLmxpbmVEYXRhLl9pc0RpcnR5ID0gdHJ1ZTtcbiAgICB0aGlzLmtleUFkZGVkLmRpc3BhdGNoKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgLy8gY3VycmVudCB2YWx1ZXMgYXJlIGRlZmluZWQgaW4gQGxpbmVEYXRhLnZhbHVlc1xuICAgIHRoaXMudmFsdWVzID0gdGhpcy5saW5lRGF0YS52YWx1ZXMgIT09IHVuZGVmaW5lZCA/IHRoaXMubGluZURhdGEudmFsdWVzIDoge307XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdmFyIGtleSA9IHRoaXMuZ2V0Q3VycmVudEtleSgpO1xuICAgIHRoaXMuJGtleS50b2dnbGVDbGFzcygncHJvcGVydHlfX2tleS0tYWN0aXZlJywga2V5KTtcbiAgfVxuXG4gIHJlbW92ZSgpIHtcbiAgICBpZiAodGhpcy5rZXlBZGRlZCkge1xuICAgICAgdGhpcy5rZXlBZGRlZC5kaXNwb3NlKCk7XG4gICAgfVxuICAgIGRlbGV0ZSB0aGlzLmluc3RhbmNlX3Byb3BlcnR5O1xuICAgIGRlbGV0ZSB0aGlzLmxpbmVEYXRhO1xuICAgIGRlbGV0ZSB0aGlzLmVkaXRvcjtcbiAgICBkZWxldGUgdGhpcy5rZXlfdmFsO1xuXG4gICAgZGVsZXRlIHRoaXMudGltZXI7XG4gICAgZGVsZXRlIHRoaXMua2V5QWRkZWQ7XG4gICAgZGVsZXRlIHRoaXMuJGtleTtcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9lZGl0b3IvUHJvcGVydHlCYXNlLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");
=======
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Utils = __webpack_require__(1);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Signals = __webpack_require__(5);
	var _ = __webpack_require__(10);
	
	var PropertyBase = function () {
	  // @instance_property: The current property on the data object.
	  // @lineData: The line data object.
	
	  function PropertyBase(instance_property, lineData, editor) {
	    var key_val = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
	
	    _classCallCheck(this, PropertyBase);
	
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
	
	  _createClass(PropertyBase, [{
	    key: 'onKeyClick',
	    value: function onKeyClick(e) {
	      e.preventDefault();
	      var currentValue = this.getCurrentVal();
	      this.addKey(currentValue);
	    }
	  }, {
	    key: 'getInputVal',
	    value: function getInputVal() {
	      return this.$el.find('input').val();
	    }
	  }, {
	    key: 'getCurrentVal',
	    value: function getCurrentVal() {
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
	  }, {
	    key: 'onInputChange',
	    value: function onInputChange() {
	      var current_value = this.getInputVal();
	      var currentTime = this.timer.getCurrentTime() / 1000;
	
	      // if we selected a key simply get the time from it.
	      if (this.key_val) {
	        currentTime = this.key_val.time;
	      }
	
	      if (this.instance_property.keys && this.instance_property.keys.length) {
	        // Add a new key if there is no other key at same time
	        var current_key = _.find(this.instance_property.keys, function (key) {
	          return key.time === currentTime;
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
	          currentTime = this.timer.getCurrentTime() / 1000;
	          // Set the property on the instance object.
	          this.lineData.object.update(currentTime - this.lineData.start);
	        }
	      }
	
	      // Something changed, make the lineData dirty to rebuild things. d
	      this.lineData._isDirty = true;
	    }
	  }, {
	    key: 'getCurrentKey',
	    value: function getCurrentKey() {
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
	  }, {
	    key: 'addKey',
	    value: function addKey(val) {
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
	      this.instance_property.keys = _Utils2.default.sortKeys(this.instance_property.keys);
	      this.lineData._isDirty = true;
	      this.keyAdded.dispatch();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      // current values are defined in @lineData.values
	      this.values = this.lineData.values !== undefined ? this.lineData.values : {};
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var key = this.getCurrentKey();
	      this.$key.toggleClass('property__key--active', key);
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
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
	  }]);
	
	  return PropertyBase;
	}();
	
	exports.default = PropertyBase;
>>>>>>> master

/***/ },
/* 26 */
/***/ function(module, exports) {

<<<<<<< HEAD
	eval("module.exports = __WEBPACK_EXTERNAL_MODULE_22__;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wicm9vdFwiOlwiRHJhZ2dhYmxlTnVtYmVyXCIsXCJjb21tb25qc1wiOlwiZHJhZ2dhYmxlLW51bWJlci5qc1wiLFwiY29tbW9uanMyXCI6XCJkcmFnZ2FibGUtbnVtYmVyLmpzXCIsXCJhbWRcIjpcIkRyYWdnYWJsZU51bWJlclwifT8zODk0Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6IjIyLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzIyX187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCB7XCJyb290XCI6XCJEcmFnZ2FibGVOdW1iZXJcIixcImNvbW1vbmpzXCI6XCJkcmFnZ2FibGUtbnVtYmVyLmpzXCIsXCJjb21tb25qczJcIjpcImRyYWdnYWJsZS1udW1iZXIuanNcIixcImFtZFwiOlwiRHJhZ2dhYmxlTnVtYmVyXCJ9XG4gKiogbW9kdWxlIGlkID0gMjJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");
=======
	module.exports = __WEBPACK_EXTERNAL_MODULE_26__;
>>>>>>> master

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("var H = __webpack_require__(24);\nmodule.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||\"\");t.b(\"<div class=\\\"property property--number\\\">\");t.b(\"\\n\" + i);t.b(\"  <button class=\\\"property__key\\\"></button>\");t.b(\"\\n\" + i);t.b(\"  <label for=\\\"\");t.b(t.v(t.f(\"id\",c,p,0)));t.b(\"\\\" class=\\\"property__label\\\">\");t.b(t.v(t.f(\"label\",c,p,0)));t.b(\"</label>\");t.b(\"\\n\" + i);t.b(\"  <input type=\\\"number\\\" id=\\\"\");t.b(t.v(t.f(\"id\",c,p,0)));t.b(\"\\\" class=\\\"property__input\\\" value=\\\"\");t.b(t.v(t.f(\"val\",c,p,0)));t.b(\"\\\" />\");t.b(\"\\n\" + i);t.b(\"</div>\");t.b(\"\\n\");return t.fl(); },partials: {}, subs: {  }}, \"<div class=\\\"property property--number\\\">\\n  <button class=\\\"property__key\\\"></button>\\n  <label for=\\\"{{id}}\\\" class=\\\"property__label\\\">{{label}}</label>\\n  <input type=\\\"number\\\" id=\\\"{{id}}\\\" class=\\\"property__input\\\" value=\\\"{{val}}\\\" />\\n</div>\\n\", H); return T.render.apply(T, arguments); };//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi90ZW1wbGF0ZXMvcHJvcGVydHlOdW1iZXIudHBsLmh0bWw/NDg3MiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBLDZCQUE2Qix5QkFBeUIsd0JBQXdCLFlBQVksYUFBYSxpREFBaUQsY0FBYyxtREFBbUQsY0FBYyx1QkFBdUIsMEJBQTBCLHFDQUFxQyw2QkFBNkIsZ0JBQWdCLGNBQWMsc0NBQXNDLDBCQUEwQiw2Q0FBNkMsMkJBQTJCLGFBQWEsY0FBYyxjQUFjLFVBQVUsY0FBYyxFQUFFLGFBQWEsU0FBUyxJQUFJLDRHQUE0RyxJQUFJLCtCQUErQixPQUFPLDBDQUEwQyxJQUFJLHVDQUF1QyxLQUFLLHFCQUFxQixxQ0FBcUMiLCJmaWxlIjoiMjMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgSCA9IHJlcXVpcmUoXCJob2dhbi5qc1wiKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7IHZhciBUID0gbmV3IEguVGVtcGxhdGUoe2NvZGU6IGZ1bmN0aW9uIChjLHAsaSkgeyB2YXIgdD10aGlzO3QuYihpPWl8fFwiXCIpO3QuYihcIjxkaXYgY2xhc3M9XFxcInByb3BlcnR5IHByb3BlcnR5LS1udW1iZXJcXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPGJ1dHRvbiBjbGFzcz1cXFwicHJvcGVydHlfX2tleVxcXCI+PC9idXR0b24+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8bGFiZWwgZm9yPVxcXCJcIik7dC5iKHQudih0LmYoXCJpZFwiLGMscCwwKSkpO3QuYihcIlxcXCIgY2xhc3M9XFxcInByb3BlcnR5X19sYWJlbFxcXCI+XCIpO3QuYih0LnYodC5mKFwibGFiZWxcIixjLHAsMCkpKTt0LmIoXCI8L2xhYmVsPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPGlucHV0IHR5cGU9XFxcIm51bWJlclxcXCIgaWQ9XFxcIlwiKTt0LmIodC52KHQuZihcImlkXCIsYyxwLDApKSk7dC5iKFwiXFxcIiBjbGFzcz1cXFwicHJvcGVydHlfX2lucHV0XFxcIiB2YWx1ZT1cXFwiXCIpO3QuYih0LnYodC5mKFwidmFsXCIsYyxwLDApKSk7dC5iKFwiXFxcIiAvPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIjwvZGl2PlwiKTt0LmIoXCJcXG5cIik7cmV0dXJuIHQuZmwoKTsgfSxwYXJ0aWFsczoge30sIHN1YnM6IHsgIH19LCBcIjxkaXYgY2xhc3M9XFxcInByb3BlcnR5IHByb3BlcnR5LS1udW1iZXJcXFwiPlxcbiAgPGJ1dHRvbiBjbGFzcz1cXFwicHJvcGVydHlfX2tleVxcXCI+PC9idXR0b24+XFxuICA8bGFiZWwgZm9yPVxcXCJ7e2lkfX1cXFwiIGNsYXNzPVxcXCJwcm9wZXJ0eV9fbGFiZWxcXFwiPnt7bGFiZWx9fTwvbGFiZWw+XFxuICA8aW5wdXQgdHlwZT1cXFwibnVtYmVyXFxcIiBpZD1cXFwie3tpZH19XFxcIiBjbGFzcz1cXFwicHJvcGVydHlfX2lucHV0XFxcIiB2YWx1ZT1cXFwie3t2YWx9fVxcXCIgLz5cXG48L2Rpdj5cXG5cIiwgSCk7IHJldHVybiBULnJlbmRlci5hcHBseShULCBhcmd1bWVudHMpOyB9O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi90ZW1wbGF0ZXMvcHJvcGVydHlOdW1iZXIudHBsLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAyM1xuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");
=======
	var H = __webpack_require__(28);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"property property--number\">");t.b("\n" + i);t.b("  <button class=\"property__key\"></button>");t.b("\n" + i);t.b("  <label for=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"property__label\">");t.b(t.v(t.f("label",c,p,0)));t.b("</label>");t.b("\n" + i);t.b("  <input type=\"number\" id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"property__input\" value=\"");t.b(t.v(t.f("val",c,p,0)));t.b("\" />");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<div class=\"property property--number\">\n  <button class=\"property__key\"></button>\n  <label for=\"{{id}}\" class=\"property__label\">{{label}}</label>\n  <input type=\"number\" id=\"{{id}}\" class=\"property__input\" value=\"{{val}}\" />\n</div>\n", H); return T.render.apply(T, arguments); };
>>>>>>> master

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("/*\n *  Copyright 2011 Twitter, Inc.\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *  http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n// This file is for use with Node.js. See dist/ for browser files.\n\nvar Hogan = __webpack_require__(25);\nHogan.Template = __webpack_require__(26).Template;\nHogan.template = Hogan.Template;\nmodule.exports = Hogan;\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vL1VzZXJzL3ByaW1vei93b3JrL3Jlc3BvbnNpdmVhZHMvVHdlZW5UaW1lL1R3ZWVuVGltZS9+L2hvZ2FuLmpzL2xpYi9ob2dhbi5qcz9mYWQ0Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiMjQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDExIFR3aXR0ZXIsIEluYy5cbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8vIFRoaXMgZmlsZSBpcyBmb3IgdXNlIHdpdGggTm9kZS5qcy4gU2VlIGRpc3QvIGZvciBicm93c2VyIGZpbGVzLlxuXG52YXIgSG9nYW4gPSByZXF1aXJlKCcuL2NvbXBpbGVyJyk7XG5Ib2dhbi5UZW1wbGF0ZSA9IHJlcXVpcmUoJy4vdGVtcGxhdGUnKS5UZW1wbGF0ZTtcbkhvZ2FuLnRlbXBsYXRlID0gSG9nYW4uVGVtcGxhdGU7XG5tb2R1bGUuZXhwb3J0cyA9IEhvZ2FuO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAvVXNlcnMvcHJpbW96L3dvcmsvcmVzcG9uc2l2ZWFkcy9Ud2VlblRpbWUvVHdlZW5UaW1lL34vaG9nYW4uanMvbGliL2hvZ2FuLmpzXG4gKiogbW9kdWxlIGlkID0gMjRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");
=======
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
	
	var Hogan = __webpack_require__(29);
	Hogan.Template = __webpack_require__(30).Template;
	Hogan.template = Hogan.Template;
	module.exports = Hogan;

>>>>>>> master

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	eval("/*\n *  Copyright 2011 Twitter, Inc.\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *  http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\n(function (Hogan) {\n  // Setup regex  assignments\n  // remove whitespace according to Mustache spec\n  var rIsWhitespace = /\\S/,\n      rQuot = /\\\"/g,\n      rNewline =  /\\n/g,\n      rCr = /\\r/g,\n      rSlash = /\\\\/g,\n      rLineSep = /\\u2028/,\n      rParagraphSep = /\\u2029/;\n\n  Hogan.tags = {\n    '#': 1, '^': 2, '<': 3, '$': 4,\n    '/': 5, '!': 6, '>': 7, '=': 8, '_v': 9,\n    '{': 10, '&': 11, '_t': 12\n  };\n\n  Hogan.scan = function scan(text, delimiters) {\n    var len = text.length,\n        IN_TEXT = 0,\n        IN_TAG_TYPE = 1,\n        IN_TAG = 2,\n        state = IN_TEXT,\n        tagType = null,\n        tag = null,\n        buf = '',\n        tokens = [],\n        seenTag = false,\n        i = 0,\n        lineStart = 0,\n        otag = '{{',\n        ctag = '}}';\n\n    function addBuf() {\n      if (buf.length > 0) {\n        tokens.push({tag: '_t', text: new String(buf)});\n        buf = '';\n      }\n    }\n\n    function lineIsWhitespace() {\n      var isAllWhitespace = true;\n      for (var j = lineStart; j < tokens.length; j++) {\n        isAllWhitespace =\n          (Hogan.tags[tokens[j].tag] < Hogan.tags['_v']) ||\n          (tokens[j].tag == '_t' && tokens[j].text.match(rIsWhitespace) === null);\n        if (!isAllWhitespace) {\n          return false;\n        }\n      }\n\n      return isAllWhitespace;\n    }\n\n    function filterLine(haveSeenTag, noNewLine) {\n      addBuf();\n\n      if (haveSeenTag && lineIsWhitespace()) {\n        for (var j = lineStart, next; j < tokens.length; j++) {\n          if (tokens[j].text) {\n            if ((next = tokens[j+1]) && next.tag == '>') {\n              // set indent to token value\n              next.indent = tokens[j].text.toString()\n            }\n            tokens.splice(j, 1);\n          }\n        }\n      } else if (!noNewLine) {\n        tokens.push({tag:'\\n'});\n      }\n\n      seenTag = false;\n      lineStart = tokens.length;\n    }\n\n    function changeDelimiters(text, index) {\n      var close = '=' + ctag,\n          closeIndex = text.indexOf(close, index),\n          delimiters = trim(\n            text.substring(text.indexOf('=', index) + 1, closeIndex)\n          ).split(' ');\n\n      otag = delimiters[0];\n      ctag = delimiters[delimiters.length - 1];\n\n      return closeIndex + close.length - 1;\n    }\n\n    if (delimiters) {\n      delimiters = delimiters.split(' ');\n      otag = delimiters[0];\n      ctag = delimiters[1];\n    }\n\n    for (i = 0; i < len; i++) {\n      if (state == IN_TEXT) {\n        if (tagChange(otag, text, i)) {\n          --i;\n          addBuf();\n          state = IN_TAG_TYPE;\n        } else {\n          if (text.charAt(i) == '\\n') {\n            filterLine(seenTag);\n          } else {\n            buf += text.charAt(i);\n          }\n        }\n      } else if (state == IN_TAG_TYPE) {\n        i += otag.length - 1;\n        tag = Hogan.tags[text.charAt(i + 1)];\n        tagType = tag ? text.charAt(i + 1) : '_v';\n        if (tagType == '=') {\n          i = changeDelimiters(text, i);\n          state = IN_TEXT;\n        } else {\n          if (tag) {\n            i++;\n          }\n          state = IN_TAG;\n        }\n        seenTag = i;\n      } else {\n        if (tagChange(ctag, text, i)) {\n          tokens.push({tag: tagType, n: trim(buf), otag: otag, ctag: ctag,\n                       i: (tagType == '/') ? seenTag - otag.length : i + ctag.length});\n          buf = '';\n          i += ctag.length - 1;\n          state = IN_TEXT;\n          if (tagType == '{') {\n            if (ctag == '}}') {\n              i++;\n            } else {\n              cleanTripleStache(tokens[tokens.length - 1]);\n            }\n          }\n        } else {\n          buf += text.charAt(i);\n        }\n      }\n    }\n\n    filterLine(seenTag, true);\n\n    return tokens;\n  }\n\n  function cleanTripleStache(token) {\n    if (token.n.substr(token.n.length - 1) === '}') {\n      token.n = token.n.substring(0, token.n.length - 1);\n    }\n  }\n\n  function trim(s) {\n    if (s.trim) {\n      return s.trim();\n    }\n\n    return s.replace(/^\\s*|\\s*$/g, '');\n  }\n\n  function tagChange(tag, text, index) {\n    if (text.charAt(index) != tag.charAt(0)) {\n      return false;\n    }\n\n    for (var i = 1, l = tag.length; i < l; i++) {\n      if (text.charAt(index + i) != tag.charAt(i)) {\n        return false;\n      }\n    }\n\n    return true;\n  }\n\n  // the tags allowed inside super templates\n  var allowedInSuper = {'_t': true, '\\n': true, '$': true, '/': true};\n\n  function buildTree(tokens, kind, stack, customTags) {\n    var instructions = [],\n        opener = null,\n        tail = null,\n        token = null;\n\n    tail = stack[stack.length - 1];\n\n    while (tokens.length > 0) {\n      token = tokens.shift();\n\n      if (tail && tail.tag == '<' && !(token.tag in allowedInSuper)) {\n        throw new Error('Illegal content in < super tag.');\n      }\n\n      if (Hogan.tags[token.tag] <= Hogan.tags['$'] || isOpener(token, customTags)) {\n        stack.push(token);\n        token.nodes = buildTree(tokens, token.tag, stack, customTags);\n      } else if (token.tag == '/') {\n        if (stack.length === 0) {\n          throw new Error('Closing tag without opener: /' + token.n);\n        }\n        opener = stack.pop();\n        if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {\n          throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);\n        }\n        opener.end = token.i;\n        return instructions;\n      } else if (token.tag == '\\n') {\n        token.last = (tokens.length == 0) || (tokens[0].tag == '\\n');\n      }\n\n      instructions.push(token);\n    }\n\n    if (stack.length > 0) {\n      throw new Error('missing closing tag: ' + stack.pop().n);\n    }\n\n    return instructions;\n  }\n\n  function isOpener(token, tags) {\n    for (var i = 0, l = tags.length; i < l; i++) {\n      if (tags[i].o == token.n) {\n        token.tag = '#';\n        return true;\n      }\n    }\n  }\n\n  function isCloser(close, open, tags) {\n    for (var i = 0, l = tags.length; i < l; i++) {\n      if (tags[i].c == close && tags[i].o == open) {\n        return true;\n      }\n    }\n  }\n\n  function stringifySubstitutions(obj) {\n    var items = [];\n    for (var key in obj) {\n      items.push('\"' + esc(key) + '\": function(c,p,t,i) {' + obj[key] + '}');\n    }\n    return \"{ \" + items.join(\",\") + \" }\";\n  }\n\n  function stringifyPartials(codeObj) {\n    var partials = [];\n    for (var key in codeObj.partials) {\n      partials.push('\"' + esc(key) + '\":{name:\"' + esc(codeObj.partials[key].name) + '\", ' + stringifyPartials(codeObj.partials[key]) + \"}\");\n    }\n    return \"partials: {\" + partials.join(\",\") + \"}, subs: \" + stringifySubstitutions(codeObj.subs);\n  }\n\n  Hogan.stringify = function(codeObj, text, options) {\n    return \"{code: function (c,p,i) { \" + Hogan.wrapMain(codeObj.code) + \" },\" + stringifyPartials(codeObj) +  \"}\";\n  }\n\n  var serialNo = 0;\n  Hogan.generate = function(tree, text, options) {\n    serialNo = 0;\n    var context = { code: '', subs: {}, partials: {} };\n    Hogan.walk(tree, context);\n\n    if (options.asString) {\n      return this.stringify(context, text, options);\n    }\n\n    return this.makeTemplate(context, text, options);\n  }\n\n  Hogan.wrapMain = function(code) {\n    return 'var t=this;t.b(i=i||\"\");' + code + 'return t.fl();';\n  }\n\n  Hogan.template = Hogan.Template;\n\n  Hogan.makeTemplate = function(codeObj, text, options) {\n    var template = this.makePartials(codeObj);\n    template.code = new Function('c', 'p', 'i', this.wrapMain(codeObj.code));\n    return new this.template(template, text, this, options);\n  }\n\n  Hogan.makePartials = function(codeObj) {\n    var key, template = {subs: {}, partials: codeObj.partials, name: codeObj.name};\n    for (key in template.partials) {\n      template.partials[key] = this.makePartials(template.partials[key]);\n    }\n    for (key in codeObj.subs) {\n      template.subs[key] = new Function('c', 'p', 't', 'i', codeObj.subs[key]);\n    }\n    return template;\n  }\n\n  function esc(s) {\n    return s.replace(rSlash, '\\\\\\\\')\n            .replace(rQuot, '\\\\\\\"')\n            .replace(rNewline, '\\\\n')\n            .replace(rCr, '\\\\r')\n            .replace(rLineSep, '\\\\u2028')\n            .replace(rParagraphSep, '\\\\u2029');\n  }\n\n  function chooseMethod(s) {\n    return (~s.indexOf('.')) ? 'd' : 'f';\n  }\n\n  function createPartial(node, context) {\n    var prefix = \"<\" + (context.prefix || \"\");\n    var sym = prefix + node.n + serialNo++;\n    context.partials[sym] = {name: node.n, partials: {}};\n    context.code += 't.b(t.rp(\"' +  esc(sym) + '\",c,p,\"' + (node.indent || '') + '\"));';\n    return sym;\n  }\n\n  Hogan.codegen = {\n    '#': function(node, context) {\n      context.code += 'if(t.s(t.' + chooseMethod(node.n) + '(\"' + esc(node.n) + '\",c,p,1),' +\n                      'c,p,0,' + node.i + ',' + node.end + ',\"' + node.otag + \" \" + node.ctag + '\")){' +\n                      't.rs(c,p,' + 'function(c,p,t){';\n      Hogan.walk(node.nodes, context);\n      context.code += '});c.pop();}';\n    },\n\n    '^': function(node, context) {\n      context.code += 'if(!t.s(t.' + chooseMethod(node.n) + '(\"' + esc(node.n) + '\",c,p,1),c,p,1,0,0,\"\")){';\n      Hogan.walk(node.nodes, context);\n      context.code += '};';\n    },\n\n    '>': createPartial,\n    '<': function(node, context) {\n      var ctx = {partials: {}, code: '', subs: {}, inPartial: true};\n      Hogan.walk(node.nodes, ctx);\n      var template = context.partials[createPartial(node, context)];\n      template.subs = ctx.subs;\n      template.partials = ctx.partials;\n    },\n\n    '$': function(node, context) {\n      var ctx = {subs: {}, code: '', partials: context.partials, prefix: node.n};\n      Hogan.walk(node.nodes, ctx);\n      context.subs[node.n] = ctx.code;\n      if (!context.inPartial) {\n        context.code += 't.sub(\"' + esc(node.n) + '\",c,p,i);';\n      }\n    },\n\n    '\\n': function(node, context) {\n      context.code += write('\"\\\\n\"' + (node.last ? '' : ' + i'));\n    },\n\n    '_v': function(node, context) {\n      context.code += 't.b(t.v(t.' + chooseMethod(node.n) + '(\"' + esc(node.n) + '\",c,p,0)));';\n    },\n\n    '_t': function(node, context) {\n      context.code += write('\"' + esc(node.text) + '\"');\n    },\n\n    '{': tripleStache,\n\n    '&': tripleStache\n  }\n\n  function tripleStache(node, context) {\n    context.code += 't.b(t.t(t.' + chooseMethod(node.n) + '(\"' + esc(node.n) + '\",c,p,0)));';\n  }\n\n  function write(s) {\n    return 't.b(' + s + ');';\n  }\n\n  Hogan.walk = function(nodelist, context) {\n    var func;\n    for (var i = 0, l = nodelist.length; i < l; i++) {\n      func = Hogan.codegen[nodelist[i].tag];\n      func && func(nodelist[i], context);\n    }\n    return context;\n  }\n\n  Hogan.parse = function(tokens, text, options) {\n    options = options || {};\n    return buildTree(tokens, '', [], options.sectionTags || []);\n  }\n\n  Hogan.cache = {};\n\n  Hogan.cacheKey = function(text, options) {\n    return [text, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join('||');\n  }\n\n  Hogan.compile = function(text, options) {\n    options = options || {};\n    var key = Hogan.cacheKey(text, options);\n    var template = this.cache[key];\n\n    if (template) {\n      var partials = template.partials;\n      for (var name in partials) {\n        delete partials[name].instance;\n      }\n      return template;\n    }\n\n    template = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);\n    return this.cache[key] = template;\n  }\n})( true ? exports : Hogan);\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vL1VzZXJzL3ByaW1vei93b3JrL3Jlc3BvbnNpdmVhZHMvVHdlZW5UaW1lL1R3ZWVuVGltZS9+L2hvZ2FuLmpzL2xpYi9jb21waWxlci5qcz8yMzhiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLGtCQUFrQjs7QUFFbEI7QUFDQTtBQUNBLHFCQUFxQixpQ0FBaUM7QUFDdEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2QkFBNkIsbUJBQW1CO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHFDQUFxQyxtQkFBbUI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxxQkFBcUIsU0FBUztBQUM5Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSx1QkFBdUI7QUFDdkIscUZBQXFGO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQiwyQkFBMkI7QUFDM0I7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUNBQW1DLE9BQU87QUFDMUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHdCQUF3Qjs7QUFFeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG9DQUFvQyxPQUFPO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9DQUFvQyxPQUFPO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseURBQXlELGlCQUFpQjtBQUMxRTtBQUNBLGFBQWEsMEJBQTBCO0FBQ3ZDOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxpR0FBaUc7QUFDMUk7QUFDQSx1QkFBdUIsMkJBQTJCO0FBQ2xEOztBQUVBO0FBQ0EsYUFBYSx3QkFBd0IsdUNBQXVDLHFDQUFxQztBQUNqSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsbUJBQW1CLGNBQWM7QUFDcEQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsYUFBYSwwQkFBMEI7QUFDOUQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF5QixRQUFRO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLHNGQUFzRjtBQUN0RjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFHQUFxRztBQUNyRyxxREFBcUQ7QUFDckQ7QUFDQSx3QkFBd0IsRUFBRSxTQUFTO0FBQ25DLEtBQUs7O0FBRUw7QUFDQSwwR0FBMEc7QUFDMUc7QUFDQSx5QkFBeUI7QUFDekIsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsaUJBQWlCLFlBQVksb0JBQW9CO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLGlCQUFpQixRQUFRO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBLDREQUE0RDtBQUM1RDtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSw2RkFBNkY7QUFDN0YsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxNQUFNOztBQUVOO0FBQ0E7O0FBRUE7QUFDQSwyRkFBMkY7QUFDM0Y7O0FBRUE7QUFDQSwyQkFBMkI7QUFDM0I7O0FBRUE7QUFDQTtBQUNBLHdDQUF3QyxPQUFPO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJmaWxlIjoiMjUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDExIFR3aXR0ZXIsIEluYy5cbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbiAoSG9nYW4pIHtcbiAgLy8gU2V0dXAgcmVnZXggIGFzc2lnbm1lbnRzXG4gIC8vIHJlbW92ZSB3aGl0ZXNwYWNlIGFjY29yZGluZyB0byBNdXN0YWNoZSBzcGVjXG4gIHZhciBySXNXaGl0ZXNwYWNlID0gL1xcUy8sXG4gICAgICByUXVvdCA9IC9cXFwiL2csXG4gICAgICByTmV3bGluZSA9ICAvXFxuL2csXG4gICAgICByQ3IgPSAvXFxyL2csXG4gICAgICByU2xhc2ggPSAvXFxcXC9nLFxuICAgICAgckxpbmVTZXAgPSAvXFx1MjAyOC8sXG4gICAgICByUGFyYWdyYXBoU2VwID0gL1xcdTIwMjkvO1xuXG4gIEhvZ2FuLnRhZ3MgPSB7XG4gICAgJyMnOiAxLCAnXic6IDIsICc8JzogMywgJyQnOiA0LFxuICAgICcvJzogNSwgJyEnOiA2LCAnPic6IDcsICc9JzogOCwgJ192JzogOSxcbiAgICAneyc6IDEwLCAnJic6IDExLCAnX3QnOiAxMlxuICB9O1xuXG4gIEhvZ2FuLnNjYW4gPSBmdW5jdGlvbiBzY2FuKHRleHQsIGRlbGltaXRlcnMpIHtcbiAgICB2YXIgbGVuID0gdGV4dC5sZW5ndGgsXG4gICAgICAgIElOX1RFWFQgPSAwLFxuICAgICAgICBJTl9UQUdfVFlQRSA9IDEsXG4gICAgICAgIElOX1RBRyA9IDIsXG4gICAgICAgIHN0YXRlID0gSU5fVEVYVCxcbiAgICAgICAgdGFnVHlwZSA9IG51bGwsXG4gICAgICAgIHRhZyA9IG51bGwsXG4gICAgICAgIGJ1ZiA9ICcnLFxuICAgICAgICB0b2tlbnMgPSBbXSxcbiAgICAgICAgc2VlblRhZyA9IGZhbHNlLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGluZVN0YXJ0ID0gMCxcbiAgICAgICAgb3RhZyA9ICd7eycsXG4gICAgICAgIGN0YWcgPSAnfX0nO1xuXG4gICAgZnVuY3Rpb24gYWRkQnVmKCkge1xuICAgICAgaWYgKGJ1Zi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRva2Vucy5wdXNoKHt0YWc6ICdfdCcsIHRleHQ6IG5ldyBTdHJpbmcoYnVmKX0pO1xuICAgICAgICBidWYgPSAnJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5lSXNXaGl0ZXNwYWNlKCkge1xuICAgICAgdmFyIGlzQWxsV2hpdGVzcGFjZSA9IHRydWU7XG4gICAgICBmb3IgKHZhciBqID0gbGluZVN0YXJ0OyBqIDwgdG9rZW5zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlzQWxsV2hpdGVzcGFjZSA9XG4gICAgICAgICAgKEhvZ2FuLnRhZ3NbdG9rZW5zW2pdLnRhZ10gPCBIb2dhbi50YWdzWydfdiddKSB8fFxuICAgICAgICAgICh0b2tlbnNbal0udGFnID09ICdfdCcgJiYgdG9rZW5zW2pdLnRleHQubWF0Y2gocklzV2hpdGVzcGFjZSkgPT09IG51bGwpO1xuICAgICAgICBpZiAoIWlzQWxsV2hpdGVzcGFjZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXNBbGxXaGl0ZXNwYWNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckxpbmUoaGF2ZVNlZW5UYWcsIG5vTmV3TGluZSkge1xuICAgICAgYWRkQnVmKCk7XG5cbiAgICAgIGlmIChoYXZlU2VlblRhZyAmJiBsaW5lSXNXaGl0ZXNwYWNlKCkpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IGxpbmVTdGFydCwgbmV4dDsgaiA8IHRva2Vucy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGlmICh0b2tlbnNbal0udGV4dCkge1xuICAgICAgICAgICAgaWYgKChuZXh0ID0gdG9rZW5zW2orMV0pICYmIG5leHQudGFnID09ICc+Jykge1xuICAgICAgICAgICAgICAvLyBzZXQgaW5kZW50IHRvIHRva2VuIHZhbHVlXG4gICAgICAgICAgICAgIG5leHQuaW5kZW50ID0gdG9rZW5zW2pdLnRleHQudG9TdHJpbmcoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9rZW5zLnNwbGljZShqLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIW5vTmV3TGluZSkge1xuICAgICAgICB0b2tlbnMucHVzaCh7dGFnOidcXG4nfSk7XG4gICAgICB9XG5cbiAgICAgIHNlZW5UYWcgPSBmYWxzZTtcbiAgICAgIGxpbmVTdGFydCA9IHRva2Vucy5sZW5ndGg7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hhbmdlRGVsaW1pdGVycyh0ZXh0LCBpbmRleCkge1xuICAgICAgdmFyIGNsb3NlID0gJz0nICsgY3RhZyxcbiAgICAgICAgICBjbG9zZUluZGV4ID0gdGV4dC5pbmRleE9mKGNsb3NlLCBpbmRleCksXG4gICAgICAgICAgZGVsaW1pdGVycyA9IHRyaW0oXG4gICAgICAgICAgICB0ZXh0LnN1YnN0cmluZyh0ZXh0LmluZGV4T2YoJz0nLCBpbmRleCkgKyAxLCBjbG9zZUluZGV4KVxuICAgICAgICAgICkuc3BsaXQoJyAnKTtcblxuICAgICAgb3RhZyA9IGRlbGltaXRlcnNbMF07XG4gICAgICBjdGFnID0gZGVsaW1pdGVyc1tkZWxpbWl0ZXJzLmxlbmd0aCAtIDFdO1xuXG4gICAgICByZXR1cm4gY2xvc2VJbmRleCArIGNsb3NlLmxlbmd0aCAtIDE7XG4gICAgfVxuXG4gICAgaWYgKGRlbGltaXRlcnMpIHtcbiAgICAgIGRlbGltaXRlcnMgPSBkZWxpbWl0ZXJzLnNwbGl0KCcgJyk7XG4gICAgICBvdGFnID0gZGVsaW1pdGVyc1swXTtcbiAgICAgIGN0YWcgPSBkZWxpbWl0ZXJzWzFdO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHN0YXRlID09IElOX1RFWFQpIHtcbiAgICAgICAgaWYgKHRhZ0NoYW5nZShvdGFnLCB0ZXh0LCBpKSkge1xuICAgICAgICAgIC0taTtcbiAgICAgICAgICBhZGRCdWYoKTtcbiAgICAgICAgICBzdGF0ZSA9IElOX1RBR19UWVBFO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0ZXh0LmNoYXJBdChpKSA9PSAnXFxuJykge1xuICAgICAgICAgICAgZmlsdGVyTGluZShzZWVuVGFnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnVmICs9IHRleHQuY2hhckF0KGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PSBJTl9UQUdfVFlQRSkge1xuICAgICAgICBpICs9IG90YWcubGVuZ3RoIC0gMTtcbiAgICAgICAgdGFnID0gSG9nYW4udGFnc1t0ZXh0LmNoYXJBdChpICsgMSldO1xuICAgICAgICB0YWdUeXBlID0gdGFnID8gdGV4dC5jaGFyQXQoaSArIDEpIDogJ192JztcbiAgICAgICAgaWYgKHRhZ1R5cGUgPT0gJz0nKSB7XG4gICAgICAgICAgaSA9IGNoYW5nZURlbGltaXRlcnModGV4dCwgaSk7XG4gICAgICAgICAgc3RhdGUgPSBJTl9URVhUO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0YWcpIHtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RhdGUgPSBJTl9UQUc7XG4gICAgICAgIH1cbiAgICAgICAgc2VlblRhZyA9IGk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGFnQ2hhbmdlKGN0YWcsIHRleHQsIGkpKSB7XG4gICAgICAgICAgdG9rZW5zLnB1c2goe3RhZzogdGFnVHlwZSwgbjogdHJpbShidWYpLCBvdGFnOiBvdGFnLCBjdGFnOiBjdGFnLFxuICAgICAgICAgICAgICAgICAgICAgICBpOiAodGFnVHlwZSA9PSAnLycpID8gc2VlblRhZyAtIG90YWcubGVuZ3RoIDogaSArIGN0YWcubGVuZ3RofSk7XG4gICAgICAgICAgYnVmID0gJyc7XG4gICAgICAgICAgaSArPSBjdGFnLmxlbmd0aCAtIDE7XG4gICAgICAgICAgc3RhdGUgPSBJTl9URVhUO1xuICAgICAgICAgIGlmICh0YWdUeXBlID09ICd7Jykge1xuICAgICAgICAgICAgaWYgKGN0YWcgPT0gJ319Jykge1xuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjbGVhblRyaXBsZVN0YWNoZSh0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnVmICs9IHRleHQuY2hhckF0KGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZmlsdGVyTGluZShzZWVuVGFnLCB0cnVlKTtcblxuICAgIHJldHVybiB0b2tlbnM7XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhblRyaXBsZVN0YWNoZSh0b2tlbikge1xuICAgIGlmICh0b2tlbi5uLnN1YnN0cih0b2tlbi5uLmxlbmd0aCAtIDEpID09PSAnfScpIHtcbiAgICAgIHRva2VuLm4gPSB0b2tlbi5uLnN1YnN0cmluZygwLCB0b2tlbi5uLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRyaW0ocykge1xuICAgIGlmIChzLnRyaW0pIHtcbiAgICAgIHJldHVybiBzLnRyaW0oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcy5yZXBsYWNlKC9eXFxzKnxcXHMqJC9nLCAnJyk7XG4gIH1cblxuICBmdW5jdGlvbiB0YWdDaGFuZ2UodGFnLCB0ZXh0LCBpbmRleCkge1xuICAgIGlmICh0ZXh0LmNoYXJBdChpbmRleCkgIT0gdGFnLmNoYXJBdCgwKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAxLCBsID0gdGFnLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKHRleHQuY2hhckF0KGluZGV4ICsgaSkgIT0gdGFnLmNoYXJBdChpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyB0aGUgdGFncyBhbGxvd2VkIGluc2lkZSBzdXBlciB0ZW1wbGF0ZXNcbiAgdmFyIGFsbG93ZWRJblN1cGVyID0geydfdCc6IHRydWUsICdcXG4nOiB0cnVlLCAnJCc6IHRydWUsICcvJzogdHJ1ZX07XG5cbiAgZnVuY3Rpb24gYnVpbGRUcmVlKHRva2Vucywga2luZCwgc3RhY2ssIGN1c3RvbVRhZ3MpIHtcbiAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gW10sXG4gICAgICAgIG9wZW5lciA9IG51bGwsXG4gICAgICAgIHRhaWwgPSBudWxsLFxuICAgICAgICB0b2tlbiA9IG51bGw7XG5cbiAgICB0YWlsID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG5cbiAgICB3aGlsZSAodG9rZW5zLmxlbmd0aCA+IDApIHtcbiAgICAgIHRva2VuID0gdG9rZW5zLnNoaWZ0KCk7XG5cbiAgICAgIGlmICh0YWlsICYmIHRhaWwudGFnID09ICc8JyAmJiAhKHRva2VuLnRhZyBpbiBhbGxvd2VkSW5TdXBlcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbGxlZ2FsIGNvbnRlbnQgaW4gPCBzdXBlciB0YWcuJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChIb2dhbi50YWdzW3Rva2VuLnRhZ10gPD0gSG9nYW4udGFnc1snJCddIHx8IGlzT3BlbmVyKHRva2VuLCBjdXN0b21UYWdzKSkge1xuICAgICAgICBzdGFjay5wdXNoKHRva2VuKTtcbiAgICAgICAgdG9rZW4ubm9kZXMgPSBidWlsZFRyZWUodG9rZW5zLCB0b2tlbi50YWcsIHN0YWNrLCBjdXN0b21UYWdzKTtcbiAgICAgIH0gZWxzZSBpZiAodG9rZW4udGFnID09ICcvJykge1xuICAgICAgICBpZiAoc3RhY2subGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDbG9zaW5nIHRhZyB3aXRob3V0IG9wZW5lcjogLycgKyB0b2tlbi5uKTtcbiAgICAgICAgfVxuICAgICAgICBvcGVuZXIgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgaWYgKHRva2VuLm4gIT0gb3BlbmVyLm4gJiYgIWlzQ2xvc2VyKHRva2VuLm4sIG9wZW5lci5uLCBjdXN0b21UYWdzKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTmVzdGluZyBlcnJvcjogJyArIG9wZW5lci5uICsgJyB2cy4gJyArIHRva2VuLm4pO1xuICAgICAgICB9XG4gICAgICAgIG9wZW5lci5lbmQgPSB0b2tlbi5pO1xuICAgICAgICByZXR1cm4gaW5zdHJ1Y3Rpb25zO1xuICAgICAgfSBlbHNlIGlmICh0b2tlbi50YWcgPT0gJ1xcbicpIHtcbiAgICAgICAgdG9rZW4ubGFzdCA9ICh0b2tlbnMubGVuZ3RoID09IDApIHx8ICh0b2tlbnNbMF0udGFnID09ICdcXG4nKTtcbiAgICAgIH1cblxuICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2godG9rZW4pO1xuICAgIH1cblxuICAgIGlmIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21pc3NpbmcgY2xvc2luZyB0YWc6ICcgKyBzdGFjay5wb3AoKS5uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5zdHJ1Y3Rpb25zO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNPcGVuZXIodG9rZW4sIHRhZ3MpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRhZ3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodGFnc1tpXS5vID09IHRva2VuLm4pIHtcbiAgICAgICAgdG9rZW4udGFnID0gJyMnO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc0Nsb3NlcihjbG9zZSwgb3BlbiwgdGFncykge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGFncy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICh0YWdzW2ldLmMgPT0gY2xvc2UgJiYgdGFnc1tpXS5vID09IG9wZW4pIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc3RyaW5naWZ5U3Vic3RpdHV0aW9ucyhvYmopIHtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpdGVtcy5wdXNoKCdcIicgKyBlc2Moa2V5KSArICdcIjogZnVuY3Rpb24oYyxwLHQsaSkgeycgKyBvYmpba2V5XSArICd9Jyk7XG4gICAgfVxuICAgIHJldHVybiBcInsgXCIgKyBpdGVtcy5qb2luKFwiLFwiKSArIFwiIH1cIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0cmluZ2lmeVBhcnRpYWxzKGNvZGVPYmopIHtcbiAgICB2YXIgcGFydGlhbHMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gY29kZU9iai5wYXJ0aWFscykge1xuICAgICAgcGFydGlhbHMucHVzaCgnXCInICsgZXNjKGtleSkgKyAnXCI6e25hbWU6XCInICsgZXNjKGNvZGVPYmoucGFydGlhbHNba2V5XS5uYW1lKSArICdcIiwgJyArIHN0cmluZ2lmeVBhcnRpYWxzKGNvZGVPYmoucGFydGlhbHNba2V5XSkgKyBcIn1cIik7XG4gICAgfVxuICAgIHJldHVybiBcInBhcnRpYWxzOiB7XCIgKyBwYXJ0aWFscy5qb2luKFwiLFwiKSArIFwifSwgc3ViczogXCIgKyBzdHJpbmdpZnlTdWJzdGl0dXRpb25zKGNvZGVPYmouc3Vicyk7XG4gIH1cblxuICBIb2dhbi5zdHJpbmdpZnkgPSBmdW5jdGlvbihjb2RlT2JqLCB0ZXh0LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIFwie2NvZGU6IGZ1bmN0aW9uIChjLHAsaSkgeyBcIiArIEhvZ2FuLndyYXBNYWluKGNvZGVPYmouY29kZSkgKyBcIiB9LFwiICsgc3RyaW5naWZ5UGFydGlhbHMoY29kZU9iaikgKyAgXCJ9XCI7XG4gIH1cblxuICB2YXIgc2VyaWFsTm8gPSAwO1xuICBIb2dhbi5nZW5lcmF0ZSA9IGZ1bmN0aW9uKHRyZWUsIHRleHQsIG9wdGlvbnMpIHtcbiAgICBzZXJpYWxObyA9IDA7XG4gICAgdmFyIGNvbnRleHQgPSB7IGNvZGU6ICcnLCBzdWJzOiB7fSwgcGFydGlhbHM6IHt9IH07XG4gICAgSG9nYW4ud2Fsayh0cmVlLCBjb250ZXh0KTtcblxuICAgIGlmIChvcHRpb25zLmFzU3RyaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdHJpbmdpZnkoY29udGV4dCwgdGV4dCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubWFrZVRlbXBsYXRlKGNvbnRleHQsIHRleHQsIG9wdGlvbnMpO1xuICB9XG5cbiAgSG9nYW4ud3JhcE1haW4gPSBmdW5jdGlvbihjb2RlKSB7XG4gICAgcmV0dXJuICd2YXIgdD10aGlzO3QuYihpPWl8fFwiXCIpOycgKyBjb2RlICsgJ3JldHVybiB0LmZsKCk7JztcbiAgfVxuXG4gIEhvZ2FuLnRlbXBsYXRlID0gSG9nYW4uVGVtcGxhdGU7XG5cbiAgSG9nYW4ubWFrZVRlbXBsYXRlID0gZnVuY3Rpb24oY29kZU9iaiwgdGV4dCwgb3B0aW9ucykge1xuICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMubWFrZVBhcnRpYWxzKGNvZGVPYmopO1xuICAgIHRlbXBsYXRlLmNvZGUgPSBuZXcgRnVuY3Rpb24oJ2MnLCAncCcsICdpJywgdGhpcy53cmFwTWFpbihjb2RlT2JqLmNvZGUpKTtcbiAgICByZXR1cm4gbmV3IHRoaXMudGVtcGxhdGUodGVtcGxhdGUsIHRleHQsIHRoaXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgSG9nYW4ubWFrZVBhcnRpYWxzID0gZnVuY3Rpb24oY29kZU9iaikge1xuICAgIHZhciBrZXksIHRlbXBsYXRlID0ge3N1YnM6IHt9LCBwYXJ0aWFsczogY29kZU9iai5wYXJ0aWFscywgbmFtZTogY29kZU9iai5uYW1lfTtcbiAgICBmb3IgKGtleSBpbiB0ZW1wbGF0ZS5wYXJ0aWFscykge1xuICAgICAgdGVtcGxhdGUucGFydGlhbHNba2V5XSA9IHRoaXMubWFrZVBhcnRpYWxzKHRlbXBsYXRlLnBhcnRpYWxzW2tleV0pO1xuICAgIH1cbiAgICBmb3IgKGtleSBpbiBjb2RlT2JqLnN1YnMpIHtcbiAgICAgIHRlbXBsYXRlLnN1YnNba2V5XSA9IG5ldyBGdW5jdGlvbignYycsICdwJywgJ3QnLCAnaScsIGNvZGVPYmouc3Vic1trZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG5cbiAgZnVuY3Rpb24gZXNjKHMpIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKHJTbGFzaCwgJ1xcXFxcXFxcJylcbiAgICAgICAgICAgIC5yZXBsYWNlKHJRdW90LCAnXFxcXFxcXCInKVxuICAgICAgICAgICAgLnJlcGxhY2Uock5ld2xpbmUsICdcXFxcbicpXG4gICAgICAgICAgICAucmVwbGFjZShyQ3IsICdcXFxccicpXG4gICAgICAgICAgICAucmVwbGFjZShyTGluZVNlcCwgJ1xcXFx1MjAyOCcpXG4gICAgICAgICAgICAucmVwbGFjZShyUGFyYWdyYXBoU2VwLCAnXFxcXHUyMDI5Jyk7XG4gIH1cblxuICBmdW5jdGlvbiBjaG9vc2VNZXRob2Qocykge1xuICAgIHJldHVybiAofnMuaW5kZXhPZignLicpKSA/ICdkJyA6ICdmJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVBhcnRpYWwobm9kZSwgY29udGV4dCkge1xuICAgIHZhciBwcmVmaXggPSBcIjxcIiArIChjb250ZXh0LnByZWZpeCB8fCBcIlwiKTtcbiAgICB2YXIgc3ltID0gcHJlZml4ICsgbm9kZS5uICsgc2VyaWFsTm8rKztcbiAgICBjb250ZXh0LnBhcnRpYWxzW3N5bV0gPSB7bmFtZTogbm9kZS5uLCBwYXJ0aWFsczoge319O1xuICAgIGNvbnRleHQuY29kZSArPSAndC5iKHQucnAoXCInICsgIGVzYyhzeW0pICsgJ1wiLGMscCxcIicgKyAobm9kZS5pbmRlbnQgfHwgJycpICsgJ1wiKSk7JztcbiAgICByZXR1cm4gc3ltO1xuICB9XG5cbiAgSG9nYW4uY29kZWdlbiA9IHtcbiAgICAnIyc6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQuY29kZSArPSAnaWYodC5zKHQuJyArIGNob29zZU1ldGhvZChub2RlLm4pICsgJyhcIicgKyBlc2Mobm9kZS5uKSArICdcIixjLHAsMSksJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ2MscCwwLCcgKyBub2RlLmkgKyAnLCcgKyBub2RlLmVuZCArICcsXCInICsgbm9kZS5vdGFnICsgXCIgXCIgKyBub2RlLmN0YWcgKyAnXCIpKXsnICtcbiAgICAgICAgICAgICAgICAgICAgICAndC5ycyhjLHAsJyArICdmdW5jdGlvbihjLHAsdCl7JztcbiAgICAgIEhvZ2FuLndhbGsobm9kZS5ub2RlcywgY29udGV4dCk7XG4gICAgICBjb250ZXh0LmNvZGUgKz0gJ30pO2MucG9wKCk7fSc7XG4gICAgfSxcblxuICAgICdeJzogZnVuY3Rpb24obm9kZSwgY29udGV4dCkge1xuICAgICAgY29udGV4dC5jb2RlICs9ICdpZighdC5zKHQuJyArIGNob29zZU1ldGhvZChub2RlLm4pICsgJyhcIicgKyBlc2Mobm9kZS5uKSArICdcIixjLHAsMSksYyxwLDEsMCwwLFwiXCIpKXsnO1xuICAgICAgSG9nYW4ud2Fsayhub2RlLm5vZGVzLCBjb250ZXh0KTtcbiAgICAgIGNvbnRleHQuY29kZSArPSAnfTsnO1xuICAgIH0sXG5cbiAgICAnPic6IGNyZWF0ZVBhcnRpYWwsXG4gICAgJzwnOiBmdW5jdGlvbihub2RlLCBjb250ZXh0KSB7XG4gICAgICB2YXIgY3R4ID0ge3BhcnRpYWxzOiB7fSwgY29kZTogJycsIHN1YnM6IHt9LCBpblBhcnRpYWw6IHRydWV9O1xuICAgICAgSG9nYW4ud2Fsayhub2RlLm5vZGVzLCBjdHgpO1xuICAgICAgdmFyIHRlbXBsYXRlID0gY29udGV4dC5wYXJ0aWFsc1tjcmVhdGVQYXJ0aWFsKG5vZGUsIGNvbnRleHQpXTtcbiAgICAgIHRlbXBsYXRlLnN1YnMgPSBjdHguc3VicztcbiAgICAgIHRlbXBsYXRlLnBhcnRpYWxzID0gY3R4LnBhcnRpYWxzO1xuICAgIH0sXG5cbiAgICAnJCc6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIHZhciBjdHggPSB7c3Viczoge30sIGNvZGU6ICcnLCBwYXJ0aWFsczogY29udGV4dC5wYXJ0aWFscywgcHJlZml4OiBub2RlLm59O1xuICAgICAgSG9nYW4ud2Fsayhub2RlLm5vZGVzLCBjdHgpO1xuICAgICAgY29udGV4dC5zdWJzW25vZGUubl0gPSBjdHguY29kZTtcbiAgICAgIGlmICghY29udGV4dC5pblBhcnRpYWwpIHtcbiAgICAgICAgY29udGV4dC5jb2RlICs9ICd0LnN1YihcIicgKyBlc2Mobm9kZS5uKSArICdcIixjLHAsaSk7JztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJ1xcbic6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQuY29kZSArPSB3cml0ZSgnXCJcXFxcblwiJyArIChub2RlLmxhc3QgPyAnJyA6ICcgKyBpJykpO1xuICAgIH0sXG5cbiAgICAnX3YnOiBmdW5jdGlvbihub2RlLCBjb250ZXh0KSB7XG4gICAgICBjb250ZXh0LmNvZGUgKz0gJ3QuYih0LnYodC4nICsgY2hvb3NlTWV0aG9kKG5vZGUubikgKyAnKFwiJyArIGVzYyhub2RlLm4pICsgJ1wiLGMscCwwKSkpOyc7XG4gICAgfSxcblxuICAgICdfdCc6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQuY29kZSArPSB3cml0ZSgnXCInICsgZXNjKG5vZGUudGV4dCkgKyAnXCInKTtcbiAgICB9LFxuXG4gICAgJ3snOiB0cmlwbGVTdGFjaGUsXG5cbiAgICAnJic6IHRyaXBsZVN0YWNoZVxuICB9XG5cbiAgZnVuY3Rpb24gdHJpcGxlU3RhY2hlKG5vZGUsIGNvbnRleHQpIHtcbiAgICBjb250ZXh0LmNvZGUgKz0gJ3QuYih0LnQodC4nICsgY2hvb3NlTWV0aG9kKG5vZGUubikgKyAnKFwiJyArIGVzYyhub2RlLm4pICsgJ1wiLGMscCwwKSkpOyc7XG4gIH1cblxuICBmdW5jdGlvbiB3cml0ZShzKSB7XG4gICAgcmV0dXJuICd0LmIoJyArIHMgKyAnKTsnO1xuICB9XG5cbiAgSG9nYW4ud2FsayA9IGZ1bmN0aW9uKG5vZGVsaXN0LCBjb250ZXh0KSB7XG4gICAgdmFyIGZ1bmM7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBub2RlbGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGZ1bmMgPSBIb2dhbi5jb2RlZ2VuW25vZGVsaXN0W2ldLnRhZ107XG4gICAgICBmdW5jICYmIGZ1bmMobm9kZWxpc3RbaV0sIGNvbnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuXG4gIEhvZ2FuLnBhcnNlID0gZnVuY3Rpb24odG9rZW5zLCB0ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgcmV0dXJuIGJ1aWxkVHJlZSh0b2tlbnMsICcnLCBbXSwgb3B0aW9ucy5zZWN0aW9uVGFncyB8fCBbXSk7XG4gIH1cblxuICBIb2dhbi5jYWNoZSA9IHt9O1xuXG4gIEhvZ2FuLmNhY2hlS2V5ID0gZnVuY3Rpb24odGV4dCwgb3B0aW9ucykge1xuICAgIHJldHVybiBbdGV4dCwgISFvcHRpb25zLmFzU3RyaW5nLCAhIW9wdGlvbnMuZGlzYWJsZUxhbWJkYSwgb3B0aW9ucy5kZWxpbWl0ZXJzLCAhIW9wdGlvbnMubW9kZWxHZXRdLmpvaW4oJ3x8Jyk7XG4gIH1cblxuICBIb2dhbi5jb21waWxlID0gZnVuY3Rpb24odGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBrZXkgPSBIb2dhbi5jYWNoZUtleSh0ZXh0LCBvcHRpb25zKTtcbiAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLmNhY2hlW2tleV07XG5cbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgIHZhciBwYXJ0aWFscyA9IHRlbXBsYXRlLnBhcnRpYWxzO1xuICAgICAgZm9yICh2YXIgbmFtZSBpbiBwYXJ0aWFscykge1xuICAgICAgICBkZWxldGUgcGFydGlhbHNbbmFtZV0uaW5zdGFuY2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgdGVtcGxhdGUgPSB0aGlzLmdlbmVyYXRlKHRoaXMucGFyc2UodGhpcy5zY2FuKHRleHQsIG9wdGlvbnMuZGVsaW1pdGVycyksIHRleHQsIG9wdGlvbnMpLCB0ZXh0LCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5jYWNoZVtrZXldID0gdGVtcGxhdGU7XG4gIH1cbn0pKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyA/IGV4cG9ydHMgOiBIb2dhbik7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC9Vc2Vycy9wcmltb3ovd29yay9yZXNwb25zaXZlYWRzL1R3ZWVuVGltZS9Ud2VlblRpbWUvfi9ob2dhbi5qcy9saWIvY29tcGlsZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyNVxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	eval("/*\n *  Copyright 2011 Twitter, Inc.\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *  http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */\n\nvar Hogan = {};\n\n(function (Hogan) {\n  Hogan.Template = function (codeObj, text, compiler, options) {\n    codeObj = codeObj || {};\n    this.r = codeObj.code || this.r;\n    this.c = compiler;\n    this.options = options || {};\n    this.text = text || '';\n    this.partials = codeObj.partials || {};\n    this.subs = codeObj.subs || {};\n    this.buf = '';\n  }\n\n  Hogan.Template.prototype = {\n    // render: replaced by generated code.\n    r: function (context, partials, indent) { return ''; },\n\n    // variable escaping\n    v: hoganEscape,\n\n    // triple stache\n    t: coerceToString,\n\n    render: function render(context, partials, indent) {\n      return this.ri([context], partials || {}, indent);\n    },\n\n    // render internal -- a hook for overrides that catches partials too\n    ri: function (context, partials, indent) {\n      return this.r(context, partials, indent);\n    },\n\n    // ensurePartial\n    ep: function(symbol, partials) {\n      var partial = this.partials[symbol];\n\n      // check to see that if we've instantiated this partial before\n      var template = partials[partial.name];\n      if (partial.instance && partial.base == template) {\n        return partial.instance;\n      }\n\n      if (typeof template == 'string') {\n        if (!this.c) {\n          throw new Error(\"No compiler available.\");\n        }\n        template = this.c.compile(template, this.options);\n      }\n\n      if (!template) {\n        return null;\n      }\n\n      // We use this to check whether the partials dictionary has changed\n      this.partials[symbol].base = template;\n\n      if (partial.subs) {\n        // Make sure we consider parent template now\n        if (!partials.stackText) partials.stackText = {};\n        for (key in partial.subs) {\n          if (!partials.stackText[key]) {\n            partials.stackText[key] = (this.activeSub !== undefined && partials.stackText[this.activeSub]) ? partials.stackText[this.activeSub] : this.text;\n          }\n        }\n        template = createSpecializedPartial(template, partial.subs, partial.partials,\n          this.stackSubs, this.stackPartials, partials.stackText);\n      }\n      this.partials[symbol].instance = template;\n\n      return template;\n    },\n\n    // tries to find a partial in the current scope and render it\n    rp: function(symbol, context, partials, indent) {\n      var partial = this.ep(symbol, partials);\n      if (!partial) {\n        return '';\n      }\n\n      return partial.ri(context, partials, indent);\n    },\n\n    // render a section\n    rs: function(context, partials, section) {\n      var tail = context[context.length - 1];\n\n      if (!isArray(tail)) {\n        section(context, partials, this);\n        return;\n      }\n\n      for (var i = 0; i < tail.length; i++) {\n        context.push(tail[i]);\n        section(context, partials, this);\n        context.pop();\n      }\n    },\n\n    // maybe start a section\n    s: function(val, ctx, partials, inverted, start, end, tags) {\n      var pass;\n\n      if (isArray(val) && val.length === 0) {\n        return false;\n      }\n\n      if (typeof val == 'function') {\n        val = this.ms(val, ctx, partials, inverted, start, end, tags);\n      }\n\n      pass = !!val;\n\n      if (!inverted && pass && ctx) {\n        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);\n      }\n\n      return pass;\n    },\n\n    // find values with dotted names\n    d: function(key, ctx, partials, returnFound) {\n      var found,\n          names = key.split('.'),\n          val = this.f(names[0], ctx, partials, returnFound),\n          doModelGet = this.options.modelGet,\n          cx = null;\n\n      if (key === '.' && isArray(ctx[ctx.length - 2])) {\n        val = ctx[ctx.length - 1];\n      } else {\n        for (var i = 1; i < names.length; i++) {\n          found = findInScope(names[i], val, doModelGet);\n          if (found !== undefined) {\n            cx = val;\n            val = found;\n          } else {\n            val = '';\n          }\n        }\n      }\n\n      if (returnFound && !val) {\n        return false;\n      }\n\n      if (!returnFound && typeof val == 'function') {\n        ctx.push(cx);\n        val = this.mv(val, ctx, partials);\n        ctx.pop();\n      }\n\n      return val;\n    },\n\n    // find values with normal names\n    f: function(key, ctx, partials, returnFound) {\n      var val = false,\n          v = null,\n          found = false,\n          doModelGet = this.options.modelGet;\n\n      for (var i = ctx.length - 1; i >= 0; i--) {\n        v = ctx[i];\n        val = findInScope(key, v, doModelGet);\n        if (val !== undefined) {\n          found = true;\n          break;\n        }\n      }\n\n      if (!found) {\n        return (returnFound) ? false : \"\";\n      }\n\n      if (!returnFound && typeof val == 'function') {\n        val = this.mv(val, ctx, partials);\n      }\n\n      return val;\n    },\n\n    // higher order templates\n    ls: function(func, cx, partials, text, tags) {\n      var oldTags = this.options.delimiters;\n\n      this.options.delimiters = tags;\n      this.b(this.ct(coerceToString(func.call(cx, text)), cx, partials));\n      this.options.delimiters = oldTags;\n\n      return false;\n    },\n\n    // compile text\n    ct: function(text, cx, partials) {\n      if (this.options.disableLambda) {\n        throw new Error('Lambda features disabled.');\n      }\n      return this.c.compile(text, this.options).render(cx, partials);\n    },\n\n    // template result buffering\n    b: function(s) { this.buf += s; },\n\n    fl: function() { var r = this.buf; this.buf = ''; return r; },\n\n    // method replace section\n    ms: function(func, ctx, partials, inverted, start, end, tags) {\n      var textSource,\n          cx = ctx[ctx.length - 1],\n          result = func.call(cx);\n\n      if (typeof result == 'function') {\n        if (inverted) {\n          return true;\n        } else {\n          textSource = (this.activeSub && this.subsText && this.subsText[this.activeSub]) ? this.subsText[this.activeSub] : this.text;\n          return this.ls(result, cx, partials, textSource.substring(start, end), tags);\n        }\n      }\n\n      return result;\n    },\n\n    // method replace variable\n    mv: function(func, ctx, partials) {\n      var cx = ctx[ctx.length - 1];\n      var result = func.call(cx);\n\n      if (typeof result == 'function') {\n        return this.ct(coerceToString(result.call(cx)), cx, partials);\n      }\n\n      return result;\n    },\n\n    sub: function(name, context, partials, indent) {\n      var f = this.subs[name];\n      if (f) {\n        this.activeSub = name;\n        f(context, partials, this, indent);\n        this.activeSub = false;\n      }\n    }\n\n  };\n\n  //Find a key in an object\n  function findInScope(key, scope, doModelGet) {\n    var val;\n\n    if (scope && typeof scope == 'object') {\n\n      if (scope[key] !== undefined) {\n        val = scope[key];\n\n      // try lookup with get for backbone or similar model data\n      } else if (doModelGet && scope.get && typeof scope.get == 'function') {\n        val = scope.get(key);\n      }\n    }\n\n    return val;\n  }\n\n  function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {\n    function PartialTemplate() {};\n    PartialTemplate.prototype = instance;\n    function Substitutions() {};\n    Substitutions.prototype = instance.subs;\n    var key;\n    var partial = new PartialTemplate();\n    partial.subs = new Substitutions();\n    partial.subsText = {};  //hehe. substext.\n    partial.buf = '';\n\n    stackSubs = stackSubs || {};\n    partial.stackSubs = stackSubs;\n    partial.subsText = stackText;\n    for (key in subs) {\n      if (!stackSubs[key]) stackSubs[key] = subs[key];\n    }\n    for (key in stackSubs) {\n      partial.subs[key] = stackSubs[key];\n    }\n\n    stackPartials = stackPartials || {};\n    partial.stackPartials = stackPartials;\n    for (key in partials) {\n      if (!stackPartials[key]) stackPartials[key] = partials[key];\n    }\n    for (key in stackPartials) {\n      partial.partials[key] = stackPartials[key];\n    }\n\n    return partial;\n  }\n\n  var rAmp = /&/g,\n      rLt = /</g,\n      rGt = />/g,\n      rApos = /\\'/g,\n      rQuot = /\\\"/g,\n      hChars = /[&<>\\\"\\']/;\n\n  function coerceToString(val) {\n    return String((val === null || val === undefined) ? '' : val);\n  }\n\n  function hoganEscape(str) {\n    str = coerceToString(str);\n    return hChars.test(str) ?\n      str\n        .replace(rAmp, '&amp;')\n        .replace(rLt, '&lt;')\n        .replace(rGt, '&gt;')\n        .replace(rApos, '&#39;')\n        .replace(rQuot, '&quot;') :\n      str;\n  }\n\n  var isArray = Array.isArray || function(a) {\n    return Object.prototype.toString.call(a) === '[object Array]';\n  };\n\n})( true ? exports : Hogan);\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vL1VzZXJzL3ByaW1vei93b3JrL3Jlc3BvbnNpdmVhZHMvVHdlZW5UaW1lL1R3ZWVuVGltZS9+L2hvZ2FuLmpzL2xpYi90ZW1wbGF0ZS5qcz8wNjYxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkNBQTZDLFdBQVcsRUFBRTs7QUFFMUQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsOENBQThDO0FBQzlDLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUIsaUJBQWlCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsdUJBQXVCLGtCQUFrQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtDQUFrQyxRQUFRO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxvQkFBb0IsZUFBZSxFQUFFOztBQUVyQyxvQkFBb0Isa0JBQWtCLGVBQWUsVUFBVSxFQUFFOztBQUVqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLDJCQUEyQjtBQUMzQiwyQkFBMkI7QUFDM0IsOEJBQThCO0FBQzlCLCtCQUErQjtBQUMvQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDIiwiZmlsZSI6IjI2LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAxMSBUd2l0dGVyLCBJbmMuXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG52YXIgSG9nYW4gPSB7fTtcblxuKGZ1bmN0aW9uIChIb2dhbikge1xuICBIb2dhbi5UZW1wbGF0ZSA9IGZ1bmN0aW9uIChjb2RlT2JqLCB0ZXh0LCBjb21waWxlciwgb3B0aW9ucykge1xuICAgIGNvZGVPYmogPSBjb2RlT2JqIHx8IHt9O1xuICAgIHRoaXMuciA9IGNvZGVPYmouY29kZSB8fCB0aGlzLnI7XG4gICAgdGhpcy5jID0gY29tcGlsZXI7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnRleHQgPSB0ZXh0IHx8ICcnO1xuICAgIHRoaXMucGFydGlhbHMgPSBjb2RlT2JqLnBhcnRpYWxzIHx8IHt9O1xuICAgIHRoaXMuc3VicyA9IGNvZGVPYmouc3VicyB8fCB7fTtcbiAgICB0aGlzLmJ1ZiA9ICcnO1xuICB9XG5cbiAgSG9nYW4uVGVtcGxhdGUucHJvdG90eXBlID0ge1xuICAgIC8vIHJlbmRlcjogcmVwbGFjZWQgYnkgZ2VuZXJhdGVkIGNvZGUuXG4gICAgcjogZnVuY3Rpb24gKGNvbnRleHQsIHBhcnRpYWxzLCBpbmRlbnQpIHsgcmV0dXJuICcnOyB9LFxuXG4gICAgLy8gdmFyaWFibGUgZXNjYXBpbmdcbiAgICB2OiBob2dhbkVzY2FwZSxcblxuICAgIC8vIHRyaXBsZSBzdGFjaGVcbiAgICB0OiBjb2VyY2VUb1N0cmluZyxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGNvbnRleHQsIHBhcnRpYWxzLCBpbmRlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJpKFtjb250ZXh0XSwgcGFydGlhbHMgfHwge30sIGluZGVudCk7XG4gICAgfSxcblxuICAgIC8vIHJlbmRlciBpbnRlcm5hbCAtLSBhIGhvb2sgZm9yIG92ZXJyaWRlcyB0aGF0IGNhdGNoZXMgcGFydGlhbHMgdG9vXG4gICAgcmk6IGZ1bmN0aW9uIChjb250ZXh0LCBwYXJ0aWFscywgaW5kZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5yKGNvbnRleHQsIHBhcnRpYWxzLCBpbmRlbnQpO1xuICAgIH0sXG5cbiAgICAvLyBlbnN1cmVQYXJ0aWFsXG4gICAgZXA6IGZ1bmN0aW9uKHN5bWJvbCwgcGFydGlhbHMpIHtcbiAgICAgIHZhciBwYXJ0aWFsID0gdGhpcy5wYXJ0aWFsc1tzeW1ib2xdO1xuXG4gICAgICAvLyBjaGVjayB0byBzZWUgdGhhdCBpZiB3ZSd2ZSBpbnN0YW50aWF0ZWQgdGhpcyBwYXJ0aWFsIGJlZm9yZVxuICAgICAgdmFyIHRlbXBsYXRlID0gcGFydGlhbHNbcGFydGlhbC5uYW1lXTtcbiAgICAgIGlmIChwYXJ0aWFsLmluc3RhbmNlICYmIHBhcnRpYWwuYmFzZSA9PSB0ZW1wbGF0ZSkge1xuICAgICAgICByZXR1cm4gcGFydGlhbC5pbnN0YW5jZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoIXRoaXMuYykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGNvbXBpbGVyIGF2YWlsYWJsZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgdGVtcGxhdGUgPSB0aGlzLmMuY29tcGlsZSh0ZW1wbGF0ZSwgdGhpcy5vcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0ZW1wbGF0ZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gV2UgdXNlIHRoaXMgdG8gY2hlY2sgd2hldGhlciB0aGUgcGFydGlhbHMgZGljdGlvbmFyeSBoYXMgY2hhbmdlZFxuICAgICAgdGhpcy5wYXJ0aWFsc1tzeW1ib2xdLmJhc2UgPSB0ZW1wbGF0ZTtcblxuICAgICAgaWYgKHBhcnRpYWwuc3Vicykge1xuICAgICAgICAvLyBNYWtlIHN1cmUgd2UgY29uc2lkZXIgcGFyZW50IHRlbXBsYXRlIG5vd1xuICAgICAgICBpZiAoIXBhcnRpYWxzLnN0YWNrVGV4dCkgcGFydGlhbHMuc3RhY2tUZXh0ID0ge307XG4gICAgICAgIGZvciAoa2V5IGluIHBhcnRpYWwuc3Vicykge1xuICAgICAgICAgIGlmICghcGFydGlhbHMuc3RhY2tUZXh0W2tleV0pIHtcbiAgICAgICAgICAgIHBhcnRpYWxzLnN0YWNrVGV4dFtrZXldID0gKHRoaXMuYWN0aXZlU3ViICE9PSB1bmRlZmluZWQgJiYgcGFydGlhbHMuc3RhY2tUZXh0W3RoaXMuYWN0aXZlU3ViXSkgPyBwYXJ0aWFscy5zdGFja1RleHRbdGhpcy5hY3RpdmVTdWJdIDogdGhpcy50ZXh0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wbGF0ZSA9IGNyZWF0ZVNwZWNpYWxpemVkUGFydGlhbCh0ZW1wbGF0ZSwgcGFydGlhbC5zdWJzLCBwYXJ0aWFsLnBhcnRpYWxzLFxuICAgICAgICAgIHRoaXMuc3RhY2tTdWJzLCB0aGlzLnN0YWNrUGFydGlhbHMsIHBhcnRpYWxzLnN0YWNrVGV4dCk7XG4gICAgICB9XG4gICAgICB0aGlzLnBhcnRpYWxzW3N5bWJvbF0uaW5zdGFuY2UgPSB0ZW1wbGF0ZTtcblxuICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH0sXG5cbiAgICAvLyB0cmllcyB0byBmaW5kIGEgcGFydGlhbCBpbiB0aGUgY3VycmVudCBzY29wZSBhbmQgcmVuZGVyIGl0XG4gICAgcnA6IGZ1bmN0aW9uKHN5bWJvbCwgY29udGV4dCwgcGFydGlhbHMsIGluZGVudCkge1xuICAgICAgdmFyIHBhcnRpYWwgPSB0aGlzLmVwKHN5bWJvbCwgcGFydGlhbHMpO1xuICAgICAgaWYgKCFwYXJ0aWFsKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhcnRpYWwucmkoY29udGV4dCwgcGFydGlhbHMsIGluZGVudCk7XG4gICAgfSxcblxuICAgIC8vIHJlbmRlciBhIHNlY3Rpb25cbiAgICByczogZnVuY3Rpb24oY29udGV4dCwgcGFydGlhbHMsIHNlY3Rpb24pIHtcbiAgICAgIHZhciB0YWlsID0gY29udGV4dFtjb250ZXh0Lmxlbmd0aCAtIDFdO1xuXG4gICAgICBpZiAoIWlzQXJyYXkodGFpbCkpIHtcbiAgICAgICAgc2VjdGlvbihjb250ZXh0LCBwYXJ0aWFscywgdGhpcyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWlsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnRleHQucHVzaCh0YWlsW2ldKTtcbiAgICAgICAgc2VjdGlvbihjb250ZXh0LCBwYXJ0aWFscywgdGhpcyk7XG4gICAgICAgIGNvbnRleHQucG9wKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIG1heWJlIHN0YXJ0IGEgc2VjdGlvblxuICAgIHM6IGZ1bmN0aW9uKHZhbCwgY3R4LCBwYXJ0aWFscywgaW52ZXJ0ZWQsIHN0YXJ0LCBlbmQsIHRhZ3MpIHtcbiAgICAgIHZhciBwYXNzO1xuXG4gICAgICBpZiAoaXNBcnJheSh2YWwpICYmIHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbCA9IHRoaXMubXModmFsLCBjdHgsIHBhcnRpYWxzLCBpbnZlcnRlZCwgc3RhcnQsIGVuZCwgdGFncyk7XG4gICAgICB9XG5cbiAgICAgIHBhc3MgPSAhIXZhbDtcblxuICAgICAgaWYgKCFpbnZlcnRlZCAmJiBwYXNzICYmIGN0eCkge1xuICAgICAgICBjdHgucHVzaCgodHlwZW9mIHZhbCA9PSAnb2JqZWN0JykgPyB2YWwgOiBjdHhbY3R4Lmxlbmd0aCAtIDFdKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhc3M7XG4gICAgfSxcblxuICAgIC8vIGZpbmQgdmFsdWVzIHdpdGggZG90dGVkIG5hbWVzXG4gICAgZDogZnVuY3Rpb24oa2V5LCBjdHgsIHBhcnRpYWxzLCByZXR1cm5Gb3VuZCkge1xuICAgICAgdmFyIGZvdW5kLFxuICAgICAgICAgIG5hbWVzID0ga2V5LnNwbGl0KCcuJyksXG4gICAgICAgICAgdmFsID0gdGhpcy5mKG5hbWVzWzBdLCBjdHgsIHBhcnRpYWxzLCByZXR1cm5Gb3VuZCksXG4gICAgICAgICAgZG9Nb2RlbEdldCA9IHRoaXMub3B0aW9ucy5tb2RlbEdldCxcbiAgICAgICAgICBjeCA9IG51bGw7XG5cbiAgICAgIGlmIChrZXkgPT09ICcuJyAmJiBpc0FycmF5KGN0eFtjdHgubGVuZ3RoIC0gMl0pKSB7XG4gICAgICAgIHZhbCA9IGN0eFtjdHgubGVuZ3RoIC0gMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZm91bmQgPSBmaW5kSW5TY29wZShuYW1lc1tpXSwgdmFsLCBkb01vZGVsR2V0KTtcbiAgICAgICAgICBpZiAoZm91bmQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY3ggPSB2YWw7XG4gICAgICAgICAgICB2YWwgPSBmb3VuZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsID0gJyc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXR1cm5Gb3VuZCAmJiAhdmFsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZXR1cm5Gb3VuZCAmJiB0eXBlb2YgdmFsID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY3R4LnB1c2goY3gpO1xuICAgICAgICB2YWwgPSB0aGlzLm12KHZhbCwgY3R4LCBwYXJ0aWFscyk7XG4gICAgICAgIGN0eC5wb3AoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9LFxuXG4gICAgLy8gZmluZCB2YWx1ZXMgd2l0aCBub3JtYWwgbmFtZXNcbiAgICBmOiBmdW5jdGlvbihrZXksIGN0eCwgcGFydGlhbHMsIHJldHVybkZvdW5kKSB7XG4gICAgICB2YXIgdmFsID0gZmFsc2UsXG4gICAgICAgICAgdiA9IG51bGwsXG4gICAgICAgICAgZm91bmQgPSBmYWxzZSxcbiAgICAgICAgICBkb01vZGVsR2V0ID0gdGhpcy5vcHRpb25zLm1vZGVsR2V0O1xuXG4gICAgICBmb3IgKHZhciBpID0gY3R4Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHYgPSBjdHhbaV07XG4gICAgICAgIHZhbCA9IGZpbmRJblNjb3BlKGtleSwgdiwgZG9Nb2RlbEdldCk7XG4gICAgICAgIGlmICh2YWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgIHJldHVybiAocmV0dXJuRm91bmQpID8gZmFsc2UgOiBcIlwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJldHVybkZvdW5kICYmIHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YWwgPSB0aGlzLm12KHZhbCwgY3R4LCBwYXJ0aWFscyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWw7XG4gICAgfSxcblxuICAgIC8vIGhpZ2hlciBvcmRlciB0ZW1wbGF0ZXNcbiAgICBsczogZnVuY3Rpb24oZnVuYywgY3gsIHBhcnRpYWxzLCB0ZXh0LCB0YWdzKSB7XG4gICAgICB2YXIgb2xkVGFncyA9IHRoaXMub3B0aW9ucy5kZWxpbWl0ZXJzO1xuXG4gICAgICB0aGlzLm9wdGlvbnMuZGVsaW1pdGVycyA9IHRhZ3M7XG4gICAgICB0aGlzLmIodGhpcy5jdChjb2VyY2VUb1N0cmluZyhmdW5jLmNhbGwoY3gsIHRleHQpKSwgY3gsIHBhcnRpYWxzKSk7XG4gICAgICB0aGlzLm9wdGlvbnMuZGVsaW1pdGVycyA9IG9sZFRhZ3M7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gY29tcGlsZSB0ZXh0XG4gICAgY3Q6IGZ1bmN0aW9uKHRleHQsIGN4LCBwYXJ0aWFscykge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kaXNhYmxlTGFtYmRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTGFtYmRhIGZlYXR1cmVzIGRpc2FibGVkLicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuYy5jb21waWxlKHRleHQsIHRoaXMub3B0aW9ucykucmVuZGVyKGN4LCBwYXJ0aWFscyk7XG4gICAgfSxcblxuICAgIC8vIHRlbXBsYXRlIHJlc3VsdCBidWZmZXJpbmdcbiAgICBiOiBmdW5jdGlvbihzKSB7IHRoaXMuYnVmICs9IHM7IH0sXG5cbiAgICBmbDogZnVuY3Rpb24oKSB7IHZhciByID0gdGhpcy5idWY7IHRoaXMuYnVmID0gJyc7IHJldHVybiByOyB9LFxuXG4gICAgLy8gbWV0aG9kIHJlcGxhY2Ugc2VjdGlvblxuICAgIG1zOiBmdW5jdGlvbihmdW5jLCBjdHgsIHBhcnRpYWxzLCBpbnZlcnRlZCwgc3RhcnQsIGVuZCwgdGFncykge1xuICAgICAgdmFyIHRleHRTb3VyY2UsXG4gICAgICAgICAgY3ggPSBjdHhbY3R4Lmxlbmd0aCAtIDFdLFxuICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuY2FsbChjeCk7XG5cbiAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaWYgKGludmVydGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGV4dFNvdXJjZSA9ICh0aGlzLmFjdGl2ZVN1YiAmJiB0aGlzLnN1YnNUZXh0ICYmIHRoaXMuc3Vic1RleHRbdGhpcy5hY3RpdmVTdWJdKSA/IHRoaXMuc3Vic1RleHRbdGhpcy5hY3RpdmVTdWJdIDogdGhpcy50ZXh0O1xuICAgICAgICAgIHJldHVybiB0aGlzLmxzKHJlc3VsdCwgY3gsIHBhcnRpYWxzLCB0ZXh0U291cmNlLnN1YnN0cmluZyhzdGFydCwgZW5kKSwgdGFncyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgLy8gbWV0aG9kIHJlcGxhY2UgdmFyaWFibGVcbiAgICBtdjogZnVuY3Rpb24oZnVuYywgY3R4LCBwYXJ0aWFscykge1xuICAgICAgdmFyIGN4ID0gY3R4W2N0eC5sZW5ndGggLSAxXTtcbiAgICAgIHZhciByZXN1bHQgPSBmdW5jLmNhbGwoY3gpO1xuXG4gICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN0KGNvZXJjZVRvU3RyaW5nKHJlc3VsdC5jYWxsKGN4KSksIGN4LCBwYXJ0aWFscyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIHN1YjogZnVuY3Rpb24obmFtZSwgY29udGV4dCwgcGFydGlhbHMsIGluZGVudCkge1xuICAgICAgdmFyIGYgPSB0aGlzLnN1YnNbbmFtZV07XG4gICAgICBpZiAoZikge1xuICAgICAgICB0aGlzLmFjdGl2ZVN1YiA9IG5hbWU7XG4gICAgICAgIGYoY29udGV4dCwgcGFydGlhbHMsIHRoaXMsIGluZGVudCk7XG4gICAgICAgIHRoaXMuYWN0aXZlU3ViID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gIH07XG5cbiAgLy9GaW5kIGEga2V5IGluIGFuIG9iamVjdFxuICBmdW5jdGlvbiBmaW5kSW5TY29wZShrZXksIHNjb3BlLCBkb01vZGVsR2V0KSB7XG4gICAgdmFyIHZhbDtcblxuICAgIGlmIChzY29wZSAmJiB0eXBlb2Ygc2NvcGUgPT0gJ29iamVjdCcpIHtcblxuICAgICAgaWYgKHNjb3BlW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YWwgPSBzY29wZVtrZXldO1xuXG4gICAgICAvLyB0cnkgbG9va3VwIHdpdGggZ2V0IGZvciBiYWNrYm9uZSBvciBzaW1pbGFyIG1vZGVsIGRhdGFcbiAgICAgIH0gZWxzZSBpZiAoZG9Nb2RlbEdldCAmJiBzY29wZS5nZXQgJiYgdHlwZW9mIHNjb3BlLmdldCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbCA9IHNjb3BlLmdldChrZXkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVTcGVjaWFsaXplZFBhcnRpYWwoaW5zdGFuY2UsIHN1YnMsIHBhcnRpYWxzLCBzdGFja1N1YnMsIHN0YWNrUGFydGlhbHMsIHN0YWNrVGV4dCkge1xuICAgIGZ1bmN0aW9uIFBhcnRpYWxUZW1wbGF0ZSgpIHt9O1xuICAgIFBhcnRpYWxUZW1wbGF0ZS5wcm90b3R5cGUgPSBpbnN0YW5jZTtcbiAgICBmdW5jdGlvbiBTdWJzdGl0dXRpb25zKCkge307XG4gICAgU3Vic3RpdHV0aW9ucy5wcm90b3R5cGUgPSBpbnN0YW5jZS5zdWJzO1xuICAgIHZhciBrZXk7XG4gICAgdmFyIHBhcnRpYWwgPSBuZXcgUGFydGlhbFRlbXBsYXRlKCk7XG4gICAgcGFydGlhbC5zdWJzID0gbmV3IFN1YnN0aXR1dGlvbnMoKTtcbiAgICBwYXJ0aWFsLnN1YnNUZXh0ID0ge307ICAvL2hlaGUuIHN1YnN0ZXh0LlxuICAgIHBhcnRpYWwuYnVmID0gJyc7XG5cbiAgICBzdGFja1N1YnMgPSBzdGFja1N1YnMgfHwge307XG4gICAgcGFydGlhbC5zdGFja1N1YnMgPSBzdGFja1N1YnM7XG4gICAgcGFydGlhbC5zdWJzVGV4dCA9IHN0YWNrVGV4dDtcbiAgICBmb3IgKGtleSBpbiBzdWJzKSB7XG4gICAgICBpZiAoIXN0YWNrU3Vic1trZXldKSBzdGFja1N1YnNba2V5XSA9IHN1YnNba2V5XTtcbiAgICB9XG4gICAgZm9yIChrZXkgaW4gc3RhY2tTdWJzKSB7XG4gICAgICBwYXJ0aWFsLnN1YnNba2V5XSA9IHN0YWNrU3Vic1trZXldO1xuICAgIH1cblxuICAgIHN0YWNrUGFydGlhbHMgPSBzdGFja1BhcnRpYWxzIHx8IHt9O1xuICAgIHBhcnRpYWwuc3RhY2tQYXJ0aWFscyA9IHN0YWNrUGFydGlhbHM7XG4gICAgZm9yIChrZXkgaW4gcGFydGlhbHMpIHtcbiAgICAgIGlmICghc3RhY2tQYXJ0aWFsc1trZXldKSBzdGFja1BhcnRpYWxzW2tleV0gPSBwYXJ0aWFsc1trZXldO1xuICAgIH1cbiAgICBmb3IgKGtleSBpbiBzdGFja1BhcnRpYWxzKSB7XG4gICAgICBwYXJ0aWFsLnBhcnRpYWxzW2tleV0gPSBzdGFja1BhcnRpYWxzW2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnRpYWw7XG4gIH1cblxuICB2YXIgckFtcCA9IC8mL2csXG4gICAgICByTHQgPSAvPC9nLFxuICAgICAgckd0ID0gLz4vZyxcbiAgICAgIHJBcG9zID0gL1xcJy9nLFxuICAgICAgclF1b3QgPSAvXFxcIi9nLFxuICAgICAgaENoYXJzID0gL1smPD5cXFwiXFwnXS87XG5cbiAgZnVuY3Rpb24gY29lcmNlVG9TdHJpbmcodmFsKSB7XG4gICAgcmV0dXJuIFN0cmluZygodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSA/ICcnIDogdmFsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhvZ2FuRXNjYXBlKHN0cikge1xuICAgIHN0ciA9IGNvZXJjZVRvU3RyaW5nKHN0cik7XG4gICAgcmV0dXJuIGhDaGFycy50ZXN0KHN0cikgP1xuICAgICAgc3RyXG4gICAgICAgIC5yZXBsYWNlKHJBbXAsICcmYW1wOycpXG4gICAgICAgIC5yZXBsYWNlKHJMdCwgJyZsdDsnKVxuICAgICAgICAucmVwbGFjZShyR3QsICcmZ3Q7JylcbiAgICAgICAgLnJlcGxhY2UockFwb3MsICcmIzM5OycpXG4gICAgICAgIC5yZXBsYWNlKHJRdW90LCAnJnF1b3Q7JykgOlxuICAgICAgc3RyO1xuICB9XG5cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKGEpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG59KSh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgPyBleHBvcnRzIDogSG9nYW4pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAvVXNlcnMvcHJpbW96L3dvcmsvcmVzcG9uc2l2ZWFkcy9Ud2VlblRpbWUvVHdlZW5UaW1lL34vaG9nYW4uanMvbGliL3RlbXBsYXRlLmpzXG4gKiogbW9kdWxlIGlkID0gMjZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if (\"value\" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };\n\n__webpack_require__(18);\n\nvar _PropertyBase2 = __webpack_require__(21);\n\nvar _PropertyBase3 = _interopRequireDefault(_PropertyBase2);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\n__webpack_require__(28);\n\n\nvar tpl_property = __webpack_require__(29);\n\nvar PropertyColor = function (_PropertyBase) {\n  _inherits(PropertyColor, _PropertyBase);\n\n  function PropertyColor(instance_property, lineData, editor) {\n    var key_val = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];\n\n    _classCallCheck(this, PropertyColor);\n\n    var _this = _possibleConstructorReturn(this, (PropertyColor.__proto__ || Object.getPrototypeOf(PropertyColor)).call(this, instance_property, lineData, editor, key_val));\n\n    _this.onInputChange = _this.onInputChange.bind(_this);\n    _this.$input = _this.$el.find('input');\n    return _this;\n  }\n\n  _createClass(PropertyColor, [{\n    key: 'render',\n    value: function render() {\n      var _this2 = this;\n\n      _get(PropertyColor.prototype.__proto__ || Object.getPrototypeOf(PropertyColor.prototype), 'render', this).call(this);\n      // By default assign the property default value\n      var val = this.getCurrentVal();\n\n      var data = {\n        id: this.instance_property.name, // \"circleRadius\" instead of \"circle radius\"\n        label: this.instance_property.label || this.instance_property.name,\n        val: val\n      };\n\n      var view = tpl_property(data);\n      this.$el = $(view);\n      this.$el.find('.property__key').click(this.onKeyClick);\n\n      var $input = this.$el.find('input');\n\n      $input.spectrum({\n        allowEmpty: false,\n        showAlpha: true,\n        clickoutFiresChange: false,\n        preferredFormat: 'rgb',\n        change: function change() {\n          _this2.editor.undoManager.addState();\n        },\n        move: function move(color) {\n          if (color._a === 1) {\n            $input.val(color.toHexString());\n          } else {\n            $input.val(color.toRgbString());\n          }\n\n          _this2.onInputChange();\n        }\n      });\n\n      $input.change(this.onInputChange);\n    }\n  }, {\n    key: 'remove',\n    value: function remove() {\n      _get(PropertyColor.prototype.__proto__ || Object.getPrototypeOf(PropertyColor.prototype), 'remove', this).call(this);\n      this.$el.find('input').spectrum('destroy');\n      delete this.$el;\n      delete this.$input;\n    }\n  }, {\n    key: 'update',\n    value: function update() {\n      _get(PropertyColor.prototype.__proto__ || Object.getPrototypeOf(PropertyColor.prototype), 'update', this).call(this);\n      var val = this.getCurrentVal();\n      this.$input.val(val);\n      this.$input.spectrum('set', val);\n    }\n  }]);\n\n  return PropertyColor;\n}(_PropertyBase3.default);\n\nexports.default = PropertyColor;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lZGl0b3IvUHJvcGVydHlDb2xvci5qcz80ZmJmIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJ0cGxfcHJvcGVydHkiLCJQcm9wZXJ0eUNvbG9yIiwiaW5zdGFuY2VfcHJvcGVydHkiLCJsaW5lRGF0YSIsImVkaXRvciIsImtleV92YWwiLCJvbklucHV0Q2hhbmdlIiwiYmluZCIsIiRpbnB1dCIsIiRlbCIsImZpbmQiLCJ2YWwiLCJnZXRDdXJyZW50VmFsIiwiZGF0YSIsImlkIiwibmFtZSIsImxhYmVsIiwidmlldyIsIiQiLCJjbGljayIsIm9uS2V5Q2xpY2siLCJzcGVjdHJ1bSIsImFsbG93RW1wdHkiLCJzaG93QWxwaGEiLCJjbGlja291dEZpcmVzQ2hhbmdlIiwicHJlZmVycmVkRm9ybWF0IiwiY2hhbmdlIiwidW5kb01hbmFnZXIiLCJhZGRTdGF0ZSIsIm1vdmUiLCJjb2xvciIsIl9hIiwidG9IZXhTdHJpbmciLCJ0b1JnYlN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztBQUVBOzs7Ozs7Ozs7Ozs7QUFEQSxtQkFBQUEsQ0FBUSxFQUFSOzs7QUFHQSxJQUFJQyxlQUFlLG1CQUFBRCxDQUFRLEVBQVIsQ0FBbkI7O0lBRXFCRSxhOzs7QUFDbkIseUJBQVlDLGlCQUFaLEVBQStCQyxRQUEvQixFQUF5Q0MsTUFBekMsRUFBa0U7QUFBQSxRQUFqQkMsT0FBaUIseURBQVAsS0FBTzs7QUFBQTs7QUFBQSw4SEFDMURILGlCQUQwRCxFQUN2Q0MsUUFEdUMsRUFDN0JDLE1BRDZCLEVBQ3JCQyxPQURxQjs7QUFFaEUsVUFBS0MsYUFBTCxHQUFxQixNQUFLQSxhQUFMLENBQW1CQyxJQUFuQixPQUFyQjtBQUNBLFVBQUtDLE1BQUwsR0FBYyxNQUFLQyxHQUFMLENBQVNDLElBQVQsQ0FBYyxPQUFkLENBQWQ7QUFIZ0U7QUFJakU7Ozs7NkJBRVE7QUFBQTs7QUFDUDtBQUNBO0FBQ0EsVUFBSUMsTUFBTSxLQUFLQyxhQUFMLEVBQVY7O0FBRUEsVUFBSUMsT0FBTztBQUNUQyxZQUFJLEtBQUtaLGlCQUFMLENBQXVCYSxJQURsQixFQUN3QjtBQUNqQ0MsZUFBTyxLQUFLZCxpQkFBTCxDQUF1QmMsS0FBdkIsSUFBZ0MsS0FBS2QsaUJBQUwsQ0FBdUJhLElBRnJEO0FBR1RKLGFBQUtBO0FBSEksT0FBWDs7QUFNQSxVQUFJTSxPQUFPakIsYUFBYWEsSUFBYixDQUFYO0FBQ0EsV0FBS0osR0FBTCxHQUFXUyxFQUFFRCxJQUFGLENBQVg7QUFDQSxXQUFLUixHQUFMLENBQVNDLElBQVQsQ0FBYyxnQkFBZCxFQUFnQ1MsS0FBaEMsQ0FBc0MsS0FBS0MsVUFBM0M7O0FBRUEsVUFBSVosU0FBUyxLQUFLQyxHQUFMLENBQVNDLElBQVQsQ0FBYyxPQUFkLENBQWI7O0FBRUFGLGFBQU9hLFFBQVAsQ0FBZ0I7QUFDZEMsb0JBQVksS0FERTtBQUVkQyxtQkFBVyxJQUZHO0FBR2RDLDZCQUFxQixLQUhQO0FBSWRDLHlCQUFpQixLQUpIO0FBS2RDLGdCQUFRLGtCQUFNO0FBQ1osaUJBQUt0QixNQUFMLENBQVl1QixXQUFaLENBQXdCQyxRQUF4QjtBQUNELFNBUGE7QUFRZEMsY0FBTSxjQUFDQyxLQUFELEVBQVc7QUFDZixjQUFJQSxNQUFNQyxFQUFOLEtBQWEsQ0FBakIsRUFBb0I7QUFDbEJ2QixtQkFBT0csR0FBUCxDQUFXbUIsTUFBTUUsV0FBTixFQUFYO0FBQ0QsV0FGRCxNQUdLO0FBQ0h4QixtQkFBT0csR0FBUCxDQUFXbUIsTUFBTUcsV0FBTixFQUFYO0FBQ0Q7O0FBRUQsaUJBQUszQixhQUFMO0FBQ0Q7QUFqQmEsT0FBaEI7O0FBb0JBRSxhQUFPa0IsTUFBUCxDQUFjLEtBQUtwQixhQUFuQjtBQUNEOzs7NkJBRVE7QUFDUDtBQUNBLFdBQUtHLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLE9BQWQsRUFBdUJXLFFBQXZCLENBQWdDLFNBQWhDO0FBQ0EsYUFBTyxLQUFLWixHQUFaO0FBQ0EsYUFBTyxLQUFLRCxNQUFaO0FBQ0Q7Ozs2QkFFUTtBQUNQO0FBQ0EsVUFBSUcsTUFBTSxLQUFLQyxhQUFMLEVBQVY7QUFDQSxXQUFLSixNQUFMLENBQVlHLEdBQVosQ0FBZ0JBLEdBQWhCO0FBQ0EsV0FBS0gsTUFBTCxDQUFZYSxRQUFaLENBQXFCLEtBQXJCLEVBQTRCVixHQUE1QjtBQUNEOzs7Ozs7a0JBM0RrQlYsYSIsImZpbGUiOiIyNy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnanF1ZXJ5JztcbnJlcXVpcmUoJ3NwZWN0cnVtJyk7XG5pbXBvcnQgUHJvcGVydHlCYXNlIGZyb20gJy4vUHJvcGVydHlCYXNlJztcblxubGV0IHRwbF9wcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9wcm9wZXJ0eUNvbG9yLnRwbC5odG1sJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb3BlcnR5Q29sb3IgZXh0ZW5kcyBQcm9wZXJ0eUJhc2Uge1xuICBjb25zdHJ1Y3RvcihpbnN0YW5jZV9wcm9wZXJ0eSwgbGluZURhdGEsIGVkaXRvciwga2V5X3ZhbCA9IGZhbHNlKSB7XG4gICAgc3VwZXIoaW5zdGFuY2VfcHJvcGVydHksIGxpbmVEYXRhLCBlZGl0b3IsIGtleV92YWwpO1xuICAgIHRoaXMub25JbnB1dENoYW5nZSA9IHRoaXMub25JbnB1dENoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuJGlucHV0ID0gdGhpcy4kZWwuZmluZCgnaW5wdXQnKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBzdXBlci5yZW5kZXIoKTtcbiAgICAvLyBCeSBkZWZhdWx0IGFzc2lnbiB0aGUgcHJvcGVydHkgZGVmYXVsdCB2YWx1ZVxuICAgIHZhciB2YWwgPSB0aGlzLmdldEN1cnJlbnRWYWwoKTtcblxuICAgIHZhciBkYXRhID0ge1xuICAgICAgaWQ6IHRoaXMuaW5zdGFuY2VfcHJvcGVydHkubmFtZSwgLy8gXCJjaXJjbGVSYWRpdXNcIiBpbnN0ZWFkIG9mIFwiY2lyY2xlIHJhZGl1c1wiXG4gICAgICBsYWJlbDogdGhpcy5pbnN0YW5jZV9wcm9wZXJ0eS5sYWJlbCB8fCB0aGlzLmluc3RhbmNlX3Byb3BlcnR5Lm5hbWUsXG4gICAgICB2YWw6IHZhbFxuICAgIH07XG5cbiAgICB2YXIgdmlldyA9IHRwbF9wcm9wZXJ0eShkYXRhKTtcbiAgICB0aGlzLiRlbCA9ICQodmlldyk7XG4gICAgdGhpcy4kZWwuZmluZCgnLnByb3BlcnR5X19rZXknKS5jbGljayh0aGlzLm9uS2V5Q2xpY2spO1xuXG4gICAgdmFyICRpbnB1dCA9IHRoaXMuJGVsLmZpbmQoJ2lucHV0Jyk7XG5cbiAgICAkaW5wdXQuc3BlY3RydW0oe1xuICAgICAgYWxsb3dFbXB0eTogZmFsc2UsXG4gICAgICBzaG93QWxwaGE6IHRydWUsXG4gICAgICBjbGlja291dEZpcmVzQ2hhbmdlOiBmYWxzZSxcbiAgICAgIHByZWZlcnJlZEZvcm1hdDogJ3JnYicsXG4gICAgICBjaGFuZ2U6ICgpID0+IHtcbiAgICAgICAgdGhpcy5lZGl0b3IudW5kb01hbmFnZXIuYWRkU3RhdGUoKTtcbiAgICAgIH0sXG4gICAgICBtb3ZlOiAoY29sb3IpID0+IHtcbiAgICAgICAgaWYgKGNvbG9yLl9hID09PSAxKSB7XG4gICAgICAgICAgJGlucHV0LnZhbChjb2xvci50b0hleFN0cmluZygpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAkaW5wdXQudmFsKGNvbG9yLnRvUmdiU3RyaW5nKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vbklucHV0Q2hhbmdlKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAkaW5wdXQuY2hhbmdlKHRoaXMub25JbnB1dENoYW5nZSk7XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgc3VwZXIucmVtb3ZlKCk7XG4gICAgdGhpcy4kZWwuZmluZCgnaW5wdXQnKS5zcGVjdHJ1bSgnZGVzdHJveScpO1xuICAgIGRlbGV0ZSB0aGlzLiRlbDtcbiAgICBkZWxldGUgdGhpcy4kaW5wdXQ7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgc3VwZXIudXBkYXRlKCk7XG4gICAgdmFyIHZhbCA9IHRoaXMuZ2V0Q3VycmVudFZhbCgpO1xuICAgIHRoaXMuJGlucHV0LnZhbCh2YWwpO1xuICAgIHRoaXMuJGlucHV0LnNwZWN0cnVtKCdzZXQnLCB2YWwpO1xuICB9XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2VkaXRvci9Qcm9wZXJ0eUNvbG9yLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");
=======
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	__webpack_require__(22);
	
	var _PropertyBase2 = __webpack_require__(25);
	
	var _PropertyBase3 = _interopRequireDefault(_PropertyBase2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	__webpack_require__(32);
	
	
	var tpl_property = __webpack_require__(33);
	
	var PropertyColor = function (_PropertyBase) {
	  _inherits(PropertyColor, _PropertyBase);
	
	  function PropertyColor(instance_property, lineData, editor) {
	    var key_val = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
	
	    _classCallCheck(this, PropertyColor);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PropertyColor).call(this, instance_property, lineData, editor, key_val));
	
	    _this.onInputChange = _this.onInputChange.bind(_this);
	    _this.$input = _this.$el.find('input');
	    return _this;
	  }
	
	  _createClass(PropertyColor, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;
	
	      _get(Object.getPrototypeOf(PropertyColor.prototype), 'render', this).call(this);
	      // By default assign the property default value
	      var val = this.getCurrentVal();
	
	      var data = {
	        id: this.instance_property.name, // "circleRadius" instead of "circle radius"
	        label: this.instance_property.label || this.instance_property.name,
	        val: val
	      };
	
	      var view = tpl_property(data);
	      this.$el = $(view);
	      this.$el.find('.property__key').click(this.onKeyClick);
	
	      var $input = this.$el.find('input');
	
	      $input.spectrum({
	        allowEmpty: false,
	        showAlpha: true,
	        clickoutFiresChange: false,
	        preferredFormat: 'rgb',
	        change: function change() {
	          _this2.editor.undoManager.addState();
	        },
	        move: function move(color) {
	          if (color._a === 1) {
	            $input.val(color.toHexString());
	          } else {
	            $input.val(color.toRgbString());
	          }
	
	          _this2.onInputChange();
	        }
	      });
	
	      $input.change(this.onInputChange);
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      _get(Object.getPrototypeOf(PropertyColor.prototype), 'remove', this).call(this);
	      this.$el.find('input').spectrum('destroy');
	      delete this.$el;
	      delete this.$input;
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      _get(Object.getPrototypeOf(PropertyColor.prototype), 'update', this).call(this);
	      var val = this.getCurrentVal();
	      this.$input.val(val);
	      this.$input.spectrum('set', val);
	    }
	  }]);
	
	  return PropertyColor;
	}(_PropertyBase3.default);
	
	exports.default = PropertyColor;
>>>>>>> master

/***/ },
/* 32 */
/***/ function(module, exports) {

<<<<<<< HEAD
	eval("module.exports = __WEBPACK_EXTERNAL_MODULE_28__;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wicm9vdFwiOlwic3BlY3RydW1cIixcImNvbW1vbmpzXCI6XCJzcGVjdHJ1bS1jb2xvcnBpY2tlclwiLFwiY29tbW9uanMyXCI6XCJzcGVjdHJ1bS1jb2xvcnBpY2tlclwiLFwiYW1kXCI6XCJzcGVjdHJ1bVwifT8wNTYxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6IjI4LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzI4X187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCB7XCJyb290XCI6XCJzcGVjdHJ1bVwiLFwiY29tbW9uanNcIjpcInNwZWN0cnVtLWNvbG9ycGlja2VyXCIsXCJjb21tb25qczJcIjpcInNwZWN0cnVtLWNvbG9ycGlja2VyXCIsXCJhbWRcIjpcInNwZWN0cnVtXCJ9XG4gKiogbW9kdWxlIGlkID0gMjhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");
=======
	module.exports = __WEBPACK_EXTERNAL_MODULE_32__;
>>>>>>> master

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("var H = __webpack_require__(24);\nmodule.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||\"\");t.b(\"<div class=\\\"property property--number\\\">\");t.b(\"\\n\" + i);t.b(\"  <button class=\\\"property__key\\\"></button>\");t.b(\"\\n\" + i);t.b(\"  <label for=\\\"\");t.b(t.v(t.f(\"id\",c,p,0)));t.b(\"\\\" class=\\\"property__label\\\">\");t.b(t.v(t.f(\"label\",c,p,0)));t.b(\"</label>\");t.b(\"\\n\" + i);t.b(\"  <input id=\\\"\");t.b(t.v(t.f(\"id\",c,p,0)));t.b(\"\\\" class=\\\"property__input\\\" value=\\\"\");t.b(t.v(t.f(\"val\",c,p,0)));t.b(\"\\\" />\");t.b(\"\\n\" + i);t.b(\"</div>\");t.b(\"\\n\");return t.fl(); },partials: {}, subs: {  }}, \"<div class=\\\"property property--number\\\">\\n  <button class=\\\"property__key\\\"></button>\\n  <label for=\\\"{{id}}\\\" class=\\\"property__label\\\">{{label}}</label>\\n  <input id=\\\"{{id}}\\\" class=\\\"property__input\\\" value=\\\"{{val}}\\\" />\\n</div>\\n\", H); return T.render.apply(T, arguments); };//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi90ZW1wbGF0ZXMvcHJvcGVydHlDb2xvci50cGwuaHRtbD84ZDE5Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0EsNkJBQTZCLHlCQUF5Qix3QkFBd0IsWUFBWSxhQUFhLGlEQUFpRCxjQUFjLG1EQUFtRCxjQUFjLHVCQUF1QiwwQkFBMEIscUNBQXFDLDZCQUE2QixnQkFBZ0IsY0FBYyxzQkFBc0IsMEJBQTBCLDZDQUE2QywyQkFBMkIsYUFBYSxjQUFjLGNBQWMsVUFBVSxjQUFjLEVBQUUsYUFBYSxTQUFTLElBQUksNEdBQTRHLElBQUksK0JBQStCLE9BQU8sMEJBQTBCLElBQUksdUNBQXVDLEtBQUsscUJBQXFCLHFDQUFxQyIsImZpbGUiOiIyOS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBIID0gcmVxdWlyZShcImhvZ2FuLmpzXCIpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHsgdmFyIFQgPSBuZXcgSC5UZW1wbGF0ZSh7Y29kZTogZnVuY3Rpb24gKGMscCxpKSB7IHZhciB0PXRoaXM7dC5iKGk9aXx8XCJcIik7dC5iKFwiPGRpdiBjbGFzcz1cXFwicHJvcGVydHkgcHJvcGVydHktLW51bWJlclxcXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8YnV0dG9uIGNsYXNzPVxcXCJwcm9wZXJ0eV9fa2V5XFxcIj48L2J1dHRvbj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDxsYWJlbCBmb3I9XFxcIlwiKTt0LmIodC52KHQuZihcImlkXCIsYyxwLDApKSk7dC5iKFwiXFxcIiBjbGFzcz1cXFwicHJvcGVydHlfX2xhYmVsXFxcIj5cIik7dC5iKHQudih0LmYoXCJsYWJlbFwiLGMscCwwKSkpO3QuYihcIjwvbGFiZWw+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8aW5wdXQgaWQ9XFxcIlwiKTt0LmIodC52KHQuZihcImlkXCIsYyxwLDApKSk7dC5iKFwiXFxcIiBjbGFzcz1cXFwicHJvcGVydHlfX2lucHV0XFxcIiB2YWx1ZT1cXFwiXCIpO3QuYih0LnYodC5mKFwidmFsXCIsYyxwLDApKSk7dC5iKFwiXFxcIiAvPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIjwvZGl2PlwiKTt0LmIoXCJcXG5cIik7cmV0dXJuIHQuZmwoKTsgfSxwYXJ0aWFsczoge30sIHN1YnM6IHsgIH19LCBcIjxkaXYgY2xhc3M9XFxcInByb3BlcnR5IHByb3BlcnR5LS1udW1iZXJcXFwiPlxcbiAgPGJ1dHRvbiBjbGFzcz1cXFwicHJvcGVydHlfX2tleVxcXCI+PC9idXR0b24+XFxuICA8bGFiZWwgZm9yPVxcXCJ7e2lkfX1cXFwiIGNsYXNzPVxcXCJwcm9wZXJ0eV9fbGFiZWxcXFwiPnt7bGFiZWx9fTwvbGFiZWw+XFxuICA8aW5wdXQgaWQ9XFxcInt7aWR9fVxcXCIgY2xhc3M9XFxcInByb3BlcnR5X19pbnB1dFxcXCIgdmFsdWU9XFxcInt7dmFsfX1cXFwiIC8+XFxuPC9kaXY+XFxuXCIsIEgpOyByZXR1cm4gVC5yZW5kZXIuYXBwbHkoVCwgYXJndW1lbnRzKTsgfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdGVtcGxhdGVzL3Byb3BlcnR5Q29sb3IudHBsLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAyOVxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");
=======
	var H = __webpack_require__(28);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"property property--number\">");t.b("\n" + i);t.b("  <button class=\"property__key\"></button>");t.b("\n" + i);t.b("  <label for=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"property__label\">");t.b(t.v(t.f("label",c,p,0)));t.b("</label>");t.b("\n" + i);t.b("  <input id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"property__input\" value=\"");t.b(t.v(t.f("val",c,p,0)));t.b("\" />");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<div class=\"property property--number\">\n  <button class=\"property__key\"></button>\n  <label for=\"{{id}}\" class=\"property__label\">{{label}}</label>\n  <input id=\"{{id}}\" class=\"property__input\" value=\"{{val}}\" />\n</div>\n", H); return T.render.apply(T, arguments); };
>>>>>>> master

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\n__webpack_require__(18);\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar tpl_property = __webpack_require__(31);\n\nvar PropertyTween = function () {\n  // instance_property: The current property on the data object.\n  // lineData: The line data object.\n  function PropertyTween(instance_property, lineData, editor) {\n    var key_val = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];\n    var timeline = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];\n\n    _classCallCheck(this, PropertyTween);\n\n    this.instance_property = instance_property;\n    this.lineData = lineData;\n    this.editor = editor;\n    this.key_val = key_val;\n    this.timeline = timeline;\n\n    this.onChange = this.onChange.bind(this);\n\n    this.timer = this.editor.timer;\n    this.$time = false;\n    this.$el = false;\n    this.render();\n  }\n\n  _createClass(PropertyTween, [{\n    key: 'remove',\n    value: function remove() {\n      delete this.$el;\n      delete this.instance_property;\n      delete this.lineData;\n      delete this.editor;\n      delete this.key_val;\n      delete this.timeline;\n\n      delete this.timer;\n      delete this.$time;\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      var _this = this;\n\n      var self = this;\n      if (!this.key_val.ease) {\n        this.key_val.ease = 'Quad.easeOut';\n      }\n      var data = {\n        id: this.instance_property.name + '_tween',\n        val: this.key_val.ease,\n        time: this.key_val.time.toFixed(3),\n        options: ['Linear.easeNone'],\n        selected: function selected() {\n          if (this.toString() === self.key_val.ease) {\n            return 'selected';\n          }\n          return '';\n        }\n      };\n\n      var tweens = ['Quad', 'Cubic', 'Quart', 'Quint'];\n      for (var i = 0; i < tweens.length; i++) {\n        var tween = tweens[i];\n        data.options.push(tween + '.easeOut');\n        data.options.push(tween + '.easeIn');\n        data.options.push(tween + '.easeInOut');\n      }\n\n      this.$el = $(tpl_property(data));\n      this.$time = this.$el.find('.property__key-time strong');\n      this.$time.keypress(function (e) {\n        if (e.charCode === 13) {\n          // Enter\n          e.preventDefault();\n          _this.$time.blur();\n          _this.updateKeyTime(_this.$time.text());\n        }\n      });\n\n      this.$time.on('click', function () {\n        return document.execCommand('selectAll', false, null);\n      });\n      this.$el.find('select').change(this.onChange);\n    }\n  }, {\n    key: 'updateKeyTime',\n    value: function updateKeyTime(time) {\n      var time2 = parseFloat(time);\n      if (isNaN(time2)) {\n        time2 = this.key_val.time;\n      }\n      this.$time.text(time2);\n      this.key_val.time = time2;\n      this.onChange();\n    }\n  }, {\n    key: 'onChange',\n    value: function onChange() {\n      var ease = this.$el.find('select').val();\n      this.key_val.ease = ease;\n      this.editor.undoManager.addState();\n      this.lineData._isDirty = true;\n      this.timeline._isDirty = true;\n    }\n  }, {\n    key: 'update',\n    value: function update() {\n      // todo: use mustache instead...\n      this.$time.html(this.key_val.time.toFixed(3));\n    }\n  }]);\n\n  return PropertyTween;\n}();\n\nexports.default = PropertyTween;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lZGl0b3IvUHJvcGVydHlUd2Vlbi5qcz8xODZmIl0sIm5hbWVzIjpbInRwbF9wcm9wZXJ0eSIsInJlcXVpcmUiLCJQcm9wZXJ0eVR3ZWVuIiwiaW5zdGFuY2VfcHJvcGVydHkiLCJsaW5lRGF0YSIsImVkaXRvciIsImtleV92YWwiLCJ0aW1lbGluZSIsIm9uQ2hhbmdlIiwiYmluZCIsInRpbWVyIiwiJHRpbWUiLCIkZWwiLCJyZW5kZXIiLCJzZWxmIiwiZWFzZSIsImRhdGEiLCJpZCIsIm5hbWUiLCJ2YWwiLCJ0aW1lIiwidG9GaXhlZCIsIm9wdGlvbnMiLCJzZWxlY3RlZCIsInRvU3RyaW5nIiwidHdlZW5zIiwiaSIsImxlbmd0aCIsInR3ZWVuIiwicHVzaCIsIiQiLCJmaW5kIiwia2V5cHJlc3MiLCJlIiwiY2hhckNvZGUiLCJwcmV2ZW50RGVmYXVsdCIsImJsdXIiLCJ1cGRhdGVLZXlUaW1lIiwidGV4dCIsIm9uIiwiZG9jdW1lbnQiLCJleGVjQ29tbWFuZCIsImNoYW5nZSIsInRpbWUyIiwicGFyc2VGbG9hdCIsImlzTmFOIiwidW5kb01hbmFnZXIiLCJhZGRTdGF0ZSIsIl9pc0RpcnR5IiwiaHRtbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUVBLElBQUlBLGVBQWUsbUJBQUFDLENBQVEsRUFBUixDQUFuQjs7SUFFcUJDLGE7QUFDbkI7QUFDQTtBQUNBLHlCQUFZQyxpQkFBWixFQUErQkMsUUFBL0IsRUFBeUNDLE1BQXpDLEVBQW9GO0FBQUEsUUFBbkNDLE9BQW1DLHlEQUF6QixLQUF5QjtBQUFBLFFBQWxCQyxRQUFrQix5REFBUCxLQUFPOztBQUFBOztBQUNsRixTQUFLSixpQkFBTCxHQUF5QkEsaUJBQXpCO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxTQUFLQyxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxTQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFDQSxTQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjs7QUFFQSxTQUFLQyxRQUFMLEdBQWdCLEtBQUtBLFFBQUwsQ0FBY0MsSUFBZCxDQUFtQixJQUFuQixDQUFoQjs7QUFFQSxTQUFLQyxLQUFMLEdBQWEsS0FBS0wsTUFBTCxDQUFZSyxLQUF6QjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxLQUFiO0FBQ0EsU0FBS0MsR0FBTCxHQUFXLEtBQVg7QUFDQSxTQUFLQyxNQUFMO0FBQ0Q7Ozs7NkJBRVE7QUFDUCxhQUFPLEtBQUtELEdBQVo7QUFDQSxhQUFPLEtBQUtULGlCQUFaO0FBQ0EsYUFBTyxLQUFLQyxRQUFaO0FBQ0EsYUFBTyxLQUFLQyxNQUFaO0FBQ0EsYUFBTyxLQUFLQyxPQUFaO0FBQ0EsYUFBTyxLQUFLQyxRQUFaOztBQUVBLGFBQU8sS0FBS0csS0FBWjtBQUNBLGFBQU8sS0FBS0MsS0FBWjtBQUNEOzs7NkJBRVE7QUFBQTs7QUFDUCxVQUFJRyxPQUFPLElBQVg7QUFDQSxVQUFJLENBQUMsS0FBS1IsT0FBTCxDQUFhUyxJQUFsQixFQUF3QjtBQUN0QixhQUFLVCxPQUFMLENBQWFTLElBQWIsR0FBb0IsY0FBcEI7QUFDRDtBQUNELFVBQUlDLE9BQU87QUFDVEMsWUFBSSxLQUFLZCxpQkFBTCxDQUF1QmUsSUFBdkIsR0FBOEIsUUFEekI7QUFFVEMsYUFBSyxLQUFLYixPQUFMLENBQWFTLElBRlQ7QUFHVEssY0FBTSxLQUFLZCxPQUFMLENBQWFjLElBQWIsQ0FBa0JDLE9BQWxCLENBQTBCLENBQTFCLENBSEc7QUFJVEMsaUJBQVMsQ0FBQyxpQkFBRCxDQUpBO0FBS1RDLGtCQUFVLG9CQUFXO0FBQ25CLGNBQUksS0FBS0MsUUFBTCxPQUFvQlYsS0FBS1IsT0FBTCxDQUFhUyxJQUFyQyxFQUEyQztBQUN6QyxtQkFBTyxVQUFQO0FBQ0Q7QUFDRCxpQkFBTyxFQUFQO0FBQ0Q7QUFWUSxPQUFYOztBQWFBLFVBQUlVLFNBQVMsQ0FBQyxNQUFELEVBQVMsT0FBVCxFQUFrQixPQUFsQixFQUEyQixPQUEzQixDQUFiO0FBQ0EsV0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlELE9BQU9FLE1BQTNCLEVBQW1DRCxHQUFuQyxFQUF3QztBQUN0QyxZQUFJRSxRQUFRSCxPQUFPQyxDQUFQLENBQVo7QUFDQVYsYUFBS00sT0FBTCxDQUFhTyxJQUFiLENBQWtCRCxRQUFRLFVBQTFCO0FBQ0FaLGFBQUtNLE9BQUwsQ0FBYU8sSUFBYixDQUFrQkQsUUFBUSxTQUExQjtBQUNBWixhQUFLTSxPQUFMLENBQWFPLElBQWIsQ0FBa0JELFFBQVEsWUFBMUI7QUFDRDs7QUFFRCxXQUFLaEIsR0FBTCxHQUFXa0IsRUFBRTlCLGFBQWFnQixJQUFiLENBQUYsQ0FBWDtBQUNBLFdBQUtMLEtBQUwsR0FBYSxLQUFLQyxHQUFMLENBQVNtQixJQUFULENBQWMsNEJBQWQsQ0FBYjtBQUNBLFdBQUtwQixLQUFMLENBQVdxQixRQUFYLENBQW9CLFVBQUNDLENBQUQsRUFBTztBQUN6QixZQUFJQSxFQUFFQyxRQUFGLEtBQWUsRUFBbkIsRUFBdUI7QUFDckI7QUFDQUQsWUFBRUUsY0FBRjtBQUNBLGdCQUFLeEIsS0FBTCxDQUFXeUIsSUFBWDtBQUNBLGdCQUFLQyxhQUFMLENBQW1CLE1BQUsxQixLQUFMLENBQVcyQixJQUFYLEVBQW5CO0FBQ0Q7QUFDRixPQVBEOztBQVNBLFdBQUszQixLQUFMLENBQVc0QixFQUFYLENBQWMsT0FBZCxFQUF1QjtBQUFBLGVBQU1DLFNBQVNDLFdBQVQsQ0FBcUIsV0FBckIsRUFBa0MsS0FBbEMsRUFBeUMsSUFBekMsQ0FBTjtBQUFBLE9BQXZCO0FBQ0EsV0FBSzdCLEdBQUwsQ0FBU21CLElBQVQsQ0FBYyxRQUFkLEVBQXdCVyxNQUF4QixDQUErQixLQUFLbEMsUUFBcEM7QUFDRDs7O2tDQUVhWSxJLEVBQU07QUFDbEIsVUFBSXVCLFFBQVFDLFdBQVd4QixJQUFYLENBQVo7QUFDQSxVQUFJeUIsTUFBTUYsS0FBTixDQUFKLEVBQWtCO0FBQ2hCQSxnQkFBUSxLQUFLckMsT0FBTCxDQUFhYyxJQUFyQjtBQUNEO0FBQ0QsV0FBS1QsS0FBTCxDQUFXMkIsSUFBWCxDQUFnQkssS0FBaEI7QUFDQSxXQUFLckMsT0FBTCxDQUFhYyxJQUFiLEdBQW9CdUIsS0FBcEI7QUFDQSxXQUFLbkMsUUFBTDtBQUNEOzs7K0JBRVU7QUFDVCxVQUFJTyxPQUFPLEtBQUtILEdBQUwsQ0FBU21CLElBQVQsQ0FBYyxRQUFkLEVBQXdCWixHQUF4QixFQUFYO0FBQ0EsV0FBS2IsT0FBTCxDQUFhUyxJQUFiLEdBQW9CQSxJQUFwQjtBQUNBLFdBQUtWLE1BQUwsQ0FBWXlDLFdBQVosQ0FBd0JDLFFBQXhCO0FBQ0EsV0FBSzNDLFFBQUwsQ0FBYzRDLFFBQWQsR0FBeUIsSUFBekI7QUFDQSxXQUFLekMsUUFBTCxDQUFjeUMsUUFBZCxHQUF5QixJQUF6QjtBQUNEOzs7NkJBRVE7QUFDUDtBQUNBLFdBQUtyQyxLQUFMLENBQVdzQyxJQUFYLENBQWdCLEtBQUszQyxPQUFMLENBQWFjLElBQWIsQ0FBa0JDLE9BQWxCLENBQTBCLENBQTFCLENBQWhCO0FBQ0Q7Ozs7OztrQkE1RmtCbkIsYSIsImZpbGUiOiIzMC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnanF1ZXJ5JztcblxubGV0IHRwbF9wcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9wcm9wZXJ0eVR3ZWVuLnRwbC5odG1sJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb3BlcnR5VHdlZW4ge1xuICAvLyBpbnN0YW5jZV9wcm9wZXJ0eTogVGhlIGN1cnJlbnQgcHJvcGVydHkgb24gdGhlIGRhdGEgb2JqZWN0LlxuICAvLyBsaW5lRGF0YTogVGhlIGxpbmUgZGF0YSBvYmplY3QuXG4gIGNvbnN0cnVjdG9yKGluc3RhbmNlX3Byb3BlcnR5LCBsaW5lRGF0YSwgZWRpdG9yLCBrZXlfdmFsID0gZmFsc2UsIHRpbWVsaW5lID0gZmFsc2UpIHtcbiAgICB0aGlzLmluc3RhbmNlX3Byb3BlcnR5ID0gaW5zdGFuY2VfcHJvcGVydHk7XG4gICAgdGhpcy5saW5lRGF0YSA9IGxpbmVEYXRhO1xuICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgIHRoaXMua2V5X3ZhbCA9IGtleV92YWw7XG4gICAgdGhpcy50aW1lbGluZSA9IHRpbWVsaW5lO1xuXG4gICAgdGhpcy5vbkNoYW5nZSA9IHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKTtcblxuICAgIHRoaXMudGltZXIgPSB0aGlzLmVkaXRvci50aW1lcjtcbiAgICB0aGlzLiR0aW1lID0gZmFsc2U7XG4gICAgdGhpcy4kZWwgPSBmYWxzZTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGRlbGV0ZSB0aGlzLiRlbDtcbiAgICBkZWxldGUgdGhpcy5pbnN0YW5jZV9wcm9wZXJ0eTtcbiAgICBkZWxldGUgdGhpcy5saW5lRGF0YTtcbiAgICBkZWxldGUgdGhpcy5lZGl0b3I7XG4gICAgZGVsZXRlIHRoaXMua2V5X3ZhbDtcbiAgICBkZWxldGUgdGhpcy50aW1lbGluZTtcblxuICAgIGRlbGV0ZSB0aGlzLnRpbWVyO1xuICAgIGRlbGV0ZSB0aGlzLiR0aW1lO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoIXRoaXMua2V5X3ZhbC5lYXNlKSB7XG4gICAgICB0aGlzLmtleV92YWwuZWFzZSA9ICdRdWFkLmVhc2VPdXQnO1xuICAgIH1cbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIGlkOiB0aGlzLmluc3RhbmNlX3Byb3BlcnR5Lm5hbWUgKyAnX3R3ZWVuJyxcbiAgICAgIHZhbDogdGhpcy5rZXlfdmFsLmVhc2UsXG4gICAgICB0aW1lOiB0aGlzLmtleV92YWwudGltZS50b0ZpeGVkKDMpLFxuICAgICAgb3B0aW9uczogWydMaW5lYXIuZWFzZU5vbmUnXSxcbiAgICAgIHNlbGVjdGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMudG9TdHJpbmcoKSA9PT0gc2VsZi5rZXlfdmFsLmVhc2UpIHtcbiAgICAgICAgICByZXR1cm4gJ3NlbGVjdGVkJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciB0d2VlbnMgPSBbJ1F1YWQnLCAnQ3ViaWMnLCAnUXVhcnQnLCAnUXVpbnQnXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHR3ZWVucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHR3ZWVuID0gdHdlZW5zW2ldO1xuICAgICAgZGF0YS5vcHRpb25zLnB1c2godHdlZW4gKyAnLmVhc2VPdXQnKTtcbiAgICAgIGRhdGEub3B0aW9ucy5wdXNoKHR3ZWVuICsgJy5lYXNlSW4nKTtcbiAgICAgIGRhdGEub3B0aW9ucy5wdXNoKHR3ZWVuICsgJy5lYXNlSW5PdXQnKTtcbiAgICB9XG5cbiAgICB0aGlzLiRlbCA9ICQodHBsX3Byb3BlcnR5KGRhdGEpKTtcbiAgICB0aGlzLiR0aW1lID0gdGhpcy4kZWwuZmluZCgnLnByb3BlcnR5X19rZXktdGltZSBzdHJvbmcnKTtcbiAgICB0aGlzLiR0aW1lLmtleXByZXNzKChlKSA9PiB7XG4gICAgICBpZiAoZS5jaGFyQ29kZSA9PT0gMTMpIHtcbiAgICAgICAgLy8gRW50ZXJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLiR0aW1lLmJsdXIoKTtcbiAgICAgICAgdGhpcy51cGRhdGVLZXlUaW1lKHRoaXMuJHRpbWUudGV4dCgpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuJHRpbWUub24oJ2NsaWNrJywgKCkgPT4gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ3NlbGVjdEFsbCcsIGZhbHNlLCBudWxsKSk7XG4gICAgdGhpcy4kZWwuZmluZCgnc2VsZWN0JykuY2hhbmdlKHRoaXMub25DaGFuZ2UpO1xuICB9XG5cbiAgdXBkYXRlS2V5VGltZSh0aW1lKSB7XG4gICAgbGV0IHRpbWUyID0gcGFyc2VGbG9hdCh0aW1lKTtcbiAgICBpZiAoaXNOYU4odGltZTIpKSB7XG4gICAgICB0aW1lMiA9IHRoaXMua2V5X3ZhbC50aW1lO1xuICAgIH1cbiAgICB0aGlzLiR0aW1lLnRleHQodGltZTIpO1xuICAgIHRoaXMua2V5X3ZhbC50aW1lID0gdGltZTI7XG4gICAgdGhpcy5vbkNoYW5nZSgpO1xuICB9XG5cbiAgb25DaGFuZ2UoKSB7XG4gICAgdmFyIGVhc2UgPSB0aGlzLiRlbC5maW5kKCdzZWxlY3QnKS52YWwoKTtcbiAgICB0aGlzLmtleV92YWwuZWFzZSA9IGVhc2U7XG4gICAgdGhpcy5lZGl0b3IudW5kb01hbmFnZXIuYWRkU3RhdGUoKTtcbiAgICB0aGlzLmxpbmVEYXRhLl9pc0RpcnR5ID0gdHJ1ZTtcbiAgICB0aGlzLnRpbWVsaW5lLl9pc0RpcnR5ID0gdHJ1ZTtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICAvLyB0b2RvOiB1c2UgbXVzdGFjaGUgaW5zdGVhZC4uLlxuICAgIHRoaXMuJHRpbWUuaHRtbCh0aGlzLmtleV92YWwudGltZS50b0ZpeGVkKDMpKTtcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9lZGl0b3IvUHJvcGVydHlUd2Vlbi5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");
=======
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	__webpack_require__(22);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var tpl_property = __webpack_require__(35);
	
	var PropertyTween = function () {
	  // instance_property: The current property on the data object.
	  // lineData: The line data object.
	
	  function PropertyTween(instance_property, lineData, editor) {
	    var key_val = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
	    var timeline = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
	
	    _classCallCheck(this, PropertyTween);
	
	    this.instance_property = instance_property;
	    this.lineData = lineData;
	    this.editor = editor;
	    this.key_val = key_val;
	    this.timeline = timeline;
	
	    this.onChange = this.onChange.bind(this);
	
	    this.timer = this.editor.timer;
	    this.$el = false;
	    this.render();
	  }
	
	  _createClass(PropertyTween, [{
	    key: 'remove',
	    value: function remove() {
	      delete this.$el;
	      delete this.instance_property;
	      delete this.lineData;
	      delete this.editor;
	      delete this.key_val;
	      delete this.timeline;
	
	      delete this.timer;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var self = this;
	      if (!this.key_val.ease) {
	        this.key_val.ease = 'Quad.easeOut';
	      }
	      var data = {
	        id: this.instance_property.name + '_tween',
	        val: this.key_val.ease,
	        options: ['Linear.easeNone'],
	        selected: function selected() {
	          if (this.toString() === self.key_val.ease) {
	            return 'selected';
	          }
	          return '';
	        }
	      };
	
	      var tweens = ['Quad', 'Cubic', 'Quart', 'Quint'];
	      for (var i = 0; i < tweens.length; i++) {
	        var tween = tweens[i];
	        data.options.push(tween + '.easeOut');
	        data.options.push(tween + '.easeIn');
	        data.options.push(tween + '.easeInOut');
	      }
	
	      this.$el = $(tpl_property(data));
	      this.$el.find('select').change(this.onChange);
	    }
	  }, {
	    key: 'onChange',
	    value: function onChange() {
	      var ease = this.$el.find('select').val();
	      this.key_val.ease = ease;
	      this.editor.undoManager.addState();
	      this.lineData._isDirty = true;
	      this.timeline._isDirty = true;
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      console.log('PropertyTween\'s upload method is not yet implemented.');
	    }
	  }]);
	
	  return PropertyTween;
	}();
	
	exports.default = PropertyTween;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var H = __webpack_require__(28);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"property property--tween\">");t.b("\n" + i);t.b("  <label for=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"property__label\">easing</label>");t.b("\n" + i);t.b("  <div class=\"property__select\">");t.b("\n" + i);t.b("    <div class=\"custom-select\">");t.b("\n" + i);t.b("      <select id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\">");t.b("\n" + i);if(t.s(t.f("options",c,p,1),c,p,0,212,279,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("        <option value=\"");t.b(t.v(t.d(".",c,p,0)));t.b("\" ");t.b(t.v(t.f("selected",c,p,0)));t.b(">");t.b(t.v(t.d(".",c,p,0)));t.b("</option>");t.b("\n" + i);});c.pop();}t.b("      </select>");t.b("\n" + i);t.b("    </div>");t.b("\n" + i);t.b("  </div>");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<div class=\"property property--tween\">\n  <label for=\"{{id}}\" class=\"property__label\">easing</label>\n  <div class=\"property__select\">\n    <div class=\"custom-select\">\n      <select id=\"{{id}}\">\n        {{#options}}\n        <option value=\"{{.}}\" {{selected}}>{{.}}</option>\n        {{/options}}\n      </select>\n    </div>\n  </div>\n</div>\n", H); return T.render.apply(T, arguments); };

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	__webpack_require__(22);
	
	var _PropertyBase2 = __webpack_require__(25);
	
	var _PropertyBase3 = _interopRequireDefault(_PropertyBase2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var tpl_property = __webpack_require__(37);
	
	var PropertyEvent = function (_PropertyBase) {
	  _inherits(PropertyEvent, _PropertyBase);
	
	  // instance_property: The current property on the data object.
	  // lineData: The line data object.
	
	  function PropertyEvent(instance_property, lineData, editor) {
	    var key_val = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
	
	    _classCallCheck(this, PropertyEvent);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PropertyEvent).call(this, instance_property, lineData, editor, key_val));
	
	    _this.onInputChange = _this.onInputChange.bind(_this);
	    _this.$input = _this.$el.find('input');
	    return _this;
	  }
	
	  _createClass(PropertyEvent, [{
	    key: 'render',
	    value: function render() {
	      _get(Object.getPrototypeOf(PropertyEvent.prototype), 'render', this).call(this);
	
	      var val = this.getCurrentVal();
	
	      var data = {
	        id: this.instance_property.name, // "circleRadius" instead of "circle radius"
	        label: this.instance_property.label || this.instance_property.name,
	        val: val
	      };
	
	      var view = tpl_property(data);
	      this.$el = $(view);
	
	      var $input = this.$el.find('input');
	
	      $input.change(this.onInputChange);
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      _get(Object.getPrototypeOf(PropertyEvent.prototype), 'remove', this).call(this);
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      _get(Object.getPrototypeOf(PropertyEvent.prototype), 'update', this).call(this);
	      var val = this.getCurrentVal();
	      this.$input.val(val);
	    }
	  }]);
	
	  return PropertyEvent;
	}(_PropertyBase3.default);
	
	exports.default = PropertyEvent;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var H = __webpack_require__(28);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"property property--number\">");t.b("\n" + i);t.b("  <button class=\"property__key\"></button>");t.b("\n" + i);t.b("  <label for=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"property__label\">");t.b(t.v(t.f("label",c,p,0)));t.b("</label>");t.b("\n" + i);t.b("  <input type=\"text\" id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"property__input\" value=\"");t.b(t.v(t.f("val",c,p,0)));t.b("\" />");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<div class=\"property property--number\">\n  <button class=\"property__key\"></button>\n  <label for=\"{{id}}\" class=\"property__label\">{{label}}</label>\n  <input type=\"text\" id=\"{{id}}\" class=\"property__input\" value=\"{{val}}\" />\n</div>\n", H); return T.render.apply(T, arguments); };

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	__webpack_require__(22);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var tpl_property = __webpack_require__(39);
	
	var PropertyFooter = function () {
	  // instance_property: The current property on the data object.
	  // lineData: The line data object.
	
	  function PropertyFooter(instance_property, lineData, editor) {
	    var key_val = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
	    var timeline = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
	
	    _classCallCheck(this, PropertyFooter);
	
	    this.instance_property = instance_property;
	    this.lineData = lineData;
	    this.editor = editor;
	    this.key_val = key_val;
	    this.timeline = timeline;
	
	    this.timer = this.editor.timer;
	    this.$time = false;
	    this.$el = false;
	    this.render();
	  }
	
	  _createClass(PropertyFooter, [{
	    key: 'remove',
	    value: function remove() {
	      delete this.$el;
	      delete this.instance_property;
	      delete this.lineData;
	      delete this.editor;
	      delete this.key_val;
	      delete this.timeline;
	
	      delete this.timer;
	      delete this.$time;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this = this;
	
	      var data = {
	        time: this.key_val.time.toFixed(3)
	      };
	
	      this.$el = $(tpl_property(data));
	      this.$time = this.$el.find('.property__key-time strong');
	      this.$time.keypress(function (e) {
	        if (e.charCode === 13) {
	          // Enter
	          e.preventDefault();
	          _this.$time.blur();
	          _this.updateKeyTime(_this.$time.text());
	        }
	      });
	
	      this.$time.on('click', function () {
	        return document.execCommand('selectAll', false, null);
	      });
	    }
	  }, {
	    key: 'updateKeyTime',
	    value: function updateKeyTime(time) {
	      var time2 = parseFloat(time);
	      if (isNaN(time2)) {
	        time2 = this.key_val.time;
	      }
	      this.$time.text(time2);
	      this.key_val.time = time2;
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      // todo: use mustache instead...
	      this.$time.html(this.key_val.time.toFixed(3));
	    }
	  }]);
	
	  return PropertyFooter;
	}();
	
	exports.default = PropertyFooter;
>>>>>>> master

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("var H = __webpack_require__(24);\nmodule.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||\"\");t.b(\"<div class=\\\"property property--tween\\\">\");t.b(\"\\n\" + i);t.b(\"  <label for=\\\"\");t.b(t.v(t.f(\"id\",c,p,0)));t.b(\"\\\" class=\\\"property__label\\\">easing</label>\");t.b(\"\\n\" + i);t.b(\"  <div class=\\\"property__select\\\">\");t.b(\"\\n\" + i);t.b(\"    <div class=\\\"custom-select\\\">\");t.b(\"\\n\" + i);t.b(\"      <select id=\\\"\");t.b(t.v(t.f(\"id\",c,p,0)));t.b(\"\\\">\");t.b(\"\\n\" + i);if(t.s(t.f(\"options\",c,p,1),c,p,0,212,279,\"{{ }}\")){t.rs(c,p,function(c,p,t){t.b(\"        <option value=\\\"\");t.b(t.v(t.d(\".\",c,p,0)));t.b(\"\\\" \");t.b(t.v(t.f(\"selected\",c,p,0)));t.b(\">\");t.b(t.v(t.d(\".\",c,p,0)));t.b(\"</option>\");t.b(\"\\n\" + i);});c.pop();}t.b(\"      </select>\");t.b(\"\\n\" + i);t.b(\"    </div>\");t.b(\"\\n\" + i);t.b(\"  </div>\");t.b(\"\\n\" + i);t.b(\"</div>\");t.b(\"\\n\" + i);t.b(\"<div class=\\\"properties-editor__actions actions\\\">\");t.b(\"\\n\" + i);t.b(\"  <span class=\\\"property__key-time\\\">key at <strong class=\\\"property__key-input\\\" contenteditable=\\\"true\\\">\");t.b(t.v(t.f(\"time\",c,p,0)));t.b(\"</strong> seconds</span>\");t.b(\"\\n\" + i);t.b(\"  <a href=\\\"#\\\" class=\\\"actions__item\\\" data-action-remove>Remove key</a>\");t.b(\"\\n\" + i);t.b(\"</div>\");return t.fl(); },partials: {}, subs: {  }}, \"<div class=\\\"property property--tween\\\">\\n  <label for=\\\"{{id}}\\\" class=\\\"property__label\\\">easing</label>\\n  <div class=\\\"property__select\\\">\\n    <div class=\\\"custom-select\\\">\\n      <select id=\\\"{{id}}\\\">\\n        {{#options}}\\n        <option value=\\\"{{.}}\\\" {{selected}}>{{.}}</option>\\n        {{/options}}\\n      </select>\\n    </div>\\n  </div>\\n</div>\\n<div class=\\\"properties-editor__actions actions\\\">\\n  <span class=\\\"property__key-time\\\">key at <strong class=\\\"property__key-input\\\" contenteditable=\\\"true\\\">{{time}}</strong> seconds</span>\\n  <a href=\\\"#\\\" class=\\\"actions__item\\\" data-action-remove>Remove key</a>\\n</div>\", H); return T.render.apply(T, arguments); };//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi90ZW1wbGF0ZXMvcHJvcGVydHlUd2Vlbi50cGwuaHRtbD8wODA3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0EsNkJBQTZCLHlCQUF5Qix3QkFBd0IsWUFBWSxhQUFhLGdEQUFnRCxjQUFjLHVCQUF1QiwwQkFBMEIsbURBQW1ELGNBQWMsMENBQTBDLGNBQWMseUNBQXlDLGNBQWMsMkJBQTJCLDBCQUEwQixXQUFXLGNBQWMsNkNBQTZDLEdBQUcsSUFBSSx5QkFBeUIsZ0NBQWdDLHlCQUF5QixXQUFXLGdDQUFnQyxTQUFTLHlCQUF5QixpQkFBaUIsZUFBZSxFQUFFLFNBQVMsdUJBQXVCLGNBQWMsa0JBQWtCLGNBQWMsZ0JBQWdCLGNBQWMsY0FBYyxjQUFjLDBEQUEwRCxjQUFjLG1IQUFtSCw0QkFBNEIsZ0NBQWdDLGNBQWMsaUZBQWlGLGNBQWMsY0FBYyxjQUFjLEVBQUUsYUFBYSxTQUFTLElBQUksOERBQThELElBQUkseUlBQXlJLElBQUksZUFBZSxVQUFVLDRCQUE0QixHQUFHLEtBQUssVUFBVSxHQUFHLEdBQUcscUJBQXFCLFVBQVUsa05BQWtOLE1BQU0saUhBQWlILHFDQUFxQyIsImZpbGUiOiIzMS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBIID0gcmVxdWlyZShcImhvZ2FuLmpzXCIpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHsgdmFyIFQgPSBuZXcgSC5UZW1wbGF0ZSh7Y29kZTogZnVuY3Rpb24gKGMscCxpKSB7IHZhciB0PXRoaXM7dC5iKGk9aXx8XCJcIik7dC5iKFwiPGRpdiBjbGFzcz1cXFwicHJvcGVydHkgcHJvcGVydHktLXR3ZWVuXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDxsYWJlbCBmb3I9XFxcIlwiKTt0LmIodC52KHQuZihcImlkXCIsYyxwLDApKSk7dC5iKFwiXFxcIiBjbGFzcz1cXFwicHJvcGVydHlfX2xhYmVsXFxcIj5lYXNpbmc8L2xhYmVsPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPGRpdiBjbGFzcz1cXFwicHJvcGVydHlfX3NlbGVjdFxcXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIDxkaXYgY2xhc3M9XFxcImN1c3RvbS1zZWxlY3RcXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDxzZWxlY3QgaWQ9XFxcIlwiKTt0LmIodC52KHQuZihcImlkXCIsYyxwLDApKSk7dC5iKFwiXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTtpZih0LnModC5mKFwib3B0aW9uc1wiLGMscCwxKSxjLHAsMCwyMTIsMjc5LFwie3sgfX1cIikpe3QucnMoYyxwLGZ1bmN0aW9uKGMscCx0KXt0LmIoXCIgICAgICAgIDxvcHRpb24gdmFsdWU9XFxcIlwiKTt0LmIodC52KHQuZChcIi5cIixjLHAsMCkpKTt0LmIoXCJcXFwiIFwiKTt0LmIodC52KHQuZihcInNlbGVjdGVkXCIsYyxwLDApKSk7dC5iKFwiPlwiKTt0LmIodC52KHQuZChcIi5cIixjLHAsMCkpKTt0LmIoXCI8L29wdGlvbj5cIik7dC5iKFwiXFxuXCIgKyBpKTt9KTtjLnBvcCgpO310LmIoXCIgICAgICA8L3NlbGVjdD5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8L2Rpdj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8L2Rpdj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8ZGl2IGNsYXNzPVxcXCJwcm9wZXJ0aWVzLWVkaXRvcl9fYWN0aW9ucyBhY3Rpb25zXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDxzcGFuIGNsYXNzPVxcXCJwcm9wZXJ0eV9fa2V5LXRpbWVcXFwiPmtleSBhdCA8c3Ryb25nIGNsYXNzPVxcXCJwcm9wZXJ0eV9fa2V5LWlucHV0XFxcIiBjb250ZW50ZWRpdGFibGU9XFxcInRydWVcXFwiPlwiKTt0LmIodC52KHQuZihcInRpbWVcIixjLHAsMCkpKTt0LmIoXCI8L3N0cm9uZz4gc2Vjb25kczwvc3Bhbj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJhY3Rpb25zX19pdGVtXFxcIiBkYXRhLWFjdGlvbi1yZW1vdmU+UmVtb3ZlIGtleTwvYT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8L2Rpdj5cIik7cmV0dXJuIHQuZmwoKTsgfSxwYXJ0aWFsczoge30sIHN1YnM6IHsgIH19LCBcIjxkaXYgY2xhc3M9XFxcInByb3BlcnR5IHByb3BlcnR5LS10d2VlblxcXCI+XFxuICA8bGFiZWwgZm9yPVxcXCJ7e2lkfX1cXFwiIGNsYXNzPVxcXCJwcm9wZXJ0eV9fbGFiZWxcXFwiPmVhc2luZzwvbGFiZWw+XFxuICA8ZGl2IGNsYXNzPVxcXCJwcm9wZXJ0eV9fc2VsZWN0XFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiY3VzdG9tLXNlbGVjdFxcXCI+XFxuICAgICAgPHNlbGVjdCBpZD1cXFwie3tpZH19XFxcIj5cXG4gICAgICAgIHt7I29wdGlvbnN9fVxcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cXFwie3sufX1cXFwiIHt7c2VsZWN0ZWR9fT57ey59fTwvb3B0aW9uPlxcbiAgICAgICAge3svb3B0aW9uc319XFxuICAgICAgPC9zZWxlY3Q+XFxuICAgIDwvZGl2PlxcbiAgPC9kaXY+XFxuPC9kaXY+XFxuPGRpdiBjbGFzcz1cXFwicHJvcGVydGllcy1lZGl0b3JfX2FjdGlvbnMgYWN0aW9uc1xcXCI+XFxuICA8c3BhbiBjbGFzcz1cXFwicHJvcGVydHlfX2tleS10aW1lXFxcIj5rZXkgYXQgPHN0cm9uZyBjbGFzcz1cXFwicHJvcGVydHlfX2tleS1pbnB1dFxcXCIgY29udGVudGVkaXRhYmxlPVxcXCJ0cnVlXFxcIj57e3RpbWV9fTwvc3Ryb25nPiBzZWNvbmRzPC9zcGFuPlxcbiAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImFjdGlvbnNfX2l0ZW1cXFwiIGRhdGEtYWN0aW9uLXJlbW92ZT5SZW1vdmUga2V5PC9hPlxcbjwvZGl2PlwiLCBIKTsgcmV0dXJuIFQucmVuZGVyLmFwcGx5KFQsIGFyZ3VtZW50cyk7IH07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3RlbXBsYXRlcy9wcm9wZXJ0eVR3ZWVuLnRwbC5odG1sXG4gKiogbW9kdWxlIGlkID0gMzFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");
=======
	var H = __webpack_require__(28);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"properties-editor__actions actions\">");t.b("\n" + i);t.b("  <span class=\"property__key-time\">key at <strong class=\"property__key-input\" contenteditable=\"true\">");t.b(t.v(t.f("time",c,p,0)));t.b("</strong> seconds</span>");t.b("\n" + i);t.b("  <a href=\"#\" class=\"actions__item\" data-action-remove>Remove key</a>");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<div class=\"properties-editor__actions actions\">\n  <span class=\"property__key-time\">key at <strong class=\"property__key-input\" contenteditable=\"true\">{{time}}</strong> seconds</span>\n  <a href=\"#\" class=\"actions__item\" data-action-remove>Remove key</a>\n</div>\n", H); return T.render.apply(T, arguments); };
>>>>>>> master

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("var H = __webpack_require__(24);\nmodule.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||\"\");t.b(\"<div class=\\\"properties-editor\\\">\");t.b(\"\\n\" + i);t.b(\"  <a href=\\\"#\\\" class=\\\"menu-item menu-item--toggle-side\\\" data-action=\\\"toggle\\\"><i class=\\\"icon-toggle\\\"></i></a>\");t.b(\"\\n\" + i);t.b(\"  <div class=\\\"properties-editor__main\\\"></div>\");t.b(\"\\n\" + i);t.b(\"</div>\");t.b(\"\\n\");return t.fl(); },partials: {}, subs: {  }}, \"<div class=\\\"properties-editor\\\">\\n  <a href=\\\"#\\\" class=\\\"menu-item menu-item--toggle-side\\\" data-action=\\\"toggle\\\"><i class=\\\"icon-toggle\\\"></i></a>\\n  <div class=\\\"properties-editor__main\\\"></div>\\n</div>\\n\", H); return T.render.apply(T, arguments); };//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi90ZW1wbGF0ZXMvcHJvcGVydGllc0VkaXRvci50cGwuaHRtbD80NGMxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0EsNkJBQTZCLHlCQUF5Qix3QkFBd0IsWUFBWSxhQUFhLHlDQUF5QyxjQUFjLDJIQUEySCxjQUFjLHVEQUF1RCxjQUFjLGNBQWMsVUFBVSxjQUFjLEVBQUUsYUFBYSxTQUFTLElBQUksME5BQTBOLHFDQUFxQyIsImZpbGUiOiIzMi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBIID0gcmVxdWlyZShcImhvZ2FuLmpzXCIpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHsgdmFyIFQgPSBuZXcgSC5UZW1wbGF0ZSh7Y29kZTogZnVuY3Rpb24gKGMscCxpKSB7IHZhciB0PXRoaXM7dC5iKGk9aXx8XCJcIik7dC5iKFwiPGRpdiBjbGFzcz1cXFwicHJvcGVydGllcy1lZGl0b3JcXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcIm1lbnUtaXRlbSBtZW51LWl0ZW0tLXRvZ2dsZS1zaWRlXFxcIiBkYXRhLWFjdGlvbj1cXFwidG9nZ2xlXFxcIj48aSBjbGFzcz1cXFwiaWNvbi10b2dnbGVcXFwiPjwvaT48L2E+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8ZGl2IGNsYXNzPVxcXCJwcm9wZXJ0aWVzLWVkaXRvcl9fbWFpblxcXCI+PC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPC9kaXY+XCIpO3QuYihcIlxcblwiKTtyZXR1cm4gdC5mbCgpOyB9LHBhcnRpYWxzOiB7fSwgc3ViczogeyAgfX0sIFwiPGRpdiBjbGFzcz1cXFwicHJvcGVydGllcy1lZGl0b3JcXFwiPlxcbiAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcIm1lbnUtaXRlbSBtZW51LWl0ZW0tLXRvZ2dsZS1zaWRlXFxcIiBkYXRhLWFjdGlvbj1cXFwidG9nZ2xlXFxcIj48aSBjbGFzcz1cXFwiaWNvbi10b2dnbGVcXFwiPjwvaT48L2E+XFxuICA8ZGl2IGNsYXNzPVxcXCJwcm9wZXJ0aWVzLWVkaXRvcl9fbWFpblxcXCI+PC9kaXY+XFxuPC9kaXY+XFxuXCIsIEgpOyByZXR1cm4gVC5yZW5kZXIuYXBwbHkoVCwgYXJndW1lbnRzKTsgfTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdGVtcGxhdGVzL3Byb3BlcnRpZXNFZGl0b3IudHBsLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAzMlxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");
=======
	var H = __webpack_require__(28);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"properties-editor\">");t.b("\n" + i);t.b("  <a href=\"#\" class=\"menu-item menu-item--toggle-side\" data-action=\"toggle\"><i class=\"icon-toggle\"></i></a>");t.b("\n" + i);t.b("  <div class=\"properties-editor__main\"></div>");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<div class=\"properties-editor\">\n  <a href=\"#\" class=\"menu-item menu-item--toggle-side\" data-action=\"toggle\"><i class=\"icon-toggle\"></i></a>\n  <div class=\"properties-editor__main\"></div>\n</div>\n", H); return T.render.apply(T, arguments); };
>>>>>>> master

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar saveAs = __webpack_require__(34).saveAs || __webpack_require__(34);\n\nvar EditorMenu = function () {\n  function EditorMenu(tweenTime, $timeline, editor) {\n    _classCallCheck(this, EditorMenu);\n\n    this.tweenTime = tweenTime;\n    this.$timeline = $timeline;\n    this.editor = editor;\n    this.timer = this.tweenTime.timer;\n    this.initExport();\n    this.initToggle();\n  }\n\n  _createClass(EditorMenu, [{\n    key: 'initToggle',\n    value: function initToggle() {\n      var parentElement = this.editor.el;\n      var timelineClosed = false;\n      var $toggleLink = this.$timeline.find('[data-action=\"toggle\"]');\n      $toggleLink.click(function (e) {\n        e.preventDefault();\n        timelineClosed = !timelineClosed;\n        $toggleLink.toggleClass('menu-item--toggle-up', timelineClosed);\n        parentElement.toggleClass('timeline-is-closed', timelineClosed);\n        return window.dispatchEvent(new Event('resize'));\n      });\n      var $toggleLinkSide = $('.properties-editor', parentElement).find('[data-action=\"toggle\"]');\n      $toggleLinkSide.click(function (e) {\n        var propertiesClosed;\n        e.preventDefault();\n        propertiesClosed = !parentElement.hasClass('properties-is-closed');\n        parentElement.toggleClass('properties-is-closed', propertiesClosed);\n        return window.dispatchEvent(new Event('resize'));\n      });\n    }\n  }, {\n    key: 'initExport',\n    value: function initExport() {\n      var exporter = this.editor.exporter;\n      this.$timeline.find('[data-action=\"export\"]').click(function (e) {\n        e.preventDefault();\n        var data = exporter.getJSON();\n        var blob = new Blob([data], {\n          type: 'text/json;charset=utf-8'\n        });\n        saveAs(blob, 'data.json');\n      });\n    }\n  }]);\n\n  return EditorMenu;\n}();\n\nexports.default = EditorMenu;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lZGl0b3IvRWRpdG9yTWVudS5qcz81MDU5Il0sIm5hbWVzIjpbInNhdmVBcyIsInJlcXVpcmUiLCJFZGl0b3JNZW51IiwidHdlZW5UaW1lIiwiJHRpbWVsaW5lIiwiZWRpdG9yIiwidGltZXIiLCJpbml0RXhwb3J0IiwiaW5pdFRvZ2dsZSIsInBhcmVudEVsZW1lbnQiLCJlbCIsInRpbWVsaW5lQ2xvc2VkIiwiJHRvZ2dsZUxpbmsiLCJmaW5kIiwiY2xpY2siLCJlIiwicHJldmVudERlZmF1bHQiLCJ0b2dnbGVDbGFzcyIsIndpbmRvdyIsImRpc3BhdGNoRXZlbnQiLCJFdmVudCIsIiR0b2dnbGVMaW5rU2lkZSIsIiQiLCJwcm9wZXJ0aWVzQ2xvc2VkIiwiaGFzQ2xhc3MiLCJleHBvcnRlciIsImRhdGEiLCJnZXRKU09OIiwiYmxvYiIsIkJsb2IiLCJ0eXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBSUEsU0FBUyxtQkFBQUMsQ0FBUSxFQUFSLEVBQXNCRCxNQUF0QixJQUFnQyxtQkFBQUMsQ0FBUSxFQUFSLENBQTdDOztJQUVxQkMsVTtBQUNuQixzQkFBWUMsU0FBWixFQUF1QkMsU0FBdkIsRUFBa0NDLE1BQWxDLEVBQTBDO0FBQUE7O0FBQ3hDLFNBQUtGLFNBQUwsR0FBaUJBLFNBQWpCO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxTQUFLQyxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxTQUFLQyxLQUFMLEdBQWEsS0FBS0gsU0FBTCxDQUFlRyxLQUE1QjtBQUNBLFNBQUtDLFVBQUw7QUFDQSxTQUFLQyxVQUFMO0FBQ0Q7Ozs7aUNBRVk7QUFDWCxVQUFJQyxnQkFBZ0IsS0FBS0osTUFBTCxDQUFZSyxFQUFoQztBQUNBLFVBQUlDLGlCQUFpQixLQUFyQjtBQUNBLFVBQUlDLGNBQWMsS0FBS1IsU0FBTCxDQUFlUyxJQUFmLENBQW9CLHdCQUFwQixDQUFsQjtBQUNBRCxrQkFBWUUsS0FBWixDQUFrQixVQUFDQyxDQUFELEVBQU87QUFDdkJBLFVBQUVDLGNBQUY7QUFDQUwseUJBQWlCLENBQUNBLGNBQWxCO0FBQ0FDLG9CQUFZSyxXQUFaLENBQXdCLHNCQUF4QixFQUFnRE4sY0FBaEQ7QUFDQUYsc0JBQWNRLFdBQWQsQ0FBMEIsb0JBQTFCLEVBQWdETixjQUFoRDtBQUNBLGVBQU9PLE9BQU9DLGFBQVAsQ0FBcUIsSUFBSUMsS0FBSixDQUFVLFFBQVYsQ0FBckIsQ0FBUDtBQUNELE9BTkQ7QUFPQSxVQUFJQyxrQkFBa0JDLEVBQUUsb0JBQUYsRUFBd0JiLGFBQXhCLEVBQXVDSSxJQUF2QyxDQUE0Qyx3QkFBNUMsQ0FBdEI7QUFDQVEsc0JBQWdCUCxLQUFoQixDQUFzQixVQUFDQyxDQUFELEVBQU87QUFDM0IsWUFBSVEsZ0JBQUo7QUFDQVIsVUFBRUMsY0FBRjtBQUNBTywyQkFBbUIsQ0FBQ2QsY0FBY2UsUUFBZCxDQUF1QixzQkFBdkIsQ0FBcEI7QUFDQWYsc0JBQWNRLFdBQWQsQ0FBMEIsc0JBQTFCLEVBQWtETSxnQkFBbEQ7QUFDQSxlQUFPTCxPQUFPQyxhQUFQLENBQXFCLElBQUlDLEtBQUosQ0FBVSxRQUFWLENBQXJCLENBQVA7QUFDRCxPQU5EO0FBT0Q7OztpQ0FFWTtBQUNYLFVBQUlLLFdBQVcsS0FBS3BCLE1BQUwsQ0FBWW9CLFFBQTNCO0FBQ0EsV0FBS3JCLFNBQUwsQ0FBZVMsSUFBZixDQUFvQix3QkFBcEIsRUFBOENDLEtBQTlDLENBQW9ELFVBQVNDLENBQVQsRUFBWTtBQUM5REEsVUFBRUMsY0FBRjtBQUNBLFlBQUlVLE9BQU9ELFNBQVNFLE9BQVQsRUFBWDtBQUNBLFlBQUlDLE9BQU8sSUFBSUMsSUFBSixDQUFTLENBQUNILElBQUQsQ0FBVCxFQUFpQjtBQUMxQkksZ0JBQU07QUFEb0IsU0FBakIsQ0FBWDtBQUdBOUIsZUFBTzRCLElBQVAsRUFBYSxXQUFiO0FBQ0QsT0FQRDtBQVFEOzs7Ozs7a0JBekNrQjFCLFUiLCJmaWxlIjoiMzMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgc2F2ZUFzID0gcmVxdWlyZSgnZmlsZS1zYXZlcicpLnNhdmVBcyB8fCByZXF1aXJlKCdmaWxlLXNhdmVyJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRvck1lbnUge1xuICBjb25zdHJ1Y3Rvcih0d2VlblRpbWUsICR0aW1lbGluZSwgZWRpdG9yKSB7XG4gICAgdGhpcy50d2VlblRpbWUgPSB0d2VlblRpbWU7XG4gICAgdGhpcy4kdGltZWxpbmUgPSAkdGltZWxpbmU7XG4gICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XG4gICAgdGhpcy50aW1lciA9IHRoaXMudHdlZW5UaW1lLnRpbWVyO1xuICAgIHRoaXMuaW5pdEV4cG9ydCgpO1xuICAgIHRoaXMuaW5pdFRvZ2dsZSgpO1xuICB9XG5cbiAgaW5pdFRvZ2dsZSgpIHtcbiAgICB2YXIgcGFyZW50RWxlbWVudCA9IHRoaXMuZWRpdG9yLmVsO1xuICAgIHZhciB0aW1lbGluZUNsb3NlZCA9IGZhbHNlO1xuICAgIHZhciAkdG9nZ2xlTGluayA9IHRoaXMuJHRpbWVsaW5lLmZpbmQoJ1tkYXRhLWFjdGlvbj1cInRvZ2dsZVwiXScpO1xuICAgICR0b2dnbGVMaW5rLmNsaWNrKChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aW1lbGluZUNsb3NlZCA9ICF0aW1lbGluZUNsb3NlZDtcbiAgICAgICR0b2dnbGVMaW5rLnRvZ2dsZUNsYXNzKCdtZW51LWl0ZW0tLXRvZ2dsZS11cCcsIHRpbWVsaW5lQ2xvc2VkKTtcbiAgICAgIHBhcmVudEVsZW1lbnQudG9nZ2xlQ2xhc3MoJ3RpbWVsaW5lLWlzLWNsb3NlZCcsIHRpbWVsaW5lQ2xvc2VkKTtcbiAgICAgIHJldHVybiB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ3Jlc2l6ZScpKTtcbiAgICB9KTtcbiAgICB2YXIgJHRvZ2dsZUxpbmtTaWRlID0gJCgnLnByb3BlcnRpZXMtZWRpdG9yJywgcGFyZW50RWxlbWVudCkuZmluZCgnW2RhdGEtYWN0aW9uPVwidG9nZ2xlXCJdJyk7XG4gICAgJHRvZ2dsZUxpbmtTaWRlLmNsaWNrKChlKSA9PiB7XG4gICAgICB2YXIgcHJvcGVydGllc0Nsb3NlZDtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHByb3BlcnRpZXNDbG9zZWQgPSAhcGFyZW50RWxlbWVudC5oYXNDbGFzcygncHJvcGVydGllcy1pcy1jbG9zZWQnKTtcbiAgICAgIHBhcmVudEVsZW1lbnQudG9nZ2xlQ2xhc3MoJ3Byb3BlcnRpZXMtaXMtY2xvc2VkJywgcHJvcGVydGllc0Nsb3NlZCk7XG4gICAgICByZXR1cm4gd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdyZXNpemUnKSk7XG4gICAgfSk7XG4gIH1cblxuICBpbml0RXhwb3J0KCkge1xuICAgIHZhciBleHBvcnRlciA9IHRoaXMuZWRpdG9yLmV4cG9ydGVyO1xuICAgIHRoaXMuJHRpbWVsaW5lLmZpbmQoJ1tkYXRhLWFjdGlvbj1cImV4cG9ydFwiXScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciBkYXRhID0gZXhwb3J0ZXIuZ2V0SlNPTigpO1xuICAgICAgdmFyIGJsb2IgPSBuZXcgQmxvYihbZGF0YV0sIHtcbiAgICAgICAgdHlwZTogJ3RleHQvanNvbjtjaGFyc2V0PXV0Zi04J1xuICAgICAgfSk7XG4gICAgICBzYXZlQXMoYmxvYiwgJ2RhdGEuanNvbicpO1xuICAgIH0pO1xuICB9XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2VkaXRvci9FZGl0b3JNZW51LmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");
=======
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var saveAs = __webpack_require__(42).saveAs || __webpack_require__(42);
	
	var EditorMenu = function () {
	  function EditorMenu(tweenTime, $timeline, editor) {
	    _classCallCheck(this, EditorMenu);
	
	    this.tweenTime = tweenTime;
	    this.$timeline = $timeline;
	    this.editor = editor;
	    this.timer = this.tweenTime.timer;
	    this.initExport();
	    this.initToggle();
	  }
	
	  _createClass(EditorMenu, [{
	    key: 'initToggle',
	    value: function initToggle() {
	      var parentElement = this.editor.el;
	      var timelineClosed = false;
	      var $toggleLink = this.$timeline.find('[data-action="toggle"]');
	      $toggleLink.click(function (e) {
	        e.preventDefault();
	        timelineClosed = !timelineClosed;
	        $toggleLink.toggleClass('menu-item--toggle-up', timelineClosed);
	        parentElement.toggleClass('timeline-is-closed', timelineClosed);
	        return window.dispatchEvent(new Event('resize'));
	      });
	      var $toggleLinkSide = $('.properties-editor', parentElement).find('[data-action="toggle"]');
	      $toggleLinkSide.click(function (e) {
	        var propertiesClosed;
	        e.preventDefault();
	        propertiesClosed = !parentElement.hasClass('properties-is-closed');
	        parentElement.toggleClass('properties-is-closed', propertiesClosed);
	        return window.dispatchEvent(new Event('resize'));
	      });
	    }
	  }, {
	    key: 'initExport',
	    value: function initExport() {
	      var exporter = this.editor.exporter;
	      this.$timeline.find('[data-action="export"]').click(function (e) {
	        e.preventDefault();
	        var data = exporter.getJSON();
	        var blob = new Blob([data], {
	          type: 'text/json;charset=utf-8'
	        });
	        saveAs(blob, 'data.json');
	      });
	    }
	  }]);
	
	  return EditorMenu;
	}();
	
	exports.default = EditorMenu;
>>>>>>> master

/***/ },
/* 42 */
/***/ function(module, exports) {

<<<<<<< HEAD
	eval("module.exports = __WEBPACK_EXTERNAL_MODULE_34__;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wicm9vdFwiOlwic2F2ZUFzXCIsXCJjb21tb25qc1wiOlwiZmlsZS1zYXZlclwiLFwiY29tbW9uanMyXCI6XCJmaWxlLXNhdmVyXCIsXCJhbWRcIjpcImZpbGUtc2F2ZXJcIn0/Y2UwZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiIzNC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8zNF9fO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwge1wicm9vdFwiOlwic2F2ZUFzXCIsXCJjb21tb25qc1wiOlwiZmlsZS1zYXZlclwiLFwiY29tbW9uanMyXCI6XCJmaWxlLXNhdmVyXCIsXCJhbWRcIjpcImZpbGUtc2F2ZXJcIn1cbiAqKiBtb2R1bGUgaWQgPSAzNFxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");
=======
	module.exports = __WEBPACK_EXTERNAL_MODULE_42__;
>>>>>>> master

/***/ },
/* 43 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar EditorControls = function () {\n  function EditorControls(tweenTime, $timeline) {\n    var _this = this;\n\n    _classCallCheck(this, EditorControls);\n\n    this.tweenTime = tweenTime;\n    this.$timeline = $timeline;\n    this.timer = this.tweenTime.timer;\n    this.$time = this.$timeline.find('.control--time');\n    this.$time_end = this.$timeline.find('.control--time-end');\n    this.initControls();\n    this.$time_end.val(this.tweenTime.timer.getDuration());\n\n    $(document).keypress(function (e) {\n      if (e.charCode === 32) {\n        // Space\n        _this.playPause();\n      }\n    });\n  }\n\n  _createClass(EditorControls, [{\n    key: 'playPause',\n    value: function playPause() {\n      var $play_pause;\n      this.timer.toggle();\n      $play_pause = this.$timeline.find('.control--play-pause');\n      $play_pause.toggleClass('icon-pause', this.timer.is_playing);\n      $play_pause.toggleClass('icon-play', !this.timer.is_playing);\n    }\n  }, {\n    key: 'initControls',\n    value: function initControls() {\n      var _this2 = this;\n\n      var $play_pause = this.$timeline.find('.control--play-pause');\n      $play_pause.click(function (e) {\n        e.preventDefault();\n        _this2.playPause();\n      });\n      var $bt_first = this.$timeline.find('.control--first');\n      $bt_first.click(function (e) {\n        e.preventDefault();\n        _this2.timer.seek([0]);\n      });\n      var $bt_last = this.$timeline.find('.control--last');\n      $bt_last.click(function (e) {\n        e.preventDefault();\n        var total = _this2.tweenTime.getTotalDuration();\n        _this2.timer.seek([total * 1000]);\n      });\n      this.$time.change(function () {\n        var seconds = parseFloat(_this2.$time.val(), 10) * 1000;\n        _this2.timer.seek([seconds]);\n      });\n      this.$time_end.change(function () {\n        var seconds = parseFloat(_this2.$time_end.val(), 10);\n        _this2.timer.setDuration(seconds);\n      });\n    }\n  }, {\n    key: 'render',\n    value: function render(time, time_changed) {\n      if (time_changed) {\n        var seconds = time / 1000;\n        this.$time.val(seconds.toFixed(3));\n      }\n    }\n  }]);\n\n  return EditorControls;\n}();\n\nexports.default = EditorControls;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lZGl0b3IvRWRpdG9yQ29udHJvbHMuanM/NTFiZiJdLCJuYW1lcyI6WyJFZGl0b3JDb250cm9scyIsInR3ZWVuVGltZSIsIiR0aW1lbGluZSIsInRpbWVyIiwiJHRpbWUiLCJmaW5kIiwiJHRpbWVfZW5kIiwiaW5pdENvbnRyb2xzIiwidmFsIiwiZ2V0RHVyYXRpb24iLCIkIiwiZG9jdW1lbnQiLCJrZXlwcmVzcyIsImUiLCJjaGFyQ29kZSIsInBsYXlQYXVzZSIsIiRwbGF5X3BhdXNlIiwidG9nZ2xlIiwidG9nZ2xlQ2xhc3MiLCJpc19wbGF5aW5nIiwiY2xpY2siLCJwcmV2ZW50RGVmYXVsdCIsIiRidF9maXJzdCIsInNlZWsiLCIkYnRfbGFzdCIsInRvdGFsIiwiZ2V0VG90YWxEdXJhdGlvbiIsImNoYW5nZSIsInNlY29uZHMiLCJwYXJzZUZsb2F0Iiwic2V0RHVyYXRpb24iLCJ0aW1lIiwidGltZV9jaGFuZ2VkIiwidG9GaXhlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFxQkEsYztBQUNuQiwwQkFBWUMsU0FBWixFQUF1QkMsU0FBdkIsRUFBa0M7QUFBQTs7QUFBQTs7QUFDaEMsU0FBS0QsU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxTQUFLQyxTQUFMLEdBQWlCQSxTQUFqQjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxLQUFLRixTQUFMLENBQWVFLEtBQTVCO0FBQ0EsU0FBS0MsS0FBTCxHQUFhLEtBQUtGLFNBQUwsQ0FBZUcsSUFBZixDQUFvQixnQkFBcEIsQ0FBYjtBQUNBLFNBQUtDLFNBQUwsR0FBaUIsS0FBS0osU0FBTCxDQUFlRyxJQUFmLENBQW9CLG9CQUFwQixDQUFqQjtBQUNBLFNBQUtFLFlBQUw7QUFDQSxTQUFLRCxTQUFMLENBQWVFLEdBQWYsQ0FBbUIsS0FBS1AsU0FBTCxDQUFlRSxLQUFmLENBQXFCTSxXQUFyQixFQUFuQjs7QUFFQUMsTUFBRUMsUUFBRixFQUFZQyxRQUFaLENBQXFCLFVBQUNDLENBQUQsRUFBTztBQUMxQixVQUFJQSxFQUFFQyxRQUFGLEtBQWUsRUFBbkIsRUFBdUI7QUFDckI7QUFDQSxjQUFLQyxTQUFMO0FBQ0Q7QUFDRixLQUxEO0FBTUQ7Ozs7Z0NBRVc7QUFDVixVQUFJQyxXQUFKO0FBQ0EsV0FBS2IsS0FBTCxDQUFXYyxNQUFYO0FBQ0FELG9CQUFjLEtBQUtkLFNBQUwsQ0FBZUcsSUFBZixDQUFvQixzQkFBcEIsQ0FBZDtBQUNBVyxrQkFBWUUsV0FBWixDQUF3QixZQUF4QixFQUFzQyxLQUFLZixLQUFMLENBQVdnQixVQUFqRDtBQUNBSCxrQkFBWUUsV0FBWixDQUF3QixXQUF4QixFQUFxQyxDQUFDLEtBQUtmLEtBQUwsQ0FBV2dCLFVBQWpEO0FBQ0Q7OzttQ0FFYztBQUFBOztBQUNiLFVBQUlILGNBQWMsS0FBS2QsU0FBTCxDQUFlRyxJQUFmLENBQW9CLHNCQUFwQixDQUFsQjtBQUNBVyxrQkFBWUksS0FBWixDQUFrQixVQUFDUCxDQUFELEVBQU87QUFDdkJBLFVBQUVRLGNBQUY7QUFDQSxlQUFLTixTQUFMO0FBQ0QsT0FIRDtBQUlBLFVBQUlPLFlBQVksS0FBS3BCLFNBQUwsQ0FBZUcsSUFBZixDQUFvQixpQkFBcEIsQ0FBaEI7QUFDQWlCLGdCQUFVRixLQUFWLENBQWdCLFVBQUNQLENBQUQsRUFBTztBQUNyQkEsVUFBRVEsY0FBRjtBQUNBLGVBQUtsQixLQUFMLENBQVdvQixJQUFYLENBQWdCLENBQUMsQ0FBRCxDQUFoQjtBQUNELE9BSEQ7QUFJQSxVQUFJQyxXQUFXLEtBQUt0QixTQUFMLENBQWVHLElBQWYsQ0FBb0IsZ0JBQXBCLENBQWY7QUFDQW1CLGVBQVNKLEtBQVQsQ0FBZSxVQUFDUCxDQUFELEVBQU87QUFDcEJBLFVBQUVRLGNBQUY7QUFDQSxZQUFJSSxRQUFRLE9BQUt4QixTQUFMLENBQWV5QixnQkFBZixFQUFaO0FBQ0EsZUFBS3ZCLEtBQUwsQ0FBV29CLElBQVgsQ0FBZ0IsQ0FBQ0UsUUFBUSxJQUFULENBQWhCO0FBQ0QsT0FKRDtBQUtBLFdBQUtyQixLQUFMLENBQVd1QixNQUFYLENBQWtCLFlBQU07QUFDdEIsWUFBSUMsVUFBVUMsV0FBVyxPQUFLekIsS0FBTCxDQUFXSSxHQUFYLEVBQVgsRUFBNkIsRUFBN0IsSUFBbUMsSUFBakQ7QUFDQSxlQUFLTCxLQUFMLENBQVdvQixJQUFYLENBQWdCLENBQUNLLE9BQUQsQ0FBaEI7QUFDRCxPQUhEO0FBSUEsV0FBS3RCLFNBQUwsQ0FBZXFCLE1BQWYsQ0FBc0IsWUFBTTtBQUMxQixZQUFJQyxVQUFVQyxXQUFXLE9BQUt2QixTQUFMLENBQWVFLEdBQWYsRUFBWCxFQUFpQyxFQUFqQyxDQUFkO0FBQ0EsZUFBS0wsS0FBTCxDQUFXMkIsV0FBWCxDQUF1QkYsT0FBdkI7QUFDRCxPQUhEO0FBSUQ7OzsyQkFFTUcsSSxFQUFNQyxZLEVBQWM7QUFDekIsVUFBSUEsWUFBSixFQUFrQjtBQUNoQixZQUFJSixVQUFVRyxPQUFPLElBQXJCO0FBQ0EsYUFBSzNCLEtBQUwsQ0FBV0ksR0FBWCxDQUFlb0IsUUFBUUssT0FBUixDQUFnQixDQUFoQixDQUFmO0FBQ0Q7QUFDRjs7Ozs7O2tCQTFEa0JqQyxjIiwiZmlsZSI6IjM1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdG9yQ29udHJvbHMge1xuICBjb25zdHJ1Y3Rvcih0d2VlblRpbWUsICR0aW1lbGluZSkge1xuICAgIHRoaXMudHdlZW5UaW1lID0gdHdlZW5UaW1lO1xuICAgIHRoaXMuJHRpbWVsaW5lID0gJHRpbWVsaW5lO1xuICAgIHRoaXMudGltZXIgPSB0aGlzLnR3ZWVuVGltZS50aW1lcjtcbiAgICB0aGlzLiR0aW1lID0gdGhpcy4kdGltZWxpbmUuZmluZCgnLmNvbnRyb2wtLXRpbWUnKTtcbiAgICB0aGlzLiR0aW1lX2VuZCA9IHRoaXMuJHRpbWVsaW5lLmZpbmQoJy5jb250cm9sLS10aW1lLWVuZCcpO1xuICAgIHRoaXMuaW5pdENvbnRyb2xzKCk7XG4gICAgdGhpcy4kdGltZV9lbmQudmFsKHRoaXMudHdlZW5UaW1lLnRpbWVyLmdldER1cmF0aW9uKCkpO1xuXG4gICAgJChkb2N1bWVudCkua2V5cHJlc3MoKGUpID0+IHtcbiAgICAgIGlmIChlLmNoYXJDb2RlID09PSAzMikge1xuICAgICAgICAvLyBTcGFjZVxuICAgICAgICB0aGlzLnBsYXlQYXVzZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcGxheVBhdXNlKCkge1xuICAgIHZhciAkcGxheV9wYXVzZTtcbiAgICB0aGlzLnRpbWVyLnRvZ2dsZSgpO1xuICAgICRwbGF5X3BhdXNlID0gdGhpcy4kdGltZWxpbmUuZmluZCgnLmNvbnRyb2wtLXBsYXktcGF1c2UnKTtcbiAgICAkcGxheV9wYXVzZS50b2dnbGVDbGFzcygnaWNvbi1wYXVzZScsIHRoaXMudGltZXIuaXNfcGxheWluZyk7XG4gICAgJHBsYXlfcGF1c2UudG9nZ2xlQ2xhc3MoJ2ljb24tcGxheScsICF0aGlzLnRpbWVyLmlzX3BsYXlpbmcpO1xuICB9XG5cbiAgaW5pdENvbnRyb2xzKCkge1xuICAgIHZhciAkcGxheV9wYXVzZSA9IHRoaXMuJHRpbWVsaW5lLmZpbmQoJy5jb250cm9sLS1wbGF5LXBhdXNlJyk7XG4gICAgJHBsYXlfcGF1c2UuY2xpY2soKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMucGxheVBhdXNlKCk7XG4gICAgfSk7XG4gICAgdmFyICRidF9maXJzdCA9IHRoaXMuJHRpbWVsaW5lLmZpbmQoJy5jb250cm9sLS1maXJzdCcpO1xuICAgICRidF9maXJzdC5jbGljaygoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy50aW1lci5zZWVrKFswXSk7XG4gICAgfSk7XG4gICAgdmFyICRidF9sYXN0ID0gdGhpcy4kdGltZWxpbmUuZmluZCgnLmNvbnRyb2wtLWxhc3QnKTtcbiAgICAkYnRfbGFzdC5jbGljaygoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIHRvdGFsID0gdGhpcy50d2VlblRpbWUuZ2V0VG90YWxEdXJhdGlvbigpO1xuICAgICAgdGhpcy50aW1lci5zZWVrKFt0b3RhbCAqIDEwMDBdKTtcbiAgICB9KTtcbiAgICB0aGlzLiR0aW1lLmNoYW5nZSgoKSA9PiB7XG4gICAgICB2YXIgc2Vjb25kcyA9IHBhcnNlRmxvYXQodGhpcy4kdGltZS52YWwoKSwgMTApICogMTAwMDtcbiAgICAgIHRoaXMudGltZXIuc2Vlayhbc2Vjb25kc10pO1xuICAgIH0pO1xuICAgIHRoaXMuJHRpbWVfZW5kLmNoYW5nZSgoKSA9PiB7XG4gICAgICB2YXIgc2Vjb25kcyA9IHBhcnNlRmxvYXQodGhpcy4kdGltZV9lbmQudmFsKCksIDEwKTtcbiAgICAgIHRoaXMudGltZXIuc2V0RHVyYXRpb24oc2Vjb25kcyk7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIodGltZSwgdGltZV9jaGFuZ2VkKSB7XG4gICAgaWYgKHRpbWVfY2hhbmdlZCkge1xuICAgICAgdmFyIHNlY29uZHMgPSB0aW1lIC8gMTAwMDtcbiAgICAgIHRoaXMuJHRpbWUudmFsKHNlY29uZHMudG9GaXhlZCgzKSk7XG4gICAgfVxuICB9XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2VkaXRvci9FZGl0b3JDb250cm9scy5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar d3 = __webpack_require__(9);\nvar Signals = __webpack_require__(3);\nvar _ = __webpack_require__(6);\n\nvar SelectionManager = function () {\n  function SelectionManager(tweenTime) {\n    _classCallCheck(this, SelectionManager);\n\n    this.tweenTime = tweenTime;\n    this.selection = [];\n    this.onSelect = new Signals.Signal();\n  }\n\n  _createClass(SelectionManager, [{\n    key: 'select',\n    value: function select(item) {\n      var addToSelection = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];\n\n      this.addDataRelations();\n\n      if (!addToSelection) {\n        this.selection = [];\n      }\n      if (item instanceof Array) {\n        for (var i = 0; i < item.length; i++) {\n          var el = item[i];\n          this.selection.push(el);\n        }\n      } else {\n        this.selection.push(item);\n      }\n\n      this.removeDuplicates();\n      this.highlightItems();\n      this.sortSelection();\n      this.onSelect.dispatch(this.selection, addToSelection);\n    }\n  }, {\n    key: 'getSelection',\n    value: function getSelection() {\n      return this.selection;\n    }\n  }, {\n    key: 'removeDuplicates',\n    value: function removeDuplicates() {\n      var result = [];\n      for (var i = 0; i < this.selection.length; i++) {\n        var item = this.selection[i];\n        var found = false;\n        for (var j = 0; j < result.length; j++) {\n          var item2 = result[j];\n          if (_.isEqual(item, item2)) {\n            found = true;\n            break;\n          }\n        }\n        if (found === false) {\n          result.push(item);\n        }\n      }\n      this.selection = result;\n    }\n  }, {\n    key: 'removeItem',\n    value: function removeItem(item) {\n      // If we pass an _id then search for the item and remove it.\n      if (typeof item === 'string') {\n        var itemObj = _.find(this.selection, function (el) {\n          return el._id === item;\n        });\n        if (itemObj) {\n          return this.removeItem(itemObj);\n        }\n      }\n\n      // Remove the object if it exists in the selection.\n      var index = this.selection.indexOf(item);\n      if (index > -1) {\n        this.selection.splice(index, 1);\n      }\n      this.triggerSelect();\n    }\n  }, {\n    key: 'sortSelection',\n    value: function sortSelection() {\n      var compare = function compare(a, b) {\n        if (!a.time || !b.time) {\n          return 0;\n        }\n        if (a.time < b.time) {\n          return -1;\n        }\n        if (a.time > b.time) {\n          return 1;\n        }\n        return 0;\n      };\n      this.selection = this.selection.sort(compare);\n    }\n  }, {\n    key: 'reset',\n    value: function reset() {\n      this.selection = [];\n      this.highlightItems();\n      this.onSelect.dispatch(this.selection, false);\n    }\n  }, {\n    key: 'triggerSelect',\n    value: function triggerSelect() {\n      this.onSelect.dispatch(this.selection, false);\n    }\n  }, {\n    key: 'addDataRelations',\n    value: function addDataRelations() {\n      // We need to add some parent references in main data object.\n      // Add a _property reference to each keys.\n      // Add a _line property for each references.\n      var data = this.tweenTime.data;\n      for (var lineIndex = 0; lineIndex < data.length; lineIndex++) {\n        var line = data[lineIndex];\n        for (var propIndex = 0; propIndex < line.properties.length; propIndex++) {\n          var property = line.properties[propIndex];\n          property._line = line;\n          for (var keyIndex = 0; keyIndex < property.keys.length; keyIndex++) {\n            var key = property.keys[keyIndex];\n            key._property = property;\n          }\n        }\n      }\n    }\n  }, {\n    key: 'highlightItems',\n    value: function highlightItems() {\n      d3.selectAll('.bar--selected').classed('bar--selected', false);\n      d3.selectAll('.key--selected').classed('key--selected', false);\n\n      for (var i = 0; i < this.selection.length; i++) {\n        var data = this.selection[i];\n        if (data._dom) {\n          var d3item = d3.select(data._dom);\n          if (d3item.classed('bar')) {\n            d3item.classed('bar--selected', true);\n          } else if (d3item.classed('key')) {\n            d3item.classed('key--selected', true);\n          }\n        }\n      }\n    }\n  }]);\n\n  return SelectionManager;\n}();\n\nexports.default = SelectionManager;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lZGl0b3IvU2VsZWN0aW9uTWFuYWdlci5qcz8zNjIzIl0sIm5hbWVzIjpbImQzIiwicmVxdWlyZSIsIlNpZ25hbHMiLCJfIiwiU2VsZWN0aW9uTWFuYWdlciIsInR3ZWVuVGltZSIsInNlbGVjdGlvbiIsIm9uU2VsZWN0IiwiU2lnbmFsIiwiaXRlbSIsImFkZFRvU2VsZWN0aW9uIiwiYWRkRGF0YVJlbGF0aW9ucyIsIkFycmF5IiwiaSIsImxlbmd0aCIsImVsIiwicHVzaCIsInJlbW92ZUR1cGxpY2F0ZXMiLCJoaWdobGlnaHRJdGVtcyIsInNvcnRTZWxlY3Rpb24iLCJkaXNwYXRjaCIsInJlc3VsdCIsImZvdW5kIiwiaiIsIml0ZW0yIiwiaXNFcXVhbCIsIml0ZW1PYmoiLCJmaW5kIiwiX2lkIiwicmVtb3ZlSXRlbSIsImluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsInRyaWdnZXJTZWxlY3QiLCJjb21wYXJlIiwiYSIsImIiLCJ0aW1lIiwic29ydCIsImRhdGEiLCJsaW5lSW5kZXgiLCJsaW5lIiwicHJvcEluZGV4IiwicHJvcGVydGllcyIsInByb3BlcnR5IiwiX2xpbmUiLCJrZXlJbmRleCIsImtleXMiLCJrZXkiLCJfcHJvcGVydHkiLCJzZWxlY3RBbGwiLCJjbGFzc2VkIiwiX2RvbSIsImQzaXRlbSIsInNlbGVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQUlBLEtBQUssbUJBQUFDLENBQVEsQ0FBUixDQUFUO0FBQ0EsSUFBSUMsVUFBVSxtQkFBQUQsQ0FBUSxDQUFSLENBQWQ7QUFDQSxJQUFJRSxJQUFJLG1CQUFBRixDQUFRLENBQVIsQ0FBUjs7SUFFcUJHLGdCO0FBQ25CLDRCQUFZQyxTQUFaLEVBQXVCO0FBQUE7O0FBQ3JCLFNBQUtBLFNBQUwsR0FBaUJBLFNBQWpCO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixFQUFqQjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0IsSUFBSUwsUUFBUU0sTUFBWixFQUFoQjtBQUNE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USxNQUFuQyxFQUEyQ0QsR0FBM0MsRUFBZ0Q7QUFDOUMsWUFBSTBCLE9BQU8sS0FBS2pDLFNBQUwsQ0FBZU8sQ0FBZixDQUFYO0FBQ0EsWUFBSTBCLEtBQUthLElBQVQsRUFBZTtBQUNiLGNBQUlDLFNBQVNyRCxHQUFHc0QsTUFBSCxDQUFVZixLQUFLYSxJQUFmLENBQWI7QUFDQSxjQUFJQyxPQUFPRixPQUFQLENBQWUsS0FBZixDQUFKLEVBQTJCO0FBQ3pCRSxtQkFBT0YsT0FBUCxDQUFlLGVBQWYsRUFBZ0MsSUFBaEM7QUFDRCxXQUZELE1BR0ssSUFBSUUsT0FBT0YsT0FBUCxDQUFlLEtBQWYsQ0FBSixFQUEyQjtBQUM5QkUsbUJBQU9GLE9BQVAsQ0FBZSxlQUFmLEVBQWdDLElBQWhDO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7Ozs7OztrQkFuSWtCL0MsZ0IiLCJmaWxlIjoiMzYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgZDMgPSByZXF1aXJlKCdkMycpO1xubGV0IFNpZ25hbHMgPSByZXF1aXJlKCdqcy1zaWduYWxzJyk7XG5sZXQgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3Rpb25NYW5hZ2VyIHtcbiAgY29uc3RydWN0b3IodHdlZW5UaW1lKSB7XG4gICAgdGhpcy50d2VlblRpbWUgPSB0d2VlblRpbWU7XG4gICAgdGhpcy5zZWxlY3Rpb24gPSBbXTtcbiAgICB0aGlzLm9uU2VsZWN0ID0gbmV3IFNpZ25hbHMuU2lnbmFsKCk7XG4gIH1cblxuICBzZWxlY3QoaXRlbSwgYWRkVG9TZWxlY3Rpb24gPSBmYWxzZSkge1xuICAgIHRoaXMuYWRkRGF0YVJlbGF0aW9ucygpO1xuXG4gICAgaWYgKCFhZGRUb1NlbGVjdGlvbikge1xuICAgICAgdGhpcy5zZWxlY3Rpb24gPSBbXTtcbiAgICB9XG4gICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlbCA9IGl0ZW1baV07XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uLnB1c2goZWwpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnB1c2goaXRlbSk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW1vdmVEdXBsaWNhdGVzKCk7XG4gICAgdGhpcy5oaWdobGlnaHRJdGVtcygpO1xuICAgIHRoaXMuc29ydFNlbGVjdGlvbigpO1xuICAgIHRoaXMub25TZWxlY3QuZGlzcGF0Y2godGhpcy5zZWxlY3Rpb24sIGFkZFRvU2VsZWN0aW9uKTtcbiAgfVxuXG4gIGdldFNlbGVjdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb247XG4gIH1cblxuICByZW1vdmVEdXBsaWNhdGVzKCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2VsZWN0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IHRoaXMuc2VsZWN0aW9uW2ldO1xuICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJlc3VsdC5sZW5ndGg7IGorKykge1xuICAgICAgICB2YXIgaXRlbTIgPSByZXN1bHRbal07XG4gICAgICAgIGlmIChfLmlzRXF1YWwoaXRlbSwgaXRlbTIpKSB7XG4gICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmQgPT09IGZhbHNlKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnNlbGVjdGlvbiA9IHJlc3VsdDtcbiAgfVxuXG4gIHJlbW92ZUl0ZW0oaXRlbSkge1xuICAgIC8vIElmIHdlIHBhc3MgYW4gX2lkIHRoZW4gc2VhcmNoIGZvciB0aGUgaXRlbSBhbmQgcmVtb3ZlIGl0LlxuICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGxldCBpdGVtT2JqID0gXy5maW5kKHRoaXMuc2VsZWN0aW9uLCBmdW5jdGlvbihlbCkge1xuICAgICAgICByZXR1cm4gZWwuX2lkID09PSBpdGVtO1xuICAgICAgfSk7XG4gICAgICBpZiAoaXRlbU9iaikge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVJdGVtKGl0ZW1PYmopO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSB0aGUgb2JqZWN0IGlmIGl0IGV4aXN0cyBpbiB0aGUgc2VsZWN0aW9uLlxuICAgIHZhciBpbmRleCA9IHRoaXMuc2VsZWN0aW9uLmluZGV4T2YoaXRlbSk7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICAgIHRoaXMudHJpZ2dlclNlbGVjdCgpO1xuICB9XG5cbiAgc29ydFNlbGVjdGlvbigpIHtcbiAgICB2YXIgY29tcGFyZSA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIGlmICghYS50aW1lIHx8ICFiLnRpbWUpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICBpZiAoYS50aW1lIDwgYi50aW1lKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChhLnRpbWUgPiBiLnRpbWUpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9O1xuICAgIHRoaXMuc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24uc29ydChjb21wYXJlKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuc2VsZWN0aW9uID0gW107XG4gICAgdGhpcy5oaWdobGlnaHRJdGVtcygpO1xuICAgIHRoaXMub25TZWxlY3QuZGlzcGF0Y2godGhpcy5zZWxlY3Rpb24sIGZhbHNlKTtcbiAgfVxuXG4gIHRyaWdnZXJTZWxlY3QoKSB7XG4gICAgdGhpcy5vblNlbGVjdC5kaXNwYXRjaCh0aGlzLnNlbGVjdGlvbiwgZmFsc2UpO1xuICB9XG5cbiAgYWRkRGF0YVJlbGF0aW9ucygpIHtcbiAgICAvLyBXZSBuZWVkIHRvIGFkZCBzb21lIHBhcmVudCByZWZlcmVuY2VzIGluIG1haW4gZGF0YSBvYmplY3QuXG4gICAgLy8gQWRkIGEgX3Byb3BlcnR5IHJlZmVyZW5jZSB0byBlYWNoIGtleXMuXG4gICAgLy8gQWRkIGEgX2xpbmUgcHJvcGVydHkgZm9yIGVhY2ggcmVmZXJlbmNlcy5cbiAgICB2YXIgZGF0YSA9IHRoaXMudHdlZW5UaW1lLmRhdGE7XG4gICAgZm9yICh2YXIgbGluZUluZGV4ID0gMDsgbGluZUluZGV4IDwgZGF0YS5sZW5ndGg7IGxpbmVJbmRleCsrKSB7XG4gICAgICB2YXIgbGluZSA9IGRhdGFbbGluZUluZGV4XTtcbiAgICAgIGZvciAodmFyIHByb3BJbmRleCA9IDA7IHByb3BJbmRleCA8IGxpbmUucHJvcGVydGllcy5sZW5ndGg7IHByb3BJbmRleCsrKSB7XG4gICAgICAgIHZhciBwcm9wZXJ0eSA9IGxpbmUucHJvcGVydGllc1twcm9wSW5kZXhdO1xuICAgICAgICBwcm9wZXJ0eS5fbGluZSA9IGxpbmU7XG4gICAgICAgIGZvciAodmFyIGtleUluZGV4ID0gMDsga2V5SW5kZXggPCBwcm9wZXJ0eS5rZXlzLmxlbmd0aDsga2V5SW5kZXgrKykge1xuICAgICAgICAgIHZhciBrZXkgPSBwcm9wZXJ0eS5rZXlzW2tleUluZGV4XTtcbiAgICAgICAgICBrZXkuX3Byb3BlcnR5ID0gcHJvcGVydHk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoaWdobGlnaHRJdGVtcygpIHtcbiAgICBkMy5zZWxlY3RBbGwoJy5iYXItLXNlbGVjdGVkJykuY2xhc3NlZCgnYmFyLS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgICBkMy5zZWxlY3RBbGwoJy5rZXktLXNlbGVjdGVkJykuY2xhc3NlZCgna2V5LS1zZWxlY3RlZCcsIGZhbHNlKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZWxlY3Rpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkYXRhID0gdGhpcy5zZWxlY3Rpb25baV07XG4gICAgICBpZiAoZGF0YS5fZG9tKSB7XG4gICAgICAgIHZhciBkM2l0ZW0gPSBkMy5zZWxlY3QoZGF0YS5fZG9tKTtcbiAgICAgICAgaWYgKGQzaXRlbS5jbGFzc2VkKCdiYXInKSkge1xuICAgICAgICAgIGQzaXRlbS5jbGFzc2VkKCdiYXItLXNlbGVjdGVkJywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZDNpdGVtLmNsYXNzZWQoJ2tleScpKSB7XG4gICAgICAgICAgZDNpdGVtLmNsYXNzZWQoJ2tleS0tc2VsZWN0ZWQnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9lZGl0b3IvU2VsZWN0aW9uTWFuYWdlci5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");
=======
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var d3 = __webpack_require__(13);
	var Signals = __webpack_require__(5);
	var _ = __webpack_require__(10);
	
	var SelectionManager = function () {
	  function SelectionManager(tweenTime) {
	    _classCallCheck(this, SelectionManager);
	
	    this.tweenTime = tweenTime;
	    this.selection = [];
	    this.onSelect = new Signals.Signal();
	  }
	
	  _createClass(SelectionManager, [{
	    key: 'select',
	    value: function select(item) {
	      var addToSelection = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
	      this.addDataRelations();
	
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
	    }
	  }, {
	    key: 'getSelection',
	    value: function getSelection() {
	      return this.selection;
	    }
	  }, {
	    key: 'removeDuplicates',
	    value: function removeDuplicates() {
	      var result = [];
	      for (var i = 0; i < this.selection.length; i++) {
	        var item = this.selection[i];
	        var found = false;
	        for (var j = 0; j < result.length; j++) {
	          var item2 = result[j];
	          if (_.isEqual(item, item2)) {
	            found = true;
	            break;
	          }
	        }
	        if (found === false) {
	          result.push(item);
	        }
	      }
	      this.selection = result;
	    }
	  }, {
	    key: 'removeItem',
	    value: function removeItem(item) {
	      // If we pass an _id then search for the item and remove it.
	      if (typeof item === 'string') {
	        var itemObj = _.find(this.selection, function (el) {
	          return el._id === item;
	        });
	        if (itemObj) {
	          return this.removeItem(itemObj);
	        }
	      }
	
	      // Remove the object if it exists in the selection.
	      var index = this.selection.indexOf(item);
	      if (index > -1) {
	        this.selection.splice(index, 1);
	      }
	      this.triggerSelect();
	    }
	  }, {
	    key: 'sortSelection',
	    value: function sortSelection() {
	      var compare = function compare(a, b) {
	        if (!a.time || !b.time) {
	          return 0;
	        }
	        if (a.time < b.time) {
	          return -1;
	        }
	        if (a.time > b.time) {
	          return 1;
	        }
	        return 0;
	      };
	      this.selection = this.selection.sort(compare);
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      this.selection = [];
	      this.highlightItems();
	      this.onSelect.dispatch(this.selection, false);
	    }
	  }, {
	    key: 'triggerSelect',
	    value: function triggerSelect() {
	      this.onSelect.dispatch(this.selection, false);
	    }
	  }, {
	    key: 'addDataRelations',
	    value: function addDataRelations() {
	      // We need to add some parent references in main data object.
	      // Add a _property reference to each keys.
	      // Add a _line property for each references.
	      var data = this.tweenTime.data;
	      for (var lineIndex = 0; lineIndex < data.length; lineIndex++) {
	        var line = data[lineIndex];
	        for (var propIndex = 0; propIndex < line.properties.length; propIndex++) {
	          var property = line.properties[propIndex];
	          property._line = line;
	          for (var keyIndex = 0; keyIndex < property.keys.length; keyIndex++) {
	            var key = property.keys[keyIndex];
	            key._property = property;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'highlightItems',
	    value: function highlightItems() {
	      d3.selectAll('.bar--selected').classed('bar--selected', false);
	      d3.selectAll('.key--selected').classed('key--selected', false);
	
	      for (var i = 0; i < this.selection.length; i++) {
	        var data = this.selection[i];
	        if (data._dom) {
	          var d3item = d3.select(data._dom);
	          if (d3item.classed('bar')) {
	            d3item.classed('bar--selected', true);
	          } else if (d3item.classed('key')) {
	            d3item.classed('key--selected', true);
	          }
	        }
	      }
	    }
	  }]);
	
	  return SelectionManager;
	}();
	
	exports.default = SelectionManager;
>>>>>>> master

/***/ },
/* 45 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Exporter = function () {\n  function Exporter(editor) {\n    _classCallCheck(this, Exporter);\n\n    this.editor = editor;\n  }\n\n  _createClass(Exporter, [{\n    key: 'getData',\n    value: function getData() {\n      var tweenTime = this.editor.tweenTime;\n      var domain = this.editor.timeline.x.domain();\n      var domain_start = domain[0];\n      var domain_end = domain[1];\n      return {\n        settings: {\n          time: tweenTime.timer.getCurrentTime(),\n          duration: tweenTime.timer.getDuration(),\n          domain: [domain_start.getTime(), domain_end.getTime()]\n        },\n        data: tweenTime.data\n      };\n    }\n  }, {\n    key: 'getJSON',\n    value: function getJSON() {\n      var options = this.editor.options;\n      var json_replacer = function json_replacer(key, val) {\n        // Disable all private properies from TweenMax/TimelineMax\n        if (key.indexOf('_') === 0) {\n          return undefined;\n        }\n        if (options.json_replacer !== undefined) {\n          return options.json_replacer(key, val);\n        }\n        return val;\n      };\n\n      var data = this.getData();\n      return JSON.stringify(data, json_replacer, 2);\n    }\n  }]);\n\n  return Exporter;\n}();\n\nexports.default = Exporter;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lZGl0b3IvRXhwb3J0ZXIuanM/YjE3YyJdLCJuYW1lcyI6WyJFeHBvcnRlciIsImVkaXRvciIsInR3ZWVuVGltZSIsImRvbWFpbiIsInRpbWVsaW5lIiwieCIsImRvbWFpbl9zdGFydCIsImRvbWFpbl9lbmQiLCJzZXR0aW5ncyIsInRpbWUiLCJ0aW1lciIsImdldEN1cnJlbnRUaW1lIiwiZHVyYXRpb24iLCJnZXREdXJhdGlvbiIsImdldFRpbWUiLCJkYXRhIiwib3B0aW9ucyIsImpzb25fcmVwbGFjZXIiLCJrZXkiLCJ2YWwiLCJpbmRleE9mIiwidW5kZWZpbmVkIiwiZ2V0RGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBcUJBLFE7QUFDbkIsb0JBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFDbEIsU0FBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0Q7Ozs7OEJBRVM7QUFDUixVQUFJQyxZQUFZLEtBQUtELE1BQUwsQ0FBWUMsU0FBNUI7QUFDQSxVQUFJQyxTQUFTLEtBQUtGLE1BQUwsQ0FBWUcsUUFBWixDQUFxQkMsQ0FBckIsQ0FBdUJGLE1BQXZCLEVBQWI7QUFDQSxVQUFJRyxlQUFlSCxPQUFPLENBQVAsQ0FBbkI7QUFDQSxVQUFJSSxhQUFhSixPQUFPLENBQVAsQ0FBakI7QUFDQSxhQUFPO0FBQ0xLLGtCQUFVO0FBQ1JDLGdCQUFNUCxVQUFVUSxLQUFWLENBQWdCQyxjQUFoQixFQURFO0FBRVJDLG9CQUFVVixVQUFVUSxLQUFWLENBQWdCRyxXQUFoQixFQUZGO0FBR1JWLGtCQUFRLENBQUNHLGFBQWFRLE9BQWIsRUFBRCxFQUF5QlAsV0FBV08sT0FBWCxFQUF6QjtBQUhBLFNBREw7QUFNTEMsY0FBTWIsVUFBVWE7QUFOWCxPQUFQO0FBUUQ7Ozs4QkFFUztBQUNSLFVBQUlDLFVBQVUsS0FBS2YsTUFBTCxDQUFZZSxPQUExQjtBQUNBLFVBQUlDLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBU0MsR0FBVCxFQUFjQyxHQUFkLEVBQW1CO0FBQ3JDO0FBQ0EsWUFBSUQsSUFBSUUsT0FBSixDQUFZLEdBQVosTUFBcUIsQ0FBekIsRUFBNEI7QUFDMUIsaUJBQU9DLFNBQVA7QUFDRDtBQUNELFlBQUlMLFFBQVFDLGFBQVIsS0FBMEJJLFNBQTlCLEVBQXlDO0FBQ3ZDLGlCQUFPTCxRQUFRQyxhQUFSLENBQXNCQyxHQUF0QixFQUEyQkMsR0FBM0IsQ0FBUDtBQUNEO0FBQ0QsZUFBT0EsR0FBUDtBQUNELE9BVEQ7O0FBV0EsVUFBSUosT0FBTyxLQUFLTyxPQUFMLEVBQVg7QUFDQSxhQUFPQyxLQUFLQyxTQUFMLENBQWVULElBQWYsRUFBcUJFLGFBQXJCLEVBQW9DLENBQXBDLENBQVA7QUFDRDs7Ozs7O2tCQW5Da0JqQixRIiwiZmlsZSI6IjM3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXhwb3J0ZXIge1xuICBjb25zdHJ1Y3RvcihlZGl0b3IpIHtcbiAgICB0aGlzLmVkaXRvciA9IGVkaXRvcjtcbiAgfVxuXG4gIGdldERhdGEoKSB7XG4gICAgdmFyIHR3ZWVuVGltZSA9IHRoaXMuZWRpdG9yLnR3ZWVuVGltZTtcbiAgICB2YXIgZG9tYWluID0gdGhpcy5lZGl0b3IudGltZWxpbmUueC5kb21haW4oKTtcbiAgICB2YXIgZG9tYWluX3N0YXJ0ID0gZG9tYWluWzBdO1xuICAgIHZhciBkb21haW5fZW5kID0gZG9tYWluWzFdO1xuICAgIHJldHVybiB7XG4gICAgICBzZXR0aW5nczoge1xuICAgICAgICB0aW1lOiB0d2VlblRpbWUudGltZXIuZ2V0Q3VycmVudFRpbWUoKSxcbiAgICAgICAgZHVyYXRpb246IHR3ZWVuVGltZS50aW1lci5nZXREdXJhdGlvbigpLFxuICAgICAgICBkb21haW46IFtkb21haW5fc3RhcnQuZ2V0VGltZSgpLCBkb21haW5fZW5kLmdldFRpbWUoKV1cbiAgICAgIH0sXG4gICAgICBkYXRhOiB0d2VlblRpbWUuZGF0YVxuICAgIH07XG4gIH1cblxuICBnZXRKU09OKCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5lZGl0b3Iub3B0aW9ucztcbiAgICB2YXIganNvbl9yZXBsYWNlciA9IGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgICAvLyBEaXNhYmxlIGFsbCBwcml2YXRlIHByb3BlcmllcyBmcm9tIFR3ZWVuTWF4L1RpbWVsaW5lTWF4XG4gICAgICBpZiAoa2V5LmluZGV4T2YoJ18nKSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuanNvbl9yZXBsYWNlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLmpzb25fcmVwbGFjZXIoa2V5LCB2YWwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9O1xuXG4gICAgdmFyIGRhdGEgPSB0aGlzLmdldERhdGEoKTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSwganNvbl9yZXBsYWNlciwgMik7XG4gIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vZWRpdG9yL0V4cG9ydGVyLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\n__webpack_require__(18);\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar UndoManager = function () {\n  function UndoManager(editor) {\n    var _this = this;\n\n    _classCallCheck(this, UndoManager);\n\n    this.editor = editor;\n    this.history_max = 100;\n    this.history = [];\n    this.current_index = 0;\n\n    // Add the initial state\n    this.addState();\n\n    $(document).keydown(function (e) {\n      if (e.keyCode === 90) {\n        if (e.metaKey || e.ctrlKey) {\n          if (!e.shiftKey) {\n            // (command | ctrl) Z\n            _this.undo();\n          } else {\n            // (command | ctrl) shift Z\n            _this.redo();\n          }\n        }\n      }\n    });\n  }\n\n  _createClass(UndoManager, [{\n    key: 'undo',\n    value: function undo() {\n      // If there is no more history return\n      if (this.current_index <= 0) {\n        return false;\n      }\n      this.current_index -= 1;\n      this.setState(this.current_index);\n    }\n  }, {\n    key: 'redo',\n    value: function redo() {\n      // Stop if there is no more things.\n      if (this.current_index >= this.history.length - 1) {\n        return false;\n      }\n      this.current_index += 1;\n      this.setState(this.current_index);\n    }\n  }, {\n    key: 'addState',\n    value: function addState() {\n      var data = JSON.parse(this.editor.exporter.getJSON());\n\n      // if we did some undo before and then edit something,\n      // we want to remove all actions past the current index first.\n      if (this.current_index + 1 < this.history.length) {\n        this.history.splice(this.current_index + 1, this.history.length - 1);\n      }\n\n      this.history.push(data);\n\n      // Keep history to a max size by removing the first element if needed.\n      if (this.history.length > this.history_max) {\n        this.history.shift();\n      }\n\n      // Set the current index\n      this.current_index = this.history.length - 1;\n    }\n  }, {\n    key: 'setState',\n    value: function setState(index) {\n      var state = this.history[index];\n      var data = state.data;\n      var tweenTime = this.editor.tweenTime;\n\n      // naively copy keys and values from previous state\n      for (var item_key = 0; item_key < data.length; item_key++) {\n        var item = data[item_key];\n        // if item is not defined copy it\n        if (!tweenTime.data[item_key]) {\n          tweenTime.data[item_key] = item;\n        } else {\n          for (var prop_key = 0; prop_key < item.properties.length; prop_key++) {\n            var prop = item.properties[prop_key];\n            // if property is not defined copy it\n            if (!tweenTime.data[item_key].properties[prop_key]) {\n              tweenTime.data[item_key].properties[prop_key] = prop;\n            } else {\n              // set property keys\n              var keys = tweenTime.data[item_key].properties[prop_key].keys;\n              for (var key_key = 0; key_key < prop.keys.length; key_key++) {\n                var key = prop.keys[key_key];\n                if (!keys[key_key]) {\n                  keys[key_key] = key;\n                } else {\n                  keys[key_key].time = key.time;\n                  keys[key_key].val = key.val;\n                  keys[key_key].ease = key.ease;\n                }\n              }\n            }\n          }\n        }\n\n        tweenTime.data[item_key]._isDirty = true;\n      }\n      this.editor.render(false, true);\n    }\n  }]);\n\n  return UndoManager;\n}();\n\nexports.default = UndoManager;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9lZGl0b3IvVW5kb01hbmFnZXIuanM/YzZiNyJdLCJuYW1lcyI6WyJVbmRvTWFuYWdlciIsImVkaXRvciIsImhpc3RvcnlfbWF4IiwiaGlzdG9yeSIsImN1cnJlbnRfaW5kZXgiLCJhZGRTdGF0ZSIsIiQiLCJkb2N1bWVudCIsImtleWRvd24iLCJlIiwia2V5Q29kZSIsIm1ldGFLZXkiLCJjdHJsS2V5Iiwic2hpZnRLZXkiLCJ1bmRvIiwicmVkbyIsInNldFN0YXRlIiwibGVuZ3RoIiwiZGF0YSIsIkpTT04iLCJwYXJzZSIsImV4cG9ydGVyIiwiZ2V0SlNPTiIsInNwbGljZSIsInB1c2giLCJzaGlmdCIsImluZGV4Iiwic3RhdGUiLCJ0d2VlblRpbWUiLCJpdGVtX2tleSIsIml0ZW0iLCJwcm9wX2tleSIsInByb3BlcnRpZXMiLCJwcm9wIiwia2V5cyIsImtleV9rZXkiLCJrZXkiLCJ0aW1lIiwidmFsIiwiZWFzZSIsIl9pc0RpcnR5IiwicmVuZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0lBRXFCQSxXO0FBQ25CLHVCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQUE7O0FBQ2xCLFNBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsR0FBbkI7QUFDQSxTQUFLQyxPQUFMLEdBQWUsRUFBZjtBQUNBLFNBQUtDLGFBQUwsR0FBcUIsQ0FBckI7O0FBRUE7QUFDQSxTQUFLQyxRQUFMOztBQUVBQyxNQUFFQyxRQUFGLEVBQVlDLE9BQVosQ0FBb0IsVUFBQ0MsQ0FBRCxFQUFPO0FBQ3pCLFVBQUlBLEVBQUVDLE9BQUYsS0FBYyxFQUFsQixFQUFzQjtBQUNwQixZQUFJRCxFQUFFRSxPQUFGLElBQWFGLEVBQUVHLE9BQW5CLEVBQTRCO0FBQzFCLGNBQUksQ0FBQ0gsRUFBRUksUUFBUCxFQUFpQjtBQUNmO0FBQ0Esa0JBQUtDLElBQUw7QUFDRCxXQUhELE1BSUs7QUFDSDtBQUNBLGtCQUFLQyxJQUFMO0FB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LElBQUlDLElBQXpCO0FBQ0FILHVCQUFLQyxPQUFMLEVBQWNHLEdBQWQsR0FBb0JGLElBQUlFLEdBQXhCO0FBQ0FKLHVCQUFLQyxPQUFMLEVBQWNJLElBQWQsR0FBcUJILElBQUlHLElBQXpCO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7QUFDRjs7QUFFRFgsa0JBQVVWLElBQVYsQ0FBZVcsUUFBZixFQUF5QlcsUUFBekIsR0FBb0MsSUFBcEM7QUFDRDtBQUNELFdBQUt2QyxNQUFMLENBQVl3QyxNQUFaLENBQW1CLEtBQW5CLEVBQTBCLElBQTFCO0FBQ0Q7Ozs7OztrQkF4R2tCekMsVyIsImZpbGUiOiIzOC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnanF1ZXJ5JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVW5kb01hbmFnZXIge1xuICBjb25zdHJ1Y3RvcihlZGl0b3IpIHtcbiAgICB0aGlzLmVkaXRvciA9IGVkaXRvcjtcbiAgICB0aGlzLmhpc3RvcnlfbWF4ID0gMTAwO1xuICAgIHRoaXMuaGlzdG9yeSA9IFtdO1xuICAgIHRoaXMuY3VycmVudF9pbmRleCA9IDA7XG5cbiAgICAvLyBBZGQgdGhlIGluaXRpYWwgc3RhdGVcbiAgICB0aGlzLmFkZFN0YXRlKCk7XG5cbiAgICAkKGRvY3VtZW50KS5rZXlkb3duKChlKSA9PiB7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSA5MCkge1xuICAgICAgICBpZiAoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkge1xuICAgICAgICAgIGlmICghZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgLy8gKGNvbW1hbmQgfCBjdHJsKSBaXG4gICAgICAgICAgICB0aGlzLnVuZG8oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyAoY29tbWFuZCB8IGN0cmwpIHNoaWZ0IFpcbiAgICAgICAgICAgIHRoaXMucmVkbygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdW5kbygpIHtcbiAgICAvLyBJZiB0aGVyZSBpcyBubyBtb3JlIGhpc3RvcnkgcmV0dXJuXG4gICAgaWYgKHRoaXMuY3VycmVudF9pbmRleCA8PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuY3VycmVudF9pbmRleCAtPSAxO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5jdXJyZW50X2luZGV4KTtcbiAgfVxuXG4gIHJlZG8oKSB7XG4gICAgLy8gU3RvcCBpZiB0aGVyZSBpcyBubyBtb3JlIHRoaW5ncy5cbiAgICBpZiAodGhpcy5jdXJyZW50X2luZGV4ID49IHRoaXMuaGlzdG9yeS5sZW5ndGggLSAxKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuY3VycmVudF9pbmRleCArPSAxO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5jdXJyZW50X2luZGV4KTtcbiAgfVxuXG4gIGFkZFN0YXRlKCkge1xuICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZSh0aGlzLmVkaXRvci5leHBvcnRlci5nZXRKU09OKCkpO1xuXG4gICAgLy8gaWYgd2UgZGlkIHNvbWUgdW5kbyBiZWZvcmUgYW5kIHRoZW4gZWRpdCBzb21ldGhpbmcsXG4gICAgLy8gd2Ugd2FudCB0byByZW1vdmUgYWxsIGFjdGlvbnMgcGFzdCB0aGUgY3VycmVudCBpbmRleCBmaXJzdC5cbiAgICBpZiAodGhpcy5jdXJyZW50X2luZGV4ICsgMSA8IHRoaXMuaGlzdG9yeS5sZW5ndGgpIHtcbiAgICAgIHRoaXMuaGlzdG9yeS5zcGxpY2UodGhpcy5jdXJyZW50X2luZGV4ICsgMSwgdGhpcy5oaXN0b3J5Lmxlbmd0aCAtIDEpO1xuICAgIH1cblxuICAgIHRoaXMuaGlzdG9yeS5wdXNoKGRhdGEpO1xuXG4gICAgLy8gS2VlcCBoaXN0b3J5IHRvIGEgbWF4IHNpemUgYnkgcmVtb3ZpbmcgdGhlIGZpcnN0IGVsZW1lbnQgaWYgbmVlZGVkLlxuICAgIGlmICh0aGlzLmhpc3RvcnkubGVuZ3RoID4gdGhpcy5oaXN0b3J5X21heCkge1xuICAgICAgdGhpcy5oaXN0b3J5LnNoaWZ0KCk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBjdXJyZW50IGluZGV4XG4gICAgdGhpcy5jdXJyZW50X2luZGV4ID0gdGhpcy5oaXN0b3J5Lmxlbmd0aCAtIDE7XG4gIH1cblxuICBzZXRTdGF0ZShpbmRleCkge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuaGlzdG9yeVtpbmRleF07XG4gICAgdmFyIGRhdGEgPSBzdGF0ZS5kYXRhO1xuICAgIHZhciB0d2VlblRpbWUgPSB0aGlzLmVkaXRvci50d2VlblRpbWU7XG5cbiAgICAvLyBuYWl2ZWx5IGNvcHkga2V5cyBhbmQgdmFsdWVzIGZyb20gcHJldmlvdXMgc3RhdGVcbiAgICBmb3IgKHZhciBpdGVtX2tleSA9IDA7IGl0ZW1fa2V5IDwgZGF0YS5sZW5ndGg7IGl0ZW1fa2V5KyspIHtcbiAgICAgIHZhciBpdGVtID0gZGF0YVtpdGVtX2tleV07XG4gICAgICAvLyBpZiBpdGVtIGlzIG5vdCBkZWZpbmVkIGNvcHkgaXRcbiAgICAgIGlmICghdHdlZW5UaW1lLmRhdGFbaXRlbV9rZXldKSB7XG4gICAgICAgIHR3ZWVuVGltZS5kYXRhW2l0ZW1fa2V5XSA9IGl0ZW07XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcF9rZXkgPSAwOyBwcm9wX2tleSA8IGl0ZW0ucHJvcGVydGllcy5sZW5ndGg7IHByb3Bfa2V5KyspIHtcbiAgICAgICAgICB2YXIgcHJvcCA9IGl0ZW0ucHJvcGVydGllc1twcm9wX2tleV07XG4gICAgICAgICAgLy8gaWYgcHJvcGVydHkgaXMgbm90IGRlZmluZWQgY29weSBpdFxuICAgICAgICAgIGlmICghdHdlZW5UaW1lLmRhdGFbaXRlbV9rZXldLnByb3BlcnRpZXNbcHJvcF9rZXldKSB7XG4gICAgICAgICAgICB0d2VlblRpbWUuZGF0YVtpdGVtX2tleV0ucHJvcGVydGllc1twcm9wX2tleV0gPSBwcm9wO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIHNldCBwcm9wZXJ0eSBrZXlzXG4gICAgICAgICAgICB2YXIga2V5cyA9IHR3ZWVuVGltZS5kYXRhW2l0ZW1fa2V5XS5wcm9wZXJ0aWVzW3Byb3Bfa2V5XS5rZXlzO1xuICAgICAgICAgICAgZm9yICh2YXIga2V5X2tleSA9IDA7IGtleV9rZXkgPCBwcm9wLmtleXMubGVuZ3RoOyBrZXlfa2V5KyspIHtcbiAgICAgICAgICAgICAgdmFyIGtleSA9IHByb3Aua2V5c1trZXlfa2V5XTtcbiAgICAgICAgICAgICAgaWYgKCFrZXlzW2tleV9rZXldKSB7XG4gICAgICAgICAgICAgICAga2V5c1trZXlfa2V5XSA9IGtleTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBrZXlzW2tleV9rZXldLnRpbWUgPSBrZXkudGltZTtcbiAgICAgICAgICAgICAgICBrZXlzW2tleV9rZXldLnZhbCA9IGtleS52YWw7XG4gICAgICAgICAgICAgICAga2V5c1trZXlfa2V5XS5lYXNlID0ga2V5LmVhc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdHdlZW5UaW1lLmRhdGFbaXRlbV9rZXldLl9pc0RpcnR5ID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5lZGl0b3IucmVuZGVyKGZhbHNlLCB0cnVlKTtcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9lZGl0b3IvVW5kb01hbmFnZXIuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9");
=======
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	__webpack_require__(22);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var UndoManager = function () {
	  function UndoManager(editor) {
	    var _this = this;
	
	    _classCallCheck(this, UndoManager);
	
	    this.editor = editor;
	    this.history_max = 100;
	    this.history = [];
	    this.current_index = 0;
	
	    // Add the initial state
	    this.addState();
	
	    $(document).keydown(function (e) {
	      if (e.keyCode === 90) {
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
	  }
	
	  _createClass(UndoManager, [{
	    key: 'undo',
	    value: function undo() {
	      // If there is no more history return
	      if (this.current_index <= 0) {
	        return false;
	      }
	      this.current_index -= 1;
	      this.setState(this.current_index);
	    }
	  }, {
	    key: 'redo',
	    value: function redo() {
	      // Stop if there is no more things.
	      if (this.current_index >= this.history.length - 1) {
	        return false;
	      }
	      this.current_index += 1;
	      this.setState(this.current_index);
	    }
	  }, {
	    key: 'addState',
	    value: function addState() {
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
	    }
	  }, {
	    key: 'setState',
	    value: function setState(index) {
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
	    }
	  }]);
	
	  return UndoManager;
	}();
	
	exports.default = UndoManager;
>>>>>>> master

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("var H = __webpack_require__(24);\nmodule.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||\"\");t.b(\"<div class=\\\"timeline\\\">\");t.b(\"\\n\" + i);t.b(\"  <nav class=\\\"timeline__menu\\\">\");t.b(\"\\n\" + i);t.b(\"    <a href=\\\"#\\\" class=\\\"menu-item\\\" data-action=\\\"export\\\">Export</a>\");t.b(\"\\n\" + i);t.b(\"    <a href=\\\"#\\\" class=\\\"menu-item menu-item--toggle\\\" data-action=\\\"toggle\\\"><i class=\\\"icon-toggle\\\"></i></a>\");t.b(\"\\n\" + i);t.b(\"  </nav>\");t.b(\"\\n\" + i);t.b(\"  <div class=\\\"timeline__controls controls\\\">\");t.b(\"\\n\" + i);t.b(\"    <a href=\\\"#\\\" class=\\\"control control--first icon-backward\\\"></a>\");t.b(\"\\n\" + i);t.b(\"    <a href=\\\"#\\\" class=\\\"control control--play-pause icon-play\\\"></a>\");t.b(\"\\n\" + i);t.b(\"    <a href=\\\"#\\\" class=\\\"control control--last icon-forward\\\"></a>\");t.b(\"\\n\" + i);t.b(\"    <input type=\\\"text\\\" class=\\\"control control--input control--time\\\" /> <span class=\\\"control__time-separator\\\">/</span> <input type=\\\"text\\\" class=\\\"control control--input control--time-end\\\" />\");t.b(\"\\n\" + i);t.b(\"  </div>\");t.b(\"\\n\" + i);t.b(\"  <div class=\\\"timeline__header\\\">\");t.b(\"\\n\");t.b(\"\\n\" + i);t.b(\"  </div>\");t.b(\"\\n\" + i);t.b(\"  <div class=\\\"timeline__main\\\">\");t.b(\"\\n\");t.b(\"\\n\" + i);t.b(\"  </div>\");t.b(\"\\n\" + i);t.b(\"</div>\");t.b(\"\\n\");return t.fl(); },partials: {}, subs: {  }}, \"<div class=\\\"timeline\\\">\\n  <nav class=\\\"timeline__menu\\\">\\n    <a href=\\\"#\\\" class=\\\"menu-item\\\" data-action=\\\"export\\\">Export</a>\\n    <a href=\\\"#\\\" class=\\\"menu-item menu-item--toggle\\\" data-action=\\\"toggle\\\"><i class=\\\"icon-toggle\\\"></i></a>\\n  </nav>\\n  <div class=\\\"timeline__controls controls\\\">\\n    <a href=\\\"#\\\" class=\\\"control control--first icon-backward\\\"></a>\\n    <a href=\\\"#\\\" class=\\\"control control--play-pause icon-play\\\"></a>\\n    <a href=\\\"#\\\" class=\\\"control control--last icon-forward\\\"></a>\\n    <input type=\\\"text\\\" class=\\\"control control--input control--time\\\" /> <span class=\\\"control__time-separator\\\">/</span> <input type=\\\"text\\\" class=\\\"control control--input control--time-end\\\" />\\n  </div>\\n  <div class=\\\"timeline__header\\\">\\n\\n  </div>\\n  <div class=\\\"timeline__main\\\">\\n\\n  </div>\\n</div>\\n\", H); return T.render.apply(T, arguments); };//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi90ZW1wbGF0ZXMvdGltZWxpbmUudHBsLmh0bWw/NWIwYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBLDZCQUE2Qix5QkFBeUIsd0JBQXdCLFlBQVksYUFBYSxnQ0FBZ0MsY0FBYyx3Q0FBd0MsY0FBYywrRUFBK0UsY0FBYyx3SEFBd0gsY0FBYyxnQkFBZ0IsY0FBYyxxREFBcUQsY0FBYyw2RUFBNkUsY0FBYyw4RUFBOEUsY0FBYywyRUFBMkUsY0FBYyw4TUFBOE0sY0FBYyxnQkFBZ0IsY0FBYywwQ0FBMEMsVUFBVSxjQUFjLGdCQUFnQixjQUFjLHdDQUF3QyxVQUFVLGNBQWMsZ0JBQWdCLGNBQWMsY0FBYyxVQUFVLGNBQWMsRUFBRSxhQUFhLFNBQVMsSUFBSSxxMEJBQXEwQixxQ0FBcUMiLCJmaWxlIjoiMzkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgSCA9IHJlcXVpcmUoXCJob2dhbi5qc1wiKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7IHZhciBUID0gbmV3IEguVGVtcGxhdGUoe2NvZGU6IGZ1bmN0aW9uIChjLHAsaSkgeyB2YXIgdD10aGlzO3QuYihpPWl8fFwiXCIpO3QuYihcIjxkaXYgY2xhc3M9XFxcInRpbWVsaW5lXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDxuYXYgY2xhc3M9XFxcInRpbWVsaW5lX19tZW51XFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcIm1lbnUtaXRlbVxcXCIgZGF0YS1hY3Rpb249XFxcImV4cG9ydFxcXCI+RXhwb3J0PC9hPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8YSBocmVmPVxcXCIjXFxcIiBjbGFzcz1cXFwibWVudS1pdGVtIG1lbnUtaXRlbS0tdG9nZ2xlXFxcIiBkYXRhLWFjdGlvbj1cXFwidG9nZ2xlXFxcIj48aSBjbGFzcz1cXFwiaWNvbi10b2dnbGVcXFwiPjwvaT48L2E+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8L25hdj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDxkaXYgY2xhc3M9XFxcInRpbWVsaW5lX19jb250cm9scyBjb250cm9sc1xcXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJjb250cm9sIGNvbnRyb2wtLWZpcnN0IGljb24tYmFja3dhcmRcXFwiPjwvYT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImNvbnRyb2wgY29udHJvbC0tcGxheS1wYXVzZSBpY29uLXBsYXlcXFwiPjwvYT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcImNvbnRyb2wgY29udHJvbC0tbGFzdCBpY29uLWZvcndhcmRcXFwiPjwvYT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJjb250cm9sIGNvbnRyb2wtLWlucHV0IGNvbnRyb2wtLXRpbWVcXFwiIC8+IDxzcGFuIGNsYXNzPVxcXCJjb250cm9sX190aW1lLXNlcGFyYXRvclxcXCI+Lzwvc3Bhbj4gPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJjb250cm9sIGNvbnRyb2wtLWlucHV0IGNvbnRyb2wtLXRpbWUtZW5kXFxcIiAvPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8ZGl2IGNsYXNzPVxcXCJ0aW1lbGluZV9faGVhZGVyXFxcIj5cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8L2Rpdj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDxkaXYgY2xhc3M9XFxcInRpbWVsaW5lX19tYWluXFxcIj5cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8L2Rpdj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8L2Rpdj5cIik7dC5iKFwiXFxuXCIpO3JldHVybiB0LmZsKCk7IH0scGFydGlhbHM6IHt9LCBzdWJzOiB7ICB9fSwgXCI8ZGl2IGNsYXNzPVxcXCJ0aW1lbGluZVxcXCI+XFxuICA8bmF2IGNsYXNzPVxcXCJ0aW1lbGluZV9fbWVudVxcXCI+XFxuICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJtZW51LWl0ZW1cXFwiIGRhdGEtYWN0aW9uPVxcXCJleHBvcnRcXFwiPkV4cG9ydDwvYT5cXG4gICAgPGEgaHJlZj1cXFwiI1xcXCIgY2xhc3M9XFxcIm1lbnUtaXRlbSBtZW51LWl0ZW0tLXRvZ2dsZVxcXCIgZGF0YS1hY3Rpb249XFxcInRvZ2dsZVxcXCI+PGkgY2xhc3M9XFxcImljb24tdG9nZ2xlXFxcIj48L2k+PC9hPlxcbiAgPC9uYXY+XFxuICA8ZGl2IGNsYXNzPVxcXCJ0aW1lbGluZV9fY29udHJvbHMgY29udHJvbHNcXFwiPlxcbiAgICA8YSBocmVmPVxcXCIjXFxcIiBjbGFzcz1cXFwiY29udHJvbCBjb250cm9sLS1maXJzdCBpY29uLWJhY2t3YXJkXFxcIj48L2E+XFxuICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJjb250cm9sIGNvbnRyb2wtLXBsYXktcGF1c2UgaWNvbi1wbGF5XFxcIj48L2E+XFxuICAgIDxhIGhyZWY9XFxcIiNcXFwiIGNsYXNzPVxcXCJjb250cm9sIGNvbnRyb2wtLWxhc3QgaWNvbi1mb3J3YXJkXFxcIj48L2E+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwiY29udHJvbCBjb250cm9sLS1pbnB1dCBjb250cm9sLS10aW1lXFxcIiAvPiA8c3BhbiBjbGFzcz1cXFwiY29udHJvbF9fdGltZS1zZXBhcmF0b3JcXFwiPi88L3NwYW4+IDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwiY29udHJvbCBjb250cm9sLS1pbnB1dCBjb250cm9sLS10aW1lLWVuZFxcXCIgLz5cXG4gIDwvZGl2PlxcbiAgPGRpdiBjbGFzcz1cXFwidGltZWxpbmVfX2hlYWRlclxcXCI+XFxuXFxuICA8L2Rpdj5cXG4gIDxkaXYgY2xhc3M9XFxcInRpbWVsaW5lX19tYWluXFxcIj5cXG5cXG4gIDwvZGl2PlxcbjwvZGl2PlxcblwiLCBIKTsgcmV0dXJuIFQucmVuZGVyLmFwcGx5KFQsIGFyZ3VtZW50cyk7IH07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3RlbXBsYXRlcy90aW1lbGluZS50cGwuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDM5XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9");
=======
	var H = __webpack_require__(28);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"timeline\">");t.b("\n" + i);t.b("  <nav class=\"timeline__menu\">");t.b("\n" + i);t.b("    <a href=\"#\" class=\"menu-item\" data-action=\"export\">Export</a>");t.b("\n" + i);t.b("    <a href=\"#\" class=\"menu-item menu-item--toggle\" data-action=\"toggle\"><i class=\"icon-toggle\"></i></a>");t.b("\n" + i);t.b("  </nav>");t.b("\n" + i);t.b("  <div class=\"timeline__controls controls\">");t.b("\n" + i);t.b("    <a href=\"#\" class=\"control control--first icon-first\"></a>");t.b("\n" + i);t.b("    <a href=\"#\" class=\"control control--play-pause icon-play\"></a>");t.b("\n" + i);t.b("    <a href=\"#\" class=\"control control--last icon-last\"></a>");t.b("\n" + i);t.b("    <input type=\"text\" class=\"control control--input control--time\" /> <span class=\"control__time-separator\">/</span> <input type=\"text\" class=\"control control--input control--time-end\" />");t.b("\n" + i);t.b("  </div>");t.b("\n" + i);t.b("  <div class=\"timeline__header\">");t.b("\n");t.b("\n" + i);t.b("  </div>");t.b("\n" + i);t.b("  <div class=\"timeline__main\">");t.b("\n");t.b("\n" + i);t.b("  </div>");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<div class=\"timeline\">\n  <nav class=\"timeline__menu\">\n    <a href=\"#\" class=\"menu-item\" data-action=\"export\">Export</a>\n    <a href=\"#\" class=\"menu-item menu-item--toggle\" data-action=\"toggle\"><i class=\"icon-toggle\"></i></a>\n  </nav>\n  <div class=\"timeline__controls controls\">\n    <a href=\"#\" class=\"control control--first icon-first\"></a>\n    <a href=\"#\" class=\"control control--play-pause icon-play\"></a>\n    <a href=\"#\" class=\"control control--last icon-last\"></a>\n    <input type=\"text\" class=\"control control--input control--time\" /> <span class=\"control__time-separator\">/</span> <input type=\"text\" class=\"control control--input control--time-end\" />\n  </div>\n  <div class=\"timeline__header\">\n\n  </div>\n  <div class=\"timeline__main\">\n\n  </div>\n</div>\n", H); return T.render.apply(T, arguments); };
>>>>>>> master

/***/ }
/******/ ])
});
;