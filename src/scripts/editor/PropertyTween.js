import 'jquery';

let tpl_property = require('../templates/propertyTween.tpl.html');

export default class PropertyTween {
  // instance_property: The current property on the data object.
  // lineData: The line data object.
  constructor(instance_property, lineData, editor, key_val = false, timeline = false) {
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
    var self = this;
    if (!this.key_val.ease) {
      this.key_val.ease = "Quad.easeOut";
    }
    var data = {
      id: this.instance_property.name + "_tween",
      val: this.key_val.ease,
      time: this.key_val.time.toFixed(3),
      options: ['Linear.easeNone'],
      selected: function() {
        if (this.toString() === self.key_val.ease) {
          return 'selected';
        } else {
          return '';
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
    this.$time = this.$el.find('.property__key-time strong');
    this.$time.keypress((e) => {
      if (e.charCode == 13) {
        // Enter
        e.preventDefault();
        this.$time.blur();
        this.updateKeyTime(this.$time.text());
      }
    });

    this.$time.on('click', () => document.execCommand('selectAll', false, null));
    this.$el.find('select').change(this.onChange);
  }

  updateKeyTime(time) {
    time = parseFloat(time);
    if (isNaN(time)) {
      time = this.key_val.time;
    }
    this.$time.text(time);
    this.key_val.time = time;
    this.onChange();
  }

  onChange() {
    var ease = this.$el.find('select').val();
    this.key_val.ease = ease;
    this.editor.undoManager.addState();
    this.lineData._isDirty = true;
    this.timeline._isDirty = true;
  }

  update() {
    // todo: use mustache instead...
    this.$time.html(this.key_val.time.toFixed(3));
  }
}
