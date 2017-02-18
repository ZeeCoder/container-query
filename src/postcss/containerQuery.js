import postcss from 'postcss';
import detectContainerDefinition from './detectContainerDefinition';
import getConditionsFromQueryParams from './getConditionsFromQueryParams';
import getStylesObjectFromNode from './getStylesObjectFromNode';
import isEmptyObject from './isEmptyObject';
import { DEFINE_CONTAINER_NAME } from "../constants";

function addStylesToDefaultQuery (defaultElementRef, styles, keepValues = false) {
    for (let prop in styles) {
        if (typeof defaultElementRef.styles[prop] !== 'undefined') {
            continue;
        }

        defaultElementRef.styles[prop] = keepValues ? styles[prop] : '';
    }
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

        root.walk((/** Node */ node) => {
            if (node.type === 'rule') {
                // Check if there's a new container declared in the rule node
                let newContainer = detectContainerDefinition(node);
                if (newContainer !== null) {
                    flushCurrentContainerData(newContainer);
                }

                if (currentContainerSelector !== null) {
                    // Process potential container unit usages to the default query
                    addStylesToDefaultQuery(
                        getElementRefBySelector(node.selector),
                        getStylesObjectFromNode(node, true),
                        true
                    );
                }
            } else if (node.type === 'atrule' && node.name === 'container') {
                if (currentContainerSelector === null) {
                    // @todo be more specific
                    throw new Error(`A @container query was found, without preceding @${DEFINE_CONTAINER_NAME} declaration.`);
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
                            styles: getStylesObjectFromNode(elementRule),
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
