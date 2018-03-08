# PostCSS

To be able to use the syntax I've been using so far, you have to set up postcss.

This guide is specific to webpack, and the postcss-loader, but it is just as easy
to set up with Gulp or any other builder.

## Installation

```
yarn add --dev \
    postcss-loader \
    postcss-simple-vars \
    postcss-nested \
    postcss-media-minmax \
    @zeecoder/postcss-container-query
# or
npm install --save-dev \
    postcss-loader \
    postcss-simple-vars \
    postcss-nested \
    postcss-media-minmax \
    @zeecoder/postcss-container-query
```

## PostCSS config file

Save this as `postcss.config.js`.

```js
module.exports = () => {
  const plugins = [
    require("postcss-simple-vars")(),
    require("postcss-nested")({ bubble: ["container"] }),
    require("postcss-media-minmax")(),
    require("@zeecoder/postcss-container-query")()
  ];

  return { plugins };
};
```

## webpack setup

Add the following to your webpack config:

```js
{
  module: {
      rules: [
          {
              test: /\.pcss$/,
              use: ['style-loader', 'css-loader', 'postcss-loader'],
          },
      ],
  }
}
```

## PS

You might want to add `autoprefixer` too.
