import extractPropsFromNode from "./extractPropsFromNode";
import Node from "../../common/__mocks__/Node";
import RuleNode from "../../common/__mocks__/RuleNode";
import {
  HEIGHT_UNIT,
  WIDTH_UNIT,
  MIN_UNIT,
  MAX_UNIT,
  DEFINE_CONTAINER_NAME
} from "../../common/src/constants";

test("should only accept rule nodes", () => {
  expect(() => {
    extractPropsFromNode({});
  }).toThrowError(/^`ruleNode` must be of type "rule".$/);

  expect(
    extractPropsFromNode({
      type: "rule",
      nodes: null
    })
  ).toEqual({});
});

test("should extract all styles", () => {
  expect(
    extractPropsFromNode(
      new RuleNode(".container")
        .addDeclaration("height", "42px")
        .addDeclaration("width", "42px")
        .addDeclaration("font-size", `50${HEIGHT_UNIT}`)
        .addDeclaration("line-height", `100${WIDTH_UNIT}`)
        .addDeclaration("border", "none")
    )
  ).toEqual({
    styles: {
      height: "42px",
      width: "42px",
      border: "none"
    },
    values: {
      fontSize: `50${HEIGHT_UNIT}`,
      lineHeight: `100${WIDTH_UNIT}`
    }
  });
});

test("should extract all container unit styles", () => {
  expect(extractPropsFromNode(new RuleNode(".container"), true)).toEqual({});

  expect(
    extractPropsFromNode(
      new RuleNode(".container")
        .addContainerDefinition()
        .addDeclaration("width", "42px")
        .addDeclaration("height", `150${WIDTH_UNIT}`)
        .addDeclaration("font-size", `5${MIN_UNIT}`)
        .addDeclaration("line-height", `42${MAX_UNIT}`)
        .addDeclaration("border", "none"),
      {
        isContainer: true,
        onlyContainerUnits: true
      }
    )
  ).toEqual({
    values: {
      height: `150${WIDTH_UNIT}`,
      fontSize: `5${MIN_UNIT}`,
      lineHeight: `42${MAX_UNIT}`
    }
  });
});

test("should throw if with / height are using the wrong container units", () => {
  expect(() => {
    extractPropsFromNode(
      new RuleNode(".container")
        .addContainerDefinition()
        .addDeclaration("width", `42${MIN_UNIT}px`),
      {
        isContainer: true,
        onlyContainerUnits: true
      }
    );
  }).toThrow(
    `Width and height properties on containers cannot use ${MIN_UNIT} or ${MAX_UNIT} units.`
  );

  expect(() => {
    extractPropsFromNode(
      new RuleNode(".container")
        .addContainerDefinition()
        .addDeclaration("height", `42${MIN_UNIT}px`),
      {
        isContainer: true,
        onlyContainerUnits: true
      }
    );
  }).toThrow(
    `Width and height properties on containers cannot use ${MIN_UNIT} or ${MAX_UNIT} units.`
  );

  expect(() => {
    extractPropsFromNode(
      new RuleNode(".container")
        .addContainerDefinition()
        .addDeclaration("width", `42${MAX_UNIT}px`),
      {
        isContainer: true,
        onlyContainerUnits: true
      }
    );
  }).toThrow(
    `Width and height properties on containers cannot use ${MIN_UNIT} or ${MAX_UNIT} units.`
  );

  expect(() => {
    extractPropsFromNode(
      new RuleNode(".container")
        .addContainerDefinition()
        .addDeclaration("height", `42${MAX_UNIT}px`),
      {
        isContainer: true,
        onlyContainerUnits: true
      }
    );
  }).toThrow(
    `Width and height properties on containers cannot use ${MIN_UNIT} or ${MAX_UNIT} units.`
  );

  expect(() => {
    extractPropsFromNode(
      new RuleNode(".container")
        .addContainerDefinition()
        .addDeclaration("height", `42${HEIGHT_UNIT}`),
      {
        isContainer: true,
        onlyContainerUnits: true
      }
    );
  }).toThrow(`Containers cannot use ${HEIGHT_UNIT} for the height property.`);

  expect(() => {
    extractPropsFromNode(
      new RuleNode(".container")
        .addContainerDefinition()
        .addDeclaration("width", `42${WIDTH_UNIT}`),
      {
        isContainer: true,
        onlyContainerUnits: true
      }
    );
  }).toThrow(`Containers cannot use ${WIDTH_UNIT} for the width property.`);
});

test("should strip container units", () => {
  const node = new RuleNode(".container")
    .addDeclaration("border", "none")
    .addDeclaration("margin-left", `2${WIDTH_UNIT}`)
    .addDeclaration("font-size", "12px")
    .addDeclaration("line-height", `2${WIDTH_UNIT}`);

  extractPropsFromNode(node, {
    onlyContainerUnits: true,
    stripContainerUnits: true
  });

  expect(node.nodes.length).toBe(2);
  expect(node.nodes[0].prop).toBe("border");
  expect(node.nodes[1].prop).toBe("font-size");
});
