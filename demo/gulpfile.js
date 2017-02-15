const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const nested = require('postcss-nested');
const containerQuery = require('../lib/postcss/containerQuery');

gulp.task('css', function () {
    const postcss = require('gulp-postcss');

    return gulp.src('*.css')
        .pipe(postcss([
            nested(),
            containerQuery({
                getJSON: (json) => {
                    fs.writeFileSync(
                        path.join(__dirname, '/containers.json'),
                        JSON.stringify(json, null, 2)
                    );
                }
            }),
        ]))
        .pipe( gulp.dest('dist') );
});

gulp.task('watch', function() {
    gulp.watch('*.css', ['css']);
});
