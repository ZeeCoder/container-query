# Usage with Gulp

If you're not a fan of processing styles with webpack, then you can use a task
runner instead, like Gulp.

Your task could look something like this:

```js
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const containerQuery = require('@zeecoder/container-query/containerQuery');

gulp.task('styles', () => {
    return gulp.src('styles/main.pcss')
        .pipe(postcss([
            postcssImport(),
            postcssNested({ bubble: ['container'] }),
            containerQuery(),
        ]))
        .pipe(rename('main.css'))
        .pipe(gulp.dest('web/dist'));
});

```

Now you'll have both main.css and main.json. The CSS can then be served separately
from the JS, while webpack could still `require()` the JSON and do its thing. 
