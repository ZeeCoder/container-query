# Parcel

Probably the easiest way to start experimenting with the library, is with [Parcel](https://parceljs.org).

If you're only interested in how to set things up with webpack, then feel free to
[skip ahead](webpack.md).

## Installation

```sh
yarn add postcss-nested \
         postcss-media-minmax \
         @zeecoder/postcss-container-query --dev
# or
npm install postcss-nested \
            postcss-media-minmax \
            @zeecoder/postcss-container-query --save-dev
```

## Setting up PostCSS

Add the following to a file named `.postcssrc` in your root directory.

```json
{
  "plugins": {
    "postcss-nested": { "bubble": ["container"] },
    "postcss-media-minmax": {},
    "@zeecoder/postcss-container-query": {}
  }
}
```

**And you're done!** 🎉

---

◀️️ [Getting Started](getting-started.md)

▶️ [webpack](webpack.md)

▶️ [Gulp](gulp.md)

▶️ [React](react.md)
