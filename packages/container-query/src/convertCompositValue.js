import convertSingleValue from "./convertSingleValue";

/**
 * Converts a value possibly using one or more container units into a proper
 * value.
 *
 * @param  {ContainerDimensions} dimensions
 * @param  {string} compositValue Ex: "10<HEIGHT_UNIT> 5<WIDTH_UNIT>"
 *
 * @return {string} Ex: "123px 10px 42px"
 */
export default function convertCompositValue(dimensions, compositValue) {
    const valArr = compositValue.match(/\d+(\.\d+)?[rwhminax]+/gi);

    if (valArr === null) {
        return compositValue;
    }

    let convertedValues = {};
    valArr.forEach(value => {
        convertedValues[value] = convertSingleValue(dimensions, value);
    });

    let compositPixelValue = compositValue;

    for (let unconvertedValue in convertedValues) {
        compositPixelValue = compositPixelValue.replace(
            new RegExp(unconvertedValue, "g"),
            convertedValues[unconvertedValue]
        );
    }

    return compositPixelValue;
}
