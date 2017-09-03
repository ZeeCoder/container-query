# Usage with Gulp

If you're not a fan of processing styles with webpack, then you can use a task
runner instead (like Gulp), to process your CSS and generate the JSON file(s).

Your gulpfile could look something like this:

```js
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const postcssNested = require('postcss-nested');
const containerQuery = require('@zeecoder/postcss-container-query');

gulp.task('styles', () => {
    return gulp.src('styles.pcss')
        .pipe(postcss([
            postcssNested({ bubble: ['container'] }),
            containerQuery({
              singleContainer: false
            }),
        ]))
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('dist'));
});
```

The above CSS can include multiple containers thanks to `singleContainer: false`,
and [@define-container](docs/define-container.md) declarations.

This task creates a styles.css and styles.json file, which can then be used by
webpack as [you've seen it before](webpack-and-react.md).

**Next:** [Multiple Containers](multiple-containers.md)
