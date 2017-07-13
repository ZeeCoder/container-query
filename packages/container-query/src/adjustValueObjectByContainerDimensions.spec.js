import { HEIGHT_UNIT, WIDTH_UNIT } from "../../common/src/constants";
import adjustValueObjectByContainerDimensions from "./adjustValueObjectByContainerDimensions";

test("container value object gets all its values converted to pixels", () => {
    expect(
        adjustValueObjectByContainerDimensions(
            { height: 100, width: 150 },
            {
                fontSize: `50${HEIGHT_UNIT}`,
                lineHeight: `100${HEIGHT_UNIT}`,
                borderWidth: `50${WIDTH_UNIT}`,
                padding: `10${HEIGHT_UNIT} 10${WIDTH_UNIT} 10${HEIGHT_UNIT}`
            }
        )
    ).toEqual({
        fontSize: "50.00px",
        lineHeight: "100.00px",
        borderWidth: "75.00px",
        padding: "10.00px 15.00px 10.00px"
    });
});
