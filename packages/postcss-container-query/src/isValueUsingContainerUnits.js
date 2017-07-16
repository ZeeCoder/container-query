// @flow
import {
  HEIGHT_UNIT,
  WIDTH_UNIT,
  MIN_UNIT,
  MAX_UNIT
} from "../../common/src/constants";

export default function isValueUsingContainerUnits(value: string): boolean {
  if (typeof value !== "string") {
    return false;
  }

  // Matching numbers followed by characters from the r-units
  const match: ?(string[]) = value
    .toLowerCase()
    .match(/(\d+(\.\d+)?)([rwhminax]+)/i);

  if (!Array.isArray(match) || typeof match[3] !== "string") {
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
