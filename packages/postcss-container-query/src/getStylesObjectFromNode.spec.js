import getStylesObjectFromNode from "./getStylesObjectFromNode";
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
        getStylesObjectFromNode({});
    }).toThrowError(/^`ruleNode` must be of type "rule".$/);

    expect(
        getStylesObjectFromNode({
            type: "rule",
            nodes: null
        })
    ).toEqual({});
});

test("should extract all styles", () => {
    expect(
        getStylesObjectFromNode(
            new RuleNode(".container")
                .addDeclaration("height", "42px")
                .addDeclaration("width", "42px")
                .addDeclaration("font-size", `50${HEIGHT_UNIT}`)
                .addDeclaration("line-height", `100${WIDTH_UNIT}`)
                .addDeclaration("border", "none")
        )
    ).toEqual({
        height: "42px",
        width: "42px",
        fontSize: `50${HEIGHT_UNIT}`,
        lineHeight: `100${WIDTH_UNIT}`,
        border: "none"
    });
});

test("should extract all container unit styles", () => {
    expect(getStylesObjectFromNode(new RuleNode(".container"), true)).toEqual(
        {}
    );

    expect(
        getStylesObjectFromNode(
            new RuleNode(".container")
                .addContainerDefinition()
                .addDeclaration("height", "42px")
                .addDeclaration("width", "42px")
                .addDeclaration("font-size", `5${HEIGHT_UNIT}px`)
                .addDeclaration("line-height", `42${WIDTH_UNIT}px`)
                .addDeclaration("border", "none"),
            true,
            true
        )
    ).toEqual({
        fontSize: `5${HEIGHT_UNIT}px`,
        lineHeight: `42${WIDTH_UNIT}px`
    });
});

test("should throw if with / height are using the wrong container units", () => {
    expect(() => {
        getStylesObjectFromNode(
            new RuleNode(".container")
                .addContainerDefinition()
                .addDeclaration("width", `42${MIN_UNIT}px`),
            true,
            true
        );
    }).toThrow(
        `Width and height properties on containers cannot use ${MIN_UNIT} or ${MAX_UNIT} units.`
    );

    expect(() => {
        getStylesObjectFromNode(
            new RuleNode(".container")
                .addContainerDefinition()
                .addDeclaration("height", `42${MIN_UNIT}px`),
            true,
            true
        );
    }).toThrow(
        `Width and height properties on containers cannot use ${MIN_UNIT} or ${MAX_UNIT} units.`
    );

    expect(() => {
        getStylesObjectFromNode(
            new RuleNode(".container")
                .addContainerDefinition()
                .addDeclaration("width", `42${MAX_UNIT}px`),
            true,
            true
        );
    }).toThrow(
        `Width and height properties on containers cannot use ${MIN_UNIT} or ${MAX_UNIT} units.`
    );

    expect(() => {
        getStylesObjectFromNode(
            new RuleNode(".container")
                .addContainerDefinition()
                .addDeclaration("height", `42${MAX_UNIT}px`),
            true,
            true
        );
    }).toThrow(
        `Width and height properties on containers cannot use ${MIN_UNIT} or ${MAX_UNIT} units.`
    );

    expect(() => {
        getStylesObjectFromNode(
            new RuleNode(".container")
                .addContainerDefinition()
                .addDeclaration("height", `42${HEIGHT_UNIT}px`),
            true,
            true
        );
    }).toThrow(`Containers cannot use ${HEIGHT_UNIT} for the height property.`);

    expect(() => {
        getStylesObjectFromNode(
            new RuleNode(".container")
                .addContainerDefinition()
                .addDeclaration("width", `42${WIDTH_UNIT}px`),
            true,
            true
        );
    }).toThrow(`Containers cannot use ${WIDTH_UNIT} for the width property.`);
});
