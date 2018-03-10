import postcss from "postcss";
import containerQuery, { getMetadataFromMessages } from "./containerQuery";
import Root from "../__mocks__/Root";
import * as regularTest from "./test/regular";
import * as customPropertiesTest from "./test/custom-properties";
import * as exessContainerDeclarationTest from "./test/exess-container-declaration";
import * as containerAutoDetectionTest from "./test/container-auto-detection";
import * as unrecognisedAtRulesTest from "./test/unrecognised-at-rules";
import * as missingContainerDelcarationTest from "./test/missing-container-declaration";
import * as missingDeclarationWithRUnitsTest from "./test/missing-declaration-with-r-units";
import * as selfTest from "./test/self";
import * as simpleTest from "./test/simple";

jest.mock("./saveMeta");

/**
 * @param {string} rawCSS Raw CSS containing container queries
 * @param {{}} [options] plugin options
 * @return {Promise<{
 *   css: string,
 *   meta: {},
 * }>}
 */
const processCss = async (rawCSS, options = {}) => {
  let getJsonMeta = null;
  options.getJSON = (path, meta) => (getJsonMeta = meta);

  const { css, messages } = await postcss([containerQuery(options)]).process(
    rawCSS,
    { from: "from.css", to: "to.css" }
  );

  const meta = getMetadataFromMessages(messages);

  // As long as the `getJSON` option is supported, this is important
  expect(getJsonMeta).toEqual(meta);

  return { css, meta };
};

/**
 * @param {{
 *   cssInput: string,
 *   cssOutput: string,
 *   meta: {},
 * }} testObj
 * @param {{}} [options] plugin options
 */
const assertProcessingResult = async (testObj, options = {}) => {
  const { css, meta } = await processCss(testObj.cssInput, options);

  expect(css).toBe(testObj.cssOutput);
  expect(meta).toEqual(testObj.meta);
};

test("should use the default json saving function if none was supplied", () => {
  const saveMeta = require("./saveMeta").default;

  const pluginInstance = containerQuery();

  pluginInstance(new Root(), { messages: [] });

  expect(saveMeta).toHaveBeenCalledTimes(1);
});

test("should throw on missing container declaration", () => {
  expect.assertions(1);

  return processCss(missingContainerDelcarationTest.cssInput, {
    singleContainer: false
  }).catch(e => {
    expect(e.reason).toBe(
      `Missing @define-container declaration before the processed node.`
    );
  });
});

test("should throw on missing container declaration when the container has r-units", () => {
  expect.assertions(1);

  return processCss(missingDeclarationWithRUnitsTest.cssInput, {
    singleContainer: false
  }).catch(e => {
    expect(e.reason).toBe(
      `Missing @define-container declaration before the processed node.`
    );
  });
});

test("should ignore unrecognised at-rules, like @keyframes", () =>
  assertProcessingResult(unrecognisedAtRulesTest, { singleContainer: false }));

test("should properly process CSS", () =>
  assertProcessingResult(regularTest, { singleContainer: false }));

// This also tests that containers are processed even without queries
test("should detect the first class as the container by default", () =>
  assertProcessingResult(containerAutoDetectionTest));

test("should throw in non singleContainer mode for defining a different container", () => {
  expect.assertions(1);

  return processCss(exessContainerDeclarationTest.cssInput).catch(e => {
    expect(e.reason).toBe(
      "define-container declaration detected in singleContainer mode. " +
        'Tried to override ".Container" with ".AnotherContainer".'
    );
  });
});

test("should extract css custom properties", () =>
  assertProcessingResult(customPropertiesTest));

test("should handle :self", () => assertProcessingResult(selfTest));

test("should be able to run this simple test", () =>
  assertProcessingResult(simpleTest));
