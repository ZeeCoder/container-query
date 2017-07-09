import adjustContainer from "./adjustContainer";
import { HEIGHT_UNIT, WIDTH_UNIT } from "../../common/src/constants";

jest.mock("./getContainerDimensions");

// @todo update tests

const container = {
    style: {},
    querySelectorAll: () => [containerElement]
};

const containerElement = {
    style: {}
};

const config = {
    selector: ".container",
    queries: [
        {
            elements: [
                {
                    selector: ".container",
                    styles: {
                        borderWidth: `calc(10${HEIGHT_UNIT} + 10${WIDTH_UNIT})`
                    }
                },
                {
                    selector: ".container__element",
                    styles: {
                        width: "",
                        height: `5${HEIGHT_UNIT}%`,
                        fontSize: `10${HEIGHT_UNIT}`,
                        lineHeight: `100${HEIGHT_UNIT}`
                    }
                }
            ]
        },
        {
            conditionFunction: containerDimensions =>
                containerDimensions.width >= 100,
            elements: [
                {
                    selector: ".container",
                    styles: {
                        borderWidth: `calc(20${HEIGHT_UNIT} + 20${WIDTH_UNIT})`
                    }
                },
                {
                    selector: ".container__element",
                    styles: {
                        width: `50${HEIGHT_UNIT}`,
                        height: `15${HEIGHT_UNIT}%`,
                        fontSize: `50${HEIGHT_UNIT}`,
                        lineHeight: `100${HEIGHT_UNIT}`
                    }
                }
            ]
        },
        {
            conditionFunction: containerDimensions =>
                containerDimensions.width >= 100 &&
                containerDimensions.height >= 200,
            elements: [
                {
                    selector: ".container__element",
                    styles: {
                        width: `75${WIDTH_UNIT}`,
                        fontSize: `75${HEIGHT_UNIT}`,
                        lineHeight: `90${HEIGHT_UNIT}`
                    }
                }
            ]
        }
    ]
};

beforeEach(() => {
    require("./getContainerDimensions").default.mockClear();
});

test("should accept container dimensions", () => {
    const getContainerDimensions = require("./getContainerDimensions").default;
    let config = {
        queries: []
    };

    const container = {};
    const containerDimensions = { width: 1, height: 2 };

    adjustContainer(container, config, containerDimensions);

    expect(getContainerDimensions).toHaveBeenCalledTimes(0);
});

test("The container and its elements should be properly adjusted with the defaults", () => {
    const getContainerDimensionsMock = require(
        "./getContainerDimensions"
    ).default.mockImplementation(() => {
        return { width: 99, height: 100 };
    });

    adjustContainer(container, config);

    expect(getContainerDimensionsMock).toHaveBeenCalledTimes(1);
    expect(container.style).toEqual({
        borderWidth: "calc(10px + 9.9px)"
    });
    expect(containerElement.style).toEqual({
        width: "",
        height: `5px%`,
        fontSize: "10px",
        lineHeight: "100px"
    });
});

describe("query styles should be applied, then removed when conditions no longer apply", () => {
    test("Apply query styles with width >= 100", () => {
        const getContainerDimensionsMock = require(
            "./getContainerDimensions"
        ).default.mockImplementation(() => {
            return { width: 100, height: 100 };
        });

        adjustContainer(container, config);

        expect(getContainerDimensionsMock).toHaveBeenCalledTimes(1);
        expect(container.style).toEqual({
            borderWidth: "calc(20px + 20px)"
        });
        expect(containerElement.style).toEqual({
            width: "50px",
            height: `15px%`,
            fontSize: "50px",
            lineHeight: "100px"
        });
    });

    test("Apply query styles with height >= 200", () => {
        const getContainerDimensionsMock = require(
            "./getContainerDimensions"
        ).default.mockImplementation(() => {
            return { width: 100, height: 200 };
        });

        adjustContainer(container, config);

        expect(getContainerDimensionsMock).toHaveBeenCalledTimes(1);
        expect(container.style).toEqual({
            borderWidth: "calc(40px + 20px)"
        });
        expect(containerElement.style).toEqual({
            width: "75px",
            height: `30px%`,
            fontSize: "150px",
            lineHeight: "180px"
        });
    });

    test("Remove all query styles, resetting back to the defaults", () => {
        const getContainerDimensionsMock = require(
            "./getContainerDimensions"
        ).default.mockImplementation(() => {
            return { width: 99, height: 99 };
        });

        adjustContainer(container, config);

        expect(getContainerDimensionsMock).toHaveBeenCalledTimes(1);
        expect(container.style).toEqual({
            borderWidth: "calc(9.9px + 9.9px)"
        });
        expect(containerElement.style).toEqual({
            width: "",
            height: `4.95px%`,
            fontSize: "9.9px",
            lineHeight: "99px"
        });
    });
});

test("shouldn't adjust if the configuration is null (invalid)", () => {
    const getContainerDimensionsMock = require("./getContainerDimensions")
        .default;

    adjustContainer(container);

    expect(getContainerDimensionsMock).toHaveBeenCalledTimes(0);
});
