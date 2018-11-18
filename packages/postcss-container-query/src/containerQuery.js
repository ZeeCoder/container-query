import postcss from "postcss";
import hasContainerDefinition from "./hasContainerDefinition";
import extractPropsFromNode from "./extractPropsFromNode";
import MetaBuilder from "@zeecoder/container-query-meta-builder";

const plugin = "postcss-container-query";

const isContainerQuery = node =>
  node.type === "atrule" && node.name === "container";

const walkRules = (root, opts, ruleHandler) => {
  const containerSelectors = [];

  const hasContainerSelector = selector =>
    containerSelectors.indexOf(selector) !== -1;

  const handleRule = (rule, parentCQAtRule) => {
    const isContainer =
      hasContainerDefinition(rule) ||
      hasContainerSelector(rule.selector) ||
      rule.selector === ":self" ||
      (opts.singleContainer && containerSelectors.length === 0);

    const data = { rule, isContainer };

    if (isContainer && !hasContainerSelector(rule.selector)) {
      containerSelectors.push(rule.selector);
    }

    if (parentCQAtRule) {
      data.parentCQAtRule = parentCQAtRule;
    }

    ruleHandler(data);
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
 *   [singleContainer]: boolean,
 *   [exportMetaInCss]: boolean|string,
 * }} options
 */
function containerQuery(options = {}) {
  const singleContainer = options.singleContainer !== false;
  const exportMetaInCss =
    typeof options.exportMetaInCss !== "undefined"
      ? options.exportMetaInCss
      : "meta";

  return function(root, result) {
    const containers = {};
    let currentContainerSelector = null;

    walkRules(
      root,
      { singleContainer },
      ({ rule, isContainer, parentCQAtRule }) => {
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
        if (!props.values && (!parentCQAtRule || !props.styles)) {
          return;
        }

        if (!currentContainerSelector) {
          throw rule.error(
            `Missing @define-container declaration before the processed node.`
          );
        }

        const builder = containers[currentContainerSelector];

        builder.resetQuery().resetDescendant();
        if (parentCQAtRule) {
          builder.setQuery(parentCQAtRule.params);
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

        if (parentCQAtRule && props.styles) {
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

    const meta = !singleContainer
      ? containers
      : currentContainerSelector
      ? containers[currentContainerSelector]
      : {};

    const filepath = root.source.input.file;

    result.messages.push({
      type: "metadata",
      plugin,
      meta,
      filepath
    });

    // The following is picked up by css-loader, therefore making importing json
    // files obsolete
    if (exportMetaInCss) {
      root.append(
        `\n:export { ${exportMetaInCss}: '${JSON.stringify(meta)}' }`
      );
    }
  };
}

export default postcss.plugin(plugin, containerQuery);
