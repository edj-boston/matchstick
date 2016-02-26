var coveralls = require('gulp-coveralls'),
    david     = require('gulp-david'),
    eslint    = require('gulp-eslint'),
    gulp      = require('gulp'),
    istanbul  = require('gulp-istanbul'),
    mocha     = require('gulp-mocha');


// Instrument the code
gulp.task('cover', function () {
    return gulp.src('lib/*.js')
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});


// Run tests and product coverage
gulp.task('test', ['cover'], function () {
    return gulp.src('test/*.js')
        .pipe(mocha({
            require : ['should']
        }))
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({
            thresholds: { global: 100 }
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


// Check deps with David service
gulp.task('deps', function() {
    return gulp.src('package.json')
        .pipe(david());
});


// Task for local development
gulp.task('default', ['deps', 'lint'], function() {
    return gulp.watch([
        'lib/*',
        'test/*'
    ], ['lint']);
});
