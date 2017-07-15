import commonjs from "rollup-plugin-commonjs";
import flow from "rollup-plugin-flow";
import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";

export default {
    entry: "src/Container.js",
    targets: [{ dest: "dist/bundle.cjs.js", format: "cjs" }],
    plugins: [
        flow(),
        commonjs(),
        babel({
            // For some reason if I add this to .babelrc, it doesn't
            // include the babel helpers in the bundle.
            plugins: ["external-helpers"]
        }),
        uglify()
    ],
    external: [
        "es6-weak-map",
        "object-assign",
        "lodash.union",
        "lodash.difference",
        "raf",
        "mutation-observer",
        "resize-observer-polyfill"
    ]
};
