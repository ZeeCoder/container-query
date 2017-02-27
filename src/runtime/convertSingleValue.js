import {
    HEIGHT_UNIT,
    WIDTH_UNIT,
    MIN_UNIT,
    MAX_UNIT,
} from '../constants';

/**
 * Normalise unit by removing the container unit from the beginning of the
 * string.
 * Ex: "chpx" => "px", "cwem" => "em", etc.
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

    if (unit.indexOf(MIN_UNIT) === 0) {
        return unit.substr(MIN_UNIT.length);
    }

    if (unit.indexOf(MAX_UNIT) === 0) {
        return unit.substr(MAX_UNIT.length);
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

    if (
        unit === HEIGHT_UNIT ||
        unit === WIDTH_UNIT ||
        unit === MIN_UNIT ||
        unit === MAX_UNIT
    ) {
        return value;
    }

    const normalisedUnit = normaliseUnit(unit);

    const relativeToHeight = (
        unit.indexOf(HEIGHT_UNIT) === 0 ||
        (
            unit.indexOf(MIN_UNIT) === 0 &&
            dimensions.height < dimensions.width
        ) ||
        (
            unit.indexOf(MAX_UNIT) === 0 &&
            dimensions.height > dimensions.width
        )
    );
    const relativeToWidth = (
        unit.indexOf(WIDTH_UNIT) === 0 ||
        (
            unit.indexOf(MIN_UNIT) === 0 &&
            dimensions.height >= dimensions.width
        ) ||
        (
            unit.indexOf(MAX_UNIT) === 0 &&
            dimensions.height <= dimensions.width
        )
    );

    if (relativeToHeight) {
        return (dimensions.height * parseFloat(num) / 100) + normalisedUnit;
    } else if (relativeToWidth) {
        return (dimensions.width * parseFloat(num) / 100) + normalisedUnit;
    }

    return value;
}
