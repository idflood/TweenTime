let Signals = require('js-signals');

export default class Timer {
  constructor(options = {}) {
    // in millisecond
    this.totalDuration = options.totalDuration || 240 * 1000;
    // Use an array for the time for easier d3.js integration (used as data for timeseeker).
    this.time = [0];
    this.is_playing = false;
    this.last_timeStamp = -1;
    this.last_time = -1;
    this.updated = new Signals.Signal();
    this.preStatusChanged = new Signals.Signal();
    this.statusChanged = new Signals.Signal();
    this.durationChanged = new Signals.Signal();
    this.seeked = new Signals.Signal();
    this.update = this.update.bind(this);
    window.requestAnimationFrame(this.update);
  }

  getCurrentTime() {
    return this.time[0];
  }

  getDuration() {
    return this.totalDuration / 1000;
  }

  setDuration(seconds) {
    this.totalDuration = seconds * 1000;
    this.durationChanged.dispatch(seconds);
  }

  play() {
    this.preStatusChanged.dispatch(true);
    setImmediate(() => {
      this.is_playing = true;
      this.statusChanged.dispatch(this.is_playing);
    });
  }

  stop() {
    this.preStatusChanged.dispatch(false);
    setImmediate(() => {
      this.is_playing = false;
      this.statusChanged.dispatch(this.is_playing);
    });
  }

  toggle() {
    this.preStatusChanged.dispatch(!this.is_playing);
    setImmediate(() => {
      this.is_playing = !this.is_playing;
      this.statusChanged.dispatch(this.is_playing);
    });
  }

  seek(time) {
    this.time[0] = time[0];
    this.seeked.dispatch(this.time[0]);
  }

  update() {
    // Init timestamp

    // the argument timestamp is too old, if we have a long time task on click on
    // play button's click handler. so re-fetch the current timestamp here again.
    let timestamp = performance.now();
    if (this.last_timeStamp === -1) {
      this.last_timeStamp = timestamp;
    }
    var elapsed = timestamp - this.last_timeStamp;

    if (this.is_playing) {
      this.time[0] += elapsed;
    }

    if (this.time[0] >= this.totalDuration) {
      // Stop timer when reaching the end.
      this.time[0] = this.totalDuration;
      this.stop();
    }

    this.updated.dispatch(this.time[0], this.is_playing ? elapsed : 0);

    this.last_timeStamp = timestamp;
    this.last_time = this.time[0];
    window.requestAnimationFrame(this.update);
  }
}
