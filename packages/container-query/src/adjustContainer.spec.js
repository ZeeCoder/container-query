import adjustContainer from "./adjustContainer";
import { HEIGHT_UNIT, WIDTH_UNIT } from "../../common/src/constants";

jest.mock("./applyStylesToElements");
jest.mock("./getChangedStyles");
jest.mock("./getContainerDimensions");
jest.mock("./containerRegistry", () => ({
    get: jest.fn()
}));

const container = {
    style: {},
    querySelectorAll: () => [containerElement]
};

const containerElement = {
    style: {}
};

// const config = {
//     selector: '.container',
//     queries: [
//         {
//             elements: [
//                 {
//                     selector: '.container',
//                     styles: {
//                         borderWidth: `calc(10${HEIGHT_UNIT} + 10${WIDTH_UNIT})`,
//                     },
//                 },
//                 {
//                     selector: '.container__element',
//                     styles: {
//                         width: '',
//                         height: `5${HEIGHT_UNIT}%`,
//                         fontSize: `10${HEIGHT_UNIT}`,
//                         lineHeight: `100${HEIGHT_UNIT}`,
//                     },
//                 },
//             ],
//         },
//         {
//             conditionFunction: containerDimensions =>
//                 containerDimensions.width >= 100,
//             elements: [
//                 {
//                     selector: '.container',
//                     styles: {
//                         borderWidth: `calc(20${HEIGHT_UNIT} + 20${WIDTH_UNIT})`,
//                     },
//                 },
//                 {
//                     selector: '.container__element',
//                     styles: {
//                         width: `50${HEIGHT_UNIT}`,
//                         height: `15${HEIGHT_UNIT}%`,
//                         fontSize: `50${HEIGHT_UNIT}`,
//                         lineHeight: `100${HEIGHT_UNIT}`,
//                     },
//                 },
//             ],
//         },
//         {
//             conditionFunction: containerDimensions =>
//                 containerDimensions.width >= 100 &&
//                 containerDimensions.height >= 200,
//             elements: [
//                 {
//                     selector: '.container__element',
//                     styles: {
//                         width: `75${WIDTH_UNIT}`,
//                         fontSize: `75${HEIGHT_UNIT}`,
//                         lineHeight: `90${HEIGHT_UNIT}`,
//                     },
//                 },
//             ],
//         },
//     ],
// };

beforeEach(() => {
    require("./getContainerDimensions").default.mockClear();
    require("./applyStylesToElements").default.mockClear();
    require("./containerRegistry").get.mockClear();
});

test("should be able to get the container size itself, and ignore empty change sets", () => {
    const containerRegistry = require("./containerRegistry");
    const applyStylesToElements = require("./applyStylesToElements").default;
    const getChangedStyles = require("./getChangedStyles").default;
    const getContainerDimensions = require("./getContainerDimensions").default;
    const containerElement = document.createElement("div");
    const containerSize = { width: 1, height: 2 };
    getContainerDimensions.mockImplementationOnce(() => containerSize);
    containerRegistry.get.mockImplementationOnce(() => {
        return {
            queryState: [],
            jsonStats: {
                queries: []
            }
        };
    });
    getChangedStyles.mockImplementationOnce(() => ({
        addStyles: {},
        removeProps: []
    }));

    adjustContainer(containerElement);

    expect(containerRegistry.get).toHaveBeenCalledTimes(1);
    expect(containerRegistry.get).toHaveBeenCalledWith(containerElement);
    expect(getContainerDimensions).toHaveBeenCalledTimes(1);
    expect(getContainerDimensions).toHaveBeenCalledWith(containerElement);
    expect(getChangedStyles).toHaveBeenCalledTimes(1);
    expect(getChangedStyles).toHaveBeenCalledWith(
        containerElement,
        containerSize
    );

    // This proves that empty change sets are ignored
    expect(applyStylesToElements).toHaveBeenCalledTimes(0);
});

test("should apply changed styles", () => {
    const containerRegistry = require("./containerRegistry");
    const applyStylesToElements = require("./applyStylesToElements").default;
    const getChangedStyles = require("./getChangedStyles").default;
    const getContainerDimensions = require("./getContainerDimensions").default;
    const containerElement = document.createElement("div");
    const containerSize = { width: 1, height: 2 };
    containerRegistry.get.mockImplementationOnce(() => {
        return {
            queryState: [],
            jsonStats: {
                queries: []
            }
        };
    });
    getChangedStyles.mockImplementationOnce(() => ({
        addStyles: {
            lineHeight: "10px",
            background: "none"
        },
        removeProps: ["font-size", "border"]
    }));

    adjustContainer(containerElement, containerSize);

    expect(containerRegistry.get).toHaveBeenCalledTimes(1);
    expect(containerRegistry.get).toHaveBeenCalledWith(containerElement);
    expect(getContainerDimensions).toHaveBeenCalledTimes(0);
    expect(getChangedStyles).toHaveBeenCalledTimes(1);
    expect(getChangedStyles).toHaveBeenCalledWith(
        containerElement,
        containerSize
    );

    // This proves that empty change sets are ignored
    expect(applyStylesToElements).toHaveBeenCalledTimes(0);
});
