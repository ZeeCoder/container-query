"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getContainerDimensions;
/**
 * @param {jQuery} $container
 *
 * @return {ContainerDimensions}
 */
function getContainerDimensions($container) {
    return {
        width: $container.width(),
        height: $container.height()
    };
}