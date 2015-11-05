import 'jquery';
require('spectrum');
import PropertyBase from './PropertyBase';

let tpl_property = require('../templates/propertyColor.tpl.html');

export default class PropertyColor extends PropertyBase {
  constructor(instance_property, lineData, editor, key_val = false) {
    super(instance_property, lineData, editor, key_val);
    this.onInputChange = this.onInputChange.bind(this);
    this.$input = this.$el.find('input');
  }

  render() {
    super.render();
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
      change: () => {
        this.editor.undoManager.addState();
      },
      move: (color) => {
        if (color._a === 1) {
          $input.val(color.toHexString());
        }
        else {
          $input.val(color.toRgbString());
        }

        this.onInputChange();
      }
    });

    $input.change(this.onInputChange);
  }

  remove() {
    super.remove();
    this.$el.find('input').spectrum('destroy');
    delete this.$el;
    delete this.$input;
  }

  update() {
    super.update();
    var val = this.getCurrentVal();
    this.$input.val(val);
    this.$input.spectrum('set', val);
  }
}
