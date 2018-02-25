import flow from "rollup-plugin-flow";
import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";

export default {
  input: __dirname + "/../src/Container.js",
  plugins: [flow(), babel(), uglify()],
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
