import sharedConfig from "./rollup.shared";

sharedConfig.output = [
  {
    file: __dirname + "/../dist/bundle.cjs.js",
    format: "cjs"
  }
];

export default sharedConfig;
