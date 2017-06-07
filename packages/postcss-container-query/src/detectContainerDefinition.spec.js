import detectContainerDefinition from "./detectContainerDefinition";
import Node from "../../common/__mocks__/Node";
import { DEFINE_CONTAINER_NAME } from "../../common/src/constants";

test("Container definition should be detected anywhere inside the rule", () => {
    const ruleNode = new Node({
        selector: ".container"
    })
        .addNode(new Node({ type: "atrule", name: "something" }))
        .addNode(new Node({ type: "decl" }))
        .addNode(new Node({ type: "comment" }))
        .addNode(new Node({ type: "decl" }))
        .addNode(new Node({ type: "atrule", name: DEFINE_CONTAINER_NAME }))
        .addNode(new Node({ type: "decl" }));

    expect(detectContainerDefinition(ruleNode)).toBe(".container");
});

test("Return null if no container definition was found", () => {
    const ruleNode = new Node({
        selector: ".container"
    })
        .addNode(new Node({ type: "decl" }))
        .addNode(new Node({ type: "atrule", name: "something" }))
        .addNode(new Node({ type: "decl" }));

    expect(detectContainerDefinition(ruleNode)).toBeNull();
});

test("should be able to keep container-definition when detected", () => {
    const ruleNode = new Node({
        selector: ".container"
    })
        .addNode(new Node({ type: "decl" }))
        .addNode(new Node({ type: "atrule", name: DEFINE_CONTAINER_NAME }))
        .addNode(new Node({ type: "decl" }));

    expect(detectContainerDefinition(ruleNode, false)).toBe(".container");
    expect(ruleNode.nodes.length).toBe(3);
    expect(ruleNode.nodes[0].type).toBe("decl");
    expect(ruleNode.nodes[1].type).toBe("atrule");
    expect(ruleNode.nodes[1].name).toBe(DEFINE_CONTAINER_NAME);
    expect(ruleNode.nodes[2].type).toBe("decl");
});
