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
    TimelineMax: "bower_components/gsap/src/uncompressed/TimelineMax"
  },
  shim: {
    TimelineMax: {
      exports: 'TimelineLite',
      deps: ['TweenMax']
    }
    /*headroom: {
      deps: ['requestAnimationFrame', 'classList'],
      exports: 'Headroom'
    }*/
    // If a script require another script to be loaded before:
    /*
    bxslider: {
      deps: ['jquery'] // This match something in path section.
    },
     */
    // If a script returns nothing when added to a file we need
    // to define an export.
    /*
    timeline: {
      deps: ['tweenmax'],
      exports: 'TimelineLite' // In timeline.js the plugin is returned as TimelineLite object.
    },
     */
  }
});
