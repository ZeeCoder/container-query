// @flow
import objectAssign from "object-assign";
import convertCompositValue from "./convertCompositValue";
import type { ContainerSize, Styles } from "../flow/types";

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
export default function adjustValueObjectByContainerSize(
  containerSize: ContainerSize,
  valueDefinition: Styles,
  precision: number = 2
): Styles {
  const values = objectAssign({}, valueDefinition);

  for (let cssRule in values) {
    values[cssRule] = convertCompositValue(
      containerSize,
      values[cssRule],
      precision
    );
  }

  return values;
}
