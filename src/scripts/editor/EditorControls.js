export default class EditorControls {
  constructor(tweenTime, $timeline) {
    this.tweenTime = tweenTime;
    this.$timeline = $timeline;
    this.timer = this.tweenTime.timer;
    this.$time = this.$timeline.find('.control--time');
    this.$time_end = this.$timeline.find('.control--time-end');
    this.initControls();
    this.$time_end.val(this.tweenTime.timer.getDuration());

    $(document).keypress((e) => {
      if (e.charCode === 32) {
        // Space
        this.playPause();
      }
    });
  }

  playPause() {
    var $play_pause;
    this.timer.toggle();
    $play_pause = this.$timeline.find('.control--play-pause');
    $play_pause.toggleClass('icon-pause', !this.timer.is_playing);
    $play_pause.toggleClass('icon-play', this.timer.is_playing);
  }

  initControls() {
    var $play_pause = this.$timeline.find('.control--play-pause');
    $play_pause.click((e) => {
      e.preventDefault();
      this.playPause();
    });
    var $bt_first = this.$timeline.find('.control--first');
    $bt_first.click((e) => {
      e.preventDefault();
      this.timer.seek([0]);
    });
    var $bt_last = this.$timeline.find('.control--last');
    $bt_last.click((e) => {
      e.preventDefault();
      var total = this.tweenTime.getTotalDuration();
      this.timer.seek([total * 1000]);
    });
    this.$time.change(() => {
      var seconds = parseFloat(this.$time.val(), 10) * 1000;
      this.timer.seek([seconds]);
    });
    this.$time_end.change(() => {
      var seconds = parseFloat(this.$time_end.val(), 10);
      this.timer.setDuration(seconds);
    });
  }

  render(time, time_changed) {
    if (time_changed) {
      var seconds = time / 1000;
      this.$time.val(seconds.toFixed(3));
    }
  }
}
