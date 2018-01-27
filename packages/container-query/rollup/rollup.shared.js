import flow from "rollup-plugin-flow";
import babel from "rollup-plugin-babel";

export default {
  input: __dirname + "/../src/Container.js",
  plugins: [flow(), babel()],
  external: [
    "es6-weak-map",
    "object-assign",
    "lodash/difference",
    "lodash/union",
    "raf",
    "mutation-observer",
    "resize-observer-polyfill"
  ]
};
