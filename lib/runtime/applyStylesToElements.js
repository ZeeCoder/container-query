"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = applyStylesToElements;
/**
 * @param {Object} styles
 * @param {HTMLElement[]} elements
 */
function applyStylesToElements(styles, elements) {
    elements.forEach(function (element) {
        for (var prop in styles) {
            element.style[prop] = styles[prop];
        }
    });
}