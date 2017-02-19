"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getContainerDimensions;
/**
 * @param {HTMLElement} container
 *
 * @return {ContainerDimensions}
 */
function getContainerDimensions(container) {
    return {
        width: container.clientWidth,
        height: container.clientHeight
    };
}