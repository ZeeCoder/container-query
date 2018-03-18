import { readFile, writeFile } from "fs";

export default function saveMeta(cssFile, meta) {
  return new Promise(resolve => {
    const stringMeta = JSON.stringify(meta);
    const jsonFilePath = `${cssFile}.json`;

    const writeJson = () =>
      writeFile(jsonFilePath, stringMeta, e => {
        if (e) {
          console.error(`Failed to save container query json file: ${e}`);
        }

        resolve();
      });

    readFile(jsonFilePath, "utf8", (e, contents) => {
      // Write file if it doesn't exist yet, or if the contents changed
      if (e || contents !== stringMeta) {
        writeJson();
      } else {
        resolve();
      }
    });
  });
}
