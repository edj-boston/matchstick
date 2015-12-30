var gulp = require('gulp'),
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha'),
    coveralls = require('gulp-coveralls'),
    eslint = require('gulp-eslint');


// instrument the code
gulp.task('cover', function () {
    return gulp.src('lib/*.js')
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});


// Run tests and product coverage
gulp.task('test', ['cover'], function () {
    return gulp.src('test/*.js')
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({
            thresholds : {
                global : 80
            }
        }));
});


// Run tests and product coverage
gulp.task('coveralls', ['test'], function () {
    return gulp.src('coverage/lcov.info')
        .pipe(coveralls());
});


// Lint as JS files (including this one)
gulp.task('lint', ['test'], function () {
    return gulp.src([
        'lib/*.js',
        'test/*.js',
        'gulpfile.js',
        '!node_modules/**'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


// Task for local development
gulp.task('default', ['lint'], function() {
    gulp.watch([
        'lib/*',
        'test/*'
    ], ['lint']);
});