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
  }

  render() {
    var self = this;
    if (!this.key_val.ease) {
      this.key_val.ease = 'Quad.easeOut';
    }
    var data = {
      id: this.instance_property.name + '_tween',
      val: this.key_val.ease,
      options: ['Linear.easeNone'],
      selected: function() {
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

  onChange() {
    var ease = this.$el.find('select').val();
    this.key_val.ease = ease;
    this.editor.undoManager.addState();
    this.lineData._isDirty = true;
    this.timeline._isDirty = true;
  }

  update() {
    console.log('PropertyTween\'s upload method is not yet implemented.');
  }
}
