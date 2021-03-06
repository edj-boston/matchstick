'use strict';

const depcheck = require('depcheck'),
    g          = require('gulp-load-plugins')(),
    gulp       = require('gulp'),
    rules      = require('@edjboston/eslint-rules');


// Instrument the code
gulp.task('cover', () => {
    return gulp.src('lib/*.js')
        .pipe(g.istanbul())
        .pipe(g.istanbul.hookRequire());
});


// Run tests and product coverage
gulp.task('test', () => {
    return gulp.src('test/*.js')
        .pipe(g.mocha({
            require : [ 'should' ]
        }))
        .pipe(g.istanbul.writeReports())
        .pipe(g.istanbul.enforceThresholds({
            thresholds : {
                global : 100
            }
        }));
});


// Run tests and product coverage
gulp.task('coveralls', () => {
    return gulp.src('coverage/lcov.info')
        .pipe(g.coveralls());
});


// Lint as JS files (including this one)
gulp.task('lint', () => {
    const globs = [
        'lib/*.js',
        'test/*.js',
        'gulpfile.js',
        '!node_modules/**'
    ];

    return gulp.src(globs)
        .pipe(g.eslint({
            extends       : 'eslint:recommended',
            parserOptions : { 'ecmaVersion' : 6 },
            rules
        }))
        .pipe(g.eslint.format())
        .pipe(g.eslint.failAfterError());
});


// Check deps with David service
gulp.task('david', () => {
    return gulp.src('package.json')
        .pipe(g.david());
});

// Check for unused deps
gulp.task('depcheck', g.depcheck({
    specials : [
        depcheck.special['gulp-load-plugins']
    ]
}));

// Build macro
gulp.task('build', done => {
    g.sequence('cover', 'test', 'lint')(done);
});

// Macro for travis
gulp.task('travis', done => {
    g.sequence('build', 'coveralls')(done);
});


// Task for local development
gulp.task('default', [ 'david', 'depcheck', 'build' ], () => {
    return gulp.watch([
        'lib/*',
        'test/*'
    ], [ 'build' ]);
});
