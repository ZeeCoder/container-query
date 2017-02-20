const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const nested = require('postcss-nested');
const containerQuery = require('../containerQuery');

gulp.task('css', function () {
    const postcss = require('gulp-postcss');

    return gulp.src('containers.css')
        .pipe(postcss([
            nested(),
            containerQuery(),
        ]))
        .pipe( gulp.dest('dist') );
});

gulp.task('watch', function() {
    gulp.watch('*.css', ['css']);
});
