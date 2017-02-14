const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const nested = require('postcss-nested');
const containerQuery = require('./src/postcss');

gulp.task('css', function () {
    const postcss = require('gulp-postcss');

    return gulp.src('demo/*.css')
        .pipe(postcss([
            nested(),
            containerQuery({
                getJSON: (json) => {
                    fs.writeFileSync(
                        path.join(__dirname, '/demo/containers.json'),
                        JSON.stringify(json, null, 2)
                    );
                }
            }),
        ]))
        .pipe( gulp.dest('demo/dist') );
});

gulp.task('watch', function() {
    gulp.watch('demo/*.css', ['css']);
});
