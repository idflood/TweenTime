let $ = require('jquery');
require('spectrum');
let Signals = require('js-signals');
let _ = require('lodash');
let d3 = require('d3');
let Utils = require('../core/Utils');
import PropertyBase from './PropertyBase';

let Mustache = require('mustache.js');
let tpl_property = require('html!../templates/propertyColor.tpl.html');

export default class PropertyColor extends PropertyBase {
  constructor(instance_property, lineData, editor, key_val = false) {
    super(instance_property, lineData, editor, key_val);
    this.onInputChange = this.onInputChange.bind(this);
    this.$input = this.$el.find('input');
  }

  render() {
    super();
    // By default assign the property default value
    var val = this.getCurrentVal();

    data = {
      id: this.instance_property.name, // "circleRadius" instead of "circle radius"
      label: this.instance_property.label || this.instance_property.name,
      val: val
    }

    var view = Mustache.render(tpl_property, data);
    this.$el = $(view);
    this.$el.find('.property__key').click(this.onKeyClick);

    var $input = this.$el.find('input');

    $input.spectrum({
      allowEmpty: false,
      showAlpha: true,
      clickoutFiresChange: false,
      preferredFormat: "rgb",
      change: (color) => {
        this.editor.undoManager.addState();
      },
      move: (color) => {
        if (color._a == 1) {
          this.$input.val(color.toHexString());
        }
        else {
          this.$input.val(color.toRgbString());
        }
        this.onInputChange()
      }
    })

    $input.change(this.onInputChange);
  }

  update() {
    super();
    var val = this.getCurrentVal();
    this.$input.val(val);
    this.$input.spectrum('set', val);
  }
}
