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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = {
	"selector": ".container",
	"queries": [
		{
			"elements": [
				{
					"selector": ".container",
					"styles": {
						"opacity": ""
					}
				},
				{
					"selector": ".container__title",
					"styles": {
						"background": ""
					}
				}
			]
		},
		{
			"conditions": [
				[
					"width",
					">=",
					200
				],
				[
					"height",
					">=",
					200
				]
			],
			"elements": [
				{
					"selector": ".container",
					"styles": {
						"opacity": "0.5"
					}
				},
				{
					"selector": ".container__title",
					"styles": {
						"background": "red"
					}
				}
			]
		},
		{
			"conditions": [
				[
					"width",
					">=",
					300
				]
			],
			"elements": [
				{
					"selector": ".container",
					"styles": {
						"opacity": "1"
					}
				}
			]
		}
	],
	"values": [
		{
			"elements": [
				{
					"selector": ".container",
					"values": {},
					"defaultValues": {
						"borderWidth": ""
					}
				},
				{
					"selector": ".container__title",
					"values": {
						"lineHeight": [
							1,
							"ch"
						]
					},
					"defaultValues": {
						"lineHeight": "",
						"fontSize": ""
					}
				}
			]
		},
		{
			"conditions": [
				[
					"height",
					">=",
					150
				]
			],
			"elements": [
				{
					"selector": ".container",
					"values": {
						"borderWidth": [
							0.04,
							"ch"
						]
					}
				}
			]
		},
		{
			"conditions": [
				[
					"width",
					"<=",
					250
				],
				[
					"height",
					"<=",
					300
				]
			],
			"elements": [
				{
					"selector": ".container__title",
					"values": {
						"fontSize": [
							0.3,
							"ch"
						]
					}
				}
			]
		}
	]
};

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__enhanceConfig__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__adjustContainer__ = __webpack_require__(2);



/* harmony default export */ __webpack_exports__["a"] = class {
    constructor(container, config) {
        this.$container = $(container);
        this.adjust = this.adjust.bind(this);

        this.config = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__enhanceConfig__["a" /* default */])(this.$container, config);

        this.adjust();
    }

    adjust() {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__adjustContainer__["a" /* default */])(this.$container, this.config);
    }
};

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = adjustContainer;
function adjustValuesByContainerDimensions(containerDimensions, valueDefinition) {
    let values = Object.assign({}, valueDefinition);

    for (let cssRule in values) {
        values[cssRule] = convertValue(containerDimensions, values[cssRule]);
    }

    return values;
}

function convertValue(containerDimensions, value) {
    if (value[1] === 'ch') {
        return containerDimensions.height * value[0] + 'px';
    }

    return containerDimensions.width * value[0] + 'px';
}

function adjustQueries($container, containerDimensions, config) {
    let queriesLength = config.queries.length;
    let changeSets = {};

    for (var i = 0; i < queriesLength; i++) {
        if (i !== 0 && typeof config.queries[i].conditionFunction === 'function' && !config.queries[i].conditionFunction(containerDimensions)) {
            continue;
        }

        config.queries[i].elements.forEach(elementData => {
            if (i === 0) {
                // @todo This is where missing elements could be addressed
                changeSets[elementData.selector] = {
                    $element: elementData.selector === config.selector ? $container : $container.find(elementData.selector),
                    change: {}
                };
            }

            Object.assign(changeSets[elementData.selector].change, elementData.styles);
        });
    }

    for (let key in changeSets) {
        changeSets[key].$element.css(changeSets[key].change);
    }
}

function adjustValues($container, containerDimensions, config) {
    let valuesLength = config.values.length;
    let changeSets = {};

    for (var i = 0; i < valuesLength; i++) {
        if (i !== 0 && typeof config.values[i].conditionFunction === 'function' && !config.values[i].conditionFunction(containerDimensions)) {
            continue;
        }

        config.values[i].elements.forEach(elementData => {
            if (i === 0) {
                // @todo This is where missing elements could be addressed
                changeSets[elementData.selector] = {
                    $element: elementData.selector === config.selector ? $container : $container.find(elementData.selector),
                    change: Object.assign({}, elementData.defaultValues)
                };
            }

            Object.assign(changeSets[elementData.selector].change, adjustValuesByContainerDimensions(containerDimensions, elementData.values));
        });
    }

    for (let key in changeSets) {
        changeSets[key].$element.css(changeSets[key].change);
    }
}

function adjustContainer($container, config) {
    let containerDimensions = {
        width: $container.width(),
        height: $container.height()
    };

    adjustValues($container, containerDimensions, config);
    adjustQueries($container, containerDimensions, config);
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = enhanceConfig;
function getFunctionFromConditions(conditions) {
    if (!Array.isArray(conditions)) {
        return noCondition;
    }

    let conditionFunctions = conditions.map(condition => {
        const rule = condition[0];
        const operation = condition[1];
        const value = condition[2];

        if (rule === 'width') {
            if (operation === '>') {
                return containerDimensions => {
                    return containerDimensions.width > value;
                };
            } else if (operation === '>=') {
                return containerDimensions => {
                    return containerDimensions.width >= value;
                };
            } else if (operation === '<') {
                return containerDimensions => {
                    return containerDimensions.width < value;
                };
            } else if (operation === '<=') {
                return containerDimensions => {
                    return containerDimensions.width <= value;
                };
            }
        } else if (rule === 'height') {
            if (operation === '>') {
                return containerDimensions => {
                    return containerDimensions.height > value;
                };
            } else if (operation === '>=') {
                return containerDimensions => {
                    return containerDimensions.height >= value;
                };
            } else if (operation === '<') {
                return containerDimensions => {
                    return containerDimensions.height < value;
                };
            } else if (operation === '<=') {
                return containerDimensions => {
                    return containerDimensions.height <= value;
                };
            }
        }

        return () => {
            console.log("This condition was not processed properly, returning false.", condition);

            return false;
        };
    });

    return andCondition.bind(this, conditionFunctions);
}

function andCondition(conditionFunctions, containerDimensions) {
    let conditionFunctionsLength = conditionFunctions.length;
    for (let i = 0; i < conditionFunctionsLength; i++) {
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
    let config = Object.assign({}, origConfig);

    config.values.forEach(valueData => {
        valueData.conditionFunction = getFunctionFromConditions(valueData.conditions);
    });

    config.queries.forEach(queryData => {
        queryData.conditionFunction = getFunctionFromConditions(queryData.conditions);
    });

    return config;
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_Container__ = __webpack_require__(1);


const config = __webpack_require__(0);

let containers = [];
$(config.selector).each(function () {
    containers.push(new __WEBPACK_IMPORTED_MODULE_0__src_Container__["a" /* default */](this, Object.assign({}, config)));
});

$(window).on('resize', () => {
    containers.forEach(container => {
        container.adjust();
    });
});

/***/ })
/******/ ]);
//# sourceMappingURL=scripts.dist.js.map