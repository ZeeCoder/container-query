import uglify from "rollup-plugin-uglify";
import { minify } from "uglify-es";
import sharedConfig from "./rollup.shared";

sharedConfig.targets = [
  {
    dest: __dirname + "/../dist/bundle.es.js",
    format: "es"
  }
];

// @see https://www.npmjs.com/package/rollup-plugin-uglify#warning
sharedConfig.plugins.push(uglify({}, minify));

export default sharedConfig;
