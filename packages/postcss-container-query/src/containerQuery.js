import postcss from "postcss";
import detectContainerDefinition from "./detectContainerDefinition";
import extractPropsFromNode from "./extractPropsFromNode";
import saveJSON from "./saveJSON";
import MetaBuilder from "@zeecoder/container-query-meta-builder";

/**
 * Decides if a node should be processed or not.
 * Only processing root-level rules and @container at-rules.
 *
 * @param {Node} node
 * @returns {boolean}
 */
const shouldProcessNode = node =>
  (node.type === "rule" && node.parent.type === "root") ||
  (node.type === "atrule" && node.name === "container");

/**
 * Extracts container units with their props from an object.
 *
 * @param  {Node}  node
 * @param  {boolean} isContainer
 * @return {Object}
 */
const extractContainerUnits = (node, isContainer = false) =>
  extractPropsFromNode(node, {
    isContainer: isContainer,
    onlyContainerUnits: true,
    stripContainerUnits: true
  }).values || null;

/**
 * @param {{
 *   getJSON: function,
 *   singleContainer: boolean,
 * }} options
 */
function containerQuery(options = {}) {
  const getJSON = options.getJSON || saveJSON;
  const singleContainer = options.singleContainer !== false;

  return function(root) {
    const containers = {};
    let currentContainerSelector = null;

    const checkForPrecedingContainerDeclaration = node => {
      if (currentContainerSelector === null) {
        throw node.error(
          `Missing @define-container declaration before the processed node.`
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

      checkForPrecedingContainerDeclaration(node);

      const builder = containers[currentContainerSelector];

      builder.resetDescendant().resetQuery();

      // Only store selectors that are not referring to the container
      if (
        node.selector !== currentContainerSelector &&
        node.selector !== ":self"
      ) {
        builder.setDescendant(node.selector);
      }

      for (let prop in containerUnits) {
        const value = containerUnits[prop];
        builder.addStyle({ prop, value });
      }
    };

    /**
     * Processing a rule node under a container query.
     *
     * @param  {Node} node
     * @param  {string} conditions
     * @returns {null|Object}
     */
    const processRuleNode = (node, conditions) => {
      const isContainer = isContainerCheck(node);

      const props = extractPropsFromNode(node, { isContainer });

      if (!props.styles && !props.values) {
        return null;
      }

      const builder = containers[currentContainerSelector];

      builder.setQuery(conditions).resetDescendant();
      // Only store selectors that are not referring to the container
      if (
        node.selector !== currentContainerSelector &&
        node.selector !== ":self"
      ) {
        builder.setDescendant(node.selector);
      }

      for (let prop in props.styles) {
        const value = props.styles[prop];
        builder.addStyle({ prop, value });
      }
      for (let prop in props.values) {
        const value = props.values[prop];
        builder.addStyle({ prop, value });
      }
    };

    /**
     * Returns true if the node's selector is the same as the currently
     * processed container's.
     *
     * @param  {Node}  node
     * @return {boolean}
     */
    const isContainerCheck = node => currentContainerSelector === node.selector;

    const initialiseContainer = selector => {
      currentContainerSelector = selector;
      // containers[selector] = { selector, queries: [] };
      containers[selector] = new MetaBuilder(selector);
    };

    root.walk((/** Node */ node) => {
      if (!shouldProcessNode(node)) {
        return;
      }

      if (node.type === "rule") {
        // Pick up the first selector as the container selector in singleContainer mode
        if (singleContainer && !currentContainerSelector) {
          initialiseContainer(node.selector);
        }

        // Check if there's a new container declared in the rule node
        const newContainerSelector = detectContainerDefinition(node);
        if (newContainerSelector !== null) {
          // Throw if in singleContainer mode this container is
          // defined with a different selector
          if (singleContainer) {
            if (currentContainerSelector !== newContainerSelector) {
              throw node.error(
                `define-container declaration detected in singleContainer mode. Tried to override "${currentContainerSelector}" with "${newContainerSelector}".`
              );
            }
          } else {
            initialiseContainer(newContainerSelector);
          }
        }

        // Process potential container unit usages to the default query
        processRuleNodeForDefaultQuery(node);
      } else {
        // Process container query
        checkForPrecedingContainerDeclaration(node);

        node.nodes.forEach(ruleNode => {
          if (ruleNode.type !== "rule") {
            return;
          }

          processRuleNode(ruleNode, node.params);
        });

        node.remove();
      }
    });

    // Map builders to metadata
    for (let selector in containers) {
      containers[selector] = containers[selector].build();
    }

    let response = containers;
    if (singleContainer) {
      if (currentContainerSelector) {
        response = containers[currentContainerSelector];
      } else {
        response = {};
      }
    }

    getJSON(root.source.input.file, response);
  };
}

export default postcss.plugin("postcss-container-query", containerQuery);
