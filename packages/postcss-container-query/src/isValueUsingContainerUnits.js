import {
  HEIGHT_UNIT,
  WIDTH_UNIT,
  MIN_UNIT,
  MAX_UNIT
} from "../../common/src/constants";

/**
 * @param {String} value
 *
 * @returns {boolean}
 */
export default function isValueUsingContainerUnits(value) {
  if (typeof value !== "string") {
    return false;
  }

  // Matching numbers followed by characters from the r-units
  const match = value.toLowerCase().match(/(\d+(\.\d+)?)([rwhminax]+)/i);

  if (match === null) {
    return false;
  }

  const unit = match[3];

  return (
    unit === HEIGHT_UNIT ||
    unit === WIDTH_UNIT ||
    unit === MIN_UNIT ||
    unit === MAX_UNIT
  );
}
