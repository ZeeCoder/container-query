// @flow
import type { ContainerSize } from "../flow/types";

/**
 * Converts a value possibly using a container unit into a pixel value.
 * Examples:
 * - "1rh" => "123px"
 * - "10px" => 10px
 */
export default function convertSingleValue(
  dimensions: ContainerSize,
  value: string,
  precision: number = 2
): string {
  const match = value.toLowerCase().match(/^ *(\d+(\.\d+)?)([rwhminax]+) *$/i);

  if (!Array.isArray(match)) {
    return value;
  }

  const num = match[1];
  const unit = match[3];

  if (!(unit === "rh" || unit === "rw" || unit === "rmin" || unit === "rmax")) {
    return value;
  }

  const relativeToHeight =
    unit === "rh" ||
    (unit === "rmin" && dimensions.height < dimensions.width) ||
    (unit === "rmax" && dimensions.height > dimensions.width);

  const valueNum: number =
    ((relativeToHeight ? dimensions.height : dimensions.width) *
      parseFloat(num)) /
    100;

  return `${valueNum.toFixed(precision)}px`;
}
