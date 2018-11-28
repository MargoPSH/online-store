"use strict";

const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const htmlhint = require('gulp-htmlhint');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const src = {
    html: 'src/*.html',
    sass: 'src/css/*.sass',
    js: 'src/js/*.js',
    json: 'src/json/*.json',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*',
};

const dist = {
    html: 'dist/',
    css: 'dist/css/',
    js: 'dist/',
    json: 'dist/json/',
    img: 'dist/img/',
    fonts: 'dist/fonts/',
};

const watch = {
    html: 'src/**/*.html',
    sass: 'src/css/**/*.sass',
    js: 'src/js/**/*.js',
    json: 'src/json/**/*.json',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*',
};

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'dist'
        },
    });
});

gulp.task('clean', function() {
    return gulp.src('dist', {read: false}).pipe(clean());
});

gulp.task('html', function() {
    gulp.src(src.html)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(htmlhint())
    .pipe(gulp.dest(dist.html))
    .pipe(reload({stream: true}));
});

gulp.task('img', function() {
    gulp.src(src.img)
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        interlaced: true,
        optimizationLevel: 3
    })).pipe(gulp.dest(dist.img))
    .pipe(reload({stream: true}));
});

gulp.task('fonts', function() {
    gulp.src(src.fonts)
    .pipe(gulp.dest(dist.fonts))
    .pipe(reload({stream: true}));
});

gulp.task('js', function() {
    gulp.src(src.js)
    .pipe(sourcemaps.init())
    .pipe(babel({presets: ['env']}))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist.js))
    .pipe(reload({stream: true}));
});

gulp.task('json', function() {
    gulp.src(src.json)
    .pipe(gulp.dest(dist.json))
    .pipe(reload({stream: true}));
});

gulp.task('sass', function() {
    gulp.src(src.sass)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
        indentType: 'tab',
        indentWidth: 1,
        outputStyle: 'expanded',
    })).on('error', sass.logError)
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist.css))
    .pipe(reload({stream: true}));
});

gulp.task('build', ['html', 'js', 'json', 'fonts', 'img', 'sass']);
gulp.task('watch', ['browserSync'], function() {
    gulp.watch(watch.html, ['html']);
    gulp.watch(watch.sass, ['sass']);
    gulp.watch(watch.js, ['js']);
    gulp.watch(watch.js, ['json']);
    gulp.watch(watch.img, ['img']);
    gulp.watch(watch.fonts, ['fonts']);
});