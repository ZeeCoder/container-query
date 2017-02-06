const gulp = require('gulp');
const path = require('path');
const nested = require('postcss-nested');
const containerQuery = require('./src/postcss');

gulp.task('css', function () {
    var postcss    = require('gulp-postcss');

    return gulp.src('demo/styles.css')
        .pipe(postcss([
            nested(),
            containerQuery({
                JSONSavePath: path.join(__dirname, '/demo/containers.json'),
            }),
        ]))
        .pipe( gulp.dest('demo/dist') );
});

gulp.task('watch', function() {
    gulp.watch('demo/styles.css', ['css']);
});
