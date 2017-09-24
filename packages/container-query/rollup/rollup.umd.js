import resolve from "rollup-plugin-node-resolve";
import uglify from "rollup-plugin-uglify";
import sharedConfig from "./rollup.shared";
import commonjs from "rollup-plugin-commonjs";

sharedConfig.output = [
  {
    file: __dirname + "/../dist/bundle.umd.js",
    format: "iife",
    name: "Container"
  }
];

sharedConfig.plugins.unshift(commonjs());
sharedConfig.plugins.unshift(resolve());
sharedConfig.plugins.push(uglify());

delete sharedConfig.external;

export default sharedConfig;
