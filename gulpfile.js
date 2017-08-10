var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var paths = {
    scripts: ['js/googleAnalytics.js', 'js/scripts.js', 'js/serviceworker-cache-polyfill.js']
};

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('scripts', function () {
    return gulp.src(paths.scripts)
        .pipe(uglify())
        .pipe(rename({
            suffix: '-min'
        }))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }))
});