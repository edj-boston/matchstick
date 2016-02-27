'use strict';

const coveralls = require('gulp-coveralls'),
    david       = require('gulp-david'),
    eslint      = require('gulp-eslint'),
    gulp        = require('gulp'),
    istanbul    = require('gulp-istanbul'),
    mocha       = require('gulp-mocha'),
    rules       = require('edj-eslint-rules');


// Instrument the code
gulp.task('cover', () => {
    return gulp.src('lib/*.js')
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});


// Run tests and product coverage
gulp.task('test', [ 'cover' ], () => {
    return gulp.src('test/*.js')
        .pipe(mocha({
            require : [ 'should' ]
        }))
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({
            thresholds : {
                global : 100
            }
        }));
});


// Run tests and product coverage
gulp.task('coveralls', [ 'test' ], () => {
    return gulp.src('coverage/lcov.info')
        .pipe(coveralls());
});


// Lint as JS files (including this one)
gulp.task('lint', [ 'test' ], () => {
    return gulp.src([
        'lib/*.js',
        'test/*.js',
        'gulpfile.js',
        '!node_modules/**'
    ])
    .pipe(eslint({
        extends : 'eslint:recommended',
        env     : { node : true, es6 : true, mocha : true },
        rules
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


// Check deps with David service
gulp.task('deps', () => {
    return gulp.src('package.json')
        .pipe(david());
});


// Task for local development
gulp.task('default', [ 'deps', 'lint' ], () => {
    return gulp.watch([
        'lib/*',
        'test/*'
    ], [ 'lint' ]);
});
