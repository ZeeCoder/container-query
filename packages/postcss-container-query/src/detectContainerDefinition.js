// @flow
import type { Node } from "../flow/types";

/**
 * Returns the container's selector, or null if no @define-container was found.
 *
 * @return {null|string}
 */
export default function detectContainerDefinition(
  ruleNode: Node,
  removeDefinition: boolean = true
): string | null {
  if (!ruleNode.nodes) {
    return null;
  }

  const nodesLength = ruleNode.nodes.length;
  let i = 0;
  for (i; i < nodesLength; i++) {
    if (
      ruleNode.nodes[i].type === "atrule" &&
      ruleNode.nodes[i].name === "define-container"
    ) {
      if (removeDefinition) {
        ruleNode.nodes.splice(i, 1);
      }

      return ruleNode.selector;
    }
  }

  return null;
}
