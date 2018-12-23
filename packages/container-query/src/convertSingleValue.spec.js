import convertSingleValue from "./convertSingleValue";

test("should not change values with standard css units", () => {
  expect(convertSingleValue({ height: 100 }, "10px")).toBe("10px");
  expect(convertSingleValue({ height: 42 }, "10px")).toBe("10px");
  expect(convertSingleValue({ height: 10 }, "10%")).toBe("10%");
  expect(convertSingleValue({ height: 10 }, "1fr")).toBe("1fr");
  expect(convertSingleValue({ height: 10 }, "2in")).toBe("2in");
  expect(convertSingleValue({ height: 10 }, "10cm")).toBe("10cm");
  expect(convertSingleValue({ height: 10 }, "2mm")).toBe("2mm");
});

test("should not touch any string without r-units", () => {
  expect(convertSingleValue({ height: 123 }, "lorem ipsum")).toBe(
    "lorem ipsum"
  );
  expect(convertSingleValue({ height: 0 }, "55")).toBe("55");
});

test("should convert r-units to px values", () => {
  expect(convertSingleValue({ height: 100 }, "100rh")).toBe("100px");
  expect(convertSingleValue({ width: 100 }, "100rw")).toBe("100px");
  expect(convertSingleValue({ width: 100 }, "55.5rw")).toBe("55.5px");
  expect(convertSingleValue({ width: 123, height: 321 }, "25.25rw")).toBe(
    "31.06px"
  );
  expect(convertSingleValue({ width: 1200, height: 100 }, "1rmin")).toBe("1px");
  expect(convertSingleValue({ width: 1200, height: 120 }, "1rmin")).toBe(
    "1.2px"
  );
  expect(convertSingleValue({ width: 1200, height: 1200 }, "1rmin")).toBe(
    "12px"
  );
  expect(convertSingleValue({ width: 900, height: 1200 }, "1rmin")).toBe("9px");
  expect(convertSingleValue({ width: 900, height: 1200 }, "1rmax")).toBe(
    "12px"
  );
  expect(convertSingleValue({ width: 900, height: 1200 }, "2rmax")).toBe(
    "24px"
  );
});

test("should be able to handle whitespace in the value string", () => {
  expect(convertSingleValue({ height: 20 }, " 50rh")).toBe("10px");
  expect(convertSingleValue({ width: 15 }, " 50rw  ")).toBe("7.5px");
});

test("should handle higher precisions", () => {
  expect(convertSingleValue({ width: 123, height: 321 }, "25.25rw", 4)).toBe(
    "31.0575px"
  );
});
