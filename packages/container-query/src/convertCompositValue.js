// @flow
import type { ContainerSize } from "../flow/types";
import convertSingleValue from "./convertSingleValue";

/**
 * Converts a value possibly using one or more container units into a proper
 * value.
 * Example:
 * - "10rh 5rw 5rh" => "5px 10px 2.5px"
 */
export default function convertCompositValue(
  dimensions: ContainerSize,
  compositValue: string,
  precision: number = 2
): string {
  const valArr = compositValue.match(/\d+(\.\d+)?[rwhminax]+/gi);

  if (!Array.isArray(valArr)) {
    return compositValue;
  }

  const convertedValues = {};
  valArr.forEach(value => {
    convertedValues[value] = convertSingleValue(dimensions, value, precision);
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
