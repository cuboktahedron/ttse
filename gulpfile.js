var gulp = require('gulp');

var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var handleErrors = require('./scripts/lib/handleErrors');

gulp.task('browserify', function () {
  return browserify({
      debug: true,
      entries: ['scripts/main.js'],
    }).bundle()
    .on('error', handleErrors)
    .pipe(source('searhcer.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({
      loadMaps: true,
    }))
    .pipe($.uglify())
//    .pipe($.sourcemaps.write())
    .pipe($.rename('searcher.min.js'))
    .pipe(gulp.dest('./dist/'));
  });

gulp.task('sass', function () {
  gulp.src('./styles/*.scss')
  .pipe($.plumber())
  .pipe($.sass())
  .pipe($.concat('style.css'))
  .pipe($.minifyCss())
  .pipe($.rename('style.min.css'))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('test', function() {
  return gulp.src('./scripts/test/*.js')
    .pipe($.jasmine());
});

gulp.task('watch', function() {
  gulp.watch('./styles/**/*.scss', ['sass']);
  gulp.watch('./scripts/**/*', ['browserify']);
});

gulp.task('build', ['browserify', 'sass'], function() {
  gulp.src('index.html')
  .pipe(gulp.dest('./dist/'));
});

