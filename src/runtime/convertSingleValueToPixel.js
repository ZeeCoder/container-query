import {
    HEIGHT_UNIT,
} from '../constants';

/**
 * @param {ContainerDimensions} dimensions
 * @param {string} value Ex: "1<HEIGHT_UNIT>", "20<WIDTH_UNIT>"
 *
 * @return {string} Ex: "123px"
 */
export default function convertSingleValueToPixel (dimensions, value) {
    const isHeightUnit = value.indexOf(HEIGHT_UNIT) !== -1;

    const match = value.match(new RegExp('(\\d+)'));

    if (isHeightUnit) {
        return (dimensions.height * parseInt(match[1]) / 100) + 'px';
    }

    return (dimensions.width * parseInt(match[1]) / 100) + 'px';
}
