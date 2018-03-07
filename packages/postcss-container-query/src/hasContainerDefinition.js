// @flow
import type { Node } from "../flow/types";

/**
 * Checks whether a `@define-container` declaration is present or not.
 */
export default function hasContainerDefinition(
  ruleNode: Node,
  removeDefinition: boolean = true
): boolean {
  if (!ruleNode.nodes) {
    return false;
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

      return true;
    }
  }

  return false;
}
