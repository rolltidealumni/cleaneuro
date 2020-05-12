var gulp = require("gulp");
var concat = require("gulp-concat");
const terser = require('gulp-terser');
var cleanCss = require('gulp-clean-css');

gulp.task("scripts", function () {
  return gulp
    .src([
      "src/actions/*.js",
      "src/components/*.js",
      "src/containers/*.js",
      "src/firebase/*.js",
      "src/reducers/*.js",
      "src/server/*.js",
      "src/static/*.js",
    ])
    .pipe(concat("bundle.js"))
    .on('error', console.error)
    .pipe(gulp.dest("public/build/js"));
});

gulp.task("styles", function () {
  return gulp
    .src(["src/index.css"])
    .pipe(concat("stylesheet.css"))
    .pipe(cleanCss())
    .pipe(gulp.dest("public/build/css"));
});

gulp.task('default', gulp.parallel('scripts', 'styles'));