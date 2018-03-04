import * as basicTest from "./test/basic";
import * as reducedRedundancyTest from "./test/reducedRedundancy";
import * as descendantsTest from "./test/descendants";
import * as normalCssFlowTest from "./test/normalCssFlow";

test("should be able to generate the usual stats structure", () => {
  const stats = basicTest.build();

  expect(stats).toEqual(basicTest.out);
});

test("should output a json that minimises redundancy", () => {
  const stats = reducedRedundancyTest.build();

  expect(stats).toEqual(reducedRedundancyTest.out);
});

test("should handle a lot of different descendants fine", () => {
  const stats = descendantsTest.build();

  expect(stats).toEqual(descendantsTest.out);
});

test("should handle normal CSS flow fine", () => {
  const stats = normalCssFlowTest.build();

  expect(stats).toEqual(normalCssFlowTest.out);
});
