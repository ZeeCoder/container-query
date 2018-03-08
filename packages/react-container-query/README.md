# react-container-query

This module is part of a [monorepo](https://github.com/ZeeCoder/container-query).

Detailed documentation can be found there.

## Install

```
yarn add @zeecoder/react-container-query
# or
npm install --save @zeecoder/react-container-query
```

## Usage

Assuming the following CSS:

```pcss
.App {
  background: red;
  font-size: 20px;
  color: white;
  padding: 10px;
  border: none;

  @container (width > 900px) {
    background: green;
  }
}
```

And assuming that `meta` is the object obtained by running the above CSS
through the [postcss plugin](https://github.com/ZeeCoder/container-query/tree/master/packages/postcss-container-query).

The one thing you need to keep in mind is that the container css class
(".App" in this case) has to be present on the root element.

(A limitation [soon to be addressed](https://github.com/ZeeCoder/container-query/issues/89).)

### `withContainerQuery`

This is probably the easiest way of enabling container queries.

```js
import { withContainerQuery } from "@zeecoder/react-container-query";
// Assuming postcss-loader to be set up
import "./App.pcss";
import meta from "./App.pcss.json";

const App = () => <div className="App">My App</div>;

export default withContainerQuery(App, meta);
```

### `<ContainerQuery>`

A render-prop approach.

```js
import { ContainerQuery } from "@zeecoder/react-container-query";
// Assuming postcss-loader to be set up
import "./App.pcss";
import meta from "./App.pcss.json";

const App = () => (
  <ContainerQuery meta={meta}>
    <div className="App">My App</div>
  </ContainerQuery>
);

export default App;
```

If you're also interested in the component's size:

```js
import { ContainerQuery } from "@zeecoder/react-container-query";
// Assuming postcss-loader to be set up
import "./App.pcss";
import meta from "./App.pcss.json";

const App = () => (
  <ContainerQuery meta={meta}>
    {size => (
      // size can be "null" when size is still not available
      <div className="App">
        My size is: {size ? `${size.width}x${size.height}` : "?"}
      </div>
    )}
  </ContainerQuery>
);

export default App;
```

### `<ResizeObserver>`

This component simply observes an element's size changes using `ResizeObserver`.

Useful to allow for rendering parts of the component conditionally, based
on its size.

(It uses a [polyfill](https://github.com/que-etc/resize-observer-polyfill), if a native implementation is not available.)

```js
import { ResizeObserver } from "@zeecoder/react-container-query";

const App = () => (
  <ResizeObserver>
    {size => (
      // size can be "null" when size is still not available
      <div>My size is: {size ? `${size.width}x${size.height}` : "?"}</div>
    )}
  </ResizeObserver>
);

export default App;
```

## License

MIT
