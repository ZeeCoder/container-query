# CSS Modules

To make this library work with CSS Modules, we need to rewrite the class names in
our meta object based on the styles object we get from CSS Modules on import.

## Parcel

With parcel, the setup is quite simple, as it supports PostCSS configuration
files.

The following shows a usual PostCSS setup, with container queries and CSS modules:

```sh
yarn add postcss-nested \
         postcss-media-minmax \
         @zeecoder/postcss-container-query \
         postcss-modules --dev

# or with NPM:

npm install postcss-nested \
            postcss-media-minmax \
            @zeecoder/postcss-container-query \
            postcss-modules --save-dev
```

Then put the following `.postcssrc` file in your root directory:

```json
{
  "modules": true,
  "plugins": {
    "postcss-nested": { "bubble": ["container"] },
    "postcss-media-minmax": {},
    "@zeecoder/postcss-container-query": {},
    "postcss-modules": {}
  }
}
```

Now you can do the following:

```js
import React, { Component } from "react";
import styles, { meta as rawMeta } from "./App.css";
import { ContainerQuery } from "@zeecoder/react-container-query";
import { remapMetaSelectors } from "@zeecoder/container-query-meta-builder";

// Since the container query postcss plugin comes before css-modules - and which
// order we cannot change for technical reasons -, we need to remap class names
// to the hashed class names CSS modules generates in the styles object.
const meta = remapMetaSelectors(rawMeta, styles);

class App extends Component {
  render() {
    return (
      <ContainerQuery className={styles.App} meta={meta}>
        My app.
      </ContainerQuery>
    );
  }
}

export default App;
```

This would work the same way without react React, or without any component
library for that matter.

## With webpack

Usage is the same with webpack, just add something like the following to your config:

```js
{
    // ...
    test: /\.css$/,
    use: [
      "style-loader",
      {
        loader: "css-loader",
        options: {
          modules: true
        }
      },
      {
        loader: "postcss-loader",
        options: {
          plugins: [
            require("postcss-nested")({ bubble: ["container"] }),
            require("postcss-media-minmax")(),
            require("autoprefixer")(),
            require("../packages/postcss-container-query/dist")()
          ]
        }
      }
    ]
    // ...
}
```

You can of course have the PostCSS setup in a config file for webpack as well.
