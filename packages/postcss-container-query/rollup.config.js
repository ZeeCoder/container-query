import flow from "rollup-plugin-flow";
import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";
import fs from "fs";

const generate = ({ input, output }) => ({
  input,
  output: [{ file: output, format: "cjs" }],
  plugins: [flow(), babel(), uglify()],
  external: [
    "postcss",
    "lodash/trim",
    "fs",
    "@zeecoder/container-query-meta-builder"
  ]
});

export default [
  generate({
    input: "src/containerQuery.js",
    output: "dist/index.js"
  }),
  generate({
    input: "src/saveMeta.js",
    output: "./saveMeta.js"
  }),
  generate({
    input: "src/getMetadataFromMessages.js",
    output: "./getMetadataFromMessages.js"
  })
];
