import postcss from "postcss";
import containerQuery from "./containerQuery";
import Root from "../__mocks__/Root";
import * as regularTest from "./test/regular";
import * as customPropertiesTest from "./test/custom-properties";
import * as exessContainerDeclarationTest from "./test/exess-container-declaration";
import * as containerAutoDetectionTest from "./test/container-auto-detection";
import * as unrecognisedAtRulesTest from "./test/unrecognised-at-rules";
import * as missingContainerDelcarationTest from "./test/missing-container-declaration";
import * as missingDeclarationWithRUnitsTest from "./test/missing-declaration-with-r-units";

jest.mock("./saveJSON");

/**
 * @param {string} css Raw CSS containing container queries
 * @param {{}} options plugin options
 * @return {Promise<{
 *   css: string,
 *   stats: {},
 * }>}
 */
const processCss = (css, options = {}) =>
  Promise.resolve().then(() => {
    let stats = null;
    options.getJSON = (path, json) => (stats = json);

    return postcss([containerQuery(options)])
      .process(css, { from: "from.css", to: "to.css" })
      .then(result => ({ css: result.css, stats }));
  });

/**
 * @param {{
 *   cssInput: string,
 *   cssOutput: string,
 *   statsOutput: {},
 * }} testObj
 * @param {{}} options plugin options
 * @return {Promise<{
 *  actualCssOutput: string,
 *  actualStatsOutput: {},
 * }>}
 */
const assertProcessingResult = (testObj, options = {}) =>
  processCss(testObj.cssInput, options).then(({ css, stats }) => {
    expect(css).toBe(testObj.cssOutput);
    expect(stats).toEqual(testObj.statsOutput);

    return {
      cssOutput: css,
      statsOutput: stats
    };
  });

test("should use the default json saving function if none was supplied", () => {
  const saveJSON = require("./saveJSON").default;

  const pluginInstance = containerQuery();

  pluginInstance(new Root());

  expect(saveJSON).toHaveBeenCalledTimes(1);
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
