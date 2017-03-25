import { HEIGHT_UNIT, WIDTH_UNIT } from "../constants";
import adjustValueObjectByContainerDimensions
    from "./adjustValueObjectByContainerDimensions";

test("container value object gets all its values converted to pixels", () => {
    expect(
        adjustValueObjectByContainerDimensions(
            { height: 100, width: 150 },
            {
                fontSize: `50${HEIGHT_UNIT}px`,
                lineHeight: `100${HEIGHT_UNIT}px`,
                borderWidth: `50${WIDTH_UNIT}px`,
                padding: `10${HEIGHT_UNIT}px 10${WIDTH_UNIT}px 10${HEIGHT_UNIT}px`
            }
        )
    ).toEqual({
        fontSize: "50px",
        lineHeight: "100px",
        borderWidth: "75px",
        padding: "10px 15px 10px"
    });
});
