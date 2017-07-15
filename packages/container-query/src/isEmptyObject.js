/**
 * Checks if the given object is empty or not.
 *
 * @param {Object} obj
 * @todo move to common, to remove duplication
 * @returns {boolean}
 */
export default function isEmptyObject(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
}
