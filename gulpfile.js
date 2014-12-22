var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require("path");
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var webpack = require("webpack");

var getWebpackConfig = function() {
  return {
    context: __dirname + "/src/scripts",
    entry: {
      //vendor: ['gsap', 'd3', 'jquery', 'mustache.js', 'lodash', 'draggable-number.js'],
      Core: "./Core",
      Editor: "./Editor",
    },
    devtool: "source-map",
    externals: [
      'd3',
      'spectrum',
      {
        'js-signals': {
          root: 'signals',
          commonjs: './signals',
          amd: 'signals'
        },
        'draggable-number.js': {
          root: 'DraggableNumber',
          commonjs: 'DraggableNumber',
          commonjs2: 'DraggableNumber',
          amd: 'DraggableNumber'
        },
        'gsap': {
          root: 'TweenMax',
          commonjs: 'TweenMax',
          commonjs2: 'TweenMax',
          amd: 'TweenMax'
        },
        'jquery': {
          root: '$',
          commonjs: 'jquery',
          commonjs2: 'jquery',
          amd: 'jquery'
        },
        'lodash': {
          root: '_',
          commonjs: "lodash",
          commonjs2: "lodash",
          amd: "lodash"
        },
        'mustache.js': {
          root: 'Mustache',
          commonjs: "mustache",
          commonjs2: "mustache",
          amd: "mustache"
        }
      }
    ],
    output: {
        path: path.join(__dirname, "dist/scripts"),
        filename: "TweenTime.[name].js",
        libraryTarget: "umd",
        library: ["TweenTime", "[name]"]
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: '6to5-loader'},
        { test: /\.tpl.html$/, loader: 'mustache'},
      ],
    },
    resolve: {
      root: [path.join(__dirname, "src/scripts/bower_components")],
      // Add alias when the library doesn't automagically load with bower resolver.
      alias: {
        //spectrum: 'bower_components/spectrum/spectrum.js'
        //'js-signals': 'bower_components/js-signals/dist/signals.js'
      }
    },
    plugins: [
      new webpack.ResolverPlugin(
          new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
      ),
      new webpack.optimize.DedupePlugin()
    ],
  };
};

gulp.task('scripts', function(cb) {
  var conf = getWebpackConfig();
  webpack(conf, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
        chunks: false
    }));
    cb();
  });
});

gulp.task('scripts:dist', function(cb) {
  var conf = getWebpackConfig();
  // Add .min.js to output filename.
  conf.output.filename = "TweenTime.[name].min.js";
  // Add minification with UglifyJs.
  conf.plugins.push(new webpack.optimize.UglifyJsPlugin({
    mangle: true,
    output: {
      comments: false
    },
    compress: {
      drop_debugger: false,
      sequences: true,
      //dead_code: true,
      conditionals: true,
      booleans: true,
      unused: true,
      if_return: true,
      join_vars: true,
      drop_console: false
    }
  }));
  webpack(conf, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
        chunks: false
    }));
    cb();
  });
});

gulp.task('styles', function() {
  gulp.src('src/styles/editor.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({
      style: 'expanded',
      errLogToConsole: true
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist/styles/'));
});

gulp.task('livereload', function() {
  livereload.listen();
});

gulp.task('watch', function() {
  gulp.watch(['examples/*.html'], livereload.changed);
  gulp.watch(['dist/styles/*.css', 'dist/scripts/*.js'], livereload.changed);
  gulp.watch('src/styles/**', ['styles']);
  gulp.watch(['src/scripts/**', '!src/scripts/bower_components/**'], ['scripts:dist']);
});

gulp.task('default', ['watch', 'livereload', 'styles', 'scripts:dist']);
gulp.task('build', ['styles', 'scripts', 'scripts:dist']);
