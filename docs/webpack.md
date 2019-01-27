# webpack

## Installation

```sh
yarn add postcss-loader \
         postcss-nested \
         postcss-media-minmax \
         @zeecoder/postcss-container-query --dev
# or
npm install postcss-loader \
            postcss-nested \
            postcss-media-minmax \
            @zeecoder/postcss-container-query --save-dev
```

## Setup PostCSS

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

## Change the Config

Note that this setup assumes that you'll be importing pcss files.

```js
{
  ...
  module: {
      rules: [
          {
              test: /\.pcss$/,
              use: ['style-loader', 'css-loader', 'postcss-loader'],
          },
      ],
  },
  ...
}
```

**And you're done!** 🎉

---

◀️️ [Parcel](parcel.md)

▶️ [Gulp](gulp.md)

▶️ [React](react.md)
