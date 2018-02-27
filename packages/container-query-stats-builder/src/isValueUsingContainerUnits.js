// @flow
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

  return unit === "rh" || unit === "rw" || unit === "rmin" || unit === "rmax";
}
