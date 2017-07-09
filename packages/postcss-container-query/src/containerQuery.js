import postcss from "postcss";
import detectContainerDefinition from "./detectContainerDefinition";
import getConditionsFromQueryParams from "./getConditionsFromQueryParams";
import extractPropsFromNode from "./extractPropsFromNode";
import isEmptyObject from "./isEmptyObject";
import { DEFINE_CONTAINER_NAME } from "../../common/src/constants";
import saveJSON from "./saveJSON";

/**
 * @todo comments
 * @param {Node} node
 */
function shouldProcessNode(node) {
    return (
        (node.type === "rule" && node.parent.type === "root") ||
        (node.type === "atrule" && node.name === "container")
    );
}

/**
 * Extracts container units with their props from an object.
 *
 * @param  {Node}  node
 * @param  {boolean} isContainer
 * @return {Object}
 */
function extractContainerUnits(node, isContainer = false) {
    return (
        extractPropsFromNode(node, {
            isContainer: isContainer,
            onlyContainerUnits: true,
            stripContainerUnits: true
        }).values || null
    );
}

/**
 * @todo refactor this to use a builder, which'll make testing easier too
 * @param {{ getJSON: function }} options
 */
function containerQuery(options = {}) {
    const getJSON = options.getJSON || saveJSON;

    return function(root) {
        let containers = {};
        let currentContainerSelector = null;
        let currentDefaultQuery = null;
        let currentDefaultQueryMap = null;

        const checkForPrecedingContainerDeclaration = node => {
            if (currentContainerSelector === null) {
                throw node.error(
                    `A @container query was found, without a preceding @${DEFINE_CONTAINER_NAME} declaration.`
                );
            }
        };

        /**
         * Any node under "root" could potentially have container units in them.
         * Add such nodes to the default query. (One without conditions which
         * means it'll always apply)
         *
         * @return {Node}
         */
        const processRuleNodeForDefaultQuery = node => {
            const isContainer = isContainerCheck(node);

            // First check if container unites are used or not
            const containerUnits = extractContainerUnits(node, isContainer);
            if (containerUnits === null) {
                return;
            }

            // Check if we have a default query
            if (
                !containers[currentContainerSelector].queries[0] ||
                containers[currentContainerSelector].queries[0].conditions
            ) {
                // Create the default query
                containers[currentContainerSelector].queries.unshift({
                    elements: []
                });
            }

            // The query at the 0 index is the default query, without conditions
            // Fetch a previously added element data based on the selector, or
            // create a new one
            let elementData = null;
            let elementslength =
                containers[currentContainerSelector].queries[0].elements.length;
            for (let i = 0; i < elementslength; i++) {
                if (
                    containers[currentContainerSelector].queries[0].elements[i]
                        .selector === node.selector
                ) {
                    elementData =
                        containers[currentContainerSelector].queries[0]
                            .elements[i];
                    break;
                }
            }

            if (elementData === null) {
                elementData = {
                    selector: node.selector,
                    values: {}
                };

                containers[currentContainerSelector].queries[0].elements.push(
                    elementData
                );
            }

            // Add the extracted container units
            Object.assign(elementData.values, containerUnits);
        };

        /**
         * Processing a rule node under a container query.
         * @param  {Node} node
         * @returns {null|Object}
         */
        const processRuleNode = node => {
            const isContainer = isContainerCheck(node);
            // @todo instead of creating a new elementData, check if the same selector was already processed under this container query
            const elementData = {
                selector: node.selector
            };

            const props = extractPropsFromNode(node, { isContainer });

            if (!props.styles && !props.values) {
                return null;
            }

            Object.assign(elementData, props);

            return elementData;
        };

        /**
         * Returns true if the node's selector is the same as the currently
         * processed container's.
         *
         * @param  {Node}  node
         * @return {boolean}
         */
        const isContainerCheck = node => {
            return currentContainerSelector === node.selector;
        };

        root.walk((/** Node */ node) => {
            if (!shouldProcessNode(node)) {
                return;
            }

            if (node.type === "rule") {
                // Check if there's a new container declared in the rule node
                const newContainerSelector = detectContainerDefinition(node);
                if (newContainerSelector !== null) {
                    // @todo initialise new container method
                    currentContainerSelector = newContainerSelector;
                    containers[currentContainerSelector] = {
                        selector: currentContainerSelector,
                        queries: []
                    };
                }

                checkForPrecedingContainerDeclaration(node);

                // Process potential container unit usages to the default query
                processRuleNodeForDefaultQuery(node);
            } else {
                // Process container query
                checkForPrecedingContainerDeclaration(node);

                let query = {
                    conditions: getConditionsFromQueryParams(node.params),
                    elements: []
                };

                node.nodes.forEach(ruleNode => {
                    if (ruleNode.type !== "rule") {
                        return;
                    }

                    const elementData = processRuleNode(ruleNode);
                    if (elementData !== null) {
                        query.elements.push(elementData);
                    }
                });

                if (query.elements.length > 0) {
                    containers[currentContainerSelector].queries.push(query);
                }

                node.remove();
            }
        });

        getJSON(root.source.input.file, containers);
    };
}

export default postcss.plugin("postcss-container-query", containerQuery);
