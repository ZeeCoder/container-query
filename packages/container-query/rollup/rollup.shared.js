import fs from "fs";
import flow from "rollup-plugin-flow";
import babel from "rollup-plugin-babel";

const babelrc = JSON.parse(
  fs.readFileSync(__dirname + "/../.babelrc").toString()
);

// To make jest work, we have a "base" babelrc config in the directory, which
// however needs some tweaks to make rollup happy too.
babelrc.babelrc = false;
babelrc.plugins.push("external-helpers");
babelrc.presets.forEach(preset => {
  if (!Array.isArray(preset) || preset[0] !== "env") {
    return;
  }

  preset[1].modules = false;
});

export default {
  entry: __dirname + "/../src/Container.js",
  plugins: [flow(), babel(babelrc)],
  external: [
    "es6-weak-map",
    "object-assign",
    "lodash/difference",
    "lodash/union",
    "raf",
    "mutation-observer",
    "resize-observer-polyfill"
  ]
};
