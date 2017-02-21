'use strict';

const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const nested = require('postcss-nested');
const containerQuery = require('../containerQuery');
const writeFileSync = require('fs').writeFileSync;
const camelCase = require('lodash.camelCase');

gulp.task('css', function () {
    const postcss = require('gulp-postcss');

    return gulp.src('containers.css')
        .pipe(postcss([
            nested(),
            containerQuery({
                getJSON: (cssPath, containers) => {
                    for (let containerSelector in containers) {
                        writeFileSync(
                            `${__dirname}/containers/${ camelCase(containerSelector) }.json`,
                            JSON.stringify(containers[containerSelector])
                        );
                    }
                }
            }),
        ]))
        .pipe( gulp.dest('dist') );
});

gulp.task('watch', function() {
    gulp.watch('*.css', ['css']);
});
