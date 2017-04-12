'use strict';

var gulp = require('gulp');
let shell = require('gulp-shell');
let connect = require('gulp-connect');

// gulp.task('server', function () {
//     return gulp.src('/server/*.js').pipe(shell('node app.js'))
// })

gulp.task('launch', function () {
    return gulp.src('package.json').pipe(shell('npm start'))
});

// gulp.task('watch', function () {
//
//     gulp.watch(['app/scripts/app/*.js',
//         'app/scripts/app/**/*.js',
//         'app/scripts/languages/*.js',
//         'app/views/*.html',
//         'app/views/**/*.html',
//         'app/views/*.html']).on('change', function (file) {
//         gulp.src( file.path) .pipe(connect.reload());
//         gulp.start('default');
//     });
// });


gulp.task('default', ['launch']);