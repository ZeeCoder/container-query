import babili from "rollup-plugin-babili";
import flow from "rollup-plugin-flow";

export default {
  entry: "src/containerQuery.js",
  targets: [{ dest: "dist/bundle.cjs.js", format: "cjs" }],
  plugins: [flow(), babili()],
  external: ["postcss", "lodash.trim", "lodash.camelcase", "fs"]
};
