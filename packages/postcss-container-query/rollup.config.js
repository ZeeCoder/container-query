import flow from "rollup-plugin-flow";
import babel from "rollup-plugin-babel";
import babili from "rollup-plugin-babili";
import fs from "fs";

const babelrc = JSON.parse(fs.readFileSync("./.babelrc").toString());

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
  entry: "src/containerQuery.js",
  targets: [{ dest: "dist/bundle.cjs.js", format: "cjs" }],
  plugins: [flow(), babel(babelrc), babili()],
  external: ["postcss", "lodash/trim", "lodash/camelCase", "fs"]
};
