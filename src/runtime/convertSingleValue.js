import {
    HEIGHT_UNIT,
    WIDTH_UNIT,
} from '../constants';

/**
 * Normalise unit by removing height or width container unit from the
 * beginning of the string.
 *
 * @param {string} unit
 */
function normaliseUnit (unit) {
    if (unit.indexOf(HEIGHT_UNIT) === 0) {
        return unit.substr(HEIGHT_UNIT.length);
    }

    if (unit.indexOf(WIDTH_UNIT) === 0) {
        return unit.substr(WIDTH_UNIT.length);
    }

    return unit;
}

/**
 * Converts a value possibly using a container unit into a proper value.
 *
 * @param {ContainerDimensions} dimensions
 * @param {string} value Ex: "1<HEIGHT_UNIT>", "20<WIDTH_UNIT>"
 *
 * @return {string} Ex: "123px"
 */
export default function convertSingleValue (dimensions, value) {
    const match = value.toLowerCase().match(/(\d+(\.\d+)?)([a-z%]+)/i);

    if (match === null) {
        return value;
    }

    const num = match[1];
    const unit = match[3];

    if (unit === HEIGHT_UNIT || unit === WIDTH_UNIT) {
        return value;
    }

    const relativeToHeight = unit.indexOf(HEIGHT_UNIT) === 0;
    const normalisedUnit = normaliseUnit(unit);

    if (relativeToHeight) {
        return (dimensions.height * parseFloat(num) / 100) + normalisedUnit;
    }

    const relativeToWidth = unit.indexOf(WIDTH_UNIT) === 0;

    if (relativeToWidth) {
        return (dimensions.width * parseFloat(num) / 100) + normalisedUnit;
    }

    return value;
}
