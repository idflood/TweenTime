var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require("path");
var sass = require('gulp-sass');
var autoprefixer = require("gulp-autoprefixer");
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require("webpack");
var eslint = require('gulp-eslint');
var browserSync = require('browser-sync').create();

var getWebpackConfig = function() {
  return {
    context: __dirname + "/src/scripts",
    entry: {
      Core: "./Core",
      Editor: "./Editor",
    },
    devtool: "source-map",
    externals: [
      'd3',
      {
        'file-saver': {
          root: 'saveAs',
          commonjs: 'file-saver',
          commonjs2: 'file-saver',
          amd: 'file-saver'
        },
        'spectrum': {
          root: 'spectrum',
          commonjs: 'spectrum-colorpicker',
          commonjs2: 'spectrum-colorpicker',
          amd: 'spectrum',
        },
        'js-signals': {
          root: 'signals',
          commonjs: 'signals',
          commonjs2: 'signals',
          amd: 'signals'
        },
        'draggable-number.js': {
          root: 'DraggableNumber',
          commonjs: 'draggable-number.js',
          commonjs2: 'draggable-number.js',
          amd: 'DraggableNumber'
        },
        'TweenMax': {
          root: 'TweenMax',
          commonjs: ['gsap', 'TweenMax'],
          commonjs2: ['gsap', 'TweenMax'],
          amd: 'TweenMax'
        },
        'TimelineMax': {
          root: 'TimelineMax',
          commonjs: ['gsap', 'TimelineMax'],
          commonjs2: ['gsap', 'TimelineMax'],
          amd: 'TimelineMax'
        },
        'Quad': {
          root: 'Quad',
          commonjs: ['gsap', 'Quad'],
          commonjs2: ['gsap', 'Quad'],
          amd: 'Quad'
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
        {
          test: /\.js$/,
          exclude: [/bower_components/, /node_modules/, /dist/],
          loader: 'babel',
          query: {
            presets: ['es2015']
          }
        },
        {
          test: /\.tpl.html$/,
          loader: 'mustache'
        }
      ],
    },
    plugins: [
      new webpack.ResolverPlugin(
          new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
      )
    ],
  };
};

gulp.task('lint-scripts', function() {
  gulp.src([
    'src/scripts/**/*.js',
    '!src/scripts/bower_components/**'
    ])
    .pipe(eslint())
    .pipe(eslint.formatEach('stylish', process.stderr));
});

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

gulp.task('scripts:dist', ['lint-scripts'], function(cb) {
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
      sourceComments: false,
      omitSourceMapUrl: true,
      errLogToConsole: true
    }))
    .pipe(sourcemaps.write({includeContent: false}))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(autoprefixer({
      browsers: ['> 5%', 'last 2 versions'],
      cascade: false
    }))
    .pipe(minifyCss())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist/styles/'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './',
      directory: true
    }
  });
});

gulp.task('watch', function() {
  gulp.watch(['examples/*.html'], browserSync.reload);
  gulp.watch(['dist/scripts/*.js'], browserSync.reload);
  gulp.watch('src/styles/**', ['styles']);
  gulp.watch(['src/scripts/**', '!src/scripts/bower_components/**'], ['scripts:dist']);
});

gulp.task('default', ['watch', 'styles', 'scripts:dist', 'browser-sync']);
gulp.task('build', ['styles', 'scripts', 'scripts:dist']);
