import 'jquery';
import PropertyBase from './PropertyBase';

let tpl_property = require('../templates/propertyEvent.tpl.html');

export default class PropertyEvent extends PropertyBase {
  // instance_property: The current property on the data object.
  // lineData: The line data object.
  constructor(instance_property, lineData, editor, key_val = false) {
    super(instance_property, lineData, editor, key_val);
    this.onInputChange = this.onInputChange.bind(this);
    this.$input = this.$el.find('input');
  }

  render() {
    super.render();

    let val = this.getCurrentVal();

    let data = {
      id: this.instance_property.name, // "circleRadius" instead of "circle radius"
      label: this.instance_property.label || this.instance_property.name,
      val: val
    };

    let view = tpl_property(data);
    this.$el = $(view);

    var $input = this.$el.find('input');

    $input.change(this.onInputChange);
  }

  remove() {
    super.remove();
  }

  update() {
    super.update();
    var val = this.getCurrentVal();
    this.$input.val(val);
  }
}
