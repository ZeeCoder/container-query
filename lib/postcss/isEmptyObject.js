"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = isEmptyObject;
/**
 * Checks if the given object is empty or not.
 *
 * @param {Object} obj
 *
 * @returns {boolean}
 */
function isEmptyObject(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
}