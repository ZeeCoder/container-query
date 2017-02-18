import {
    HEIGHT_UNIT,
    WIDTH_UNIT,
} from '../constants';
import convertSingleValueToPixel from './convertSingleValueToPixel';

/**
 * @param  {ContainerDimensions} dimensions
 * @param  {string} compositValue Ex: "10<HEIGHT_UNIT> 5<WIDTH_UNIT>"
 *
 * @return {string} Ex: "123px 10px 42px"
 */
export default function convertCompositValuesToPixel (dimensions, compositValue) {
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
