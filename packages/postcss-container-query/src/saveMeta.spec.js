import saveMeta from "./saveMeta";
import fs from "fs";

jest.mock("fs");

test("should write contents when file does not exist", () => {
  const cssFilePath = __dirname + "/tmp/saveMeta.test.css";
  const jsonFilePath = `${cssFilePath}.json`;
  const json = { some: "JSON" };

  fs.readFile = jest.fn((filepath, type, cb) => cb(new Error("error")));
  fs.writeFile = jest.fn((filepath, content, cb) => cb());

  expect.hasAssertions();

  return Promise.resolve()
    .then(() => saveMeta(cssFilePath, json))
    .then(() => {
      expect(fs.readFile).toHaveBeenCalledTimes(1);
      expect(fs.writeFile).toHaveBeenCalledTimes(1);
      expect(fs.writeFile.mock.calls[0][0]).toBe(jsonFilePath);
      expect(fs.writeFile.mock.calls[0][1]).toBe(JSON.stringify(json));
    });
});

test("should not write contents when file already with same contents", () => {
  const cssFilePath = __dirname + "/tmp/saveMeta.test.css";
  const jsonFilePath = `${cssFilePath}.json`;
  const json = { some: "JSON" };

  fs.readFile = jest.fn((filepath, type, cb) => cb(null, JSON.stringify(json)));
  fs.writeFile = jest.fn((filepath, content, cb) => cb());

  expect.hasAssertions();

  return Promise.resolve()
    .then(() => saveMeta(cssFilePath, json))
    .then(() => {
      expect(fs.readFile).toHaveBeenCalledTimes(1);
      expect(fs.writeFile).toHaveBeenCalledTimes(0);
    });
});

test("should log error in case there's an issue writing the file", () => {
  const cssFilePath = __dirname + "/tmp/saveMeta.test.css";
  const jsonFilePath = `${cssFilePath}.json`;
  const json = { some: "JSON" };

  fs.readFile = jest.fn((filepath, type, cb) => cb(new Error("error")));
  fs.writeFile = jest.fn((filepath, content, cb) => cb(new Error("error")));
  console.error = jest.fn();

  expect.hasAssertions();

  return Promise.resolve()
    .then(() => saveMeta(cssFilePath, json))
    .then(() => {
      expect(fs.readFile).toHaveBeenCalledTimes(1);
      expect(fs.writeFile).toHaveBeenCalledTimes(1);
      expect(fs.writeFile.mock.calls[0][0]).toBe(jsonFilePath);
      expect(fs.writeFile.mock.calls[0][1]).toBe(JSON.stringify(json));
      expect(console.error).toHaveBeenCalled();
    });
});
