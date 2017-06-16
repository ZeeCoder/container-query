import {
    HEIGHT_UNIT,
    WIDTH_UNIT,
    MIN_UNIT,
    MAX_UNIT
} from "../../common/src/constants";
import convertSingleValue from "./convertSingleValue";

test("single container value should be properly converted to px", () => {
    expect(convertSingleValue({ height: 100 }, "lorem ipsum")).toBe(
        "lorem ipsum"
    );

    expect(convertSingleValue({ height: 100 }, `100${HEIGHT_UNIT}`)).toBe(
        "100px"
    );

    expect(convertSingleValue({ width: 100 }, `100${WIDTH_UNIT}`)).toBe(
        "100px"
    );

    expect(convertSingleValue({ height: 20 }, ` 50${HEIGHT_UNIT}`)).toBe(
        "10px"
    );

    expect(convertSingleValue({ width: 15 }, ` 50${WIDTH_UNIT}`)).toBe("7.5px");

    expect(convertSingleValue({ width: 100 }, `55.5${WIDTH_UNIT}`)).toBe(
        "55.5px"
    );

    // chpx, chem and other unit variants were used to be rendered to px / em
    // etc values. That was removed in favour of r-units, but I'll leave the
    // tests in case we ever want to add the functionality back again.
    expect(convertSingleValue({ width: 100 }, `55.5${WIDTH_UNIT}PX`)).toBe(
        `55.5${WIDTH_UNIT}PX`
    );

    expect(convertSingleValue({ width: 100 }, `55.5${WIDTH_UNIT}em`)).toBe(
        `55.5${WIDTH_UNIT}em`
    );

    expect(convertSingleValue({ width: 100 }, `55.5${WIDTH_UNIT}rem`)).toBe(
        `55.5${WIDTH_UNIT}rem`
    );

    expect(convertSingleValue({ width: 100 }, `55.5${WIDTH_UNIT}ch`)).toBe(
        `55.5${WIDTH_UNIT}ch`
    );

    expect(convertSingleValue({ width: 100 }, `55.5${WIDTH_UNIT}%`)).toBe(
        `55.5${WIDTH_UNIT}%`
    );

    expect(convertSingleValue({ height: 100 }, `55.5${HEIGHT_UNIT}%`)).toBe(
        `55.5${HEIGHT_UNIT}%`
    );

    expect(convertSingleValue({ width: 100 }, `55.5${WIDTH_UNIT}vw`)).toBe(
        `55.5${WIDTH_UNIT}vw`
    );

    expect(convertSingleValue({ width: 100 }, `55.5${WIDTH_UNIT}vh`)).toBe(
        `55.5${WIDTH_UNIT}vh`
    );

    expect(convertSingleValue({ width: 100 }, `55.5${WIDTH_UNIT}vmin`)).toBe(
        `55.5${WIDTH_UNIT}vmin`
    );

    expect(convertSingleValue({ width: 100 }, `55.5${WIDTH_UNIT}vmax`)).toBe(
        `55.5${WIDTH_UNIT}vmax`
    );

    expect(convertSingleValue({ width: 100 }, `55.5${WIDTH_UNIT}cm`)).toBe(
        `55.5${WIDTH_UNIT}cm`
    );

    expect(convertSingleValue({ width: 100 }, `55.5${WIDTH_UNIT}mm`)).toBe(
        `55.5${WIDTH_UNIT}mm`
    );

    expect(convertSingleValue({ width: 100 }, `55.5${WIDTH_UNIT}in`)).toBe(
        `55.5${WIDTH_UNIT}in`
    );

    expect(convertSingleValue({ width: 100 }, `55.5${WIDTH_UNIT}pt`)).toBe(
        `55.5${WIDTH_UNIT}pt`
    );

    expect(convertSingleValue({ width: 100 }, `55.5${WIDTH_UNIT}pc`)).toBe(
        `55.5${WIDTH_UNIT}pc`
    );

    expect(convertSingleValue({ width: 1000 }, `55.5ch`)).toBe("55.5ch");

    expect(convertSingleValue({ width: 1000 }, `55.5`)).toBe("55.5");

    expect(
        convertSingleValue({ width: 1200, height: 100 }, `1${MIN_UNIT}`)
    ).toBe("1px");

    expect(
        convertSingleValue({ width: 1200, height: 120 }, `1${MIN_UNIT}`)
    ).toBe("1.2px");

    expect(
        convertSingleValue({ width: 1200, height: 1200 }, `1${MIN_UNIT}`)
    ).toBe("12px");

    expect(
        convertSingleValue({ width: 900, height: 1200 }, `1${MIN_UNIT}`)
    ).toBe("9px");

    expect(
        convertSingleValue({ width: 900, height: 1200 }, `5${MIN_UNIT}em`)
    ).toBe(`5${MIN_UNIT}em`);

    expect(
        convertSingleValue({ width: 900, height: 1200 }, `1${MAX_UNIT}`)
    ).toBe("12px");

    expect(
        convertSingleValue({ width: 900, height: 1200 }, `2${MAX_UNIT}`)
    ).toBe("24px");

    expect(
        convertSingleValue({ width: 100, height: 99 }, `1${MAX_UNIT}em`)
    ).toBe(`1${MAX_UNIT}em`);

    expect(
        convertSingleValue({ width: 120, height: 99 }, `5${MAX_UNIT}em`)
    ).toBe(`5${MAX_UNIT}em`);
});
