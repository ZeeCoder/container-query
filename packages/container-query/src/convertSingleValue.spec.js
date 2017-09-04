import convertSingleValue from "./convertSingleValue";

test("single container value should be properly converted to px", () => {
  expect(convertSingleValue({ height: 100 }, "lorem ipsum")).toBe(
    "lorem ipsum"
  );

  expect(convertSingleValue({ height: 100 }, `100rh`)).toBe("100.00px");

  expect(convertSingleValue({ width: 100 }, `100rw`)).toBe("100.00px");

  expect(convertSingleValue({ height: 20 }, ` 50rh`)).toBe("10.00px");

  expect(convertSingleValue({ width: 15 }, ` 50rw`)).toBe("7.50px");

  expect(convertSingleValue({ width: 100 }, `55.5rw`)).toBe("55.50px");

  // chpx, chem and other unit variants were used to be rendered to px / em
  // etc values. That was removed in favour of r-units, but I'll leave the
  // tests in case we ever want to add the functionality back again.
  expect(convertSingleValue({ width: 100 }, `55.5rwPX`)).toBe(`55.5rwPX`);

  expect(convertSingleValue({ width: 100 }, `55.5rwem`)).toBe(`55.5rwem`);

  expect(convertSingleValue({ width: 100 }, `55.5rwrem`)).toBe(`55.5rwrem`);

  expect(convertSingleValue({ width: 100 }, `55.5rwch`)).toBe(`55.5rwch`);

  expect(convertSingleValue({ width: 100 }, `55.5rw%`)).toBe(`55.5rw%`);

  expect(convertSingleValue({ height: 100 }, `55.5rh%`)).toBe(`55.5rh%`);

  expect(convertSingleValue({ width: 100 }, `55.5rwvw`)).toBe(`55.5rwvw`);

  expect(convertSingleValue({ width: 100 }, `55.5rwvh`)).toBe(`55.5rwvh`);

  expect(convertSingleValue({ width: 100 }, `55.5rwvmin`)).toBe(`55.5rwvmin`);

  expect(convertSingleValue({ width: 100 }, `55.5rwvmax`)).toBe(`55.5rwvmax`);

  expect(convertSingleValue({ width: 100 }, `55.5rwcm`)).toBe(`55.5rwcm`);

  expect(convertSingleValue({ width: 100 }, `55.5rwmm`)).toBe(`55.5rwmm`);

  expect(convertSingleValue({ width: 100 }, `55.5rwin`)).toBe(`55.5rwin`);

  expect(convertSingleValue({ width: 100 }, `55.5rwpt`)).toBe(`55.5rwpt`);

  expect(convertSingleValue({ width: 100 }, `55.5rwpc`)).toBe(`55.5rwpc`);

  expect(convertSingleValue({ width: 1000 }, `55.5ch`)).toBe("55.5ch");

  expect(convertSingleValue({ width: 1000 }, `55.5`)).toBe("55.5");

  expect(convertSingleValue({ width: 1200, height: 100 }, `1rmin`)).toBe(
    "1.00px"
  );

  expect(convertSingleValue({ width: 1200, height: 120 }, `1rmin`)).toBe(
    "1.20px"
  );

  expect(convertSingleValue({ width: 1200, height: 1200 }, `1rmin`)).toBe(
    "12.00px"
  );

  expect(convertSingleValue({ width: 900, height: 1200 }, `1rmin`)).toBe(
    "9.00px"
  );

  expect(convertSingleValue({ width: 900, height: 1200 }, `5rminem`)).toBe(
    `5rminem`
  );

  expect(convertSingleValue({ width: 900, height: 1200 }, `1rmax`)).toBe(
    "12.00px"
  );

  expect(convertSingleValue({ width: 900, height: 1200 }, `2rmax`)).toBe(
    "24.00px"
  );

  expect(convertSingleValue({ width: 100, height: 99 }, `1rmaxem`)).toBe(
    `1rmaxem`
  );

  expect(convertSingleValue({ width: 120, height: 99 }, `5rmaxem`)).toBe(
    `5rmaxem`
  );

  expect(convertSingleValue({ width: 123, height: 321 }, `25.25rw`)).toBe(
    "31.06px"
  );

  expect(convertSingleValue({ width: 123, height: 321 }, `25.25rw`, 4)).toBe(
    "31.0575px"
  );
});
