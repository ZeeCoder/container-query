import babel from "rollup-plugin-babel";

export default {
  input: __dirname + "/../src/index.js",
  plugins: [babel()],
  external: [
    "react",
    "react-dom",
    "@zeecoder/container-query",
    "prop-types",
    "object-assign",
    "es6-weak-map",
    "resize-observer-polyfill"
  ]
};
