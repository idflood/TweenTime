var tpl_timeline = require('./templates/timeline.tpl.html');
import Timeline from './graph/Timeline';
import PropertiesEditor from './editor/PropertiesEditor';
import EditorMenu from './editor/EditorMenu';
import EditorControls from './editor/EditorControls';
import SelectionManager from './editor/SelectionManager';
import Exporter from './editor/Exporter';
import UndoManager from './editor/UndoManager';

class Editor {
  constructor(tweenTime, options = {}) {
    this.tweenTime = tweenTime;
    this.options = options;
    this.timer = this.tweenTime.timer;
    this.lastTime = -1;

    this.onKeyAdded = this.onKeyAdded.bind(this);
    this.onKeyRemoved = this.onKeyRemoved.bind(this);

    this.$timeline = $(tpl_timeline());
    $('body').append(this.$timeline);
    $('body').addClass('has-editor');

    this.selectionManager = new SelectionManager(this.tweenTime);
    this.exporter = new Exporter(this);
    this.timeline = new Timeline(this);

    this.propertiesEditor = new PropertiesEditor(this, this.selectionManager);
    this.propertiesEditor.keyAdded.add(this.onKeyAdded);
    this.propertiesEditor.keyRemoved.add(this.onKeyRemoved);

    this.menu = new EditorMenu(this.tweenTime, this.$timeline, this);
    if (this.options.onMenuCreated != null) {
      this.options.onMenuCreated(this.$timeline.find('.timeline__menu'));
    }

    this.controls = new EditorControls(this.tweenTime, this.$timeline);
    this.undoManager = new UndoManager(this);

    // Will help resize the canvas to correct size (minus sidebar and timeline)
    window.editorEnabled = true;
    window.dispatchEvent(new Event('resize'));
    window.requestAnimationFrame(() => this.update());
  }

  onKeyAdded() {
    this.undoManager.addState();
    this.render(false, true);
  }

  onKeyRemoved(item) {
    this.selectionManager.removeItem(item);
    this.undoManager.addState();
    if (this.selectionManager.selection.length) {
      this.selectionManager.triggerSelect();
    }
    this.render(false, true);
  }

  render(time = false, force = false) {
    if (time === false) {
      time = this.timer.time[0];
    }
    if (force) {
      this.timeline._isDirty = true;
    }
    this.timeline.render(time, force);
    this.controls.render(time, force);
    this.propertiesEditor.render(time, force);
  }

  update() {
    var time = this.timer.time[0];
    var time_changed = this.lastTime === time ? false : true;

    this.render(time, time_changed);
    this.lastTime = this.timer.time[0];
    window.requestAnimationFrame(() => this.update());
  }
}

module.exports = Editor;
