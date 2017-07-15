// @flow
/**
 * Checks if the given object is empty or not.
 */
export default function isEmptyObject(obj: Object): boolean {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
}
