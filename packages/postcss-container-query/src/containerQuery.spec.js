import postcss from "postcss";
import {
  WIDTH_UNIT,
  HEIGHT_UNIT,
  DEFINE_CONTAINER_NAME
} from "../../common/src/constants";
import containerQuery from "./containerQuery";
import Root from "../__mocks__/Root";
import Node from "../__mocks__/Node";
import RuleNode from "../__mocks__/RuleNode";
jest.mock("./saveJSON");

test("should use the default json saving function if none was supplied", () => {
  const saveJSON = require("./saveJSON").default;

  const pluginInstance = containerQuery();

  pluginInstance(new Root());

  expect(saveJSON).toHaveBeenCalledTimes(1);
});

test("missing container declaration", () => {
  const pluginInstance = containerQuery();

  expect(() => {
    pluginInstance(new Root().addContainerQuery("(orientation: landscape)"));
  }).toThrowError(
    `Missing @${DEFINE_CONTAINER_NAME} declaration before the processed node.`
  );
});

test("should ignore unrecognised at-rules, like @keyframes", done => {
  const pluginInstance = containerQuery({
    singleContainer: false,
    getJSON: (path, json) => {
      expect(json).toEqual({
        ".Container": {
          selector: ".Container",
          queries: [
            {
              elements: [
                {
                  selector: ".Container",
                  values: {
                    lineHeight: `3${HEIGHT_UNIT}`,
                    fontSize: `1${HEIGHT_UNIT}`,
                    marginLeft: `2${WIDTH_UNIT}`
                  }
                },
                {
                  selector: ".Container__element",
                  values: {
                    fontSize: `1${WIDTH_UNIT}`,
                    lineHeight: `2${WIDTH_UNIT}`
                  }
                }
              ]
            },
            {
              conditions: [[["orientation", ":", "landscape"]]],
              elements: [
                {
                  selector: ".Container",
                  styles: { fontSize: "24px" }
                }
              ]
            }
          ]
        }
      });
      done();
    }
  });

  pluginInstance(
    new Root()
      .addNode(
        new RuleNode(".unrelated-class").addDeclaration("color", "black")
      )
      .addNode(
        new RuleNode(".Container")
          .addDeclaration("line-height", `2${HEIGHT_UNIT}`)
          .addContainerDefinition()
          .addDeclaration("border", "none")
      )
      .addNode(
        // This should be noticed, and processed as expected
        new RuleNode(".Container").addDeclaration(
          "font-size",
          `1${HEIGHT_UNIT}`
        )
      )
      .addNode(
        new Node({
          type: "atrule",
          name: "keyframes",
          params: "Expand"
        })
          .addNode(new RuleNode("0%").addDeclaration("opacity", "0%"))
          .addNode(new RuleNode("100%").addDeclaration("opacity", "1000%"))
      )
      .addNode(
        new Node({
          type: "atrule",
          name: "container",
          params: "(orientation: landscape)"
        }).addNode(
          new RuleNode(".Container").addDeclaration("font-size", "24px")
        )
      )
      // Should ignore empty container query
      .addNode(
        new Node({
          type: "atrule",
          name: "container",
          params: "(orientation: portrait)"
        }).addNode(new RuleNode(".Container"))
      )
      // should process container values even after container queries
      .addNode(
        new RuleNode(".Container")
          .addDeclaration("line-height", `3${HEIGHT_UNIT}`)
          .addDeclaration("margin-left", `2${WIDTH_UNIT}`)
      )
      // should process default elements using values
      .addNode(
        new RuleNode(".Container__element").addDeclaration(
          "font-size",
          `1${WIDTH_UNIT}`
        )
      )
      // This should be overriden by the following node
      .addNode(
        new RuleNode(".Container__element").addDeclaration(
          "line-height",
          `1${WIDTH_UNIT}`
        )
      )
      .addNode(
        new RuleNode(".Container__element").addDeclaration(
          "line-height",
          `2${WIDTH_UNIT}`
        )
      )
  );
});

