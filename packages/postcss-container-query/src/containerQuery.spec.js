import postcss from "postcss";
import * as regularTest from "./test/regular";
import * as customPropertiesTest from "./test/custom-properties";
import * as exessContainerDeclarationTest from "./test/exess-container-declaration";
import * as containerAutoDetectionTest from "./test/container-auto-detection";
import * as unrecognisedAtRulesTest from "./test/unrecognised-at-rules";
import * as missingContainerDelcarationTest from "./test/missing-container-declaration";
import * as missingDeclarationWithRUnitsTest from "./test/missing-declaration-with-r-units";
import * as selfTest from "./test/self";
import * as simpleTest from "./test/simple";
import * as metaNamedExportTest from "./test/meta-named-export";
import * as disabledMetaExportTest from "./test/disabled-meta-export";
import fs from "fs";
import containerQuery from "./containerQuery";
import getMetadataFromMessages from "../getMetadataFromMessages";

jest.mock("fs");

/**
 * @param {string} rawCSS Raw CSS containing container queries
 * @param {{}} [options] plugin options
 * @return {Promise<{
 *   css: string,
 *   meta: {},
 * }>}
 */
const processCss = async (rawCSS, options = {}) => {
  const { css, messages } = await postcss([containerQuery(options)]).process(
    rawCSS,
    { from: "from.css", to: "to.css" }
  );

  const meta = getMetadataFromMessages(messages);

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

test('should avoid accidentally creating ".default" exports', () => {
  expect(typeof getMetadataFromMessages).toBe("function");
  expect(typeof containerQuery).toBe("function");
  expect(typeof getMetadataFromMessages.default).toBe("undefined");
  expect(typeof containerQuery.default).toBe("undefined");
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

test("should be able to export the meta under a custom export", () =>
  assertProcessingResult(metaNamedExportTest, {
    exportMetaInCss: "custom-meta"
  }));

test("should be able to disable the css meta export", () =>
  assertProcessingResult(disabledMetaExportTest, {
    exportMetaInCss: false
  }));
