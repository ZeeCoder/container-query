import uglify from "rollup-plugin-uglify";
import sharedConfig from "./rollup.shared";

sharedConfig.output = [
  {
    file: __dirname + "/../dist/bundle.cjs.js",
    format: "cjs"
  }
];

sharedConfig.plugins.push(uglify());

export default sharedConfig;
