'use strict';

const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const nested = require('postcss-nested');
const postcssImport = require('postcss-import');
const containerQuery = require('../containerQuery');
const writeFileSync = require('fs').writeFileSync;

gulp.task('css', function () {
    return gulp.src('src/css/main.pcss')
        .pipe(postcss([
            nested(),
            postcssImport(),
            containerQuery({
                getJSON: (cssPath, containers) => {
                    for (let containerSelector in containers) {
                        let component = containerSelector.substr(1);
                        writeFileSync(
                            `${__dirname}/src/css/components/${component}/${component}.json`,
                            JSON.stringify(containers[containerSelector])
                        );
                    }
                }
            }),
        ]))
        .pipe( rename('main.css') )
        .pipe( gulp.dest('web/dist') );
});

gulp.task('watch', function() {
    gulp.watch('*.css', ['css']);
});
