import postcss from 'postcss';
import trim from 'lodash.trim';
import camelCase from 'lodash.camelcase';
import { detectContainerDefinition } from './utils';
import {
    HEIGHT_UNIT,
    WIDTH_UNIT,
} from '../unit_constants';

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
function containerQuery (options) {
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

                if (currentContainerSelector !== null) {
                    // Process potential container unit usages to the default query
                    addStylesToDefaultQuery(
                        getElementRefBySelector(node.selector),
                        extractContainerUnitStylesFromRule(node, newContainer !== null),
                        true
                    );
                }
            } else if (node.type === 'atrule' && node.name === 'container') {
                if (currentContainerSelector === null) {
                    // @todo be more specific
                    // throw new Error('A @container query was found, without preceding @define-container declaration.');
                } else {

                    let query = {
                        conditions: getConditionsFromQueryParams(node.params),
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
            }
        });

        flushCurrentContainerData();

        options.getJSON(containers);
    };

}

export default postcss.plugin('postcss-container-query', containerQuery);
