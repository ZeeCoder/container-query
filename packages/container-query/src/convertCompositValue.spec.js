import convertCompositValue from "./convertCompositValue";

test("composit container values are properly converted to pixels", () => {
  expect(
    convertCompositValue({ height: 100, width: 200 }, `1rh 10rw 2rh 5rw`)
  ).toBe("1.00px 20.00px 2.00px 10.00px");

  expect(convertCompositValue({ height: 100 }, `10rh 10rh 10rh`)).toBe(
    "10.00px 10.00px 10.00px"
  );

  expect(convertCompositValue({ width: 50 }, `20rw 20rw`)).toBe(
    "10.00px 10.00px"
  );

  expect(convertCompositValue({ width: 50 }, `20.25rw 20.25rw`)).toBe(
    "10.13px 10.13px"
  );

  expect(
    convertCompositValue({ height: 50, width: 50 }, `20.25rh% 20.25rw%`)
  ).toBe("10.13px% 10.13px%");

  expect(
    convertCompositValue({ height: 50, width: 50 }, `20.25rh% 20.25rw%`, 4)
  ).toBe("10.1250px% 10.1250px%");
});
