import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";

export default {
  input: __dirname + "/../src/index.js",
  plugins: [babel(), uglify()],
  external: ["lodash/isEmpty", "lodash/trim", "lodash/isEqual", "object-assign"]
};
