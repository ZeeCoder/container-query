# Usage with webpack and React

For examples on the `<ResizeObserver>` and `<ContainerQuery>` components, check
out the package's [readme](https://github.com/ZeeCoder/container-query/tree/master/packages/react-container-query).

I recommend you to set up [postcss-loader](https://github.com/postcss/postcss-loader)
with [postcss-nested](https://github.com/postcss/postcss-nested) with
`bubble: ['container']` option, or to use SASS.

**Example postcss.config.json**

```js
module.exports = context => {
  const plugins = [
    simpleVars(),
    nested({ bubble: ["container"] }),
    autoprefixer(),
    mediaMinmax(),
    containerQuery()
  ];

  return { plugins };
};
```

**Avatar.pcss**

```pcss
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

**With @zeecoder/react-container-query**

```js
import React, { Component } from "react";
import { withContainerQuery } from "@zeecoder/react-container-query";
import "./Avatar.pcss";
import stats from "./Avatar.pcss.json"; // generated automatically

const Avatar = () => (
  <div className="Avatar">
    <img className="Avatar__image" />
  </div>
);

export default withContainerQuery(Avatar, stats);
```

**without the higher-order component**

```js
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Container from "@zeecoder/container-query";
import "./Avatar.pcss";
import stats from "./Avatar.pcss.json"; // generated automatically

export default class Avatar extends Component {
  componentDidMount() {
    new Container(ReactDOM.findDOMNode(this), stats);
  }

  render() {
    return (
      <div className="Avatar">
        <img className="Avatar__image" />
      </div>
    );
  }
}
```

**That's it!**

Now all new _Avatar_ components will automatically adjust to the size of the
component individually.

As you can see from the example, you can affect descendants' styles too, based
on the same size changes.

**Next:** [Usage with Gulp](gulp.md)
