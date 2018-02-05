# react-container-query

This module is part of a [monorepo](https://github.com/ZeeCoder/container-query).

Detailed documentation can be found there.

## Install

```
npm install --save @zeecoder/react-container-query
```

or

```
yarn add @zeecoder/react-container-query
```

## Usage

### `<ResizeObserver>`

This component simply observes a root element's size changes.

Useful to allow for rendering parts of the component conditionally, based
on its size.

(Uses a [polyfill](https://github.com/que-etc/resize-observer-polyfill), if a native implementation is not available.)

```js
import { ResizeObserver } from "@zeecoder/react-container-query";

const App = () => (
  <ResizeObserver
    render={size => (
      // size can be "null" when size is still not available
      <div>My size is: {size ? `${size.width}x${size.height}` : "?"}</div>
    )}
  />
);

export default App;
```

### `<ContainerQuery>`

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

And assuming that `stats` is the object obtained by running the above CSS
through the [postcss plugin](https://github.com/ZeeCoder/container-query/tree/master/packages/postcss-container-query).

```js
import { ContainerQuery } from "@zeecoder/react-container-query";
// Assuming postcss-loader to be set up
import "./App.pcss";
import stats from "./App.pcss.json";

const App = () => (
  <ContainerQuery
    stats={stats}
    render={size => (
      <div className="App">
        My size is: {size ? `${size.width}x${size.height}` : "?"}
      </div>
    )}
  />
);

export default App;
```

### `withContainerQueryCSS`

Similar to the one above, just using the Higher-Order Component pattern.

Note that size is not available to it however, and simply used to manage the
container query.

```js
import { withContainerQueryCSS } from "@zeecoder/react-container-query";
// Assuming postcss-loader to be set up
import "./App.pcss";
import stats from "./App.pcss.json";

const App = () => <div className="App">Styled app</div>;

export default withContainerQueryCSS(App, stats);
```

## License

MIT
