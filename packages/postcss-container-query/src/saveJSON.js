import { readFile, writeFile } from "fs";

const saveJSON = (cssFile, json) =>
  new Promise(resolve => {
    const jsonData = JSON.stringify(json);
    const jsonFilePath = `${cssFile}.json`;

    const writeJson = () =>
      writeFile(jsonFilePath, jsonData, e => {
        if (e) {
          console.error(`Failed to save container query json file: ${e}`);
        }

        resolve();
      });

    readFile(jsonFilePath, "utf8", (e, contents) => {
      // Write file if it doesn't exist yet, or if the contents changed
      if (e || contents !== jsonData) {
        writeJson();
      } else {
        resolve();
      }
    });
  });

export default saveJSON;
