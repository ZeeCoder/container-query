let gulp = require('gulp');
let containerQuery = require('./src/postcss');

gulp.task('css', function () {
    var postcss    = require('gulp-postcss');

    return gulp.src('demo/styles.css')
        .pipe(postcss([
            containerQuery()
        ]))
        .pipe( gulp.dest('demo/dist') );
});

gulp.task('watch', function() {
    gulp.watch('demo/styles.css', ['css']);
});
