import postcss from "postcss";
import detectContainerDefinition from "./detectContainerDefinition";
import getConditionsFromQueryParams from "./getConditionsFromQueryParams";
import extractPropsFromNode from "./extractPropsFromNode";
import isEmptyObject from "./isEmptyObject";
import { DEFINE_CONTAINER_NAME } from "../../common/src/constants";
import saveJSON from "./saveJSON";

function addStylesToDefaultQuery(
    defaultElementRef,
    styles,
    keepValues = false
) {
    for (let prop in styles) {
        if (typeof defaultElementRef.styles[prop] !== "undefined") {
            continue;
        }

        defaultElementRef.styles[prop] = keepValues ? styles[prop] : "";
    }
}

/**
 * Process only rules having "root", @media or @container as the parent.
 *
 * @param {Node} node
 */
function shouldProcessNode(node) {
    return (
        node.parent.type === "root" ||
        (node.parent.type === "atrule" &&
            ["container", "media"].indexOf(node.parent.name) !== -1)
    );
}

/**
 * @todo refactor a bit to make testing easier
 * @param {{ getJSON: function }} options
 */
function containerQuery(options = {}) {
    const getJSON = options.getJSON || saveJSON;

    return function(root) {
        let containers = {};
        let currentContainerSelector = null;
        let currentDefaultQuery = null;
        let currentDefaultQueryMap = null;

        function getElementRefBySelector(selector) {
            if (typeof currentDefaultQueryMap[selector] === "undefined") {
                let elementRef = {
                    selector: selector,
                    styles: {}
                };

                currentDefaultQuery.elements.push(elementRef);
                currentDefaultQueryMap[selector] = elementRef;
            }

            return currentDefaultQueryMap[selector];
        }

        function flushCurrentContainerData(newContainer = null) {
            // Prepend the default query to the previously processed container
            if (currentContainerSelector !== null) {
                containers[currentContainerSelector].queries.unshift(
                    currentDefaultQuery
                );
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

        root.walk((/** Node */ node) => {
            if (!shouldProcessNode(node)) {
                return;
            }

            if (node.type === "rule") {
                // Check if there's a new container declared in the rule node
                const newContainer = detectContainerDefinition(node);
                if (newContainer !== null) {
                    flushCurrentContainerData(newContainer);
                }

                const isContainer =
                    newContainer !== null ||
                    node.selector === currentContainerSelector;

                if (currentContainerSelector !== null) {
                    // Process potential container unit usages to the default query
                    addStylesToDefaultQuery(
                        getElementRefBySelector(node.selector),
                        extractPropsFromNode(node, {
                            isContainer: isContainer,
                            onlyContainerUnits: true,
                            stripContainerUnits: true
                        }),
                        true
                    );
                }
            } else if (node.type === "atrule" && node.name === "container") {
                if (currentContainerSelector === null) {
                    throw node.error(
                        `A @container query was found, without a preceding @${DEFINE_CONTAINER_NAME} declaration.`
                    );
                }

                let query = {
                    conditions: getConditionsFromQueryParams(node.params),
                    elements: []
                };

                node.nodes.forEach(elementRule => {
                    if (elementRule.type !== "rule") {
                        return;
                    }

                    const isContainer =
                        elementRule.selector === currentContainerSelector;
                    let element = {
                        selector: elementRule.selector
                    };
                    Object.assign(
                        element,
                        extractPropsFromNode(elementRule, { isContainer })
                    );

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

                node.remove();
            }
        });

        flushCurrentContainerData();

        getJSON(root.source.input.file, containers);
    };
}

export default postcss.plugin("postcss-container-query", containerQuery);
