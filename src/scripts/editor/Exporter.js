export default class Exporter {
  constructor (editor) {
    this.editor = editor;
  }

  getData() {
    var tweenTime = this.editor.tweenTime;
    var domain = this.editor.timeline.x.domain();
    var domain_start = domain[0];
    var domain_end = domain[1];
    return {
      settings: {
        time: tweenTime.timer.getCurrentTime(),
        duration: tweenTime.timer.getDuration(),
        domain: [domain_start.getTime(), domain_end.getTime()]
      },
      data: tweenTime.data
    };
  }

  getJSON () {
    var options = this.editor.options;
    var json_replacer = function(key, val) {
      // Disable all private properies from TweenMax/TimelineMax
      if (key.indexOf('_') === 0) {
        return undefined;
      }
      if (options.json_replacer !== undefined) {
        return options.json_replacer(key, val);
      }
      return val;
    };

    data = this.getData();
    return JSON.stringify(data, json_replacer, 2);
  }
}
