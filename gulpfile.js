var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
    scripts: ['js/googleAnalytics.js', 'js/scripts.js', 'js/serviceworker-cache-polyfill.js'],
    maps: '../maps'
};

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('scripts', function () {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({
            suffix: '-min'
        }))
        .pipe(sourcemaps.write(paths.maps))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }))
});