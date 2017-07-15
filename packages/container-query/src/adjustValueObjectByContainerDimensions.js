// @flow
import objectAssign from "object-assign";
import convertCompositValue from "./convertCompositValue";
import type { ContainerSize, Styles } from "../../common/src/types";

/**
 * Ex:
 * `{
 *   fontSize: "1<HEIGHT_UNIT>",
 *   padding: "10<HEIGHT_UNIT> 10<WIDTH_UNIT>",
 * }`
 * Ex:
 * `{
 *   fontSize: "10px",
 *   padding: "10px 20px",
 * }`
 */
export default function adjustValueObjectByContainerDimensions(
  containerDimensions: ContainerSize,
  valueDefinition: Styles,
  precision: number = 2
): Styles {
  let values = objectAssign({}, valueDefinition);

  for (let cssRule in values) {
    values[cssRule] = convertCompositValue(
      containerDimensions,
      values[cssRule],
      precision
    );
  }

  return values;
}
