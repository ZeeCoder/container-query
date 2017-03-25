import { HEIGHT_UNIT, WIDTH_UNIT } from "../constants";
import convertCompositValue from "./convertCompositValue";

test("composit container values are properly converted to pixels", () => {
    expect(
        convertCompositValue(
            { height: 100, width: 200 },
            `1${HEIGHT_UNIT}px 10${WIDTH_UNIT}px 2${HEIGHT_UNIT}px 5${WIDTH_UNIT}px`
        )
    ).toBe("1px 20px 2px 10px");

    expect(
        convertCompositValue(
            { height: 100 },
            `10${HEIGHT_UNIT}px 10${HEIGHT_UNIT}px 10${HEIGHT_UNIT}px`
        )
    ).toBe("10px 10px 10px");

    expect(
        convertCompositValue(
            { width: 50 },
            `20${WIDTH_UNIT}px 20${WIDTH_UNIT}px`
        )
    ).toBe("10px 10px");

    expect(
        convertCompositValue(
            { width: 50 },
            `20.25${WIDTH_UNIT}px 20.25${WIDTH_UNIT}px`
        )
    ).toBe("10.125px 10.125px");

    expect(
        convertCompositValue(
            { height: 50, width: 50 },
            `20.25${HEIGHT_UNIT}% 20.25${WIDTH_UNIT}%`
        )
    ).toBe("10.125% 10.125%");
});
