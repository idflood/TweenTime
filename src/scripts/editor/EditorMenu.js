let saveAs = require('../bower_components/FileSaver/FileSaver.js');

export default class EditorMenu {
  constructor(tweenTime, $timeline, editor) {
    this.tweenTime = tweenTime;
    this.$timeline = $timeline;
    this.editor = editor;
    this.timer = this.tweenTime.timer;
    this.initExport();
    this.initToggle();
  }

  initToggle() {
    var timelineClosed = false;
    var $toggleLink = this.$timeline.find('[data-action="toggle"]');
    $toggleLink.click((e) => {
      e.preventDefault();
      timelineClosed = !timelineClosed;
      $toggleLink.toggleClass('menu-item--toggle-up', timelineClosed);
      $('body').toggleClass('timeline-is-closed', timelineClosed);
      return window.dispatchEvent(new Event('resize'));
    });
    var $toggleLinkSide = $('.properties-editor').find('[data-action="toggle"]');
    $toggleLinkSide.click((e) => {
      var propertiesClosed;
      e.preventDefault();
      propertiesClosed = !$('body').hasClass('properties-is-closed');
      $('body').toggleClass('properties-is-closed', propertiesClosed);
      return window.dispatchEvent(new Event('resize'));
    });
  }

  initExport() {
    var self = this;
    var exporter = this.editor.exporter;
    this.$timeline.find('[data-action="export"]').click(function(e) {
      e.preventDefault();
      var data = exporter.getJSON();
      var blob = new Blob([data], {
        "type": "text/json;charset=utf-8"
      });
      saveAs(blob, 'data.json');
    });
  }
}