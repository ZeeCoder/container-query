/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = {
	".user": {
		"selector": ".user",
		"queries": [
			{
				"elements": [
					{
						"selector": ".user__landscape",
						"styles": {
							"display": ""
						}
					},
					{
						"selector": ".user__portrait",
						"styles": {
							"display": ""
						}
					}
				]
			},
			{
				"conditions": [
					[
						"orientation",
						":",
						"landscape"
					]
				],
				"elements": [
					{
						"selector": ".user__landscape",
						"styles": {
							"display": "block"
						}
					}
				]
			},
			{
				"conditions": [
					[
						"orientation",
						":",
						"portrait"
					]
				],
				"elements": [
					{
						"selector": ".user__portrait",
						"styles": {
							"display": "block"
						}
					}
				]
			}
		]
	}
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _enhanceConfig = __webpack_require__(4);

var _enhanceConfig2 = _interopRequireDefault(_enhanceConfig);

var _adjustContainer = __webpack_require__(3);

var _adjustContainer2 = _interopRequireDefault(_adjustContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(container, config) {
        _classCallCheck(this, _class);

        this.$container = $(container);
        this.adjust = this.adjust.bind(this);

        this.config = (0, _enhanceConfig2.default)(this.$container, config);

        this.adjust();
    }

    _createClass(_class, [{
        key: 'adjust',
        value: function adjust() {
            (0, _adjustContainer2.default)(this.$container, this.config);
        }
    }]);

    return _class;
}();

exports.default = _class;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.convertSingleValueToPixel = convertSingleValueToPixel;
exports.convertCompositValuesToPixel = convertCompositValuesToPixel;
exports.adjustValueObjectByContainerDimensions = adjustValueObjectByContainerDimensions;
exports.getContainerDimensions = getContainerDimensions;
var HEIGHT_UNIT = exports.HEIGHT_UNIT = 'ch';
var WIDTH_UNIT = exports.WIDTH_UNIT = 'cw';

/**
 * @param {ContainerDimensions} dimensions
 * @param {string} value Ex: "1<HEIGHT_UNIT>", "20<WIDTH_UNIT>"
 *
 * @return {string} Ex: "123px"
 */
function convertSingleValueToPixel(dimensions, value) {
    var isHeightUnit = value.indexOf(HEIGHT_UNIT) !== -1;

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

    match = compositValue.match(new RegExp('\\d+' + HEIGHT_UNIT, 'g'));
    if (match !== null) {
        valArr = valArr.concat(match);
    }

    match = compositValue.match(new RegExp('\\d+' + WIDTH_UNIT, 'g'));
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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = adjustContainer;

var _utils = __webpack_require__(2);

function adjustQueries($container, containerDimensions, config) {
    var queriesLength = config.queries.length;
    var changeSets = {};

    var _loop = function _loop(i) {
        // Check if the condition apply, or if it's the first, default query
        if (i !== 0 && typeof config.queries[i].conditionFunction === 'function' && !config.queries[i].conditionFunction(containerDimensions)) {
            return 'continue';
        }

        config.queries[i].elements.forEach(function (elementData) {
            if (i === 0) {
                // @todo This is where missing elements could be addressed
                changeSets[elementData.selector] = {
                    $element: elementData.selector === config.selector ? $container : $container.find(elementData.selector),
                    change: {}
                };
            }

            Object.assign(changeSets[elementData.selector].change, (0, _utils.adjustValueObjectByContainerDimensions)(containerDimensions, elementData.styles));
        });
    };

    for (var i = 0; i < queriesLength; i++) {
        var _ret = _loop(i);

        if (_ret === 'continue') continue;
    }

    for (var elementSelector in changeSets) {
        changeSets[elementSelector].$element.css(changeSets[elementSelector].change);
    }
}

function adjustContainer($container, config) {
    var containerDimensions = (0, _utils.getContainerDimensions)($container);

    adjustQueries($container, containerDimensions, config);
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = enhanceConfig;
function getFunctionFromConditions(conditions) {
    if (!Array.isArray(conditions)) {
        return noCondition;
    }

    var conditionFunctions = conditions.map(function (condition) {
        var rule = condition[0];
        var operation = condition[1];
        var value = condition[2];

        if (rule === 'width') {
            if (operation === '>') {
                return function (containerDimensions) {
                    return containerDimensions.width > value;
                };
            } else if (operation === '>=') {
                return function (containerDimensions) {
                    return containerDimensions.width >= value;
                };
            } else if (operation === '<') {
                return function (containerDimensions) {
                    return containerDimensions.width < value;
                };
            } else if (operation === '<=') {
                return function (containerDimensions) {
                    return containerDimensions.width <= value;
                };
            }
        } else if (rule === 'height') {
            if (operation === '>') {
                return function (containerDimensions) {
                    return containerDimensions.height > value;
                };
            } else if (operation === '>=') {
                return function (containerDimensions) {
                    return containerDimensions.height >= value;
                };
            } else if (operation === '<') {
                return function (containerDimensions) {
                    return containerDimensions.height < value;
                };
            } else if (operation === '<=') {
                return function (containerDimensions) {
                    return containerDimensions.height <= value;
                };
            }
        } else if (rule === 'aspect-ratio') {
            if (operation === '>') {
                return function (containerDimensions) {
                    return containerDimensions.width / containerDimensions.height > value;
                };
            } else if (operation === '>=') {
                return function (containerDimensions) {
                    return containerDimensions.width / containerDimensions.height >= value;
                };
            } else if (operation === '<') {
                return function (containerDimensions) {
                    return containerDimensions.width / containerDimensions.height < value;
                };
            } else if (operation === '<=') {
                return function (containerDimensions) {
                    return containerDimensions.width / containerDimensions.height <= value;
                };
            }
        } else if (rule === 'orientation') {
            if (value === 'portrait') {
                return function (containerDimensions) {
                    return containerDimensions.height >= containerDimensions.width;
                };
            } else {
                return function (containerDimensions) {
                    return containerDimensions.height < containerDimensions.width;
                };
            }
        }

        return function () {
            console.log("This condition was not processed properly, returning false.", condition);

            return false;
        };
    });

    return andCondition.bind(this, conditionFunctions);
}

function andCondition(conditionFunctions, containerDimensions) {
    var conditionFunctionsLength = conditionFunctions.length;
    for (var i = 0; i < conditionFunctionsLength; i++) {
        if (!conditionFunctions[i](containerDimensions)) {
            return false;
        }
    }

    return true;
}

function noCondition() {
    return true;
}

function enhanceConfig($container, origConfig) {
    var config = Object.assign({}, origConfig);

    config.queries.forEach(function (queryData) {
        queryData.conditionFunction = getFunctionFromConditions(queryData.conditions);
    });

    return config;
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Container = __webpack_require__(1);

var _Container2 = _interopRequireDefault(_Container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var containerConfigs = __webpack_require__(0);

var containers = [];

var _loop = function _loop(containerSelector) {
    $(containerSelector).each(function () {
        containers.push(new _Container2.default(this, Object.assign({}, containerConfigs[containerSelector])));
    });
};

for (var containerSelector in containerConfigs) {
    _loop(containerSelector);
}

$(window).on('resize', function () {
    containers.forEach(function (container) {
        container.adjust();
    });
});

/***/ })
/******/ ]);
//# sourceMappingURL=scripts.dist.js.map