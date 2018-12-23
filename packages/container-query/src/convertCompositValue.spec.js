import convertCompositValue from "./convertCompositValue";

test("should adjust a single value", () => {
  expect(convertCompositValue({ width: 100 }, "2rw")).toBe("2px");

  expect(convertCompositValue({ width: 123 }, "2.12rw", 4)).toBe("2.6076px");
});

test("should adjust a single value in a shorthand notation", () => {
  expect(convertCompositValue({ width: 100 }, "2rw solid none")).toBe(
    "2px solid none"
  );

  expect(convertCompositValue({ width: 123 }, "2.12rw solid none", 4)).toBe(
    "2.6076px solid none"
  );
});

test("should adjust all values", () => {
  expect(
    convertCompositValue({ height: 100, width: 200 }, "1rh 10rw 2rh 5rw")
  ).toBe("1px 20px 2px 10px");

  expect(convertCompositValue({ height: 100 }, "10rh 10rh 10rh")).toBe(
    "10px 10px 10px"
  );

  expect(convertCompositValue({ width: 50 }, "20rw 20rw")).toBe("10px 10px");

  expect(convertCompositValue({ width: 50 }, "20.25rw 20.25rw")).toBe(
    "10.13px 10.13px"
  );
});

test("should respect precision", () => {
  expect(
    convertCompositValue({ height: 50, width: 50 }, "20.25rh 20.25rw", 4)
  ).toBe("10.125px 10.125px");
});
