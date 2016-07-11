let Signals = require('js-signals');
import PropertyNumber from './PropertyNumber';
import PropertyColor from './PropertyColor';
import PropertyTween from './PropertyTween';
import PropertyEvent from './PropertyEvent';
import PropertyFooter from './PropertyFooter';

export default class Property {
  constructor(editor, $el, data) {
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
            let footerProp = this.addFooter(instance_prop, lineData, key_val, $tween_container, propertyData);
            this.items.push(footerProp);
          }
        }
      }
    }
  }

  onKeyAdded() {
    // propagate the event.
    this.keyAdded.dispatch();
  }

  getGroupContainer(instance_prop, $container) {
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

  createGroupContainer(grp_class, label = false) {
    var $grp = $('<div class="property-grp ' + grp_class + '"></div>');
    if (label) {
      $grp.append('<h3 class="property-grp__title">' + label + '</h3>');
    }
    return $grp;
  }

  getContainer(lineData) {
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

  remove() {
    this.items.forEach((item) => {item.remove();});
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

  addNumberProperty(instance_prop, lineData, key_val, $container) {
    var PropClass = PropertyNumber;
    if (instance_prop.type === 'color') {
      PropClass = PropertyColor;
    }
    else if (instance_prop.type === 'event') {
      PropClass = PropertyEvent;
    }
    var prop = new PropClass(instance_prop, lineData, this.editor, key_val);
    prop.keyAdded.add(this.onKeyAdded);
    $container.append(prop.$el);
    return prop;
  }

  addTweenProperty(instance_prop, lineData, key_val, $container) {
    var tween = new PropertyTween(instance_prop, lineData, this.editor, key_val, this.timeline);
    $container.append(tween.$el);
    return tween;
  }

  addFooter(instance_prop, lineData, key_val, $container, propertyData) {
    let footer = new PropertyFooter(instance_prop, lineData, this.editor, key_val, this.timeline);
    $container.append(footer.$el);

    // Add a remove key button
    footer.$el.find('[data-action-remove]').click((e) => {
      e.preventDefault();
      var index = propertyData.keys.indexOf(key_val);
      if (index > -1) {
        propertyData.keys.splice(index, 1);
        if (key_val._dom) {
          this.editor.propertiesEditor.keyRemoved.dispatch(key_val);
        }
        lineData._isDirty = true;
      }
    });
    return footer;
  }

  update() {
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      item.update();
    }
  }
}
