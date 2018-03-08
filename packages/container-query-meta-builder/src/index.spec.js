import * as basicTest from "./test/basic";
import * as reducedRedundancyTest from "./test/reducedRedundancy";
import * as descendantsTest from "./test/descendants";
import * as normalCssFlowTest from "./test/normalCssFlow";

test("should be able to generate the usual meta structure", () => {
  const meta = basicTest.build();

  expect(meta).toEqual(basicTest.out);
});

test("should output metadata with minimised redundancy", () => {
  const meta = reducedRedundancyTest.build();

  expect(meta).toEqual(reducedRedundancyTest.out);
});

test("should handle a lot of different descendants fine", () => {
  const meta = descendantsTest.build();

  expect(meta).toEqual(descendantsTest.out);
});

test("should handle normal CSS flow fine", () => {
  const meta = normalCssFlowTest.build();

  expect(meta).toEqual(normalCssFlowTest.out);
});
