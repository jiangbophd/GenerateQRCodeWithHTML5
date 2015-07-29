/**
 * Created by Richard on 7/28/15.
 */
var browserify = require('browserify');
var gulp = require('gulp');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var htmlmin = require('gulp-htmlmin');
var create = require('gulp-cordova-create');
var ios = require('gulp-cordova-build-ios');
var browserSync = require('browser-sync');
var source = require('vinyl-source-stream');

var config = {
    dist:'./www/'
}

gulp.task('browserify', function() {
    return browserify('./src/script/app.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.dist));
});

gulp.task('concatFile', ['browserify'], function() {
    return gulp.src(['./bower_components/qrcode-generator/js/qrcode.js',config.dist+'bundle.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest(config.dist));
});


gulp.task('compress', ['concatFile'], function() {
    return gulp.src(config.dist+'all.js')
        .pipe(uglify({mangle:false}))
        .pipe(gulp.dest(config.dist));
});

gulp.task('clean', ['compress'], function() {
    return gulp.src([config.dist+'bundle.js'], {read: false})
        .pipe(clean({force: true}));
});

gulp.task('minify-css', function() {
    return gulp.src('./src/style/*.css')
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(config.dist+'style'));
});

gulp.task('minify-html', function() {
    gulp.src(['./src/script/view/*.html'])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.dist+'script/view'));
    return gulp.src(['./src/*.html'])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.dist));
});

gulp.task('watch', function () {
    gulp.watch(['./src/*.html'], ['minify-html']);
    gulp.watch(['./src/style/*.css'], ['minify-css']);
    gulp.watch(['./src/script/controller/*.js','./src/script/app.js'],['browserify','concatFile','compress','clean']);
});

gulp.task('browserSync', function() {

    var browserSyncConfig = {
        port: 3030,
        server: {
            baseDir: 'www'
        },
        browser: ["google chrome"],
        minify: false,
        notify: false
    };
    browserSync(browserSyncConfig);
});

gulp.task('watch', ['browserSync'], function() {
    gulp.watch('./src/style/*.css',  ['minify-css']);
    gulp.watch(['./src/*.html','./src/script/view/barcode.html'],   ['minify-html']);
    gulp.watch(['./src/script/controller/*.js','./src/script/app.js'],  ['browserify','concatFile','compress','clean']);
});

gulp.task('buildIOSApp', ['clean'], function() {
    return gulp.src('./www')
        .pipe(create())
        .pipe(ios());
});

gulp.task('build', ['minify-html','minify-css','browserify','concatFile','compress','clean','buildIOSApp']);
gulp.task('serve', ['minify-html','minify-css','browserify','concatFile','compress','clean','browserSync','watch']);