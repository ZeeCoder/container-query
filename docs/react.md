# React

Once you've set up your favourite bundler with PostCSS, you're ready to start
using the runtime.

Here I'll showcase some of the ways this can be done in React.

## Installation

```
yarn add @zeecoder/react-container-query --dev
# or
npm install @zeecoder/react-container-query --save-dev
```

## Usage

You might have the following CSS:

```pcss
.App {
  /* ... */

  &__child {
    /* ... */

    @container (width > 100px) {
      /*
      Change some styles on the image element when the container is
      wider than 100px
      */
    }
  }

  @container (aspect-ratio > 3) {
    /* Change styles on the avatar itself, when the aspect-ratio is greater than 3 */
  }

  @container (width > 100px) and (height > 100px) {
    /* ... */
  }
}
```

### useContainerQuery hook

This is probably the easiest way to use Container Queries up in React.

Note that to use [React hooks](https://reactjs.org/docs/hooks-intro.html), you'll
need React 16.8.0 or higher.

```js
import React from "react";
import useContainerQuery from "@zeecoder/use-container-query";
import { meta } from "./App.pcss";

const App = () => {
  const ref = useContainerQuery(meta);

  return (
    <div className="App" ref={ref}>
      My App
    </div>
  );
};

export default App;
```

To get the component's size, you can do the following:

```js
import React, { useState } from "react";
import useContainerQuery from "@zeecoder/use-container-query";
import { meta } from "./App.pcss";

const App = () => {
  const [size, handleResize] = useState({ width: 1, height: 1 });
  const ref = useContainerQuery(meta, { handleResize });

  return (
    <div className="App" ref={ref}>
      My App {size.width}x{size.height}
    </div>
  );
};

export default App;
```

### \<ContainerQuery\> with (children) Render Prop

Using render props.

```js
import React from "react";
import { ContainerQuery } from "@zeecoder/react-container-query";
import { meta } from "./App.pcss";

// This component creates a `div` element by default. All props added to
// <ContainerQuery> will be forwarded to this div. If you need a different tag,
// then you can use the "as" prop, for example: `as="h1"`.
const App = () => (
  <ContainerQuery meta={meta} className="App">
    My App
    <div className="App__child">Child</div>
  </ContainerQuery>
);

export default App;
```

You might be interested in your component's size:

```js
import React from "react";
import { ContainerQuery } from "@zeecoder/react-container-query";
import { meta } from "./App.pcss";

const App = () => (
  <ContainerQuery meta={meta} className="App">
    {size => (
      <div className="App__child">
        Size: {size.width}x{size.height}
      </div>
    )}
  </ContainerQuery>
);

export default App;
```

### withContainerQuery Higher-Order Component

If you prefer Higher-Order Components:

```js
import { withContainerQuery } from "@zeecoder/react-container-query";
import { meta } from "./App.pcss";

const App = () => (
  <div className="App">
    My App
    <div className="App__child">Child</div>
  </div>
);

export default withContainerQuery(App, meta);
```

### Browser Support

As outlined in the [React docs](https://reactjs.org/docs/javascript-environment-requirements.html)
in order to properly support <=IE11, you'll probably want to include the appropriate
polyfills.

---

◀️️ [Parcel](parcel.md)

◀️️ [webpack](webpack.md)

◀️️ [Gulp](gulp.md)

▶️ [CSS Modules](css-modules.md)

▶️ [Without React](without-react.md)
