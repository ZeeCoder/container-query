import objectAssign from "object-assign";
import convertCompositValue from "./convertCompositValue";

/**
 * @param {ContainerDimensions} containerDimensions
 * @param {Object} valueDefinition
 * Ex:
 * `{
 *   fontSize: "1<HEIGHT_UNIT>px",
 *   padding: "10<HEIGHT_UNIT>em 10<WIDTH_UNIT>%",
 * }`
 *
 * @returns {Object}
 * Ex:
 * `{
 *   fontSize: "10px",
 *   padding: "10em 20%",
 * }`
 */
export default function adjustValueObjectByContainerDimensions(
    containerDimensions,
    valueDefinition
) {
    let values = objectAssign({}, valueDefinition);

    for (let cssRule in values) {
        values[cssRule] = convertCompositValue(
            containerDimensions,
            values[cssRule]
        );
    }

    return values;
}
