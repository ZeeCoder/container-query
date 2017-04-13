import postcss from "postcss";
import { WIDTH_UNIT, HEIGHT_UNIT, DEFINE_CONTAINER_NAME } from "../constants";
import containerQuery from "./containerQuery";
import Root from "../../__mocks__/Root";
import Node from "../../__mocks__/Node";
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
            new Root().addNode(
                new Node({
                    type: "atrule",
                    name: "container",
                    params: "(orientation: landscape)"
                })
            )
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
                ".container": {
                    selector: ".container",
                    queries: [
                        {
                            elements: [
                                {
                                    selector: ".container",
                                    styles: {
                                        fontSize: "",
                                        lineHeight: `100${HEIGHT_UNIT}px`
                                    }
                                }
                            ]
                        },
                        {
                            conditions: [[["orientation", ":", "landscape"]]],
                            elements: [
                                {
                                    selector: ".container",
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
                new Node({
                    type: "rule",
                    selector: ".container"
                })
                    .addNode(
                        new Node({
                            type: "decl",
                            prop: "line-height",
                            value: `100${HEIGHT_UNIT}px`
                        })
                    )
                    .addNode(
                        new Node({
                            type: "decl",
                            prop: "font-size",
                            value: "42px"
                        })
                    )
                    .addNode(
                        new Node({
                            type: "atrule",
                            name: DEFINE_CONTAINER_NAME
                        })
                    )
                    .addNode(
                        new Node({
                            type: "decl",
                            prop: "border",
                            value: "none"
                        })
                    )
            )
            .addNode(
                new Node({
                    type: "atrule",
                    name: "keyframes",
                    params: "Expand"
                })
                    .addNode(
                        new Node({
                            type: "rule",
                            selector: "0%"
                        }).addNode(
                            new Node({
                                type: "decl",
                                prop: "opacity",
                                value: "0%"
                            })
                        )
                    )
                    .addNode(
                        new Node({
                            type: "rule",
                            selector: "100%"
                        }).addNode(
                            new Node({
                                type: "decl",
                                prop: "opacity",
                                value: "100%"
                            })
                        )
                    )
            )
            .addNode(
                new Node({
                    type: "atrule",
                    name: "container",
                    params: "(orientation: landscape)"
                }).addNode(
                    new Node({
                        type: "rule",
                        selector: ".container"
                    }).addNode({
                        type: "decl",
                        prop: "font-size",
                        value: "24px"
                    })
                )
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
                    font-size: 50${HEIGHT_UNIT}px;
                    /* Ignore this */
                    line-height: 100${HEIGHT_UNIT}px;
                }

                @container (height >= 100px) and (width >= 100px) {
                    .container {
                        font-size: 70${HEIGHT_UNIT}px;
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
                    width: 50${WIDTH_UNIT}px;
                    height: 50${HEIGHT_UNIT}px;
                    background: green;
                }

                @container (orientation: portrait) {
                    .container2 {
                        font-size: 70${HEIGHT_UNIT}px;
                    }

                    .container2__element {
                        width: 75${WIDTH_UNIT}px;
                        height: 75${HEIGHT_UNIT}px;
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

            expect(typeof containersJSON[".container"]).toBe("object");
            expect(containersJSON[".container"]).toEqual({
                selector: ".container",
                queries: [
                    {
                        elements: [
                            {
                                selector: ".container",
                                styles: {
                                    fontSize: `50${HEIGHT_UNIT}px`,
                                    lineHeight: `100${HEIGHT_UNIT}px`,
                                    background: ""
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
                                selector: ".container",
                                styles: {
                                    fontSize: `70${HEIGHT_UNIT}px`
                                }
                            }
                        ]
                    },
                    {
                        conditions: [[["height", ">=", 100]]],
                        elements: [
                            {
                                selector: ".container",
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
                                selector: ".container",
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
                                selector: ".container2",
                                styles: {
                                    fontSize: ""
                                }
                            },
                            {
                                selector: ".container2__element",
                                styles: {
                                    width: `50${WIDTH_UNIT}px`,
                                    height: `50${HEIGHT_UNIT}px`,
                                    background: ""
                                }
                            }
                        ]
                    },
                    {
                        conditions: [[["orientation", ":", "portrait"]]],
                        elements: [
                            {
                                selector: ".container2",
                                styles: {
                                    fontSize: `70${HEIGHT_UNIT}px`
                                }
                            },
                            {
                                selector: ".container2__element",
                                styles: {
                                    width: `75${WIDTH_UNIT}px`,
                                    height: `75${HEIGHT_UNIT}px`,
                                    background: "red"
                                }
                            }
                        ]
                    }
                ]
            });
        });
});
