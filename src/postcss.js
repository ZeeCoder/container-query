const postcss = require('postcss');
const trim = require('lodash.trim');
const camelCase = require('lodash.camelCase');

const unit_constants = require('../lib/unit_constants');
const HEIGHT_UNIT = unit_constants.HEIGHT_UNIT;
const WIDTH_UNIT = unit_constants.WIDTH_UNIT;

/**
 * @param ruleNode
 *
 * @returns {string|null}
 */
function detectContainerDefinition (ruleNode) {
    let container = null;

    const nodesLength = ruleNode.nodes.length;
    for (let i = 0; i < nodesLength; i++) {
        if (
            ruleNode.nodes[i].type === 'atrule' &&
            ruleNode.nodes[i].name === 'define-container'
        ) {
            container = ruleNode.selector;
            break;
        }
    }

    return container;
}

/**
 * @param {String} value
 *
 * @returns {boolean}
 */
function isValueUsingContainerUnits (value) {
    return (
        value.indexOf(HEIGHT_UNIT) !== -1 ||
        value.indexOf(WIDTH_UNIT) !== -1
    );
}

/**
 * Creates a styles object that contains only css declarations that use
 * container units.
 */
function extractContainerUnitStylesFromRule (ruleNode, isContainer) {
    const styles = {};

    ruleNode.nodes.forEach((node) => {
        if (
            node.type !== 'decl' ||
            !isValueUsingContainerUnits(node.value)
        ) {
            return;
        }

        if (
            isContainer &&
            [ 'width', 'height' ].indexOf(node.prop) !== -1
        ) {
            // @todo more helpful message here
            throw new Error('A container cannot use container units for its width and/or height properties.');
        }

        styles[camelCase(node.prop)] = node.value;
    });

    return styles;
}

function addStylesToDefaultQuery (defaultElementRef, styles, keepValues = false) {
    for (let prop in styles) {
        if (typeof defaultElementRef.styles[prop] !== 'undefined') {
            continue;
        }

        defaultElementRef.styles[prop] = keepValues ? styles[prop] : '';
    }
}

function getConditionsFromQueryParams (params) {
    let conditionArr = params.match(/\(([^\)]*)\)/g);
    return conditionArr.map((condition) => {
        let conditionArr = trim(condition, '()');

        conditionArr = conditionArr.match(/([a-z]*)([ :><=]*)([a-z0-9]*)/i);
        conditionArr.shift();

        conditionArr = conditionArr.map(trim);

        return conditionArr;
    });
}

function getStylesObjectFromNodes(nodes) {
    const styles = {};

    nodes.forEach((node) => {
        if (node.type !== 'decl') {
            return;
        }

        styles[camelCase(node.prop)] = node.value;
    });

    return styles;
}

function isEmptyObject (obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
}

/**
 * @type {{ JSONSavePath: string }}
 */
module.exports = postcss.plugin('container-query', function ContainerQuery(options) {
    return function (root) {
        options = options || {};

        let containers = {};
        let currentContainerSelector = null;
        let currentDefaultQuery = null;
        let currentDefaultQueryMap = null;

        function getElementRefBySelector (selector) {
            if (typeof currentDefaultQueryMap[selector] === 'undefined') {
                let elementRef = {
                    selector: selector,
                    styles: {},
                };

                currentDefaultQuery.elements.push(elementRef);
                currentDefaultQueryMap[selector] = elementRef;
            }

            return currentDefaultQueryMap[selector];
        }

        function flushCurrentContainerData (newContainer = null) {
            if (currentContainerSelector !== null) {
                containers[currentContainerSelector].queries.unshift(currentDefaultQuery);
            }
            if (newContainer !== null) {
                containers[newContainer] = {
                    selector: newContainer,
                    queries: [],
                };
            }
            currentDefaultQuery = { elements: [] };
            currentDefaultQueryMap = {};

            currentContainerSelector = newContainer;
        }

        root.walk((node) => {
            if (node.type === 'rule') {
                // Check if there's a @define-container declaration in the rule
                let newContainer = detectContainerDefinition(node);
                if (newContainer !== null) {
                    flushCurrentContainerData(newContainer);
                }

                // Process potential container unit usages to the default query
                addStylesToDefaultQuery(
                    getElementRefBySelector(node.selector),
                    extractContainerUnitStylesFromRule(node, newContainer !== null),
                    true
                );
            } else if (node.type === 'atrule' && node.name === 'container') {
                let query = {
                    condition: getConditionsFromQueryParams(node.params),
                    elements: [],
                };

                node.nodes.forEach((elementRule) => {
                    if (elementRule.type !== 'rule') {
                        return;
                    }

                    // @todo check here if the "element" is the container itself, and then don't allow width / height container units
                    let element = {
                        selector: elementRule.selector,
                        styles: getStylesObjectFromNodes(elementRule.nodes),
                    };

                    if (!isEmptyObject(element.styles)) {
                        addStylesToDefaultQuery(
                            getElementRefBySelector(elementRule.selector),
                            element.styles
                        );

                        query.elements.push(element);
                    }
                });

                if (query.elements.length > 0) {
                    containers[currentContainerSelector].queries.push(query);
                }
            }
        });

        flushCurrentContainerData();

        options.getJSON(containers);
    };

});
