import Node from "./Node";

export default class RuleNode extends Node {
  constructor(selector) {
    super({
      type: "rule",
      selector
    });
  }
}
