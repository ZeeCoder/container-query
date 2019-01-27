# Gulp

If you're not a fan of processing styles with a bundler, then you can use a task
runner instead (like Gulp), to process your CSS and generate your meta object(s).

**IMPORTANT NOTE**

This setup will only work once [this update](https://github.com/postcss/gulp-postcss/pull/150)
is released.

Until then, you could use the same idea outlined here with the [postcss](https://github.com/postcss/postcss)
package itself.

## Installation

```sh
yarn add gulp \
         gulp-postcss \
         postcss-nested \
         postcss-media-minmax \
         @zeecoder/postcss-container-query --dev
# or
npm install gulp \
            gulp-postcss \
            postcss-nested \
            postcss-media-minmax \
            @zeecoder/postcss-container-query --save-dev
```

## Configuration

Your gulpfile could look something like this:

```js
const gulp = require("gulp");
const postcss = require("gulp-postcss");
const postcssNested = require("postcss-nested");
const postcssMediaMinmax = require("postcss-media-minmax");
const containerQuery = require("@zeecoder/postcss-container-query");
const getMetadataFromMessages = require("@zeecoder/postcss-container-query/lib/getMetadataFromMessages");

gulp.task("styles", () =>
  gulp
    .src("styles.css")
    .pipe(
      postcss(
        [
          postcssNested({ bubble: ["container"] }),
          postcssMediaMinmax(),
          containerQuery({
            singleContainer: false
          })
        ],
        {}, // no need to pass in postcss options here
        {
          handleResult: ({ messages }) => {
            const meta = getMetadataFromMessages(messages);
            // Do something with meta, like save it as a JSON, and later import /
            // load it in some way when needed.
          }
        }
      )
    )
    .pipe(gulp.dest("dist"))
);
```

The above CSS can include multiple containers thanks to `singleContainer: false`,
using @define-container declarations, as it's explained in the [Multiple Containers](multiple-containers.md)
section.

---

◀️️ [Parcel](parcel.md)

◀️️ [webpack](webpack.md)

▶️ [Multiple Containers](multiple-containers.md)

▶️ [React](react.md)
