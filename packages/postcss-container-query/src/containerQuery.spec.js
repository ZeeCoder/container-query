import postcss from "postcss";
import {
    WIDTH_UNIT,
    HEIGHT_UNIT,
    DEFINE_CONTAINER_NAME
} from "../../common/src/constants";
import containerQuery from "./containerQuery";
import Root from "../../common/__mocks__/Root";
import Node from "../../common/__mocks__/Node";
import RuleNode from "../../common/__mocks__/RuleNode";
jest.mock("./saveJSON");

// @todo test when an "element" of a @container {} query is actually a container itself, and certain properties should be prohibited

test("should use the default json saving function if none was supplied", () => {
    const saveJSON = require("./saveJSON").default;

    const pluginInstance = containerQuery();

    pluginInstance(new Root());

    expect(saveJSON).toHaveBeenCalledTimes(1);
});

test("missing container declaration", () => {
    const pluginInstance = containerQuery();

    expect(() => {
        pluginInstance(
            new Root().addContainerQuery("(orientation: landscape)")
        );
    }).toThrowError(
        new RegExp(
            `^A @container query was found, without a preceding @${DEFINE_CONTAINER_NAME} declaration.$`
        )
    );
});

test("should ignore unrecognised at-rules, like @keyframes", done => {
    const pluginInstance = containerQuery({
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
                                        lineHeight: `2${HEIGHT_UNIT}`,
                                        fontSize: `1${HEIGHT_UNIT}`
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
                    .addNode(
                        new RuleNode("100%").addDeclaration("opacity", "1000%")
                    )
            )
            .addNode(
                new Node({
                    type: "atrule",
                    name: "container",
                    params: "(orientation: landscape)"
                }).addNode(
                    new RuleNode(".Container").addDeclaration(
                        "font-size",
                        "24px"
                    )
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
    );
});

test("proper json and css output", () => {
    let containersJSON = null;

    return postcss([
        containerQuery({
            getJSON: (cssPath, json) => (containersJSON = json)
        })
    ])
        .process(
            `
                .container {
                    @${DEFINE_CONTAINER_NAME};
                    border: none;
                    font-size: 50${HEIGHT_UNIT};
                    /* Ignore this */
                    line-height: 100${HEIGHT_UNIT};
                }

                @container (height >= 100px) and (width >= 100px) {
                    .container {
                        font-size: 70${HEIGHT_UNIT};
                    }
                }

                @container (height >= 100px) {
                    .container {
                        background: none;
                    }
                    /* Ignore this */
                }

                @container (height >= 100px) and (width >= 100px), (aspect-ratio > 3.5) {
                    .container {
                        background: #000;
                    }
                }

                /* Ignore this */

                .container2 {
                    @${DEFINE_CONTAINER_NAME}
                    font-size: 10px;
                    border: 1px solid;
                }

                .container2__element {
                    width: 50${WIDTH_UNIT};
                    height: 50${HEIGHT_UNIT};
                    background: green;
                }

                @container (orientation: portrait) {
                    .container2 {
                        font-size: 70${HEIGHT_UNIT};
                    }

                    .container2__element {
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
                .container {
                    border: none;
                    /* Ignore this */
                }

                /* Ignore this */

                .container2 {
                    border: 1px solid;
                }

                .container2__element {
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
                        conditions: [
                            [["height", ">=", 100], ["width", ">=", 100]]
                        ],
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

            expect(typeof containersJSON[".container2"]).toBe("object");
            expect(containersJSON[".container2"]).toEqual({
                selector: ".container2",
                queries: [
                    {
                        elements: [
                            {
                                selector: ".container2__element",
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
                                selector: ".container2",
                                values: {
                                    fontSize: `70${HEIGHT_UNIT}`
                                }
                            },
                            {
                                selector: ".container2__element",
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

test("should process containers without queries", () => [
    // notice and process values after a container was defined
]);
