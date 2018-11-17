import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

export default {
  input: __dirname + "/../src/index.js",
  plugins: [babel(), terser()],
  external: [
    "react",
    "react-dom",
    "@zeecoder/container-query",
    "prop-types",
    "es6-weak-map",
    "resize-observer-polyfill"
  ]
};
