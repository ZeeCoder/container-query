// @flow
import type { ContainerSize } from "../flow/types";

// `Number.isInteger` for IE
// @see https://devdocs.io/javascript/global_objects/number/isinteger
const isInteger = value =>
  typeof value === "number" && isFinite(value) && Math.floor(value) === value;

const round = (value: number, precision: number): number => {
  if (isInteger(precision)) {
    const shift = Math.pow(10, precision);
    return Math.round(value * shift) / shift;
  }

  return Math.round(value);
};

/**
 * Converts a value possibly using a container unit into a pixel value.
 * (Respecting the given precision.)
 * Examples:
 * - "1rh" => "123px"
 * - "10px" => "10px"
 * - "2rw" => "11.42px"
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

  // Removing unnecessary precisions. (Otherwise it would get applied
  // inconsistently in chrome / firefox, which would not be a big issue, but
  // makes writing tests a pain.)
  // const preciseValue = `${valueNum.toFixed(precision)}`;

  // const trimmedValue = _.trim(_.trim(preciseValue, " 0"), ".");

  const roundedValue = round(valueNum, precision);

  return `${roundedValue}px`;
}
