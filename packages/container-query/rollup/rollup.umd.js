import resolve from "rollup-plugin-node-resolve";
import sharedConfig from "./rollup.shared";
import commonjs from "rollup-plugin-commonjs";

sharedConfig.output = [
  {
    file: __dirname + "/../dist/bundle.umd.js",
    format: "iife",
    name: "Container"
  }
];

// flow plugin has to be the first one
sharedConfig.plugins.splice(1, 0, commonjs());
sharedConfig.plugins.splice(1, 0, resolve());

delete sharedConfig.external;

export default sharedConfig;
