# react-container-query

This module is part of a [monorepo](https://github.com/ZeeCoder/container-query).

Detailed documentation can be found there.

## Install

```
yarn add @zeecoder/react-container-query
# or
npm install --save @zeecoder/react-container-query
```

### Set up PostCSS with webpack

[Here](https://github.com/ZeeCoder/container-query/blob/master/docs/postcss.md)
is a documentation on how to do just that, in order to get the same syntax I've
been using.

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

### `<ContainerQuery>`

A render-prop approach.

```js
import { ContainerQuery } from "@zeecoder/react-container-query";
import { meta } from "./App.pcss";

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
import { meta } from "./App.pcss";

const App = () => (
  <ContainerQuery meta={meta}>
    {size => (
      <div className="App">
        My size is: {size.width}x{size.height}
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

const App = () => <div className="App">My App</div>;

export default withContainerQuery(App, meta);
```

## License

MIT
