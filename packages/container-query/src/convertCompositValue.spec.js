import { HEIGHT_UNIT, WIDTH_UNIT } from "../../common/src/constants";
import convertCompositValue from "./convertCompositValue";

test("composit container values are properly converted to pixels", () => {
    expect(
        convertCompositValue(
            { height: 100, width: 200 },
            `1${HEIGHT_UNIT} 10${WIDTH_UNIT} 2${HEIGHT_UNIT} 5${WIDTH_UNIT}`
        )
    ).toBe("1.00px 20.00px 2.00px 10.00px");

    expect(
        convertCompositValue(
            { height: 100 },
            `10${HEIGHT_UNIT} 10${HEIGHT_UNIT} 10${HEIGHT_UNIT}`
        )
    ).toBe("10.00px 10.00px 10.00px");

    expect(
        convertCompositValue({ width: 50 }, `20${WIDTH_UNIT} 20${WIDTH_UNIT}`)
    ).toBe("10.00px 10.00px");

    expect(
        convertCompositValue(
            { width: 50 },
            `20.25${WIDTH_UNIT} 20.25${WIDTH_UNIT}`
        )
    ).toBe("10.13px 10.13px");

    expect(
        convertCompositValue(
            { height: 50, width: 50 },
            `20.25${HEIGHT_UNIT}% 20.25${WIDTH_UNIT}%`
        )
    ).toBe("10.13px% 10.13px%");

    expect(
        convertCompositValue(
            { height: 50, width: 50 },
            `20.25${HEIGHT_UNIT}% 20.25${WIDTH_UNIT}%`,
            4
        )
    ).toBe("10.1250px% 10.1250px%");
});
