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

### `<ContainerQuery>`

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
        The App's size is: {size.width}x{size.height}
      </div>
    )}
  </ContainerQuery>
);

export default App;
```

### `withContainerQuery`

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

---

◀️️ [Parcel](parcel.md)

◀️️ [webpack](webpack.md)

◀️️ [Gulp](gulp.md)

▶️ [CSS Modules](css-modules.md)

▶️ [Without React](without-react.md)
