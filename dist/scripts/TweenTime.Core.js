(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("signals"), require("gsap")["TweenMax"], require("gsap")["TimelineMax"], require("gsap")["Quad"], require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define(["signals", "TweenMax", "TimelineMax", "Quad", "lodash"], factory);
	else if(typeof exports === 'object')
		exports["Core"] = factory(require("signals"), require("gsap")["TweenMax"], require("gsap")["TimelineMax"], require("gsap")["Quad"], require("lodash"));
	else
		root["TweenTime"] = root["TweenTime"] || {}, root["TweenTime"]["Core"] = factory(root["signals"], root["TweenMax"], root["TimelineMax"], root["Quad"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_10__) {
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
	eval("'use strict';\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol ? \"symbol\" : typeof obj; };\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _Utils = __webpack_require__(1);\n\nvar _Utils2 = _interopRequireDefault(_Utils);\n\nvar _Timer = __webpack_require__(2);\n\nvar _Timer2 = _interopRequireDefault(_Timer);\n\nvar _Orchestrator = __webpack_require__(4);\n\nvar _Orchestrator2 = _interopRequireDefault(_Orchestrator);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar _ = __webpack_require__(6);\n\nvar Core = function () {\n  function Core(data) {\n    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];\n\n    _classCallCheck(this, Core);\n\n    this.data = data;\n    this.options = options;\n    this.timer = new _Timer2.default(options);\n    this.orchestrator = new _Orchestrator2.default(this.timer, this.data);\n  }\n\n  _createClass(Core, [{\n    key: 'addUpdateListener',\n    value: function addUpdateListener(listener) {\n      this.orchestrator.addUpdateListener(listener);\n    }\n  }, {\n    key: 'removeUpdateListener',\n    value: function removeUpdateListener(listener) {\n      this.orchestrator.removeUpdateListener(listener);\n    }\n  }, {\n    key: 'setData',\n    value: function setData(data) {\n      this.data = data;\n      this.orchestrator.setData(data);\n    }\n  }, {\n    key: 'getData',\n    value: function getData() {\n      return this.data;\n    }\n  }, {\n    key: 'getItem',\n    value: function getItem(item_id) {\n      // In case we passed the item object directly return it.\n      if (item_id && (typeof item_id === 'undefined' ? 'undefined' : _typeof(item_id)) === 'object') {\n        return item_id;\n      }\n\n      return _.find(this.data, function (item) {\n        return item.id === item_id;\n      });\n    }\n  }, {\n    key: 'getCurrentTime',\n    value: function getCurrentTime() {\n      return this.timer.getCurrentTime();\n    }\n  }, {\n    key: 'getProperty',\n    value: function getProperty(prop_name, item_id_or_obj) {\n      // If we passed the item name get the object from it.\n      var item = this.getItem(item_id_or_obj);\n\n      // Return false if we have no item\n      if (!item) {\n        return false;\n      }\n\n      return _.find(item.properties, function (property) {\n        return property.name === prop_name;\n      });\n    }\n  }, {\n    key: 'getValues',\n    value: function getValues(item_id_or_obj) {\n      // If we passed the item name get the object from it.\n      var item = this.getItem(item_id_or_obj);\n\n      // Return false if we have no item\n      if (!item) {\n        return undefined;\n      }\n\n      return item.values;\n    }\n  }, {\n    key: 'getValue',\n    value: function getValue(prop_name, item_id_or_obj) {\n      // If we passed the item name get the object from it.\n      var values = this.getValues(item_id_or_obj);\n\n      // Return false if we have no item\n      if (!values) {\n        return undefined;\n      }\n\n      if (values[prop_name] !== undefined) {\n        return values[prop_name];\n      }\n      return undefined;\n    }\n  }, {\n    key: 'getKeyAt',\n    value: function getKeyAt(property, time_in_seconds) {\n      return _.find(property.keys, function (key) {\n        return key.time === time_in_seconds;\n      });\n    }\n  }, {\n    key: 'setValue',\n    value: function setValue(property, new_val) {\n      var time_in_seconds = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];\n\n      var time = time_in_seconds;\n      if (time === false) {\n        time = this.timer.getCurrentTime() / 1000;\n      }\n      var key = this.getKeyAt(property, time);\n\n      if (key) {\n        // If we found a key, simply update the value.\n        key.val = new_val;\n      } else {\n        if (property.keys.length === 0) {\n          // If the property doesn't have any key simply the the value.\n          property.val = new_val;\n        } else {\n          // If we are not on a key but the property has other keys,\n          // create it and add it to the keys array.\n          key = { val: new_val, time: time, _property: property };\n          if (this.options.defaultEase) {\n            key.ease = this.options.defaultEase;\n          }\n          property.keys.push(key);\n          // Also sort the keys.\n          property.keys = _Utils2.default.sortKeys(property.keys);\n        }\n      }\n    }\n  }, {\n    key: 'getTotalDuration',\n    value: function getTotalDuration() {\n      return this.orchestrator.getTotalDuration();\n    }\n  }]);\n\n  return Core;\n}();\n\nmodule.exports = Core;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9Db3JlLmpzP2RjZjAiXSwibmFtZXMiOlsiXyIsInJlcXVpcmUiLCJDb3JlIiwiZGF0YSIsIm9wdGlvbnMiLCJ0aW1lciIsIm9yY2hlc3RyYXRvciIsImxpc3RlbmVyIiwiYWRkVXBkYXRlTGlzdGVuZXIiLCJyZW1vdmVVcGRhdGVMaXN0ZW5lciIsInNldERhdGEiLCJpdGVtX2lkIiwiZmluZCIsIml0ZW0iLCJpZCIsImdldEN1cnJlbnRUaW1lIiwicHJvcF9uYW1lIiwiaXRlbV9pZF9vcl9vYmoiLCJnZXRJdGVtIiwicHJvcGVydGllcyIsInByb3BlcnR5IiwibmFtZSIsInVuZGVmaW5lZCIsInZhbHVlcyIsImdldFZhbHVlcyIsInRpbWVfaW5fc2Vjb25kcyIsImtleXMiLCJrZXkiLCJ0aW1lIiwibmV3X3ZhbCIsImdldEtleUF0IiwidmFsIiwibGVuZ3RoIiwiX3Byb3BlcnR5IiwiZGVmYXVsdEVhc2UiLCJlYXNlIiwicHVzaCIsInNvcnRLZXlzIiwiZ2V0VG90YWxEdXJhdGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFKQSxJQUFJQSxJQUFJLG1CQUFBQyxDQUFRLENBQVIsQ0FBUjs7SUFNTUMsSTtBQUNKLGdCQUFZQyxJQUFaLEVBQWdDO0FBQUEsUUFBZEMsT0FBYyx5REFBSixFQUFJOztBQUFBOztBQUM5QixTQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFDQSxTQUFLQyxLQUFMLEdBQWEsb0JBQVVELE9BQVYsQ0FBYjtBQUNBLFNBQUtFLFlBQUwsR0FBb0IsMkJBQWlCLEtBQUtELEtBQXRCLEVBQTZCLEtBQUtGLElBQWxDLENBQXBCO0FBQ0Q7Ozs7c0NBRWlCSSxRLEVBQVU7QUFDMUIsV0FBS0QsWUFBTCxDQUFrQkUsaUJBQWxCLENBQW9DRCxRQUFwQztBQUNEOzs7eUNBRW9CQSxRLEVBQVU7QUFDN0IsV0FBS0QsWUFBTCxDQUFrQkcsb0JBQWxCLENBQXVDRixRQUF2QztBQUNEOzs7NEJBRU9KLEksRUFBTTtBQUNaLFdBQUtBLElBQUwsR0FBWUEsSUFBWjtBQUNBLFdBQUtHLFlBQUwsQ0FBa0JJLE9BQWxCLENBQTBCUCxJQUExQjtBQUNEOzs7OEJBRVM7QUFDUixhQUFPLEtBQUtBLElBQVo7QUFDRDs7OzRCQUVPUSxPLEVBQVM7QUFDZjtBQUNBLFVBQUlBLFdBQVcsUUFBT0EsT0FBUCx5Q0FBT0EsT0FBUCxPQUFtQixRQUFsQyxFQUE0QztBQUMxQyxlQUFPQSxPQUFQO0FBQ0Q7O0FBRUQsYUFBT1gsRUFBRVksSUFBRixDQUFPLEtBQUtULElBQVosRUFBa0IsVUFBQ1UsSUFBRDtBQUFBLGVBQVVBLEtBQUtDLEVBQUwsS0FBWUgsT0FBdEI7QUFBQSxPQUFsQixDQUFQO0FBQ0Q7OztxQ0FFZ0I7QUFDZixhQUFPLEtBQUtOLEtBQUwsQ0FBV1UsY0FBWCxFQUFQO0FBQ0Q7OztnQ0FFV0MsUyxFQUFXQyxjLEVBQWdCO0FBQ3JDO0FBQ0EsVUFBSUosT0FBTyxLQUFLSyxPQUFMLENBQWFELGNBQWIsQ0FBWDs7QUFFQTtBQUNBLFVBQUksQ0FBQ0osSUFBTCxFQUFXO0FBQ1QsZUFBTyxLQUFQO0FBQ0Q7O0FBRUQsYUFBT2IsRUFBRVksSUFBRixDQUFPQyxLQUFLTSxVQUFaLEVBQXdCO0FBQUEsZUFBWUMsU0FBU0MsSUFBVCxLQUFrQkwsU0FBOUI7QUFBQSxPQUF4QixDQUFQO0FBQ0Q7Ozs4QkFFU0MsYyxFQUFnQjtBQUN4QjtBQUNBLFVBQUlKLE9BQU8sS0FBS0ssT0FBTCxDQUFhRCxjQUFiLENBQVg7O0FBRUE7QUFDQSxVQUFJLENBQUNKLElBQUwsRUFBVztBQUNULGVBQU9TLFNBQVA7QUFDRDs7QUFFRCxhQUFPVCxLQUFLVSxNQUFaO0FBQ0Q7Ozs2QkFFUVAsUyxFQUFXQyxjLEVBQWdCO0FBQ2xDO0FBQ0EsVUFBSU0sU0FBUyxLQUFLQyxTQUFMLENBQWVQLGNBQWYsQ0FBYjs7QUFFQTtBQUNBLFVBQUksQ0FBQ00sTUFBTCxFQUFhO0FBQ1gsZUFBT0QsU0FBUDtBQUNEOztBQUVELFVBQUlDLE9BQU9QLFNBQVAsTUFBc0JNLFNBQTFCLEVBQXFDO0FBQ25DLGVBQU9DLE9BQU9QLFNBQVAsQ0FBUDtBQUNEO0FBQ0QsYUFBT00sU0FBUDtBQUNEOzs7NkJBRVFGLFEsRUFBVUssZSxFQUFpQjtBQUNsQyxhQUFPekIsRUFBRVksSUFBRixDQUFPUSxTQUFTTSxJQUFoQixFQUFzQjtBQUFBLGVBQU9DLElBQUlDLElBQUosS0FBYUgsZUFBcEI7QUFBQSxPQUF0QixDQUFQO0FBQ0Q7Ozs2QkFFUUwsUSxFQUFVUyxPLEVBQWtDO0FBQUEsVUFBekJKLGVBQXlCLHlEQUFQLEtBQU87O0FBQ25ELFVBQUlHLE9BQU9ILGVBQVg7QUFDQSxVQUFJRyxTQUFTLEtBQWIsRUFBb0I7QUFDbEJBLGVBQU8sS0FBS3ZCLEtBQUwsQ0FBV1UsY0FBWCxLQUE4QixJQUFyQztBQUNEO0FBQ0QsVUFBSVksTUFBTSxLQUFLRyxRQUFMLENBQWNWLFFBQWQsRUFBd0JRLElBQXhCLENBQVY7O0FBRUEsVUFBSUQsR0FBSixFQUFTO0FBQ1A7QUFDQUEsWUFBSUksR0FBSixHQUFVRixPQUFWO0FBQ0QsT0FIRCxNQUlLO0FBQ0gsWUFBSVQsU0FBU00sSUFBVCxDQUFjTSxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQzlCO0FBQ0FaLG1CQUFTVyxHQUFULEdBQWVGLE9BQWY7QUFDRCxTQUhELE1BSUs7QUFDSDtBQUNBO0FBQ0FGLGdCQUFNLEVBQUNJLEtBQUtGLE9BQU4sRUFBZUQsTUFBTUEsSUFBckIsRUFBMkJLLFdBQVdiLFFBQXRDLEVBQU47QUFDQSxjQUFJLEtBQUtoQixPQUFMLENBQWE4QixXQUFqQixFQUE4QjtBQUM1QlAsZ0JBQUlRLElBQUosR0FBVyxLQUFLL0IsT0FBTCxDQUFhOEIsV0FBeEI7QUFDRDtBQUNEZCxtQkFBU00sSUFBVCxDQUFjVSxJQUFkLENBQW1CVCxHQUFuQjtBQUNBO0FBQ0FQLG1CQUFTTSxJQUFULEdBQWdCLGdCQUFNVyxRQUFOLENBQWVqQixTQUFTTSxJQUF4QixDQUFoQjtBQUNEO0FBQ0Y7QUFDRjs7O3VDQUVrQjtBQUNqQixhQUFPLEtBQUtwQixZQUFMLENBQWtCZ0MsZ0JBQWxCLEVBQVA7QUFDRDs7Ozs7O0FBR0hDLE9BQU9DLE9BQVAsR0FBaUJ0QyxJQUFqQiIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuaW1wb3J0IFV0aWxzIGZyb20gJy4vY29yZS9VdGlscyc7XG5pbXBvcnQgVGltZXIgZnJvbSAnLi9jb3JlL1RpbWVyJztcbmltcG9ydCBPcmNoZXN0cmF0b3IgZnJvbSAnLi9jb3JlL09yY2hlc3RyYXRvcic7XG5cbmNsYXNzIENvcmUge1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy50aW1lciA9IG5ldyBUaW1lcihvcHRpb25zKTtcbiAgICB0aGlzLm9yY2hlc3RyYXRvciA9IG5ldyBPcmNoZXN0cmF0b3IodGhpcy50aW1lciwgdGhpcy5kYXRhKTtcbiAgfVxuXG4gIGFkZFVwZGF0ZUxpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5vcmNoZXN0cmF0b3IuYWRkVXBkYXRlTGlzdGVuZXIobGlzdGVuZXIpO1xuICB9XG5cbiAgcmVtb3ZlVXBkYXRlTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICB0aGlzLm9yY2hlc3RyYXRvci5yZW1vdmVVcGRhdGVMaXN0ZW5lcihsaXN0ZW5lcik7XG4gIH1cblxuICBzZXREYXRhKGRhdGEpIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMub3JjaGVzdHJhdG9yLnNldERhdGEoZGF0YSk7XG4gIH1cblxuICBnZXREYXRhKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGE7XG4gIH1cblxuICBnZXRJdGVtKGl0ZW1faWQpIHtcbiAgICAvLyBJbiBjYXNlIHdlIHBhc3NlZCB0aGUgaXRlbSBvYmplY3QgZGlyZWN0bHkgcmV0dXJuIGl0LlxuICAgIGlmIChpdGVtX2lkICYmIHR5cGVvZiBpdGVtX2lkID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIGl0ZW1faWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIF8uZmluZCh0aGlzLmRhdGEsIChpdGVtKSA9PiBpdGVtLmlkID09PSBpdGVtX2lkKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVyLmdldEN1cnJlbnRUaW1lKCk7XG4gIH1cblxuICBnZXRQcm9wZXJ0eShwcm9wX25hbWUsIGl0ZW1faWRfb3Jfb2JqKSB7XG4gICAgLy8gSWYgd2UgcGFzc2VkIHRoZSBpdGVtIG5hbWUgZ2V0IHRoZSBvYmplY3QgZnJvbSBpdC5cbiAgICBsZXQgaXRlbSA9IHRoaXMuZ2V0SXRlbShpdGVtX2lkX29yX29iaik7XG5cbiAgICAvLyBSZXR1cm4gZmFsc2UgaWYgd2UgaGF2ZSBubyBpdGVtXG4gICAgaWYgKCFpdGVtKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIF8uZmluZChpdGVtLnByb3BlcnRpZXMsIHByb3BlcnR5ID0+IHByb3BlcnR5Lm5hbWUgPT09IHByb3BfbmFtZSk7XG4gIH1cblxuICBnZXRWYWx1ZXMoaXRlbV9pZF9vcl9vYmopIHtcbiAgICAvLyBJZiB3ZSBwYXNzZWQgdGhlIGl0ZW0gbmFtZSBnZXQgdGhlIG9iamVjdCBmcm9tIGl0LlxuICAgIGxldCBpdGVtID0gdGhpcy5nZXRJdGVtKGl0ZW1faWRfb3Jfb2JqKTtcblxuICAgIC8vIFJldHVybiBmYWxzZSBpZiB3ZSBoYXZlIG5vIGl0ZW1cbiAgICBpZiAoIWl0ZW0pIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW0udmFsdWVzO1xuICB9XG5cbiAgZ2V0VmFsdWUocHJvcF9uYW1lLCBpdGVtX2lkX29yX29iaikge1xuICAgIC8vIElmIHdlIHBhc3NlZCB0aGUgaXRlbSBuYW1lIGdldCB0aGUgb2JqZWN0IGZyb20gaXQuXG4gICAgdmFyIHZhbHVlcyA9IHRoaXMuZ2V0VmFsdWVzKGl0ZW1faWRfb3Jfb2JqKTtcblxuICAgIC8vIFJldHVybiBmYWxzZSBpZiB3ZSBoYXZlIG5vIGl0ZW1cbiAgICBpZiAoIXZhbHVlcykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodmFsdWVzW3Byb3BfbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHZhbHVlc1twcm9wX25hbWVdO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0S2V5QXQocHJvcGVydHksIHRpbWVfaW5fc2Vjb25kcykge1xuICAgIHJldHVybiBfLmZpbmQocHJvcGVydHkua2V5cywga2V5ID0+IGtleS50aW1lID09PSB0aW1lX2luX3NlY29uZHMpO1xuICB9XG5cbiAgc2V0VmFsdWUocHJvcGVydHksIG5ld192YWwsIHRpbWVfaW5fc2Vjb25kcyA9IGZhbHNlKSB7XG4gICAgbGV0IHRpbWUgPSB0aW1lX2luX3NlY29uZHM7XG4gICAgaWYgKHRpbWUgPT09IGZhbHNlKSB7XG4gICAgICB0aW1lID0gdGhpcy50aW1lci5nZXRDdXJyZW50VGltZSgpIC8gMTAwMDtcbiAgICB9XG4gICAgdmFyIGtleSA9IHRoaXMuZ2V0S2V5QXQocHJvcGVydHksIHRpbWUpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgLy8gSWYgd2UgZm91bmQgYSBrZXksIHNpbXBseSB1cGRhdGUgdGhlIHZhbHVlLlxuICAgICAga2V5LnZhbCA9IG5ld192YWw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKHByb3BlcnR5LmtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIElmIHRoZSBwcm9wZXJ0eSBkb2Vzbid0IGhhdmUgYW55IGtleSBzaW1wbHkgdGhlIHRoZSB2YWx1ZS5cbiAgICAgICAgcHJvcGVydHkudmFsID0gbmV3X3ZhbDtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAvLyBJZiB3ZSBhcmUgbm90IG9uIGEga2V5IGJ1dCB0aGUgcHJvcGVydHkgaGFzIG90aGVyIGtleXMsXG4gICAgICAgIC8vIGNyZWF0ZSBpdCBhbmQgYWRkIGl0IHRvIHRoZSBrZXlzIGFycmF5LlxuICAgICAgICBrZXkgPSB7dmFsOiBuZXdfdmFsLCB0aW1lOiB0aW1lLCBfcHJvcGVydHk6IHByb3BlcnR5fTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWZhdWx0RWFzZSkge1xuICAgICAgICAgIGtleS5lYXNlID0gdGhpcy5vcHRpb25zLmRlZmF1bHRFYXNlO1xuICAgICAgICB9XG4gICAgICAgIHByb3BlcnR5LmtleXMucHVzaChrZXkpO1xuICAgICAgICAvLyBBbHNvIHNvcnQgdGhlIGtleXMuXG4gICAgICAgIHByb3BlcnR5LmtleXMgPSBVdGlscy5zb3J0S2V5cyhwcm9wZXJ0eS5rZXlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRUb3RhbER1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm9yY2hlc3RyYXRvci5nZXRUb3RhbER1cmF0aW9uKCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb3JlO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9Db3JlLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");
=======
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
	
	var _ = __webpack_require__(10);
	
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
>>>>>>> master

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Utils = function () {\n  function Utils() {\n    _classCallCheck(this, Utils);\n  }\n\n  _createClass(Utils, null, [{\n    key: 'formatMinutes',\n    value: function formatMinutes(d) {\n      // convert milliseconds to seconds\n      var seconds = d / 1000;\n      var hours = Math.floor(seconds / 3600);\n      var minutes = Math.floor((seconds - hours * 3600) / 60);\n      seconds = seconds - minutes * 60;\n      var output = seconds + 's';\n      if (minutes) {\n        output = minutes + 'm ' + output;\n      }\n      if (hours) {\n        output = hours + 'h ' + output;\n      }\n      return output;\n    }\n  }, {\n    key: 'getClosestTime',\n    value: function getClosestTime(data, time) {\n      var objectId = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];\n      var property_name = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];\n      var timer = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];\n      var tolerance = arguments.length <= 5 || arguments[5] === undefined ? 0.1 : arguments[5];\n\n      if (timer) {\n        var timer_time = timer.getCurrentTime() / 1000;\n        if (Math.abs(timer_time - time) <= tolerance) {\n          return timer_time;\n        }\n      }\n\n      if (objectId || property_name) {\n        for (var i = 0; i < data.length; i++) {\n          var item = data[i];\n          // Don't match item with itself, but allow property to match item start/end.\n          if (item.id !== objectId || property_name) {\n            // First check start & end.\n            if (Math.abs(item.start - time) <= tolerance) {\n              return item.start;\n            }\n\n            if (Math.abs(item.end - time) <= tolerance) {\n              return item.end;\n            }\n          }\n\n          // Test properties keys\n          for (var j = 0; j < item.properties.length; j++) {\n            var prop = item.properties[j];\n\n            // Don't match property with itself.\n            if (prop.keys && (item.id !== objectId || prop.name !== property_name)) {\n              for (var k = 0; k < prop.keys.length; k++) {\n                var key = prop.keys[k];\n                if (Math.abs(key.time - time) <= tolerance) {\n                  return key.time;\n                }\n              }\n            }\n          }\n        }\n      }\n      return false;\n    }\n  }, {\n    key: 'getPreviousKey',\n    value: function getPreviousKey(keys, time) {\n      var prevKey = false;\n      for (var i = 0; i < keys.length; i++) {\n        var key = keys[i];\n        if (key.time < time) {\n          prevKey = key;\n        } else {\n          return prevKey;\n        }\n      }\n      return prevKey;\n    }\n  }, {\n    key: 'sortKeys',\n    value: function sortKeys(keys) {\n      var compare = function compare(a, b) {\n        if (a.time < b.time) {\n          return -1;\n        }\n        if (a.time > b.time) {\n          return 1;\n        }\n        return 0;\n      };\n      return keys.sort(compare);\n    }\n  }, {\n    key: 'guid',\n    value: function guid() {\n      var s4 = function s4() {\n        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);\n      };\n      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();\n    }\n  }]);\n\n  return Utils;\n}();\n\nexports.default = Utils;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb3JlL1V0aWxzLmpzPzhkMmYiXSwibmFtZXMiOlsiVXRpbHMiLCJkIiwic2Vjb25kcyIsImhvdXJzIiwiTWF0aCIsImZsb29yIiwibWludXRlcyIsIm91dHB1dCIsImRhdGEiLCJ0aW1lIiwib2JqZWN0SWQiLCJwcm9wZXJ0eV9uYW1lIiwidGltZXIiLCJ0b2xlcmFuY2UiLCJ0aW1lcl90aW1lIiwiZ2V0Q3VycmVudFRpbWUiLCJhYnMiLCJpIiwibGVuZ3RoIiwiaXRlbSIsImlkIiwic3RhcnQiLCJlbmQiLCJqIiwicHJvcGVydGllcyIsInByb3AiLCJrZXlzIiwibmFtZSIsImsiLCJrZXkiLCJwcmV2S2V5IiwiY29tcGFyZSIsImEiLCJiIiwic29ydCIsInM0IiwicmFuZG9tIiwidG9TdHJpbmciLCJzdWJzdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBcUJBLEs7Ozs7Ozs7a0NBQ0VDLEMsRUFBRztBQUN0QjtBQUNBLFVBQUlDLFVBQVVELElBQUksSUFBbEI7QUFDQSxVQUFJRSxRQUFRQyxLQUFLQyxLQUFMLENBQVdILFVBQVUsSUFBckIsQ0FBWjtBQUNBLFVBQUlJLFVBQVVGLEtBQUtDLEtBQUwsQ0FBVyxDQUFDSCxVQUFVQyxRQUFRLElBQW5CLElBQTJCLEVBQXRDLENBQWQ7QUFDQUQsZ0JBQVVBLFVBQVVJLFVBQVUsRUFBOUI7QUFDQSxVQUFJQyxTQUFTTCxVQUFVLEdBQXZCO0FBQ0EsVUFBSUksT0FBSixFQUFhO0FBQ1hDLGlCQUFTRCxVQUFVLElBQVYsR0FBaUJDLE1BQTFCO0FBQ0Q7QUFDRCxVQUFJSixLQUFKLEVBQVc7QUFDVEksaUJBQVNKLFFBQVEsSUFBUixHQUFlSSxNQUF4QjtBQUNEO0FBQ0QsYUFBT0EsTUFBUDtBQUNEOzs7bUNBRXFCQyxJLEVBQU1DLEksRUFBK0U7QUFBQSxVQUF6RUMsUUFBeUUseURBQTlELEtBQThEO0FBQUEsVUFBdkRDLGFBQXVELHlEQUF2QyxLQUF1QztBQUFBLFVBQWhDQyxL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QyxDQUFtRCxFQUFuRCxFQUF1REMsU0FBdkQsQ0FBaUUsQ0FBakUsQ0FBUDtBQUNELE9BRkQ7QUFHQSxhQUFPSCxPQUFPQSxJQUFQLEdBQWMsR0FBZCxHQUFvQkEsSUFBcEIsR0FBMkIsR0FBM0IsR0FBaUNBLElBQWpDLEdBQXdDLEdBQXhDLEdBQThDQSxJQUE5QyxHQUFxRCxHQUFyRCxHQUEyREEsSUFBM0QsR0FBa0VBLElBQWxFLEdBQXlFQSxJQUFoRjtBQUNEOzs7Ozs7a0JBM0ZrQm5DLEsiLCJmaWxlIjoiMS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIFV0aWxzIHtcbiAgc3RhdGljIGZvcm1hdE1pbnV0ZXMoZCkge1xuICAgIC8vIGNvbnZlcnQgbWlsbGlzZWNvbmRzIHRvIHNlY29uZHNcbiAgICBsZXQgc2Vjb25kcyA9IGQgLyAxMDAwO1xuICAgIGxldCBob3VycyA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcigoc2Vjb25kcyAtIGhvdXJzICogMzYwMCkgLyA2MCk7XG4gICAgc2Vjb25kcyA9IHNlY29uZHMgLSBtaW51dGVzICogNjA7XG4gICAgbGV0IG91dHB1dCA9IHNlY29uZHMgKyAncyc7XG4gICAgaWYgKG1pbnV0ZXMpIHtcbiAgICAgIG91dHB1dCA9IG1pbnV0ZXMgKyAnbSAnICsgb3V0cHV0O1xuICAgIH1cbiAgICBpZiAoaG91cnMpIHtcbiAgICAgIG91dHB1dCA9IGhvdXJzICsgJ2ggJyArIG91dHB1dDtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIHN0YXRpYyBnZXRDbG9zZXN0VGltZShkYXRhLCB0aW1lLCBvYmplY3RJZCA9IGZhbHNlLCBwcm9wZXJ0eV9uYW1lID0gZmFsc2UsIHRpbWVyID0gZmFsc2UsIHRvbGVyYW5jZSA9IDAuMSkge1xuICAgIGlmICh0aW1lcikge1xuICAgICAgdmFyIHRpbWVyX3RpbWUgPSB0aW1lci5nZXRDdXJyZW50VGltZSgpIC8gMTAwMDtcbiAgICAgIGlmIChNYXRoLmFicyh0aW1lcl90aW1lIC0gdGltZSkgPD0gdG9sZXJhbmNlKSB7XG4gICAgICAgIHJldHVybiB0aW1lcl90aW1lO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvYmplY3RJZCB8fCBwcm9wZXJ0eV9uYW1lKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgICAvLyBEb24ndCBtYXRjaCBpdGVtIHdpdGggaXRzZWxmLCBidXQgYWxsb3cgcHJvcGVydHkgdG8gbWF0Y2ggaXRlbSBzdGFydC9lbmQuXG4gICAgICAgIGlmIChpdGVtLmlkICE9PSBvYmplY3RJZCB8fCBwcm9wZXJ0eV9uYW1lKSB7XG4gICAgICAgICAgLy8gRmlyc3QgY2hlY2sgc3RhcnQgJiBlbmQuXG4gICAgICAgICAgaWYgKE1hdGguYWJzKGl0ZW0uc3RhcnQgLSB0aW1lKSA8PSB0b2xlcmFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLnN0YXJ0O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChNYXRoLmFicyhpdGVtLmVuZCAtIHRpbWUpIDw9IHRvbGVyYW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uZW5kO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRlc3QgcHJvcGVydGllcyBrZXlzXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaXRlbS5wcm9wZXJ0aWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgdmFyIHByb3AgPSBpdGVtLnByb3BlcnRpZXNbal07XG5cbiAgICAgICAgICAvLyBEb24ndCBtYXRjaCBwcm9wZXJ0eSB3aXRoIGl0c2VsZi5cbiAgICAgICAgICBpZiAocHJvcC5rZXlzICYmIChpdGVtLmlkICE9PSBvYmplY3RJZCB8fCBwcm9wLm5hbWUgIT09IHByb3BlcnR5X25hbWUpKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHByb3Aua2V5cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICB2YXIga2V5ID0gcHJvcC5rZXlzW2tdO1xuICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoa2V5LnRpbWUgLSB0aW1lKSA8PSB0b2xlcmFuY2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5LnRpbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3RhdGljIGdldFByZXZpb3VzS2V5KGtleXMsIHRpbWUpIHtcbiAgICB2YXIgcHJldktleSA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoa2V5LnRpbWUgPCB0aW1lKSB7XG4gICAgICAgIHByZXZLZXkgPSBrZXk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHByZXZLZXk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwcmV2S2V5O1xuICB9XG5cbiAgc3RhdGljIHNvcnRLZXlzKGtleXMpIHtcbiAgICB2YXIgY29tcGFyZSA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIGlmIChhLnRpbWUgPCBiLnRpbWUpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgaWYgKGEudGltZSA+IGIudGltZSkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH07XG4gICAgcmV0dXJuIGtleXMuc29ydChjb21wYXJlKTtcbiAgfVxuXG4gIHN0YXRpYyBndWlkKCkge1xuICAgIHZhciBzNCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMSk7XG4gICAgfTtcbiAgICByZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XG4gIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vY29yZS9VdGlscy5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Signals = __webpack_require__(3);\n\nvar Timer = function () {\n  function Timer() {\n    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];\n\n    _classCallCheck(this, Timer);\n\n    // in millisecond\n    this.totalDuration = options.totalDuration || 240 * 1000;\n    // Use an array for the time for easier d3.js integration (used as data for timeseeker).\n    this.time = [0];\n    this.is_playing = false;\n    this.last_timeStamp = -1;\n    this.last_time = -1;\n    this.updated = new Signals.Signal();\n    this.statusChanged = new Signals.Signal();\n    this.durationChanged = new Signals.Signal();\n    this.seeked = new Signals.Signal();\n    this.update = this.update.bind(this);\n    window.requestAnimationFrame(this.update);\n  }\n\n  _createClass(Timer, [{\n    key: 'getCurrentTime',\n    value: function getCurrentTime() {\n      return this.time[0];\n    }\n  }, {\n    key: 'getDuration',\n    value: function getDuration() {\n      return this.totalDuration / 1000;\n    }\n  }, {\n    key: 'setDuration',\n    value: function setDuration(seconds) {\n      this.totalDuration = seconds * 1000;\n      this.durationChanged.dispatch(seconds);\n    }\n  }, {\n    key: 'play',\n    value: function play() {\n      this.is_playing = true;\n      this.statusChanged.dispatch(this.is_playing);\n    }\n  }, {\n    key: 'stop',\n    value: function stop() {\n      this.is_playing = false;\n      this.statusChanged.dispatch(this.is_playing);\n    }\n  }, {\n    key: 'toggle',\n    value: function toggle() {\n      this.is_playing = !this.is_playing;\n      this.statusChanged.dispatch(this.is_playing);\n    }\n  }, {\n    key: 'seek',\n    value: function seek(time) {\n      this.time[0] = time[0];\n      this.seeked.dispatch(this.time[0]);\n    }\n  }, {\n    key: 'update',\n    value: function update(timestamp) {\n      // Init timestamp\n      if (this.last_timeStamp === -1) {\n        this.last_timeStamp = timestamp;\n      }\n      var elapsed = timestamp - this.last_timeStamp;\n\n      if (this.is_playing) {\n        this.time[0] += elapsed;\n      }\n\n      if (this.time[0] >= this.totalDuration) {\n        // Stop timer when reaching the end.\n        this.time[0] = this.totalDuration;\n        this.stop();\n      }\n\n      this.updated.dispatch(this.time[0]);\n\n      this.last_timeStamp = timestamp;\n      this.last_time = this.time[0];\n      window.requestAnimationFrame(this.update);\n    }\n  }]);\n\n  return Timer;\n}();\n\nexports.default = Timer;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb3JlL1RpbWVyLmpzP2Q0YmUiXSwibmFtZXMiOlsiU2lnbmFscyIsInJlcXVpcmUiLCJUaW1lciIsIm9wdGlvbnMiLCJ0b3RhbER1cmF0aW9uIiwidGltZSIsImlzX3BsYXlpbmciLCJsYXN0X3RpbWVTdGFtcCIsImxhc3RfdGltZSIsInVwZGF0ZWQiLCJTaWduYWwiLCJzdGF0dXNDaGFuZ2VkIiwiZHVyYXRpb25DaGFuZ2VkIiwic2Vla2VkIiwidXBkYXRlIiwiYmluZCIsIndpbmRvdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInNlY29uZHMiLCJkaXNwYXRjaCIsInRpbWVzdGFtcCIsImVsYXBzZWQiLCJzdG9wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBSUEsVUFBVSxtQkFBQUMsQ0FBUSxDQUFSLENBQWQ7O0lBRXFCQyxLO0FBQ25CLG1CQUEwQjtBQUFBLFFBQWRDLE9BQWMseURBQUosRUFBSTs7QUFBQTs7QUFDeEI7QUFDQSxTQUFLQyxhQUFMLEdBQXFCRCxRQUFRQyxhQUFSLElBQXlCLE1BQU0sSUFBcEQ7QUFDQTtBQUNBLFNBQUtDLElBQUwsR0FBWSxDQUFDLENBQUQsQ0FBWjtBQUNBLFNBQUtDLFVBQUwsR0FBa0IsS0FBbEI7QUFDQSxTQUFLQyxjQUFMLEdBQXNCLENBQUMsQ0FBdkI7QUFDQSxTQUFLQyxTQUFMLEdBQWlCLENBQUMsQ0FBbEI7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBSVQsUUFBUVUsTUFBWixFQUFmO0FBQ0EsU0FBS0MsYUFBTCxHQUFxQixJQUFJWCxRQUFRVSxNQUFaLEVBQXJCO0FBQ0EsU0FBS0UsZUFBTCxHQUF1QixJQUFJWixRQUFRVSxNQUFaLEVBQXZCO0FBQ0EsU0FBS0csTUFBTCxHQUFjLElBQUliLFFBQVFVLE1BQVosRUFBZDtBQUNBLFNBQUtJLE1BQUwsR0FBYyxLQUFLQSxNQUFMLENBQVlDLElBQVosQ0FBaUIsSUFBakIsQ0FBZDtBQUNBQyxXQUFPQyxxQkFBUCxDQUE2QixLQUFLSCxNQUFsQztBQUNEOzs7O3FDQUVnQjtBQUNmLGFBQU8sS0FBS1QsSUFBTCxDQUFVLENBQVYsQ0FBUDtBQUNEOzs7a0NBRWE7QUFDWixhQUFPLEtBQUtELGFBQUwsR0FBcUIsSUFBNUI7QUFDRDs7O2dDQUVXYyxPLEVBQVM7QUFDbkIsV0FBS2QsYUFBTCxHQUFxQmMsVUFBVSxJQUEvQjtBQUNBLFdBQUtOLGVBQUwsQ0FBcUJPLFFBQXJCLENBQThCRCxPQUE5QjtBQUNEOzs7MkJBRU07QUFDTCxXQUFLWixVQUFMLEdBQWtCLElBQWxCO0FBQ0EsV0FBS0ssYUFBTCxDQUFtQlEsUUFBbkIsQ0FBNEIsS0FBS2IsVUFBakM7QUFDRDs7OzJCQUVNO0FBQ0wsV0FBS0EsVUFBTCxHQUFrQixLQUFsQjtBQUNBLFdBQUtLLGFBQUwsQ0FBbUJRLFFBQW5CLENBQTRCLEtBQUtiLFVBQWpDO0FBQ0Q7Ozs2QkFFUTtBQUNQLFdBQUtBLFVBQUwsR0FBa0IsQ0FBQyxLQUFLQSxVQUF4QjtBQUNBLFdBQUtLLGFBQUwsQ0FBbUJRLFFBQW5CLENBQTRCLEtBQUtiLFVBQWpDO0FBQ0Q7Ozt5QkFFSUQsSSxFQUFNO0FBQ1QsV0FBS0EsSUFBTCxDQUFVLENBQVYsSUFBZUEsS0FBSyxDQUFMLENBQWY7QUFDQSxXQUFLUSxNQUFMLENBQVlNLFFBQVosQ0FBcUIsS0FBS2QsSUFBTCxDQUFVLENBQVYsQ0FBckI7QUFDRDs7OzJCQUVNZSxTLEVBQVc7QUFDaEI7QUFDQSxVQUFJLEtBQUtiLGNBQUwsS0FBd0IsQ0FBQyxDQUE3QixFQUFnQztBQUM5QixhQUFLQSxjQUFMLEdBQXNCYSxTQUF0QjtBQUNEO0FBQ0QsVUFBSUMsVUFBVUQsWUFBWSxLQUFLYixjQUEvQjs7QUFFQSxVQUFJLEtBQUtELFVBQVQsRUFBcUI7QUFDbkIsYUFBS0QsSUFBTCxDQUFVLENBQVYsS0FBZ0JnQixPQUFoQjtBQUNEOztBQUVELFVBQUksS0FBS2hCLElBQUwsQ0FBVSxDQUFWLEtBQWdCLEtBQUtELGFBQXpCLEVBQXdDO0FBQ3RDO0FBQ0EsYUFBS0MsSUFBTCxDQUFVLENBQVYsSUFBZSxLQUFLRCxhQUFwQjtBQUNBLGFBQUtrQixJQUFMO0FBQ0Q7O0FBRUQsV0FBS2IsT0FBTCxDQUFhVSxRQUFiLENBQXNCLEtBQUtkLElBQUwsQ0FBVSxDQUFWLENBQXRCOztBQUVBLFdBQUtFLGNBQUwsR0FBc0JhLFNBQXRCO0FBQ0EsV0FBS1osU0FBTCxHQUFpQixLQUFLSCxJQUFMLENBQVUsQ0FBVixDQUFqQjtBQUNBVyxhQUFPQyxxQkFBUCxDQUE2QixLQUFLSCxNQUFsQztBQUNEOzs7Ozs7a0JBeEVrQlosSyIsImZpbGUiOiIyLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IFNpZ25hbHMgPSByZXF1aXJlKCdqcy1zaWduYWxzJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gaW4gbWlsbGlzZWNvbmRcbiAgICB0aGlzLnRvdGFsRHVyYXRpb24gPSBvcHRpb25zLnRvdGFsRHVyYXRpb24gfHwgMjQwICogMTAwMDtcbiAgICAvLyBVc2UgYW4gYXJyYXkgZm9yIHRoZSB0aW1lIGZvciBlYXNpZXIgZDMuanMgaW50ZWdyYXRpb24gKHVzZWQgYXMgZGF0YSBmb3IgdGltZXNlZWtlcikuXG4gICAgdGhpcy50aW1lID0gWzBdO1xuICAgIHRoaXMuaXNfcGxheWluZyA9IGZhbHNlO1xuICAgIHRoaXMubGFzdF90aW1lU3RhbXAgPSAtMTtcbiAgICB0aGlzLmxhc3RfdGltZSA9IC0xO1xuICAgIHRoaXMudXBkYXRlZCA9IG5ldyBTaWduYWxzLlNpZ25hbCgpO1xuICAgIHRoaXMuc3RhdHVzQ2hhbmdlZCA9IG5ldyBTaWduYWxzLlNpZ25hbCgpO1xuICAgIHRoaXMuZHVyYXRpb25DaGFuZ2VkID0gbmV3IFNpZ25hbHMuU2lnbmFsKCk7XG4gICAgdGhpcy5zZWVrZWQgPSBuZXcgU2lnbmFscy5TaWduYWwoKTtcbiAgICB0aGlzLnVwZGF0ZSA9IHRoaXMudXBkYXRlLmJpbmQodGhpcyk7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZSk7XG4gIH1cblxuICBnZXRDdXJyZW50VGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lWzBdO1xuICB9XG5cbiAgZ2V0RHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudG90YWxEdXJhdGlvbiAvIDEwMDA7XG4gIH1cblxuICBzZXREdXJhdGlvbihzZWNvbmRzKSB7XG4gICAgdGhpcy50b3RhbER1cmF0aW9uID0gc2Vjb25kcyAqIDEwMDA7XG4gICAgdGhpcy5kdXJhdGlvbkNoYW5nZWQuZGlzcGF0Y2goc2Vjb25kcyk7XG4gIH1cblxuICBwbGF5KCkge1xuICAgIHRoaXMuaXNfcGxheWluZyA9IHRydWU7XG4gICAgdGhpcy5zdGF0dXNDaGFuZ2VkLmRpc3BhdGNoKHRoaXMuaXNfcGxheWluZyk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuaXNfcGxheWluZyA9IGZhbHNlO1xuICAgIHRoaXMuc3RhdHVzQ2hhbmdlZC5kaXNwYXRjaCh0aGlzLmlzX3BsYXlpbmcpO1xuICB9XG5cbiAgdG9nZ2xlKCkge1xuICAgIHRoaXMuaXNfcGxheWluZyA9ICF0aGlzLmlzX3BsYXlpbmc7XG4gICAgdGhpcy5zdGF0dXNDaGFuZ2VkLmRpc3BhdGNoKHRoaXMuaXNfcGxheWluZyk7XG4gIH1cblxuICBzZWVrKHRpbWUpIHtcbiAgICB0aGlzLnRpbWVbMF0gPSB0aW1lWzBdO1xuICAgIHRoaXMuc2Vla2VkLmRpc3BhdGNoKHRoaXMudGltZVswXSk7XG4gIH1cblxuICB1cGRhdGUodGltZXN0YW1wKSB7XG4gICAgLy8gSW5pdCB0aW1lc3RhbXBcbiAgICBpZiAodGhpcy5sYXN0X3RpbWVTdGFtcCA9PT0gLTEpIHtcbiAgICAgIHRoaXMubGFzdF90aW1lU3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgfVxuICAgIHZhciBlbGFwc2VkID0gdGltZXN0YW1wIC0gdGhpcy5sYXN0X3RpbWVTdGFtcDtcblxuICAgIGlmICh0aGlzLmlzX3BsYXlpbmcpIHtcbiAgICAgIHRoaXMudGltZVswXSArPSBlbGFwc2VkO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRpbWVbMF0gPj0gdGhpcy50b3RhbER1cmF0aW9uKSB7XG4gICAgICAvLyBTdG9wIHRpbWVyIHdoZW4gcmVhY2hpbmcgdGhlIGVuZC5cbiAgICAgIHRoaXMudGltZVswXSA9IHRoaXMudG90YWxEdXJhdGlvbjtcbiAgICAgIHRoaXMuc3RvcCgpO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlZC5kaXNwYXRjaCh0aGlzLnRpbWVbMF0pO1xuXG4gICAgdGhpcy5sYXN0X3RpbWVTdGFtcCA9IHRpbWVzdGFtcDtcbiAgICB0aGlzLmxhc3RfdGltZSA9IHRoaXMudGltZVswXTtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudXBkYXRlKTtcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9jb3JlL1RpbWVyLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");
=======
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
	    value: function update() {
	      // Init timestamp
	
	      // the argument timestamp is too old, if we have a long time task on click on
	      // play button's click handler. so re-fetch the current timestamp here again.
	      var timestamp = performance.now();
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
>>>>>>> master

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

<<<<<<< HEAD
	eval("module.exports = __WEBPACK_EXTERNAL_MODULE_3__;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wicm9vdFwiOlwic2lnbmFsc1wiLFwiY29tbW9uanNcIjpcInNpZ25hbHNcIixcImNvbW1vbmpzMlwiOlwic2lnbmFsc1wiLFwiYW1kXCI6XCJzaWduYWxzXCJ9PzkwMzgiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiMy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8zX187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCB7XCJyb290XCI6XCJzaWduYWxzXCIsXCJjb21tb25qc1wiOlwic2lnbmFsc1wiLFwiY29tbW9uanMyXCI6XCJzaWduYWxzXCIsXCJhbWRcIjpcInNpZ25hbHNcIn1cbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");
=======
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
>>>>>>> master

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

<<<<<<< HEAD
	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Signals = __webpack_require__(3);\nvar TweenMax = __webpack_require__(5);\n\nvar Orchestrator = function () {\n  function Orchestrator(timer, data) {\n    _classCallCheck(this, Orchestrator);\n\n    this.update = this.update.bind(this);\n    this.timer = timer;\n    this.data = data;\n    this.mainTimeline = new TimelineMax({ paused: true });\n    this.onUpdate = new Signals.Signal();\n    this.timer.updated.add(this.update);\n    this.update(0);\n  }\n\n  _createClass(Orchestrator, [{\n    key: 'addUpdateListener',\n    value: function addUpdateListener(listener) {\n      this.onUpdate.add(listener);\n    }\n  }, {\n    key: 'removeUpdateListener',\n    value: function removeUpdateListener(listener) {\n      this.onUpdate.remove(listener);\n    }\n  }, {\n    key: 'setData',\n    value: function setData(data) {\n      this.data = data;\n    }\n  }, {\n    key: 'getTotalDuration',\n    value: function getTotalDuration() {\n      return this.mainTimeline.totalDuration();\n    }\n  }, {\n    key: 'getEasing',\n    value: function getEasing() {\n      var key = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];\n\n      if (key && key.ease) {\n        var ease_index = key.ease.split('.');\n        if (ease_index.length === 2 && window[ease_index[0]] && window[ease_index[0]][ease_index[1]]) {\n          return window[ease_index[0]][ease_index[1]];\n        }\n      }\n      return Quad.easeOut;\n    }\n  }, {\n    key: 'initSpecialProperties',\n    value: function initSpecialProperties(item) {\n      // Add a dom element for color tweening and other css properties.\n      item._domHelper = document.createElement('div');\n      for (var property_key = 0; property_key < item.properties.length; property_key++) {\n        var property = item.properties[property_key];\n        // Setup special properties\n        if (property.type && property.type === 'color') {\n          // If the property is a color mark it as css\n          property.css = true;\n        }\n\n        if (property.css) {\n          // If property is a css or a color value apply it to the domHelper element.\n          item._domHelper.style[property.name] = property.val;\n        }\n      }\n    }\n  }, {\n    key: 'initItemValues',\n    value: function initItemValues(item) {\n      item.values = {};\n      // item._isDirty = true\n      for (var property_key = 0; property_key < item.properties.length; property_key++) {\n        var property = item.properties[property_key];\n        if (property.keys.length) {\n          // Take the value of the first key as initial value.\n          // this.todo: update this when the value of the first key change. (when rebuilding the timeline, simply delete item.values before item._timeline)\n          property.val = property.keys[0].val;\n        }\n        item.values[property.name] = property.val;\n      }\n    }\n  }, {\n    key: 'update',\n    value: function update(timestamp) {\n      var seconds = timestamp / 1000;\n      var has_dirty_items = false;\n      var i;\n      var item;\n      var property;\n      var property_key;\n\n      for (i = 0; i < this.data.length; i++) {\n        item = this.data[i];\n        if (!item._domHelper) {\n          this.initSpecialProperties(item);\n        }\n\n        // create the values object to contain all properties\n        if (!item.values) {\n          this.initItemValues(item);\n        }\n\n        // Create the timeline if needed\n        if (!item._timeline) {\n          item._timeline = new TimelineMax();\n          this.mainTimeline.add(item._timeline, 0);\n          item._isDirty = true;\n        }\n\n        if (item._isDirty) {\n          has_dirty_items = true;\n        }\n\n        if (item._timeline && item._isDirty && item.properties) {\n          item._isDirty = false;\n          // item._timeline.clear();\n\n          for (property_key = 0; property_key < item.properties.length; property_key++) {\n            property = item.properties[property_key];\n            if (property._timeline) {\n              property._timeline.clear();\n            } else {\n              property._timeline = new TimelineMax();\n              item._timeline.add(property._timeline, 0);\n            }\n\n            var propertyTimeline = property._timeline;\n            var propName = property.name;\n\n            // If there is no key stop there and set value to default.\n            if (!property.keys.length) {\n              item.values[property.name] = property.val;\n              continue;\n            }\n\n            // Set the data values target object.\n            var data_target = item.values;\n            // Add a inital key, even if there is no animation to set the value from time 0.\n            var first_key = property.keys[0];\n\n            var tween_time = 0;\n            if (first_key) {\n              tween_time = Math.min(-1, first_key.time - 0.1);\n            }\n\n            var tween_duration = 0;\n            var val = {};\n            var easing = this.getEasing();\n            val.ease = easing;\n\n            if (property.css) {\n              data_target = item._domHelper;\n              val.css = {};\n              val.css[propName] = first_key ? first_key.val : property.val;\n            } else {\n              val[propName] = first_key ? first_key.val : property.val;\n            }\n\n            var tween = TweenMax.to(data_target, tween_duration, val);\n            propertyTimeline.add(tween, tween_time);\n\n            for (var key_index = 0; key_index < property.keys.length; key_index++) {\n              var key = property.keys[key_index];\n\n              if (key_index < property.keys.length - 1) {\n                var next_key = property.keys[key_index + 1];\n                tween_duration = next_key.time - key.time;\n\n                val = {};\n                easing = this.getEasing(next_key);\n                val.ease = easing;\n                if (property.css) {\n                  val.css = {};\n                  val.css[propName] = next_key.val;\n                } else {\n                  val[propName] = next_key.val;\n                }\n\n                tween = TweenMax.to(data_target, tween_duration, val);\n                propertyTimeline.add(tween, key.time);\n              }\n            }\n\n            // Directly seek the property timeline to update the value.\n            propertyTimeline.seek(seconds);\n          }\n          // Force main timeline to refresh but never try to go to < 0\n          // to prevent glitches when current time is 0.\n          if (seconds > 0) {\n            seconds = seconds - 0.0000001;\n          } else {\n            seconds = seconds + 0.0000001;\n          }\n        }\n      }\n\n      // Finally update the main timeline.\n      this.mainTimeline.seek(seconds);\n\n      // update the css properties.\n      for (i = 0; i < this.data.length; i++) {\n        item = this.data[i];\n        for (property_key = 0; property_key < item.properties.length; property_key++) {\n          property = item.properties[property_key];\n          if (property.css && property.keys.length) {\n            // Only css values.\n            item.values[property.name] = item._domHelper.style[property.name];\n          }\n        }\n      }\n\n      if (has_dirty_items) {\n        this.onUpdate.dispatch();\n      }\n    }\n  }]);\n\n  return Orchestrator;\n}();\n\nexports.default = Orchestrator;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb3JlL09yY2hlc3RyYXRvci5qcz81OTQ2Il0sIm5hbWVzIjpbIlNpZ25hbHMiLCJyZXF1aXJlIiwiVHdlZW5NYXgiLCJPcmNoZXN0cmF0b3IiLCJ0aW1lciIsImRhdGEiLCJ1cGRhdGUiLCJiaW5kIiwibWFpblRpbWVsaW5lIiwiVGltZWxpbmVNYXgiLCJwYXVzZWQiLCJvblVwZGF0ZSIsIlNpZ25hbCIsInVwZGF0ZWQiLCJhZGQiLCJsaXN0ZW5lciIsInJlbW92ZSIsInRvdGFsRHVyYXRpb24iLCJrZXkiLCJlYXNlIiwiZWFzZV9pbmRleCIsInNwbGl0IiwibGVuZ3RoIiwid2luZG93IiwiUXVhZCIsImVhc2VPdXQiLCJpdGVtIiwiX2RvbUhlbHBlciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInByb3BlcnR5X2tleSIsInByb3BlcnRpZXMiLCJwcm9wZXJ0eSIsInR5cGUiLCJjc3MiLCJzdHlsZSIsIm5hbWUiLCJ2YWwiLCJ2YWx1ZXMiLCJrZXlzIiwidGltZXN0YW1wIiwic2Vjb25kcyIsImhhc19kaXJ0eV9pdGVtcyIsImkiLCJpbml0U3BlY2lhbFByb3BlcnRpZXMiLCJpbml0SXRlbVZhbHVlcyIsIl90aW1lbGluZSIsIl9pc0RpcnR5IiwiY2xlYXIiLCJwcm9wZXJ0eVRpbWVsaW5lIiwicHJvcE5hbWUiLCJkYXRhX3RhcmdldCIsImZpcnN0X2tleSIsInR3ZWVuX3RpbWUiLCJNYXRoIiwibWluIiwidGltZSIsInR3ZWVuX2R1cmF0aW9uIiwiZWFzaW5nIiwiZ2V0RWFzaW5nIiwidHdlZW4iLCJ0byIsImtleV9pbmRleCIsIm5leHRfa2V5Iiwic2VlayIsImRpc3BhdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBSUEsVUFBVSxtQkFBQUMsQ0FBUSxDQUFSLENBQWQ7QUFDQSxJQUFJQyxXQUFXLG1CQUFBRCxDQUFRLENBQVIsQ0FBZjs7SUFFcUJFLFk7QUFDbkIsd0JBQVlDLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQ3ZCLFNBQUtDLE1BQUwsR0FBYyxLQUFLQSxNQUFMLENBQVlDLElBQVosQ0FBaUIsSUFBakIsQ0FBZDtBQUNBLFNBQUtILEtBQUwsR0FBYUEsS0FBYjtBQUNBLFNBQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLFNBQUtHLFlBQUwsR0FBb0IsSUFBSUMsV0FBSixDQUFnQixFQUFDQyxRQUFRLElBQVQsRUFBaEIsQ0FBcEI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLElBQUlYLFFBQVFZLE1BQVosRUFBaEI7QUFDQSxTQUFLUixLQUFMLENBQVdTLE9BQVgsQ0FBbUJDLEdBQW5CLENBQXVCLEtBQUtSLE1BQTVCO0FBQ0EsU0FBS0EsTUFBTCxDQUFZLENBQVo7QUFDRDs7OztzQ0FHaUJTLFEsRUFBVTtBQUMxQixXQUFLSixRQUFMLENBQWNHLEdBQWQsQ0FBa0JDLFFBQWxCO0FBQ0Q7Ozt5Q0FFb0JBLFEsRUFBVTtBQUM3QixXQUFLSixRQUFMLENBQWNLLE1BQWQsQ0FBcUJELFFBQXJCO0FBQ0Q7Ozs0QkFFT1YsSSxFQUFNO0FBQ1osV0FBS0EsSUFBTCxHQUFZQSxJQUFaO0FBQ0Q7Ozt1Q0FFa0I7QUFDakIsYUFBTyxLQUFLRyxZQUFMLENBQWtCUyxhQUFsQixFQUFQO0FBQ0Q7OztnQ0FFc0I7QUFBQSxVQUFiQyxHQUFhLHlEQUFQLEtBQU87O0FBQ3JCLFVBQUlBLE9BQU9BLElBQUlDLElBQWYsRUFBcUI7QUFDbkIsWUFBSUMsYUFBYUYsSUFBSUMsSUFBSixDQUFTRSxLQUFULENBQWUsR0FBZixDQUFqQjtBQUNBLFlBQUlELFdBQVdFLE1BQVgsS0FBc0IsQ0FBdEIsSUFBMkJDLE9BQU9ILFdBQVcsQ0FBWCxDQUFQLENBQTNCLElBQW9ERyxPQUFPSCxXQUFXLENBQVgsQ0FBUCxFQUFzQkEsV0FBVyxDQUFYLENBQXRCLENBQXhELEVBQThGO0FBQzVGLGlCQUFPRyxPQUFPSCxXQUFXLENBQVgsQ0FBUCxFQUFzQkEsV0FBVyxDQUFYLENBQXRCLENBQVA7QUFDRDtBQUNGO0FBQ0QsYUFBT0ksS0FBS0MsT0FBWjtBQUNEOzs7MENBRXFCQyxJLEVBQU07QUFDMUI7QUFDQUEsV0FBS0MsVUFBTCxHQUFrQkMsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFsQjtBQUNBLFdBQUssSUFBSUMsZUFBZSxDQUF4QixFQUEyQkEsZUFBZUosS0FBS0ssVUFBTCxDQUFnQlQsTUFBMUQsRUFBa0VRLGNBQWxFLEVBQWtGO0FBQ2hGLFlBQUlFLFdBQVdOLEtBQUtLLFVBQUwsQ0FBZ0JELFlBQWhCLENBQWY7QUFDQTtBQUNBLFlBQUlFLFNBQVNDLElBQVQsSUFBaUJELFNBQVNDLElBQVQsS0FBa0IsT0FBdkMsRUFBZ0Q7QUFDOUM7QUFDQUQsbUJBQVNFLEdBQVQsR0FBZSxJQUFmO0FBQ0Q7O0FBRUQsWUFBSUYsU0FBU0UsR0FBYixFQUFrQjtBQUNoQjtBQUNBUixlQUFLQyxVQUFMLENBQWdCUSxLQUFoQixDQUFzQkgsU0FBU0ksSUFBL0IsSUFBdUNKLFNBQVNLLEdBQWhEO0FBQ0Q7QUFDRjtBQUNGOzs7bUNBRWNYLEksRUFBTTtBQUNuQkEsV0FBS1ksTUFBTCxHQUFjLEVBQWQ7QUFDQTtBQUNBLFdBQUssSUFBSVIsZUFBZSxDQUF4QixFQUEyQkEsZUFBZUosS0FBS0ssVUFBTCxDQUFnQlQsTUFBMUQsRUFBa0VRLGNBQWxFLEVBQWtGO0FBQ2hGLFlBQUlFLFdBQVdOLEtBQUtLLFVBQUwsQ0FBZ0JELFlBQWhCLENBQWY7QUFDQSxZQUFJRSxTQUFTTyxJQUFULENBQWNqQixNQUFsQixFQUEwQjtBQUN4QjtBQUNBO0FBQ0FVLG1CQUFTSyxHQUFULEdBQWVMLFNBQVNPLElBQVQsQ0FBYyxDQUFkLEVBQWlCRixHQUFoQztBQUNEO0FBQ0RYLGFBQUtZLE1BQUwsQ0FBWU4sU0FBU0ksSUFBckIsSUFBNkJKLFNBQVNLLEdBQXRDO0FBQ0Q7QUFDRjs7OzJCQUVNRyxTLEVBQVc7QUFDaEIsVUFBSUMsVUFBVUQsWUFBWSxJQUExQjtBQUNBLFVBQUlFLGtCQUFrQixLQUF0QjtBQUNBLFVBQUlDLENBQUo7QUFDQSxVQUFJakIsSUFBSjtBQUNBLFVBQUlNLFFBQUo7QUFDQSxVQUFJRixZQUFKOztBQUVBLFdBQUthLElBQUksQ0FBVCxFQUFZQSxJQUFJLEtBQUt0QyxJQUFMLENBQVVpQixNQUExQixFQUFrQ3FCLEdBQWxDLEVBQXVDO0FBQ3JDakIsZUFBTyxLQUFLckIsSUFBTCxDQUFVc0MsQ0FBVixDQUFQO0FBQ0EsWUFBSSxDQUFDakIsS0FBS0MsVUFBVixFQUFzQjtBQUNwQixlQUFLaUIscUJBQUwsQ0FBMkJsQixJQUEzQjtBQUNEOztBQUVEO0FBQ0EsWUFBSSxDQUFDQSxLQUFLWSxNQUFWLEVBQWtCO0FBQ2hCLGVBQUtPLGNBQUwsQ0FBb0JuQixJQUFwQjtBQUNEOztBQUVEO0FBQ0EsWUFBSSxDQUFDQSxLQUFLb0IsU0FBVixFQUFxQjtBQUNuQnBCLGVBQUtvQixTQUFMLEdBQWlCLElBQUlyQyxXQUFKLEVBQWpCO0FBQ0EsZUFBS0QsWUFBTCxDQUFrQk0sR0FBbEIsQ0FBc0JZLEtBQUtvQixTQUEzQixFQUFzQyxDQUF0QztBQUNBcEIsZUFBS3FCLFFBQUwsR0FBZ0IsSUFBaEI7QUFDRDs7QUFFRCxZQUFJckIsS0FBS3FCLFFBQVQsRUFBbUI7QUFDakJMLDRCQUFrQixJQUFsQjtBQUNEOztBQUVELFlBQUloQixLQUFLb0IsU0FBTCxJQUFrQnBCLEtBQUtxQixRQUF2QixJQUFtQ3JCLEtBQUtLLFVBQTVDLEVBQXdEO0FBQ3RETCxlQUFLcUIsUUFBTCxHQUFnQixLQUFoQjtBQUNBOztBQUVBLGVBQUtqQixlQUFlLENBQXBCLEVBQXVCQSxlQUFlSixLQUFLSyxVQUFMLENBQWdCVCxNQUF0RCxFQUE4RFEsY0FBOUQsRUFBOEU7QUFDNUVFLHVCQUFXTixLQUFLSyxVQUFMLENBQWdCRCxZQUFoQixDQUFYO0FBQ0EsZ0JBQUlFLFNBQVNjLFNBQWIsRUFBd0I7QUFDdEJkLHVCQUFTYyxTQUFULENBQW1CRSxLQUFuQjtBQUNELGFBRkQsTUFHSztBQUNIaEIsdUJBQVNjLFNBQVQsR0FBcUIsSUFBSXJDLFdBQUosRUFBckI7QUFDQWlCLG1CQUFLb0IsU0FBTCxDQUFlaEMsR0FBZixDQUFtQmtCLFNBQVNjLFNBQTVCLEVBQXVDLENBQXZDO0FBQ0Q7O0FBRUQsZ0JBQUlHLG1CQUFtQmpCLFNBQVNjLFNBQWhDO0FBQ0EsZ0JBQUlJLFdBQVdsQixTQUFTSSxJQUF4Qjs7QUFFQTtBQUNBLGdCQUFJLENBQUNKLFNBQVNPLElBQVQsQ0FBY2pCLE1BQW5CLEVBQTJCO0FBQ3pCSSxtQkFBS1ksTUFBTCxDQUFZTixTQUFTSSxJQUFyQixJQUE2QkosU0FBU0ssR0FBdEM7QUFDQTtBQUNEOztBQUVEO0FBQ0EsZ0JBQUljLGNBQWN6QixLQUFLWSxNQUF2QjtBQUNBO0FBQ0EsZ0JBQUljLFlBQVlwQixTQUFTTyxJQUFULENBQWMsQ0FBZCxDQUFoQjs7QUFFQSxnQkFBSWMsYUFBYSxDQUFqQjtBQUNBLGdCQUFJRCxTQUFKLEVBQWU7QUFDYkMsMkJBQWFDLEtBQUtDLEdBQUwsQ0FBUyxDQUFDLENBQVYsRUFBYUgsVUFBVUksSUFBVixHQUFpQixHQUE5QixDQUFiO0FBQ0Q7O0FBRUQsZ0JBQUlDLGlCQUFpQixDQUFyQjtBQUNBLGdCQUFJcEIsTUFBTSxFQUFWO0FBQ0EsZ0JBQUlxQixTQUFTLEtBQUtDLFNBQUwsRUFBYjtBQUNBdEIsZ0JBQUlsQixJQUFKLEdBQVd1QyxNQUFYOztBQUVBLGdCQUFJMUIsU0FBU0UsR0FBYixFQUFrQjtBQUNoQmlCLDRCQUFjekIsS0FBS0MsVUFBbkI7QUFDQVUsa0JBQUlILEdBQUosR0FBVSxFQUFWO0FBQ0FHLGtCQUFJSCxHQUFKLENBQVFnQixRQUFSLElBQW9CRSxZQUFZQSxVQUFVZixHQUF0QixHQUE0QkwsU0FBU0ssR0FBekQ7QUFDRCxhQUpELE1BS0s7QUFDSEEsa0JBQUlhLFFBQUosSUFBZ0JFLFlBQVlBLFVBQVVmLEdBQXRCLEdBQTRCTCxTQUFTSyxHQUFyRDtBQUNEOztBQUVELGdCQUFJdUIsUUFBUTFELFNBQVMyRCxFQUFULENBQVlWLFdBQVosRUFBeUJNLGNBQXpCLEVBQXlDcEIsR0FBekMsQ0FBWjtBQUNBWSw2QkFBaUJuQyxHQUFqQixDQUFxQjhDLEtBQXJCLEVBQTRCUCxVQUE1Qjs7QUFFQSxpQkFBSyxJQUFJUyxZQUFZLENBQXJCLEVBQXdCQSxZQUFZOUIsU0FBU08sSUFBVCxDQUFjakIsTUFBbEQsRUFBMER3QyxXQUExRCxFQUF1RTtBQUNyRSxrQkFBSTVDLE1BQU1jLFNBQVNPLElBQVQsQ0FBY3VCLFNBQWQsQ0FBVjs7QUFFQSxrQkFBSUEsWUFBWTlCLFNBQVNPLElBQVQsQ0FBY2pCLE1BQWQsR0FBdUIsQ0FBdkMsRUFBMEM7QUFDeEMsb0JBQUl5QyxXQUFXL0IsU0FBU08sSUFBVCxDQUFjdUIsWUFBWSxDQUExQixDQUFmO0FBQ0FMLGlDQUFpQk0sU0FBU1AsSUFBVCxHQUFnQnRDLElBQUlzQyxJQUFyQzs7QUFFQW5CLHNCQUFNLEVBQU47QUFDQXFCLHlCQUFTLEtBQUtDLFNBQUwsQ0FBZUksUUFBZixDQUFUO0FBQ0ExQixvQkFBSWxCLElBQUosR0FBV3VDLE1BQVg7QUFDQSxvQkFBSTFCLFNBQVNFLEdBQWIsRUFBa0I7QUFDaEJHLHNCQUFJSCxHQUFKLEdBQVUsRUFBVjtBQUNBRyxzQkFBSUgsR0FBSixDQUFRZ0IsUUFBUixJQUFvQmEsU0FBUzFCLEdBQTdCO0FBQ0QsaUJBSEQsTUFJSztBQUNIQSxzQkFBSWEsUUFBSixJQUFnQmEsU0FBUzFCLEdBQXpCO0FBQ0Q7O0FBRUR1Qix3QkFBUTFELFNBQVMyRCxFQUFULENBQVlWLFdBQVosRUFBeUJNLGNBQXpCLEVBQXlDcEIsR0FBekMsQ0FBUjtBQUNBWSxpQ0FBaUJuQyxHQUFqQixDQUFxQjhDLEtBQXJCLEVBQTRCMUMsSUFBSXNDLElBQWhDO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBUCw2QkFBaUJlLElBQWpCLENBQXNCdkIsT0FBdEI7QUFDRDtBQUNEO0FBQ0E7QUFDQSxjQUFJQSxVQUFVLENBQWQsRUFBaUI7QUFDZkEsc0JBQVVBLFVBQVUsU0FBcEI7QUFDRCxXQUZELE1BR0s7QUFDSEEsc0JBQVVBLFVBQVUsU0FBcEI7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQ7QUFDQSxXQUFLakMsWUFBTCxDQUFrQndELElBQWxCLENBQXVCdkIsT0FBdkI7O0FBRUE7QUFDQSxXQUFLRSxJQUFJLENBQVQsRUFBWUEsSUFBSSxLQUFLdEMsSUFBTCxDQUFVaUIsTUFBMUIsRUFBa0NxQixHQUFsQyxFQUF1QztBQUNyQ2pCLGVBQU8sS0FBS3JCLElBQUwsQ0FBVXNDLENBQVYsQ0FBUDtBQUNBLGFBQUtiLGVBQWUsQ0FBcEIsRUFBdUJBLGVBQWVKLEtBQUtLLFVBQUwsQ0FBZ0JULE1BQXRELEVBQThEUSxjQUE5RCxFQUE4RTtBQUM1RUUscUJBQVdOLEtBQUtLLFVBQUwsQ0FBZ0JELFlBQWhCLENBQVg7QUFDQSxjQUFJRSxTQUFTRSxHQUFULElBQWdCRixTQUFTTyxJQUFULENBQWNqQixNQUFsQyxFQUEwQztBQUN4QztBQUNBSSxpQkFBS1ksTUFBTCxDQUFZTixTQUFTSSxJQUFyQixJQUE2QlYsS0FBS0MsVUFBTCxDQUFnQlEsS0FBaEIsQ0FBc0JILFNBQVNJLElBQS9CLENBQTdCO0FBQ0Q7QUFDRjtBQUNGOztBQUVELFVBQUlNLGVBQUosRUFBcUI7QUFDbkIsYUFBSy9CLFFBQUwsQ0FBY3NELFFBQWQ7QUFDRDtBQUNGOzs7Ozs7a0JBN01rQjlELFkiLCJmaWxlIjoiNC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBTaWduYWxzID0gcmVxdWlyZSgnanMtc2lnbmFscycpO1xubGV0IFR3ZWVuTWF4ID0gcmVxdWlyZSgnZ3NhcCcpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPcmNoZXN0cmF0b3Ige1xuICBjb25zdHJ1Y3Rvcih0aW1lciwgZGF0YSkge1xuICAgIHRoaXMudXBkYXRlID0gdGhpcy51cGRhdGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRpbWVyID0gdGltZXI7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLm1haW5UaW1lbGluZSA9IG5ldyBUaW1lbGluZU1heCh7cGF1c2VkOiB0cnVlfSk7XG4gICAgdGhpcy5vblVwZGF0ZSA9IG5ldyBTaWduYWxzLlNpZ25hbCgpO1xuICAgIHRoaXMudGltZXIudXBkYXRlZC5hZGQodGhpcy51cGRhdGUpO1xuICAgIHRoaXMudXBkYXRlKDApO1xuICB9XG5cblxuICBhZGRVcGRhdGVMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgIHRoaXMub25VcGRhdGUuYWRkKGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJlbW92ZVVwZGF0ZUxpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5vblVwZGF0ZS5yZW1vdmUobGlzdGVuZXIpO1xuICB9XG5cbiAgc2V0RGF0YShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgfVxuXG4gIGdldFRvdGFsRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubWFpblRpbWVsaW5lLnRvdGFsRHVyYXRpb24oKTtcbiAgfVxuXG4gIGdldEVhc2luZyhrZXkgPSBmYWxzZSkge1xuICAgIGlmIChrZXkgJiYga2V5LmVhc2UpIHtcbiAgICAgIHZhciBlYXNlX2luZGV4ID0ga2V5LmVhc2Uuc3BsaXQoJy4nKTtcbiAgICAgIGlmIChlYXNlX2luZGV4Lmxlbmd0aCA9PT0gMiAmJiB3aW5kb3dbZWFzZV9pbmRleFswXV0gJiYgd2luZG93W2Vhc2VfaW5kZXhbMF1dW2Vhc2VfaW5kZXhbMV1dKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3dbZWFzZV9pbmRleFswXV1bZWFzZV9pbmRleFsxXV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBRdWFkLmVhc2VPdXQ7XG4gIH1cblxuICBpbml0U3BlY2lhbFByb3BlcnRpZXMoaXRlbSkge1xuICAgIC8vIEFkZCBhIGRvbSBlbGVtZW50IGZvciBjb2xvciB0d2VlbmluZyBhbmQgb3RoZXIgY3NzIHByb3BlcnRpZXMuXG4gICAgaXRlbS5fZG9tSGVscGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZm9yICh2YXIgcHJvcGVydHlfa2V5ID0gMDsgcHJvcGVydHlfa2V5IDwgaXRlbS5wcm9wZXJ0aWVzLmxlbmd0aDsgcHJvcGVydHlfa2V5KyspIHtcbiAgICAgIHZhciBwcm9wZXJ0eSA9IGl0ZW0ucHJvcGVydGllc1twcm9wZXJ0eV9rZXldO1xuICAgICAgLy8gU2V0dXAgc3BlY2lhbCBwcm9wZXJ0aWVzXG4gICAgICBpZiAocHJvcGVydHkudHlwZSAmJiBwcm9wZXJ0eS50eXBlID09PSAnY29sb3InKSB7XG4gICAgICAgIC8vIElmIHRoZSBwcm9wZXJ0eSBpcyBhIGNvbG9yIG1hcmsgaXQgYXMgY3NzXG4gICAgICAgIHByb3BlcnR5LmNzcyA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wZXJ0eS5jc3MpIHtcbiAgICAgICAgLy8gSWYgcHJvcGVydHkgaXMgYSBjc3Mgb3IgYSBjb2xvciB2YWx1ZSBhcHBseSBpdCB0byB0aGUgZG9tSGVscGVyIGVsZW1lbnQuXG4gICAgICAgIGl0ZW0uX2RvbUhlbHBlci5zdHlsZVtwcm9wZXJ0eS5uYW1lXSA9IHByb3BlcnR5LnZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpbml0SXRlbVZhbHVlcyhpdGVtKSB7XG4gICAgaXRlbS52YWx1ZXMgPSB7fTtcbiAgICAvLyBpdGVtLl9pc0RpcnR5ID0gdHJ1ZVxuICAgIGZvciAodmFyIHByb3BlcnR5X2tleSA9IDA7IHByb3BlcnR5X2tleSA8IGl0ZW0ucHJvcGVydGllcy5sZW5ndGg7IHByb3BlcnR5X2tleSsrKSB7XG4gICAgICB2YXIgcHJvcGVydHkgPSBpdGVtLnByb3BlcnRpZXNbcHJvcGVydHlfa2V5XTtcbiAgICAgIGlmIChwcm9wZXJ0eS5rZXlzLmxlbmd0aCkge1xuICAgICAgICAvLyBUYWtlIHRoZSB2YWx1ZSBvZiB0aGUgZmlyc3Qga2V5IGFzIGluaXRpYWwgdmFsdWUuXG4gICAgICAgIC8vIHRoaXMudG9kbzogdXBkYXRlIHRoaXMgd2hlbiB0aGUgdmFsdWUgb2YgdGhlIGZpcnN0IGtleSBjaGFuZ2UuICh3aGVuIHJlYnVpbGRpbmcgdGhlIHRpbWVsaW5lLCBzaW1wbHkgZGVsZXRlIGl0ZW0udmFsdWVzIGJlZm9yZSBpdGVtLl90aW1lbGluZSlcbiAgICAgICAgcHJvcGVydHkudmFsID0gcHJvcGVydHkua2V5c1swXS52YWw7XG4gICAgICB9XG4gICAgICBpdGVtLnZhbHVlc1twcm9wZXJ0eS5uYW1lXSA9IHByb3BlcnR5LnZhbDtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUodGltZXN0YW1wKSB7XG4gICAgdmFyIHNlY29uZHMgPSB0aW1lc3RhbXAgLyAxMDAwO1xuICAgIHZhciBoYXNfZGlydHlfaXRlbXMgPSBmYWxzZTtcbiAgICB2YXIgaTtcbiAgICB2YXIgaXRlbTtcbiAgICB2YXIgcHJvcGVydHk7XG4gICAgdmFyIHByb3BlcnR5X2tleTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGl0ZW0gPSB0aGlzLmRhdGFbaV07XG4gICAgICBpZiAoIWl0ZW0uX2RvbUhlbHBlcikge1xuICAgICAgICB0aGlzLmluaXRTcGVjaWFsUHJvcGVydGllcyhpdGVtKTtcbiAgICAgIH1cblxuICAgICAgLy8gY3JlYXRlIHRoZSB2YWx1ZXMgb2JqZWN0IHRvIGNvbnRhaW4gYWxsIHByb3BlcnRpZXNcbiAgICAgIGlmICghaXRlbS52YWx1ZXMpIHtcbiAgICAgICAgdGhpcy5pbml0SXRlbVZhbHVlcyhpdGVtKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ3JlYXRlIHRoZSB0aW1lbGluZSBpZiBuZWVkZWRcbiAgICAgIGlmICghaXRlbS5fdGltZWxpbmUpIHtcbiAgICAgICAgaXRlbS5fdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoKTtcbiAgICAgICAgdGhpcy5tYWluVGltZWxpbmUuYWRkKGl0ZW0uX3RpbWVsaW5lLCAwKTtcbiAgICAgICAgaXRlbS5faXNEaXJ0eSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLl9pc0RpcnR5KSB7XG4gICAgICAgIGhhc19kaXJ0eV9pdGVtcyA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLl90aW1lbGluZSAmJiBpdGVtLl9pc0RpcnR5ICYmIGl0ZW0ucHJvcGVydGllcykge1xuICAgICAgICBpdGVtLl9pc0RpcnR5ID0gZmFsc2U7XG4gICAgICAgIC8vIGl0ZW0uX3RpbWVsaW5lLmNsZWFyKCk7XG5cbiAgICAgICAgZm9yIChwcm9wZXJ0eV9rZXkgPSAwOyBwcm9wZXJ0eV9rZXkgPCBpdGVtLnByb3BlcnRpZXMubGVuZ3RoOyBwcm9wZXJ0eV9rZXkrKykge1xuICAgICAgICAgIHByb3BlcnR5ID0gaXRlbS5wcm9wZXJ0aWVzW3Byb3BlcnR5X2tleV07XG4gICAgICAgICAgaWYgKHByb3BlcnR5Ll90aW1lbGluZSkge1xuICAgICAgICAgICAgcHJvcGVydHkuX3RpbWVsaW5lLmNsZWFyKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcHJvcGVydHkuX3RpbWVsaW5lID0gbmV3IFRpbWVsaW5lTWF4KCk7XG4gICAgICAgICAgICBpdGVtLl90aW1lbGluZS5hZGQocHJvcGVydHkuX3RpbWVsaW5lLCAwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgcHJvcGVydHlUaW1lbGluZSA9IHByb3BlcnR5Ll90aW1lbGluZTtcbiAgICAgICAgICB2YXIgcHJvcE5hbWUgPSBwcm9wZXJ0eS5uYW1lO1xuXG4gICAgICAgICAgLy8gSWYgdGhlcmUgaXMgbm8ga2V5IHN0b3AgdGhlcmUgYW5kIHNldCB2YWx1ZSB0byBkZWZhdWx0LlxuICAgICAgICAgIGlmICghcHJvcGVydHkua2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGl0ZW0udmFsdWVzW3Byb3BlcnR5Lm5hbWVdID0gcHJvcGVydHkudmFsO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gU2V0IHRoZSBkYXRhIHZhbHVlcyB0YXJnZXQgb2JqZWN0LlxuICAgICAgICAgIHZhciBkYXRhX3RhcmdldCA9IGl0ZW0udmFsdWVzO1xuICAgICAgICAgIC8vIEFkZCBhIGluaXRhbCBrZXksIGV2ZW4gaWYgdGhlcmUgaXMgbm8gYW5pbWF0aW9uIHRvIHNldCB0aGUgdmFsdWUgZnJvbSB0aW1lIDAuXG4gICAgICAgICAgdmFyIGZpcnN0X2tleSA9IHByb3BlcnR5LmtleXNbMF07XG5cbiAgICAgICAgICB2YXIgdHdlZW5fdGltZSA9IDA7XG4gICAgICAgICAgaWYgKGZpcnN0X2tleSkge1xuICAgICAgICAgICAgdHdlZW5fdGltZSA9IE1hdGgubWluKC0xLCBmaXJzdF9rZXkudGltZSAtIDAuMSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHR3ZWVuX2R1cmF0aW9uID0gMDtcbiAgICAgICAgICB2YXIgdmFsID0ge307XG4gICAgICAgICAgdmFyIGVhc2luZyA9IHRoaXMuZ2V0RWFzaW5nKCk7XG4gICAgICAgICAgdmFsLmVhc2UgPSBlYXNpbmc7XG5cbiAgICAgICAgICBpZiAocHJvcGVydHkuY3NzKSB7XG4gICAgICAgICAgICBkYXRhX3RhcmdldCA9IGl0ZW0uX2RvbUhlbHBlcjtcbiAgICAgICAgICAgIHZhbC5jc3MgPSB7fTtcbiAgICAgICAgICAgIHZhbC5jc3NbcHJvcE5hbWVdID0gZmlyc3Rfa2V5ID8gZmlyc3Rfa2V5LnZhbCA6IHByb3BlcnR5LnZhbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YWxbcHJvcE5hbWVdID0gZmlyc3Rfa2V5ID8gZmlyc3Rfa2V5LnZhbCA6IHByb3BlcnR5LnZhbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgdHdlZW4gPSBUd2Vlbk1heC50byhkYXRhX3RhcmdldCwgdHdlZW5fZHVyYXRpb24sIHZhbCk7XG4gICAgICAgICAgcHJvcGVydHlUaW1lbGluZS5hZGQodHdlZW4sIHR3ZWVuX3RpbWUpO1xuXG4gICAgICAgICAgZm9yICh2YXIga2V5X2luZGV4ID0gMDsga2V5X2luZGV4IDwgcHJvcGVydHkua2V5cy5sZW5ndGg7IGtleV9pbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0gcHJvcGVydHkua2V5c1trZXlfaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAoa2V5X2luZGV4IDwgcHJvcGVydHkua2V5cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgIHZhciBuZXh0X2tleSA9IHByb3BlcnR5LmtleXNba2V5X2luZGV4ICsgMV07XG4gICAgICAgICAgICAgIHR3ZWVuX2R1cmF0aW9uID0gbmV4dF9rZXkudGltZSAtIGtleS50aW1lO1xuXG4gICAgICAgICAgICAgIHZhbCA9IHt9O1xuICAgICAgICAgICAgICBlYXNpbmcgPSB0aGlzLmdldEVhc2luZyhuZXh0X2tleSk7XG4gICAgICAgICAgICAgIHZhbC5lYXNlID0gZWFzaW5nO1xuICAgICAgICAgICAgICBpZiAocHJvcGVydHkuY3NzKSB7XG4gICAgICAgICAgICAgICAgdmFsLmNzcyA9IHt9O1xuICAgICAgICAgICAgICAgIHZhbC5jc3NbcHJvcE5hbWVdID0gbmV4dF9rZXkudmFsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbFtwcm9wTmFtZV0gPSBuZXh0X2tleS52YWw7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB0d2VlbiA9IFR3ZWVuTWF4LnRvKGRhdGFfdGFyZ2V0LCB0d2Vlbl9kdXJhdGlvbiwgdmFsKTtcbiAgICAgICAgICAgICAgcHJvcGVydHlUaW1lbGluZS5hZGQodHdlZW4sIGtleS50aW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBEaXJlY3RseSBzZWVrIHRoZSBwcm9wZXJ0eSB0aW1lbGluZSB0byB1cGRhdGUgdGhlIHZhbHVlLlxuICAgICAgICAgIHByb3BlcnR5VGltZWxpbmUuc2VlayhzZWNvbmRzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGb3JjZSBtYWluIHRpbWVsaW5lIHRvIHJlZnJlc2ggYnV0IG5ldmVyIHRyeSB0byBnbyB0byA8IDBcbiAgICAgICAgLy8gdG8gcHJldmVudCBnbGl0Y2hlcyB3aGVuIGN1cnJlbnQgdGltZSBpcyAwLlxuICAgICAgICBpZiAoc2Vjb25kcyA+IDApIHtcbiAgICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyAtIDAuMDAwMDAwMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyArIDAuMDAwMDAwMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEZpbmFsbHkgdXBkYXRlIHRoZSBtYWluIHRpbWVsaW5lLlxuICAgIHRoaXMubWFpblRpbWVsaW5lLnNlZWsoc2Vjb25kcyk7XG5cbiAgICAvLyB1cGRhdGUgdGhlIGNzcyBwcm9wZXJ0aWVzLlxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGl0ZW0gPSB0aGlzLmRhdGFbaV07XG4gICAgICBmb3IgKHByb3BlcnR5X2tleSA9IDA7IHByb3BlcnR5X2tleSA8IGl0ZW0ucHJvcGVydGllcy5sZW5ndGg7IHByb3BlcnR5X2tleSsrKSB7XG4gICAgICAgIHByb3BlcnR5ID0gaXRlbS5wcm9wZXJ0aWVzW3Byb3BlcnR5X2tleV07XG4gICAgICAgIGlmIChwcm9wZXJ0eS5jc3MgJiYgcHJvcGVydHkua2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAvLyBPbmx5IGNzcyB2YWx1ZXMuXG4gICAgICAgICAgaXRlbS52YWx1ZXNbcHJvcGVydHkubmFtZV0gPSBpdGVtLl9kb21IZWxwZXIuc3R5bGVbcHJvcGVydHkubmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzX2RpcnR5X2l0ZW1zKSB7XG4gICAgICB0aGlzLm9uVXBkYXRlLmRpc3BhdGNoKCk7XG4gICAgfVxuICB9XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2NvcmUvT3JjaGVzdHJhdG9yLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");
=======
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Signals = __webpack_require__(5);
	var TweenMax = __webpack_require__(7);
	var TimelineMax = __webpack_require__(8);
	var Quad = __webpack_require__(9);
	
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
>>>>>>> master

/***/ },
/* 7 */
/***/ function(module, exports) {

<<<<<<< HEAD
	eval("module.exports = __WEBPACK_EXTERNAL_MODULE_5__;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wicm9vdFwiOlwiVHdlZW5NYXhcIixcImNvbW1vbmpzXCI6XCJnc2FwXCIsXCJjb21tb25qczJcIjpcImdzYXBcIixcImFtZFwiOlwiVHdlZW5NYXhcIn0/ODI2MCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiI1LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzVfXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIHtcInJvb3RcIjpcIlR3ZWVuTWF4XCIsXCJjb21tb25qc1wiOlwiZ3NhcFwiLFwiY29tbW9uanMyXCI6XCJnc2FwXCIsXCJhbWRcIjpcIlR3ZWVuTWF4XCJ9XG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==");
=======
	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;
>>>>>>> master

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ },
/* 10 */
/***/ function(module, exports) {

<<<<<<< HEAD
	eval("module.exports = __WEBPACK_EXTERNAL_MODULE_6__;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wicm9vdFwiOlwiX1wiLFwiY29tbW9uanNcIjpcImxvZGFzaFwiLFwiY29tbW9uanMyXCI6XCJsb2Rhc2hcIixcImFtZFwiOlwibG9kYXNoXCJ9PzU1ZDAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiNi5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV82X187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCB7XCJyb290XCI6XCJfXCIsXCJjb21tb25qc1wiOlwibG9kYXNoXCIsXCJjb21tb25qczJcIjpcImxvZGFzaFwiLFwiYW1kXCI6XCJsb2Rhc2hcIn1cbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=");
=======
	module.exports = __WEBPACK_EXTERNAL_MODULE_10__;
>>>>>>> master

/***/ }
/******/ ])
});
;