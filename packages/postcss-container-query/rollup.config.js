export default {
    entry: "src/containerQuery.js",
    targets: [{ dest: "dist/bundle.cjs.js", format: "cjs" }],
    plugins: [],
    external: ["postcss", "lodash.trim", "lodash.camelcase", "fs"]
};
