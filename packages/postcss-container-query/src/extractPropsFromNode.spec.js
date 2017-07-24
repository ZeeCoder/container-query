import extractPropsFromNode from "./extractPropsFromNode";
import RuleNode from "../__mocks__/RuleNode";

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
        .addDeclaration("font-size", `50rh`)
        .addDeclaration("line-height", `100rw`)
        .addDeclaration("border", "none")
    )
  ).toEqual({
    styles: {
      height: "42px",
      width: "42px",
      border: "none"
    },
    values: {
      fontSize: `50rh`,
      lineHeight: `100rw`
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
        .addDeclaration("height", `150rw`)
        .addDeclaration("font-size", `5rmin`)
        .addDeclaration("line-height", `42rmax`)
        .addDeclaration("border", "none"),
      {
        isContainer: true,
        onlyContainerUnits: true
      }
    )
  ).toEqual({
    values: {
      height: `150rw`,
      fontSize: `5rmin`,
      lineHeight: `42rmax`
    }
  });
});

test("should throw if with / height are using the wrong container units", () => {
  expect(() => {
    extractPropsFromNode(
      new RuleNode(".container")
        .addContainerDefinition()
        .addDeclaration("width", `42rminpx`),
      {
        isContainer: true,
        onlyContainerUnits: true
      }
    );
  }).toThrow(
    `Width and height properties on containers cannot use rmin or rmax units.`
  );

  expect(() => {
    extractPropsFromNode(
      new RuleNode(".container")
        .addContainerDefinition()
        .addDeclaration("height", `42rminpx`),
      {
        isContainer: true,
        onlyContainerUnits: true
      }
    );
  }).toThrow(
    `Width and height properties on containers cannot use rmin or rmax units.`
  );

  expect(() => {
    extractPropsFromNode(
      new RuleNode(".container")
        .addContainerDefinition()
        .addDeclaration("width", `42rmaxpx`),
      {
        isContainer: true,
        onlyContainerUnits: true
      }
    );
  }).toThrow(
    `Width and height properties on containers cannot use rmin or rmax units.`
  );

  expect(() => {
    extractPropsFromNode(
      new RuleNode(".container")
        .addContainerDefinition()
        .addDeclaration("height", `42rmaxpx`),
      {
        isContainer: true,
        onlyContainerUnits: true
      }
    );
  }).toThrow(
    `Width and height properties on containers cannot use rmin or rmax units.`
  );

  expect(() => {
    extractPropsFromNode(
      new RuleNode(".container")
        .addContainerDefinition()
        .addDeclaration("height", `42rh`),
      {
        isContainer: true,
        onlyContainerUnits: true
      }
    );
  }).toThrow(`Containers cannot use rh for the height property.`);

  expect(() => {
    extractPropsFromNode(
      new RuleNode(".container")
        .addContainerDefinition()
        .addDeclaration("width", `42rw`),
      {
        isContainer: true,
        onlyContainerUnits: true
      }
    );
  }).toThrow(`Containers cannot use rw for the width property.`);
});

test("should strip container units", () => {
  const node = new RuleNode(".container")
    .addDeclaration("border", "none")
    .addDeclaration("margin-left", `2rw`)
    .addDeclaration("font-size", "12px")
    .addDeclaration("line-height", `2rw`);

  extractPropsFromNode(node, {
    onlyContainerUnits: true,
    stripContainerUnits: true
  });

  expect(node.nodes.length).toBe(2);
  expect(node.nodes[0].prop).toBe("border");
  expect(node.nodes[1].prop).toBe("font-size");
});
