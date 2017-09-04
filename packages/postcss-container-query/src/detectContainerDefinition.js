// @flow
import type { Node } from "../flow/types";

/**
 * Returns the container's selector, or null if no @define-container was found.
 */
export default function detectContainerDefinition(
  ruleNode: Node,
  removeDefinition: boolean = true
): string | null {
  let container = null;

  const nodesLength = ruleNode.nodes.length;
  let i = 0;
  for (i; i < nodesLength; i++) {
    if (
      ruleNode.nodes[i].type === "atrule" &&
      ruleNode.nodes[i].name === "define-container"
    ) {
      container = ruleNode.selector;
      break;
    }
  }

  if (removeDefinition) {
    ruleNode.nodes.splice(i, 1);
  }

  return container;
}
