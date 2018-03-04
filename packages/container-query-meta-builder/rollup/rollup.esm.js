import sharedConfig from "./rollup.shared";

sharedConfig.output = [
  {
    file: __dirname + "/../dist/bundle.esm.js",
    format: "es"
  }
];

export default sharedConfig;
