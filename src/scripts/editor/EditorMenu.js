let saveAs = require('file-saver').saveAs || require('file-saver');

export default class EditorMenu {
  constructor(tweenTime, $timeline, editor) {
    this.tweenTime = tweenTime;
    this.$timeline = $timeline;
    this.editor = editor;
    this.timer = this.tweenTime.timer;
    this.initExport();
    this.initToggle();
    this.initCurveToggle();
  }

  initToggle() {
    var parentElement = this.editor.el;
    var timelineClosed = false;
    var $toggleLink = this.$timeline.find('[data-action="toggle"]');
    $toggleLink.click((e) => {
      e.preventDefault();
      timelineClosed = !timelineClosed;
      $toggleLink.toggleClass('menu-item--toggle-up', timelineClosed);
      parentElement.toggleClass('timeline-is-closed', timelineClosed);
      return window.dispatchEvent(new Event('resize'));
    });
    var $toggleLinkSide = $('.properties-editor', parentElement).find('[data-action="toggle"]');
    $toggleLinkSide.click((e) => {
      var propertiesClosed;
      e.preventDefault();
      propertiesClosed = !parentElement.hasClass('properties-is-closed');
      parentElement.toggleClass('properties-is-closed', propertiesClosed);
      return window.dispatchEvent(new Event('resize'));
    });
  }

  initExport() {
    var exporter = this.editor.exporter;
    this.$timeline.find('[data-action="export"]').click(function(e) {
      e.preventDefault();
      var data = exporter.getJSON();
      var blob = new Blob([data], {
        type: 'text/json;charset=utf-8'
      });
      saveAs(blob, 'data.json');
    });
  }

  initCurveToggle() {
    this.$timeline.find('[data-action="switch-curve"]').click((e) => {
      e.preventDefault();
      this.editor.curveEditEnabled = !this.editor.curveEditEnabled;
      this.editor.render(false, false, true);
    });
  }
}
