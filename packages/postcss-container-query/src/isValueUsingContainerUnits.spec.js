import isValueUsingContainerUnits from "./isValueUsingContainerUnits";

test("should report false for non-strings and string not containing container units", () => {
  expect(isValueUsingContainerUnits(null)).toBe(false);
  expect(isValueUsingContainerUnits({})).toBe(false);
  expect(isValueUsingContainerUnits([])).toBe(false);
  expect(isValueUsingContainerUnits("")).toBe(false);
  expect(isValueUsingContainerUnits("12px 23px 33ch")).toBe(false);
  expect(isValueUsingContainerUnits("12ch 23vw 33%")).toBe(false);
});

test("should report true for values using either or both container units", () => {
  expect(isValueUsingContainerUnits(`42rh`)).toBe(true);
  expect(isValueUsingContainerUnits(`42rw`)).toBe(true);
  expect(isValueUsingContainerUnits(`42rw 42rh 42rw`)).toBe(true);
});

test("should report min and max units too", () => {
  expect(isValueUsingContainerUnits(`42rmin`)).toBe(true);
  expect(isValueUsingContainerUnits(`42rmax`)).toBe(true);
  expect(isValueUsingContainerUnits(`42rmin 42rmax 42rmin`)).toBe(true);
});

test("should allow for spaces around the value", () => {
  expect(isValueUsingContainerUnits(` 42rmin `)).toBe(true);
});

test("should work with floating numbers", () => {
  expect(isValueUsingContainerUnits(`42.42rmin`)).toBe(true);
});
