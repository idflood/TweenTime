var gulp = require('gulp');
var gutil = require('gulp-util');
var requirejs = require('requirejs');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');

gulp.task('scripts:tweentime', [], function(cb) {
  requirejs.optimize({
    baseUrl: 'src/scripts',
    mainConfigFile: 'src/scripts/require-config.js',
    name: 'bower_components/almond/almond',
    out: 'dist/scripts/TweenTime.js',
    optimize: 'none',
    inlineText: true,
    generateSourceMaps: true,
    preserveLicenseComments: true,
    include: 'TweenTime',
    paths: {
      requireLib: "bower_components/requirejs/require"
    },
    exclude: ['coffee-script', 'TweenMax', 'TimelineMax'],
    stubModules: ['cs'],
    wrap: {
      "startFile": "src/misc/wrap.start.js",
      "endFile": "src/misc/wrap.end.js"
    },
  }, function (buildResponse) {
    cb();
  }, function (err){
    gutil.log(gutil.colors.white.bgRed.bold('### Scripts error ###'));
    gutil.log(err);
    cb();
  })
});

gulp.task('scripts', ['scripts:tweentime'], function(cb) {
  requirejs.optimize({
    baseUrl: 'src/scripts',
    mainConfigFile: 'src/scripts/require-config.js',
    name: 'bower_components/almond/almond',
    out: 'dist/scripts/Editor.js',
    optimize: 'none',
    inlineText: true,
    generateSourceMaps: true,
    preserveLicenseComments: true,
    include: 'Editor',
    paths: {
      requireLib: "bower_components/requirejs/require"
    },
    exclude: ['coffee-script', 'TweenMax', 'TimelineMax', 'd3', 'jquery', 'Mustache', 'lodash', 'draggablenumber'],
    stubModules: ['cs'],
    wrap: {
      "startFile": "src/misc/wrap.start--editor.js",
      "endFile": "src/misc/wrap.end--editor.js"
    },
  }, function (buildResponse) {
    cb();
  }, function (err){
    gutil.log(gutil.colors.white.bgRed.bold('### Scripts error ###'));
    gutil.log(err);
    cb();
  })
});

gulp.task('styles', [], function(cb) {
  gulp.src('src/styles/editor.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({
      style: 'expanded',
      errLogToConsole: true
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist/styles/'));
});

gulp.task('default', function() {
  livereload.listen();

  gulp.watch([
    'examples/*.html',
    '!src/scripts/bower_components/**',
    'dist/styles/*.css',
    'dist/scripts/*.js'
  ], livereload.changed);

  gulp.watch(['src/styles/**'], ['styles']);
  gulp.watch(['src/scripts/**', '!src/scripts/bower_components/**'], ['scripts']);
});
