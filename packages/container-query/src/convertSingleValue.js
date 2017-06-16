import {
    HEIGHT_UNIT,
    WIDTH_UNIT,
    MIN_UNIT,
    MAX_UNIT
} from "../../common/src/constants";

/**
 * Converts a value possibly using a container unit into a pixel value.
 *
 * @param {ContainerDimensions} dimensions
 * @param {string} value Ex: "1<HEIGHT_UNIT>", "20<WIDTH_UNIT>"
 *
 * @return {string} Ex: "123px"
 */
export default function convertSingleValue(dimensions, value) {
    const match = value
        .toLowerCase()
        .match(/^ *(\d+(\.\d+)?)([rwhminax]+) *$/i);

    if (match === null) {
        return value;
    }

    const num = match[1];
    const unit = match[3];

    if (
        !(
            unit === HEIGHT_UNIT ||
            unit === WIDTH_UNIT ||
            unit === MIN_UNIT ||
            unit === MAX_UNIT
        )
    ) {
        return value;
    }

    const relativeToHeight =
        unit === HEIGHT_UNIT ||
        (unit === MIN_UNIT && dimensions.height < dimensions.width) ||
        (unit === MAX_UNIT && dimensions.height > dimensions.width);

    if (relativeToHeight) {
        return dimensions.height * parseFloat(num) / 100 + "px";
    }

    // relative to width
    return dimensions.width * parseFloat(num) / 100 + "px";
}
