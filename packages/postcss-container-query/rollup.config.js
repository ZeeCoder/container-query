import flow from "rollup-plugin-flow";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

const generate = ({ input, output }) => ({
  input,
  output: [{ file: output, format: "cjs" }],
  plugins: [flow(), babel(), terser()],
  external: ["postcss", "lodash/trim", "@zeecoder/container-query-meta-builder"]
});

export default [
  generate({
    input: "src/containerQuery.js",
    output: "dist/index.js"
  }),
  generate({
    input: "src/getMetadataFromMessages.js",
    output: "./getMetadataFromMessages.js"
  })
];
