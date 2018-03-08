# Usage with webpack and React

I recommend using the [react-container-query](https://github.com/ZeeCoder/container-query/tree/master/packages/react-container-query)
package, which provides easy to use helpers, like:
`withContainerQuery()`, `<ContainerQuery>` and `<ResizeObserver>`.

You can find detailed documentation on them in the package's [readme](https://github.com/ZeeCoder/container-query/tree/master/packages/react-container-query).

## Manual Usage

If you want to do things yourself, feel free to read on!

### Set up PostCSS with webpack

[Here](./postcss.md) is a documentiation on how to do just that, in order to get
the same syntax I've been using.

### Installation

You'll need the runtime:

```
yarn add @zeecoder/container-query
# or
npm install --save-dev @zeecoder/container-query
```

### Example CSS

```pcss
/* Avatar.pcss */
.Avatar {
  /* ... */

  &__image {
    /* ... */

    @container (width > 100px) {
      /*
      Change some styles on the image element when the container is
      wider than 100px
      */
    }
  }

  @container (aspect-ratio > 3) {
    /* Change styles on the avatar itself, when the aspect-ratio is grater than 3 */
  }

  @container (width > 100px) and (height > 100px) {
    /* ... */
  }
}
```

### Component setup

```js
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Container from "@zeecoder/container-query";
import "./Avatar.pcss";
import meta from "./Avatar.pcss.json"; // generated automatically

export default class Avatar extends Component {
  componentDidMount() {
    new Container(ReactDOM.findDOMNode(this), meta);
  }

  render() {
    return (
      <div className="Avatar">
        <img className="Avatar__image" src="..." />
      </div>
    );
  }
}
```

**That's it!**

Now all new _Avatar_ components will change their styling according to their own
size.

**Next:** [Usage with Gulp](gulp.md)
