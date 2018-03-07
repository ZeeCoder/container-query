import hasContainerDefinition from "./hasContainerDefinition";
import RuleNode from "../__mocks__/RuleNode";

test("Container definition should be detected anywhere inside the rule", () => {
  const ruleNode = new RuleNode(".container")
    .addAtRule("something")
    .addDeclaration()
    .addDeclaration()
    .addComment()
    .addDeclaration()
    .addContainerDefinition()
    .addDeclaration();

  expect(hasContainerDefinition(ruleNode)).toBe(true);
});

test("Return null if no container definition was found", () => {
  const ruleNode = new RuleNode(".container")
    .addDeclaration()
    .addAtRule("something")
    .addDeclaration();

  expect(hasContainerDefinition(ruleNode)).toBe(false);
});

test("should be able to keep container-definition when detected", () => {
  const ruleNode = new RuleNode(".container")
    .addDeclaration()
    .addContainerDefinition()
    .addDeclaration();

  expect(hasContainerDefinition(ruleNode, false)).toBe(true);
  expect(ruleNode.nodes.length).toBe(3);
  expect(ruleNode.nodes[0].type).toBe("decl");
  expect(ruleNode.nodes[1].type).toBe("atrule");
  expect(ruleNode.nodes[1].name).toBe("define-container");
  expect(ruleNode.nodes[2].type).toBe("decl");
});

test("should handle empty node", () => {
  const ruleNode = new RuleNode(".Container");
  delete ruleNode.nodes;

  expect(hasContainerDefinition(ruleNode, false)).toBe(false);
});
