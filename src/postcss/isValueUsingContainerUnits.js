import {
    HEIGHT_UNIT,
    WIDTH_UNIT,
} from '../unit_constants';

/**
 * @param {String} value
 *
 * @returns {boolean}
 */
export default function isValueUsingContainerUnits (value) {
    return (
        typeof value === 'string' &&
        (
            value.indexOf(HEIGHT_UNIT) !== -1 ||
            value.indexOf(WIDTH_UNIT) !== -1
        )
    );
}
