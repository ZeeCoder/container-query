'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.convertSingleValueToPixel = convertSingleValueToPixel;
exports.convertCompositValuesToPixel = convertCompositValuesToPixel;
exports.adjustValueObjectByContainerDimensions = adjustValueObjectByContainerDimensions;
exports.getContainerDimensions = getContainerDimensions;

var _unit_constants = require('../unit_constants');

/**
 * @param {ContainerDimensions} dimensions
 * @param {string} value Ex: "1<HEIGHT_UNIT>", "20<WIDTH_UNIT>"
 *
 * @return {string} Ex: "123px"
 */
function convertSingleValueToPixel(dimensions, value) {
    var isHeightUnit = value.indexOf(_unit_constants.HEIGHT_UNIT) !== -1;

    var match = value.match(new RegExp('(\\d+)'));

    if (isHeightUnit) {
        return dimensions.height * parseInt(match[1]) / 100 + 'px';
    }

    return dimensions.width * parseInt(match[1]) / 100 + 'px';
}

/**
 * @param  {ContainerDimensions} dimensions
 * @param  {string} compositValue Ex: "10<HEIGHT_UNIT> 5<WIDTH_UNIT>"
 *
 * @return {string} Ex: "123px 10px 42px"
 */
function convertCompositValuesToPixel(dimensions, compositValue) {
    var valArr = [];
    var match = void 0;

    match = compositValue.match(new RegExp('\\d+' + _unit_constants.HEIGHT_UNIT, 'g'));
    if (match !== null) {
        valArr = valArr.concat(match);
    }

    match = compositValue.match(new RegExp('\\d+' + _unit_constants.WIDTH_UNIT, 'g'));
    if (match !== null) {
        valArr = valArr.concat(match);
    }

    var convertedValues = {};
    valArr.forEach(function (value) {
        convertedValues[value] = convertSingleValueToPixel(dimensions, value);
    });

    var compositPixelValue = compositValue;

    for (var unconvertedValue in convertedValues) {
        compositPixelValue = compositPixelValue.replace(new RegExp(unconvertedValue, 'g'), convertedValues[unconvertedValue]);
    }

    return compositPixelValue;
}

/**
 * @param {ContainerDimensions} containerDimensions
 * @param {Object} valueDefinition
 * Ex:
 * `{
 *   fontSize: "1<HEIGHT_UNIT>",
 *   padding: "10<HEIGHT_UNIT> 10<WIDTH_UNIT>",
 * }`
 *
 * @returns {Object}
 * Ex:
 * `{
 *   fontSize: "10px",
 *   padding: "10px 20px",
 * }`
 */
function adjustValueObjectByContainerDimensions(containerDimensions, valueDefinition) {
    var values = Object.assign({}, valueDefinition);

    for (var cssRule in values) {
        values[cssRule] = convertCompositValuesToPixel(containerDimensions, values[cssRule]);
    }

    return values;
}

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