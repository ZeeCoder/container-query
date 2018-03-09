import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";

export default {
  input: __dirname + "/../src/index.js",
  plugins: [babel(), uglify()],
  external: [
    "react",
    "react-dom",
    "@zeecoder/container-query",
    "prop-types",
    "es6-weak-map",
    "resize-observer-polyfill"
  ]
};
