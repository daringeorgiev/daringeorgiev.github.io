var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass')(require('sass'));
var autoprefixer  = require('gulp-autoprefixer');
var critical = require('critical');
var fs = require('fs');

var paths = {
    scripts: ['js/googleAnalytics.js', 'js/scripts.js', 'js/serviceworker-cache-polyfill.js'],
    css: 'css/styles.scss',
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

gulp.task('css', function () {
    return gulp.src(paths.css)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }))
        // compressed version
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(rename({
            suffix: '-min'
        }))
        .pipe(sourcemaps.write(paths.maps))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }))
});

gulp.task('critical', async function () {
    await critical.generate({
        inline: true,
        base: './',
        src: 'index.html',
        target: 'dist/index.html',
        css: [
            'https://bootswatch.com/5/cosmo/bootstrap.min.css',
            'css/styles-min.css'
        ],
        ignore: {
            atrule: ['font-face', 'charset', 'import']
        },
        width: 1300,
        height: 900
    });

    // Font Awesome ships with font-display:block; patch to swap so browsers
    // show fallback text immediately rather than hiding it during font load.
    const distPath = 'dist/index.html';
    const patched = fs.readFileSync(distPath, 'utf8').replace(/font-display:block/g, 'font-display:swap');
    fs.writeFileSync(distPath, patched);
});