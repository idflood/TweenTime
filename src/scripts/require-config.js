require.config({
  paths: {
    jquery: 'bower_components/jquery/dist/jquery',
    text: 'bower_components/requirejs-text/text',
    cs: "bower_components/require-cs/cs",
    "coffee-script": "bower_components/coffee-script/extras/coffee-script",
    Signal: 'bower_components/js-signals/dist/signals',
    d3: "bower_components/d3/d3",
    Mustache: "bower_components/mustache.js/mustache",
    lodash: "bower_components/lodash/dist/lodash",
    draggablenumber: "bower_components/draggable-number.js/dist/draggable-number",
    TweenMax: "bower_components/gsap/src/uncompressed/TweenMax",
    TweenLite: "bower_components/gsap/src/uncompressed/TweenLite",
    TimelineLite: "bower_components/gsap/src/uncompressed/TimelineLite",
    TimelineMax: "bower_components/gsap/src/uncompressed/TimelineMax",
    FileSaver: "bower_components/FileSaver/FileSaver"
  },
  shim: {
    TimelineMax: {
      exports: 'TimelineLite',
      deps: ['TweenMax']
    }
  }
});
