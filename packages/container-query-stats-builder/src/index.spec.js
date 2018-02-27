import * as basicTest from "./test/basic";

test("should be able to generate the usual stats structure", () => {
  const stats = basicTest.build();

  expect(stats).toEqual(basicTest.out);
});

// TODO should be the default
test("should be able to output an optimised build", () => {});
