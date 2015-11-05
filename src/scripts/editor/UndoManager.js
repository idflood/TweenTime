import 'jquery';

export default class UndoManager {
  constructor(editor) {
    this.editor = editor;
    this.history_max = 100;
    this.history = [];
    this.current_index = 0;

    // Add the initial state
    this.addState();

    $(document).keydown((e) => {
      if (e.keyCode === 90) {
        if (e.metaKey || e.ctrlKey) {
          if (!e.shiftKey) {
            // (command | ctrl) Z
            this.undo();
          }
          else {
            // (command | ctrl) shift Z
            this.redo();
          }
        }
      }
    });
  }

  undo() {
    // If there is no more history return
    if (this.current_index <= 0) {
      return false;
    }
    this.current_index -= 1;
    this.setState(this.current_index);
  }

  redo() {
    // Stop if there is no more things.
    if (this.current_index >= this.history.length - 1) {
      return false;
    }
    this.current_index += 1;
    this.setState(this.current_index);
  }

  addState() {
    var data = JSON.parse(this.editor.exporter.getJSON());

    // if we did some undo before and then edit something,
    // we want to remove all actions past the current index first.
    if (this.current_index + 1 < this.history.length) {
      this.history.splice(this.current_index + 1, this.history.length - 1);
    }

    this.history.push(data);

    // Keep history to a max size by removing the first element if needed.
    if (this.history.length > this.history_max) {
      this.history.shift();
    }

    // Set the current index
    this.current_index = this.history.length - 1;
  }

  setState(index) {
    var state = this.history[index];
    var data = state.data;
    var tweenTime = this.editor.tweenTime;

    // naively copy keys and values from previous state
    for (var item_key = 0; item_key < data.length; item_key++) {
      var item = data[item_key];
      // if item is not defined copy it
      if (!tweenTime.data[item_key]) {
        tweenTime.data[item_key] = item;
      }
      else {
        for (var prop_key = 0; prop_key < item.properties.length; prop_key++) {
          var prop = item.properties[prop_key];
          // if property is not defined copy it
          if (!tweenTime.data[item_key].properties[prop_key]) {
            tweenTime.data[item_key].properties[prop_key] = prop;
          }
          else {
            // set property keys
            var keys = tweenTime.data[item_key].properties[prop_key].keys;
            for (var key_key = 0; key_key < prop.keys.length; key_key++) {
              var key = prop.keys[key_key];
              if (!keys[key_key]) {
                keys[key_key] = key;
              }
              else {
                keys[key_key].time = key.time;
                keys[key_key].val = key.val;
                keys[key_key].ease = key.ease;
              }
            }
          }
        }
      }

      tweenTime.data[item_key]._isDirty = true;
    }
    this.editor.render(false, true);
  }
}
