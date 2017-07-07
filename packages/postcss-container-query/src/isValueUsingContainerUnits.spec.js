import {
    HEIGHT_UNIT,
    WIDTH_UNIT,
    MIN_UNIT,
    MAX_UNIT
} from "../../common/src/constants";
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
    expect(isValueUsingContainerUnits(`42${HEIGHT_UNIT}`)).toBe(true);
    expect(isValueUsingContainerUnits(`42${WIDTH_UNIT}`)).toBe(true);
    expect(
        isValueUsingContainerUnits(
            `42${WIDTH_UNIT} 42${HEIGHT_UNIT} 42${WIDTH_UNIT}`
        )
    ).toBe(true);
});

test("should report min and max units too", () => {
    expect(isValueUsingContainerUnits(`42${MIN_UNIT}`)).toBe(true);
    expect(isValueUsingContainerUnits(`42${MAX_UNIT}`)).toBe(true);
    expect(
        isValueUsingContainerUnits(`42${MIN_UNIT} 42${MAX_UNIT} 42${MIN_UNIT}`)
    ).toBe(true);
});

test("should allow for spaces around the value", () => {
    expect(isValueUsingContainerUnits(` 42${MIN_UNIT} `)).toBe(true);
});

test("should work with floating numbers", () => {
    expect(isValueUsingContainerUnits(`42.42${MIN_UNIT}`)).toBe(true);
});
