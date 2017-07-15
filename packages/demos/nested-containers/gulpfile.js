"use strict";

const gulp = require("gulp");
const fs = require("fs");
const path = require("path");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const nested = require("postcss-nested");
const autoprefixer = require("autoprefixer");
const postcssImport = require("postcss-import");
const postcssContainerQuery = require("@zeecoder/postcss-container-query");
const writeFileSync = require("fs").writeFileSync;

function containerSelectorToFilename(selector) {
  return selector.substr(1);
}

gulp.task("css", function() {
  return gulp
    .src("src/css/main.pcss")
    .pipe(
      postcss([
        postcssImport(),
        nested({
          bubble: ["container"]
        }),
        autoprefixer(),
        postcssContainerQuery({
          singleContainer: false,
          getJSON: (cssPath, containers) => {
            // Saving the container query stats individually
            for (let containerSelector in containers) {
              let component = containerSelectorToFilename(containerSelector);
              writeFileSync(
                `${__dirname}/src/css/components/${component}/${component}.json`,
                JSON.stringify(containers[containerSelector])
              );
            }

            // Then saving the container names
            writeFileSync(
              `${__dirname}/src/js/containers.json`,
              JSON.stringify(
                Object.keys(containers).map(containerSelectorToFilename)
              )
            );
          }
        })
      ])
    )
    .pipe(rename("main.css"))
    .pipe(gulp.dest("web/dist"));
});

gulp.task("watch", function() {
  gulp.watch("src/**/*.pcss", ["css"]);
});
