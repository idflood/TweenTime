let $ = require('jquery');
let Signals = require('js-signals');
let _ = require('lodash');
let d3 = require('d3');
import Utils from '../core/Utils';
import PropertyBase from './PropertyBase';
let DraggableNumber = require('draggable-number.js');

let Mustache = require('mustache.js');
let tpl_property = require('html!../templates/propertyNumber.tpl.html');

export default class PropertyNumber extends PropertyBase {
  // instance_property: The current property on the data object.
  // lineData: The line data object.
  constructor(instance_property, lineData, editor, key_val = false) {
    super(instance_property, lineData, editor, key_val);
    this.onInputChange = this.onInputChange.bind(this);
    this.$input = this.$el.find('input');
  }

  getInputVal() {
    return parseFloat(this.$el.find('input').val());
  }

  render() {
    super();
    // By default assign the property default value
    var val = this.getCurrentVal();

    data = {
      id: this.instance_property.name, // "circleRadius" instead of "circle radius"
      label: this.instance_property.label || this.instance_property.name,
      val: val
    };

    var view = Mustache.render(tpl_property, data);
    this.$el = $(view);
    this.$el.find('.property__key').click(this.onKeyClick)

    var $input = this.$el.find('input');

    var onChangeEnd = (new_val) => {
      this.editor.undoManager.addState();
    }

    var draggable = new DraggableNumber($input.get(0), {
      changeCallback: () => this.onInputChange(),
      endCallback: () => onChangeEnd()
    })
    $input.data('draggable', draggable);
    $input.change(this.onInputChange);
  }

  update() {
    super();
    var val = this.getCurrentVal();
    var draggable = this.$input.data('draggable');

    if (draggable) {
      draggable.set(val.toFixed(3));
    }
    else {
      this.$input.val(val.toFixed(3));
    }
  }
}
