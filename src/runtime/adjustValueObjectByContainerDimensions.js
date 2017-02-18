import convertCompositValuesToPixel from './convertCompositValuesToPixel';

/**
 * @param {ContainerDimensions} containerDimensions
 * @param {Object} valueDefinition
 * Ex:
 * `{
 *   fontSize: "1<HEIGHT_UNIT>",
 *   padding: "10<HEIGHT_UNIT> 10<WIDTH_UNIT>",
 * }`
 *
 * @returns {Object}
 * Ex:
 * `{
 *   fontSize: "10px",
 *   padding: "10px 20px",
 * }`
 */
export default function adjustValueObjectByContainerDimensions (containerDimensions, valueDefinition) {
    let values = Object.assign({}, valueDefinition);

    for (let cssRule in values) {
        values[cssRule] = convertCompositValuesToPixel(containerDimensions, values[cssRule]);
    }

    return values;
}
