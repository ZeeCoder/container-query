import sharedConfig from "./rollup.shared";

sharedConfig.output = [
  {
    // Muting the warning about CJS default export being added to the ".default"
    // prop. It's fine.
    exports: "named",
    file: __dirname + "/../dist/bundle.cjs.js",
    format: "cjs"
  }
];

export default sharedConfig;
