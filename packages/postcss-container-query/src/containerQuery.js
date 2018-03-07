import postcss from "postcss";
import hasContainerDefinition from "./hasContainerDefinition";
import extractPropsFromNode from "./extractPropsFromNode";
import saveJSON from "./saveJSON";
import MetaBuilder from "@zeecoder/container-query-meta-builder";

const isContainerQuery = node =>
  node.type === "atrule" && node.name === "container";

const walkRules = (root, opts, handler) => {
  const containerSelectors = [];

  const hasContainerSelector = selector =>
    containerSelectors.indexOf(selector) !== -1;

  const handleRule = (rule, parentAtRule) => {
    const data = {
      rule,
      isContainer:
        hasContainerDefinition(rule) ||
        hasContainerSelector(rule.selector) ||
        rule.selector === ":self" ||
        (opts.singleContainer && containerSelectors.length === 0)
    };

    if (parentAtRule) {
      data.parentAtRule = parentAtRule;
    }

    if (data.isContainer && !hasContainerSelector(rule.selector)) {
      containerSelectors.push(rule.selector);
    }

    handler(data);
  };

  root.walk(node => {
    if (node.type === "rule") {
      handleRule(node);
    } else if (node.type === "atrule") {
      if (!isContainerQuery(node)) {
        return;
      }

      node.nodes.forEach(childNode => {
        if (childNode.type !== "rule") {
          return;
        }

        handleRule(childNode, node);
      });

      node.remove();
    }
  });
};

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

    walkRules(
      root,
      { singleContainer },
      ({ rule, isContainer, parentAtRule }) => {
        if (
          isContainer &&
          rule.selector !== ":self" &&
          !containers[rule.selector]
        ) {
          const nextContainerSelector = rule.selector;
          if (singleContainer && currentContainerSelector) {
            throw rule.error(
              `define-container declaration detected in singleContainer mode. ` +
                `Tried to override "${currentContainerSelector}" with "${nextContainerSelector}".`
            );
          }

          // Register new container's meta builder
          currentContainerSelector = nextContainerSelector;
          containers[nextContainerSelector] = new MetaBuilder(
            nextContainerSelector
          );
        }

        const props = extractPropsFromNode(rule, {
          isContainer: isContainer,
          stripContainerUnits: true
        });

        // Only proceed if there are container units to be extracted, or if there
        // are styles under a container query at-rule
        if (!props.values && (!parentAtRule || !props.styles)) {
          return;
        }

        if (!currentContainerSelector) {
          throw rule.error(
            `Missing @define-container declaration before the processed node.`
          );
        }

        const builder = containers[currentContainerSelector];

        builder.resetQuery().resetDescendant();
        if (parentAtRule) {
          builder.setQuery(parentAtRule.params);
        }
        if (!isContainer) {
          builder.setDescendant(rule.selector);
        }

        if (props.values) {
          // store values only
          for (let prop in props.values) {
            const value = props.values[prop];
            builder.addStyle({ prop, value });
          }
        }

        if (parentAtRule && props.styles) {
          for (let prop in props.styles) {
            const value = props.styles[prop];
            builder.addStyle({ prop, value });
          }
        }
      }
    );

    // Map builders to metadata
    for (let selector in containers) {
      containers[selector] = containers[selector].build();
    }

    const response = !singleContainer
      ? containers
      : currentContainerSelector ? containers[currentContainerSelector] : {};

    getJSON(root.source.input.file, response);
  };
}

export default postcss.plugin("postcss-container-query", containerQuery);
