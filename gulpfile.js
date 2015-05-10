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
var uglifyify  = require('uglifyify');
var browserify = require('browserify');
var reactify = require('reactify');
var react = require('gulp-react');
var watchify = require('watchify');
var gStreamify = require('gulp-streamify');
var minifyCSS = require('gulp-minify-css');
var stylus = require('gulp-stylus');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');

gulp.task('default', ['watch']);

gulp.task('watch', ['jsx:watch', 'js:watch']);

gulp.task('build', ['js-jsx:build', 'css:build']);

gulp.task('js-jsx:build', ['jsx:build'], function() {
  scripts(false);
});

gulp.task('js:build', function() {
  scripts(false);
});

gulp.task('js:watch', function() {
  scripts(true);
});

gulp.task('jsx:build', function() {
  return gulp.src('app/**/*.jsx')
    .pipe(plumber({errorHandler: handleError('jsx:build')}))
    .pipe(react())
    .pipe(gulp.dest('app/'));
});

gulp.task('jsx:watch', function() {
  gulp.watch('app/**/*.jsx', ['jsx:build']);
});

var cssFiles = {
  stylus: ['assets/stylesheets/**/*.styl'],
  sass: ['assets/stylesheets/**/*.scss'],
  css: ['node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/toastr/toastr.min.css']
};
gulp.task('css:build', function() {
  var bundleCssDest = (argv.bundleCssDest ? argv.bundleCssDest : 'dist/stylesheets');
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

// gulp.task('css:watch', function() {
//   gulp.watch(cssFiles, ['css:build']);
// });

function scripts(watch) {
  var bundler, rebundle;
  bundler = browserify('./app/app.js', {
    basedir: __dirname,
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    fullPaths: watch // required to be true only for watchify
  });
  if(watch) {
    bundler = watchify(bundler);
  }
  bundler.transform(reactify);
  if(production) {
    bundler.transform({global: true}, uglifyify);
  }
  rebundle = function() {
    var stream = bundler.bundle();
    stream.on('error', handleError('Browserify'));
    stream = stream.pipe(source('bundle.js'));
    if(production) {
      stream.pipe(gStreamify(uglify()));
    }
    var bundleJsDest = (argv.bundleJsDest ? argv.bundleJsDest : 'dist/javascripts');
    return stream.pipe(gulp.dest(bundleJsDest)).pipe(notify('scripts build done!'));
  };
  bundler.on('update', rebundle);
  return rebundle();
}

function handleError(task) {
  return function(err) {
    gutil.log(gutil.colors.red(err));
    notify.onError(task + ' failed, check the logs..')(err);
  };
}
