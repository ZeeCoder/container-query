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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = {
	"selector": ".container",
	"queries": [
		{
			"conditions": [
				"width > 100px",
				"height > 100px"
			],
			"elements": [
				{
					"selector": ".avatar__image",
					"styles": {
						"background": "#000"
					}
				}
			]
		},
		{
			"conditions": [
				"width > 100px"
			],
			"elements": [
				{
					"selector": ".avatar__username",
					"styles": {
						"display": "block"
					}
				}
			]
		}
	],
	"values": [
		{
			"elements": [
				{
					"selector": ".container__title",
					"values": {
						"fontSize": [
							0.2,
							"ch"
						],
						"lineHeight": [
							1,
							"ch"
						]
					}
				},
				{
					"selector": ".container__nonexistent",
					"values": {
						"fontSize": [
							0.05,
							"ch"
						]
					}
				}
			]
		},
		{
			"conditions": [
				"width > 100px",
				"height > 100px"
			],
			"elements": [
				{
					"selector": ".avatar__image",
					"values": {
						"width": "4cw",
						"height": "4ch"
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__enhanceConfig__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__adjustContainer__ = __webpack_require__(4);



// function enhance ($container, origConfig) {
//     let config = Object.assign({}, origConfig);
//
//     config.index = index++;
//
//     return config;
//
//     config.values.forEach((valueData, index, array) => {
//         if (typeof valueData.conditions !== 'undefined') {
//             return;
//         }
//
//         valueData.elements.forEach((elementData, index, array) => {
//             let $element = $container.find(elementData.selector);
//             if (!$element.length) {
//                 array.splice(index, 1);
//
//                 return;
//             }
//
//             elementData.$element = $element;
//         });
//     });
//
//     return config;
// }

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
/* harmony export (immutable) */ __webpack_exports__["a"] = enhanceConfig;
function enhanceConfig($container, origConfig) {
    let config = Object.assign({}, origConfig);

    return config;
}

/***/ }),
/* 3 */
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

/***/ }),
/* 4 */
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

function adjustContainer($container, config) {
    let containerDimensions = {
        width: $container.width(),
        height: $container.height()
    };

    console.log('=== Adjusting');
    console.log($container[0]);
    console.log(config);
    console.log(containerDimensions);

    config.values.forEach(currentValue => {
        if (typeof currentValue.conditions !== 'undefined') {
            return;
        }

        currentValue.elements.forEach(elementData => {
            let adjustedValues = adjustValuesByContainerDimensions(containerDimensions, elementData.values);

            $container.find(elementData.selector).css(adjustedValues);
        });
    });
}

/***/ })
/******/ ]);
//# sourceMappingURL=scripts.dist.js.map