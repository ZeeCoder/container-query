export const HEIGHT_UNIT = 'ch';
export const WIDTH_UNIT = 'cw';

/**
 * @param {ContainerDimensions} dimensions
 * @param {string} value Ex: "1<HEIGHT_UNIT>", "20<WIDTH_UNIT>"
 *
 * @return {string} Ex: "123px"
 */
export function convertSingleValueToPixel (dimensions, value) {
    const isHeightUnit = value.indexOf(HEIGHT_UNIT) !== -1;

    const match = value.match(new RegExp('(\\d+)'));

    if (isHeightUnit) {
        return (dimensions.height * parseInt(match[1]) / 100) + 'px';
    }

    return (dimensions.width * parseInt(match[1]) / 100) + 'px';
}

/**
 * Converts a container value to pixels, based on the current container's
 * dimensions.
 *
 * @param  {ContainerDimensions} dimensions
 * @param  {string} compositValue Ex: "10<HEIGHT_UNIT> 5<WIDTH_UNIT>"
 *
 * @return {string} Ex: "123px 10px 42px"
 */
export function convertCompositValuesToPixel (dimensions, compositValue) {
    let valArr = [];
    let match;

    match = compositValue.match(new RegExp('\\d+' + HEIGHT_UNIT, 'g'))
    if (match !== null) {
        valArr = valArr.concat(match);
    }

    match = compositValue.match(new RegExp('\\d+' + WIDTH_UNIT, 'g'));
    if (match !== null) {
        valArr = valArr.concat(match);
    }

    let convertedValues = {};
    valArr.forEach((value) => {
        convertedValues[value] = convertSingleValueToPixel(dimensions, value);
    });

    let compositPixelValue = compositValue;

    for (let unconvertedValue in convertedValues) {
        compositPixelValue = compositPixelValue.replace(
            new RegExp(unconvertedValue, 'g'),
            convertedValues[unconvertedValue]
        );
    }


    return compositPixelValue;
}
