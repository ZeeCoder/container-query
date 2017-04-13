import { HEIGHT_UNIT, WIDTH_UNIT, MIN_UNIT, MAX_UNIT } from "../constants";

/**
 * @param {String} value
 *
 * @returns {boolean}
 */
export default function isValueUsingContainerUnits(value) {
    if (typeof value !== "string") {
        return false;
    }

    // Matching numbers followed by alphanumeric characters and %
    const match = value.toLowerCase().match(/(\d+(\.\d+)?)([a-z%]+)/i);

    if (match === null) {
        return false;
    }

    const unit = match[3];

    return (
        unit !== HEIGHT_UNIT &&
        unit !== WIDTH_UNIT &&
        unit !== MIN_UNIT &&
        unit !== MAX_UNIT &&
        (unit.indexOf(HEIGHT_UNIT) === 0 ||
            unit.indexOf(WIDTH_UNIT) === 0 ||
            unit.indexOf(MIN_UNIT) === 0 ||
            unit.indexOf(MAX_UNIT) === 0)
    );
}
