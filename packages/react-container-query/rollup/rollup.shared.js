import fs from "fs";
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
  input: __dirname + "/../src/index.js",
  plugins: [babel(babelrc)],
  external: ["react", "react-dom", "@zeecoder/container-query"]
};
