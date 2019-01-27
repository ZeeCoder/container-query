const postcss = require("postcss");
const fs = require("fs");
const containerQuery = require("../../../packages/postcss-container-query/lib");
const getMetadataFromMessages = require("../../../packages/postcss-container-query/lib/getMetadataFromMessages");
const nested = require("postcss-nested");
const mediaMinMax = require("postcss-media-minmax")();

const from = __dirname + "/styles.pcss";
const to = __dirname + "/styles.dist.pcss";
const metaPath = __dirname + "/styles.meta.json";

fs.readFile(from, (err, css) => {
  postcss([
    nested({ bubble: ["container"] }),
    mediaMinMax,
    containerQuery({
      singleContainer: false,
      exportMetaInCss: false
    })
  ])
    .process(css, { from, to })
    .then(result => {
      fs.writeFile(to, result.css, () => true);
      if (result.map) {
        fs.writeFile(to + ".map", result.map, () => true);
      }

      const meta = getMetadataFromMessages(result.messages);

      fs.writeFile(metaPath, JSON.stringify(meta), () => true);
    });
});
