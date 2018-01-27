import flow from "rollup-plugin-flow";
import babel from "rollup-plugin-babel";
import babili from "rollup-plugin-babili";
import fs from "fs";

export default {
  input: "src/containerQuery.js",
  output: [{ file: "dist/bundle.cjs.js", format: "cjs" }],
  plugins: [flow(), babel(), babili()],
  external: ["postcss", "lodash/trim", "fs"]
};
