'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _detectContainerDefinition = require('./detectContainerDefinition');

var _detectContainerDefinition2 = _interopRequireDefault(_detectContainerDefinition);

var _getConditionsFromQueryParams = require('./getConditionsFromQueryParams');

var _getConditionsFromQueryParams2 = _interopRequireDefault(_getConditionsFromQueryParams);

var _getStylesObjectFromNode = require('./getStylesObjectFromNode');

var _getStylesObjectFromNode2 = _interopRequireDefault(_getStylesObjectFromNode);

var _isEmptyObject = require('./isEmptyObject');

var _isEmptyObject2 = _interopRequireDefault(_isEmptyObject);

var _constants = require('../constants');

var _removeContainerDefinition = require('./removeContainerDefinition');

var _removeContainerDefinition2 = _interopRequireDefault(_removeContainerDefinition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addStylesToDefaultQuery(defaultElementRef, styles) {
    var keepValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    for (var prop in styles) {
        if (typeof defaultElementRef.styles[prop] !== 'undefined') {
            continue;
        }

        defaultElementRef.styles[prop] = keepValues ? styles[prop] : '';
    }
}

/**
 * @type {{ JSONSavePath: string }}
 */
function containerQuery(options) {
    return function (root) {
        options = options || {};

        var containers = {};
        var currentContainerSelector = null;
        var currentDefaultQuery = null;
        var currentDefaultQueryMap = null;

        function getElementRefBySelector(selector) {
            if (typeof currentDefaultQueryMap[selector] === 'undefined') {
                var elementRef = {
                    selector: selector,
                    styles: {}
                };

                currentDefaultQuery.elements.push(elementRef);
                currentDefaultQueryMap[selector] = elementRef;
            }

            return currentDefaultQueryMap[selector];
        }

        function flushCurrentContainerData() {
            var newContainer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (currentContainerSelector !== null) {
                containers[currentContainerSelector].queries.unshift(currentDefaultQuery);
            }
            if (newContainer !== null) {
                containers[newContainer] = {
                    selector: newContainer,
                    queries: []
                };
            }
            currentDefaultQuery = { elements: [] };
            currentDefaultQueryMap = {};

            currentContainerSelector = newContainer;
        }

        root.walk(function ( /** Node */node) {
            if (node.type === 'rule') {
                // Check if there's a new container declared in the rule node
                var newContainer = (0, _detectContainerDefinition2.default)(node, true);
                if (newContainer !== null) {
                    flushCurrentContainerData(newContainer);
                }

                if (currentContainerSelector !== null) {
                    // Process potential container unit usages to the default query
                    addStylesToDefaultQuery(getElementRefBySelector(node.selector), (0, _getStylesObjectFromNode2.default)(node, true), true);
                }

                (0, _removeContainerDefinition2.default)(node);
            } else if (node.type === 'atrule' && node.name === 'container') {
                if (currentContainerSelector === null) {
                    // @todo be more specific
                    throw new Error('A @container query was found, without preceding @' + _constants.DEFINE_CONTAINER_NAME + ' declaration.');
                } else {

                    var query = {
                        conditions: (0, _getConditionsFromQueryParams2.default)(node.params),
                        elements: []
                    };

                    node.nodes.forEach(function (elementRule) {
                        if (elementRule.type !== 'rule') {
                            return;
                        }

                        // @todo check here if the "element" is the container itself, and then don't allow width / height container units
                        var element = {
                            selector: elementRule.selector,
                            styles: (0, _getStylesObjectFromNode2.default)(elementRule)
                        };

                        if (!(0, _isEmptyObject2.default)(element.styles)) {
                            addStylesToDefaultQuery(getElementRefBySelector(elementRule.selector), element.styles);

                            query.elements.push(element);
                        }
                    });

                    if (query.elements.length > 0) {
                        containers[currentContainerSelector].queries.push(query);
                    }
                }
            }
        });

        flushCurrentContainerData();

        options.getJSON(containers);
    };
}

exports.default = _postcss2.default.plugin('postcss-container-query', containerQuery);