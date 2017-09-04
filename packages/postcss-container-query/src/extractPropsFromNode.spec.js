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
      new RuleNode(".Container")
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
      "font-size": `50rh`,
      "line-height": `100rw`
    }
  });
});

test("should extract all container unit styles", () => {
  expect(extractPropsFromNode(new RuleNode(".Container"), true)).toEqual({});

  expect(
    extractPropsFromNode(
      new RuleNode(".Container")
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
      "font-size": `5rmin`,
      "line-height": `42rmax`
    }
  });
});

test("should throw if with / height are using the wrong container units", () => {
  expect(() => {
    extractPropsFromNode(
      new RuleNode(".Container")
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
      new RuleNode(".Container")
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
      new RuleNode(".Container")
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
      new RuleNode(".Container")
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
      new RuleNode(".Container")
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
      new RuleNode(".Container")
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
  const node = new RuleNode(".Container")
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

test("should handle css custom properties", () => {
  const node = new RuleNode(".Container")
    .addDeclaration("--rw", "1rw")
    .addDeclaration("--rh", "1rh")
    .addDeclaration("--rmin", "1rmin")
    .addDeclaration("--rmax", "1rmax")
    .addDeclaration("--r-unit", "1rh");

  const props = extractPropsFromNode(node);

  expect(props).toEqual({
    values: {
      "--rw": "1rw",
      "--rh": "1rh",
      "--rmin": "1rmin",
      "--rmax": "1rmax",
      "--r-unit": "1rh"
    }
  });
});