test("proper json and css output", () => {
  let containersJSON = null;

  return postcss([
    containerQuery({
      singleContainer: false,
      getJSON: (cssPath, json) => (containersJSON = json)
    })
  ])
    .process(
      `
                .Container {
                    @${DEFINE_CONTAINER_NAME};
                    border: none;
                    font-size: 50${HEIGHT_UNIT};
                    /* Ignore this */
                    line-height: 100${HEIGHT_UNIT};
                }

                @container (height >= 100px) and (width >= 100px) {
                    .Container {
                        font-size: 70${HEIGHT_UNIT};
                    }
                }

                @container (height >= 100px) {
                    .Container {
                        background: none;
                    }
                    /* Ignore this */
                }

                @container (height >= 100px) and (width >= 100px), (aspect-ratio > 3.5) {
                    .Container {
                        background: #000;
                    }
                }

                /* Ignore this */

                .Container2 {
                    @${DEFINE_CONTAINER_NAME}
                    font-size: 10px;
                    border: 1px solid;
                }

                .Container2__element {
                    width: 50${WIDTH_UNIT};
                    height: 50${HEIGHT_UNIT};
                    background: green;
                }

                @container (orientation: portrait) {
                    .Container2 {
                        font-size: 70${HEIGHT_UNIT};
                    }

                    .Container2__element {
                        width: 75${WIDTH_UNIT};
                        height: 75${HEIGHT_UNIT};
                        background: red;
                    }
                }
            `,
      { from: "src/app.css", to: "dest/app.css" }
    )
    .then(result => {
      expect(result.css).toEqual(
        `
                .Container {
                    border: none;
                    /* Ignore this */
                }

                /* Ignore this */

                .Container2 {
                    border: 1px solid;
                }

                .Container2__element {
                    background: green;
                }
            `
      );

      expect(typeof containersJSON[".Container"]).toBe("object");
      expect(containersJSON[".Container"]).toEqual({
        selector: ".Container",
        queries: [
          {
            elements: [
              {
                selector: ".Container",
                values: {
                  fontSize: `50${HEIGHT_UNIT}`,
                  lineHeight: `100${HEIGHT_UNIT}`
                }
              }
            ]
          },
          {
            conditions: [[["height", ">=", 100], ["width", ">=", 100]]],
            elements: [
              {
                selector: ".Container",
                values: {
                  fontSize: `70${HEIGHT_UNIT}`
                }
              }
            ]
          },
          {
            conditions: [[["height", ">=", 100]]],
            elements: [
              {
                selector: ".Container",
                styles: {
                  background: "none"
                }
              }
            ]
          },
          {
            conditions: [
              [["height", ">=", 100], ["width", ">=", 100]],
              [["aspect-ratio", ">", 3.5]]
            ],
            elements: [
              {
                selector: ".Container",
                styles: {
                  background: "#000"
                }
              }
            ]
          }
        ]
      });

      expect(typeof containersJSON[".Container2"]).toBe("object");
      expect(containersJSON[".Container2"]).toEqual({
        selector: ".Container2",
        queries: [
          {
            elements: [
              {
                selector: ".Container2__element",
                values: {
                  width: `50${WIDTH_UNIT}`,
                  height: `50${HEIGHT_UNIT}`
                }
              }
            ]
          },
          {
            conditions: [[["orientation", ":", "portrait"]]],
            elements: [
              {
                selector: ".Container2",
                values: {
                  fontSize: `70${HEIGHT_UNIT}`
                }
              },
              {
                selector: ".Container2__element",
                styles: {
                  background: "red"
                },
                values: {
                  width: `75${WIDTH_UNIT}`,
                  height: `75${HEIGHT_UNIT}`
                }
              }
            ]
          }
        ]
      });
    });
});

test("should auto-detect the container by default", done => {
  const pluginInstance = containerQuery({
    getJSON: (path, json) => {
      expect(json).toEqual({
        selector: ".Container",
        queries: [
          {
            elements: [
              {
                selector: ".Container",
                values: {
                  lineHeight: `3${HEIGHT_UNIT}`,
                  fontSize: `2${HEIGHT_UNIT}`
                }
              }
            ]
          }
        ]
      });
      done();
    }
  });

  pluginInstance(
    new Root()
      .addNode(
        new RuleNode(".Container")
          .addDeclaration("line-height", `3${HEIGHT_UNIT}`)
          .addDeclaration("border", "none")
      )
      .addNode(
        new RuleNode(".Container")
          .addContainerDefinition()
          .addDeclaration("font-size", `2${HEIGHT_UNIT}`)
      )
  );
});

test("should throw in non singleContainer mode for defining a different container", () => {
  const pluginInstance = containerQuery();

  expect(() => {
    pluginInstance(
      new Root()
        .addNode(
          new RuleNode(".Container")
            .addDeclaration("line-height", `3${HEIGHT_UNIT}`)
            .addDeclaration("border", "none")
        )
        .addNode(
          new RuleNode(".AnotherContainer")
            .addContainerDefinition()
            .addDeclaration("font-size", `2${HEIGHT_UNIT}`)
        )
    );
  }).toThrow(
    `${DEFINE_CONTAINER_NAME} declaration detected in singleContainer mode. Tried to override ".Container" with ".AnotherContainer".`
  );
});

test("should process containers without queries", () => {
  // @todo notice and process values after a container was defined
});

test("should throw if container units were used without a preceding container declaration", () => {
  // @todo
});

test("should throw if container rule in container query uses container units with prohibited props", () => {
  // @todo
});
