var gulp = require('gulp'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    fileinclude = require('gulp-file-include'),
    htmlmin = require('gulp-htmlmin'),
    eslint = require('gulp-eslint'),
    webserver = require('gulp-webserver'),
	clean = require('gulp-clean');

/*devEnv = true - no minify files; project is deployed into dist/build */
/*devEnv = false - minify html, css, js files, all comments are removed; project is deployed into dist/production */
var devEnv = true,
    distPath = 'dist/build/',
    srcPath = 'app/';

/*set production environment */
gulp.task('set-production', function() {
    devEnv = false;
    distPath = 'dist/production/';
});
/*set production environment */

/*scripts build tasks */
gulp.task('custom-js', function() {
    gulp.src(srcPath + 'scripts/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('main.js'))
        .pipe(gulpif(!devEnv, uglify()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(distPath + 'scripts'));
});

gulp.task('plugins-js', function() {
    gulp.src([srcPath + 'scripts/libs/jquery.js', srcPath + 'scripts/libs/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('plugins.js'))
        .pipe(gulpif(!devEnv, uglify()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(distPath + 'scripts'));
});

gulp.task('scripts', ['custom-js', 'plugins-js']);
/*scripts build tasks */

/*styles build tasks */
gulp.task('styles', function() {
    return gulp.src(srcPath + 'styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions']
        }))
        .pipe(concat('main.css'))
        .pipe(gulpif(!devEnv, cssnano()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(distPath + 'styles'));
});
/*styles build tasks */

/*resources build tasks */
gulp.task('resources', function() {
    return gulp.src(srcPath + 'resources/**/*.*')
        .pipe(gulp.dest(distPath + 'resources'));
});
/*resources build tasks */

/*static files build tasks */
gulp.task('static-files', function() {
    return gulp.src(srcPath + '*.*')
        .pipe(gulp.dest(distPath));
});
/*resources build tasks */

/*html build tasks */
gulp.task('html', function() {
    return gulp.src(srcPath + 'templates/pages/*.html')
        .pipe(fileinclude({
	        context: {
		        devEnv: devEnv
	        },
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulpif(!devEnv, htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true, removeComments: true})))
        .pipe(gulp.dest(distPath));
});
/*html build tasks */

/*watcher task */
gulp.task('watch', ['build'], function() {
    /*scripts watcher */
    gulp.watch(srcPath + 'scripts/*.js', ['custom-js']);
    gulp.watch(srcPath + 'scripts/libs/**/*.js', ['plugins-js']);
    /*scripts watcher */

    /*styles watcher */
    gulp.watch(srcPath + 'styles/**/*.*', ['styles']);
    /*styles watcher */

    /*resources watcher */
    gulp.watch(srcPath + 'resources/**/*.*', ['resources']);
    /*resources watcher */

    /*html watcher */
    gulp.watch(srcPath + 'templates/**/*.html', ['html']);
    /*html watcher */

    /*static files watcher */
    gulp.watch(srcPath + '*.*', ['static-files']);
    /*static files watcher */

});
/*watcher task */

/*serve the site task with changing watching */
gulp.task('serve', ['watch'], function() {
    gulp.src(distPath)
        .pipe(webserver({
            livereload: false,
            port: 3000,
            directoryListing: distPath,
            open: 'http://localhost:3000/index.html'
        }));
});
/*serve the site task with changing watching */

/*clear dist folder before build start */
gulp.task('clean', function () {
	return gulp.src('dist/', {read: false, force: true})
		.pipe(clean());
});
/*clear dist folder before build start */

/*build all files devEnv */
gulp.task('build', ['scripts', 'styles', 'resources', 'html', 'static-files']);
/*build all files */

/*build all files prodEnv */
gulp.task('production', ['set-production', 'build']);
/*build all files */