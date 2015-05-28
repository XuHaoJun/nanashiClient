var ENV = process.env.ENV;
var production =  ( ENV == 'pro' || ENV == 'production' ? true : false);
var development = ( ENV == 'dev' || ENV == 'development' || !production  ? true : false);
var argv = require('yargs').argv;
var gulp = require('gulp');
var merge = require('merge-stream');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var uglify  = require('gulp-uglify');
var browserify = require('browserify');
var browserifyInc = require('browserify-incremental');
var xtend = require('xtend');
var react = require('gulp-react');
var watchify = require('watchify');
var gStreamify = require('gulp-streamify');
var minifyCSS = require('gulp-minify-css');
var stylus = require('gulp-stylus');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');

var jsFiles = 'app/**/*.js';
var jsxFiles = 'app/**/*.jsx';
var bundleJsDest = (argv.bundleJsDest ? argv.bundleJsDest : 'dist/javascripts');

var cssFiles = {
  stylus: ['assets/stylesheets/**/*.styl'],
  sass: ['assets/stylesheets/**/*.scss'],
  css: ['node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/toastr/toastr.min.css']
};
var bundleCssDest = (argv.bundleCssDest ? argv.bundleCssDest : 'dist/stylesheets');

gulp.task('default', ['watch']);

gulp.task('watch', ['jsx:watch', 'js:watch', 'css:watch']);

gulp.task('build', ['js:build', 'css:build']);

gulp.task('js-jsx:watch', ['jsx:watch', 'js:watch']);

gulp.task('js:build', ['jsx:build'], function() {
  var b;
  if (development) {
    b = browserify('./app/app.js', xtend(browserifyInc.args, {}));
  } else {
    b = browserify('./app/app.js', {fullPaths: false});
  }
  b.on('error', handleError('Browserify'));
  if (development) {
    browserifyInc(b, {cacheFile: './.browserify-cache.json'});
  }
  b = b.bundle().pipe(source('bundle.js'));
  if (production) {
    b = b.pipe(gStreamify(uglify()));
  }
  return (
    b.pipe(gulp.dest(bundleJsDest))
      .pipe(notify('scripts build done!'))
  );
});

gulp.task('js:watch', function() {
  return gulp.watch(jsFiles, ['js:build']);
});

gulp.task('jsx:build', function() {
  return gulp.src(jsxFiles)
    .pipe(plumber({errorHandler: handleError('jsx:build')}))
    .pipe(react())
    .pipe(gulp.dest('app/'));
});

gulp.task('jsx:watch', function() {
  return gulp.watch('app/**/*.jsx', ['jsx:build']);
});

gulp.task('css:build', function() {
  var _stylus = gulp.src(cssFiles.stylus)
        .pipe(plumber({errorHandler: handleError('css:build')}))
        .pipe(stylus());
  var _css = gulp.src(cssFiles.css);
  var _sass = gulp.src(cssFiles.sass).pipe(sass().on('error', sass.logError));
  return merge(_stylus, _css, _sass)
    .pipe(prefix("last 3 version"))
    .pipe(minifyCSS({keepSpecialComments: 0}))
    .pipe(concat('bundle.css', {newLine: ''}))
    .pipe(gulp.dest(bundleCssDest));
});

gulp.task('css:watch', function() {
  var files = [];
  for (var key in cssFiles) {
    files = files.concat(cssFiles[key]);
  }
  return gulp.watch(files, ['css:build']);
});

function handleError(task) {
  return function(err) {
    gutil.log(gutil.colors.red(err));
    notify.onError(task + ' failed, check the logs..')(err);
  };
}
