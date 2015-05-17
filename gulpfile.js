var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var concat = require('gulp-concat')
var minifyCss = require('gulp-minify-css')
var rename = require('gulp-rename')
var plumber = require('gulp-plumber');

gulp.task('browserify', function () {
  return browserify({
      debug: true,
      entries: ['scripts/main.js'],
    }).bundle()
    .pipe(source('searhcer.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true,
    }))
//    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(rename('searcher.min.js'))
    .pipe(gulp.dest('./dist/'));
  });

gulp.task('sass', function () {
  gulp.src('./styles/*.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(concat('style.css'))
  .pipe(minifyCss())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function() {
  gulp.watch('./styles/**/*.scss', ['sass']);
  gulp.watch('./scripts/**/*', ['browserify']);
});

gulp.task('build', ['browserify', 'sass'], function() {
  gulp.src('index.html')
  .pipe(gulp.dest('./dist/'));
});

