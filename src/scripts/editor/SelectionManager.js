let d3 = require('d3');
let Signals = require('js-signals');
let _ = require('lodash');

export default class SelectionManager {
  constructor(tweenTime) {
    this.tweenTime = tweenTime;
    this.selection = [];
    this.onSelect = new Signals.Signal();
  }

  select(item, addToSelection = false) {
    this.addDataRelations();

    if (!addToSelection) {
      this.selection = [];
    }
    if (item instanceof Array) {
      for (var i = 0; i < item.length; i++) {
        var el = item[i];
        this.selection.push(el);
      }
    }
    else {
      this.selection.push(item);
    }

    this.removeDuplicates();
    this.highlightItems();
    this.sortSelection();
    this.onSelect.dispatch(this.selection, addToSelection);
  }

  getSelection() {
    return this.selection;
  }

  removeDuplicates() {
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

  removeItem(item) {
    var index = this.selection.indexOf(item);
    if (index > -1) {
      this.selection.splice(index, 1);
    }
  }

  sortSelection() {
    var compare = function(a, b) {
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

  reset() {
    this.selection = [];
    this.highlightItems();
    this.onSelect.dispatch(this.selection, false);
  }

  triggerSelect() {
    this.onSelect.dispatch(this.selection, false);
  }

  addDataRelations() {
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

  highlightItems() {
    d3.selectAll('.bar--selected').classed('bar--selected', false);
    d3.selectAll('.key--selected').classed('key--selected', false);

    for (var i = 0; i < this.selection.length; i++) {
      var data = this.selection[i];
      if (data._dom) {
        var d3item = d3.select(data._dom);
        if (d3item.classed('bar')) {
          d3item.classed('bar--selected', true);
        }
        else if (d3item.classed('key')) {
          d3item.classed('key--selected', true);
        }
      }
    }
  }
}
