import 'jquery';

let tpl_property = require('../templates/propertyFooter.tpl.html');

export default class PropertyFooter {
  // instance_property: The current property on the data object.
  // lineData: The line data object.
  constructor(instance_property, lineData, editor, key_val = false, timeline = false) {
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

  remove() {
    delete this.$el;
    delete this.instance_property;
    delete this.lineData;
    delete this.editor;
    delete this.key_val;
    delete this.timeline;

    delete this.timer;
    delete this.$time;
  }

  render() {
    var data = {
      time: this.key_val.time.toFixed(3)
    };

    this.$el = $(tpl_property(data));
    this.$time = this.$el.find('.property__key-time strong');
    this.$time.keypress((e) => {
      if (e.charCode === 13) {
        // Enter
        e.preventDefault();
        this.$time.blur();
        this.updateKeyTime(this.$time.text());
      }
    });

    this.$time.on('click', () => document.execCommand('selectAll', false, null));
  }

  updateKeyTime(time) {
    let time2 = parseFloat(time);
    if (isNaN(time2)) {
      time2 = this.key_val.time;
    }
    this.$time.text(time2);
    this.key_val.time = time2;
  }

  update() {
    // todo: use mustache instead...
    this.$time.html(this.key_val.time.toFixed(3));
  }
}
