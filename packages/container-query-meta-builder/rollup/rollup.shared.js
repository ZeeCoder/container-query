import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

export default {
  input: __dirname + "/../src/index.js",
  plugins: [babel(), terser()],
  external: ["object-assign"]
};
