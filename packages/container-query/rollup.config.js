import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import flow from "rollup-plugin-flow";
import uglify from "rollup-plugin-uglify";
import babel from "rollup-plugin-babel";

export default {
    entry: "src/Container.js",
    targets: [
        { dest: "dist/bundle.cjs.js", format: "cjs" },
        // { dest: "dist/bundle.es.js", format: "es" },
        {
            dest: "dist/bundle.umd.js",
            format: "umd",
            moduleName: "ContainerQuery"
        }
    ],
    plugins: [
        flow(),
        commonjs(),
        nodeResolve(),
        babel({
            exclude: "node_modules/**",
            babelrc: false,
            runtimeHelpers: true,
            presets: [["es2015", { modules: false }]],
            plugins: []
        }),
        uglify()
    ]
};
