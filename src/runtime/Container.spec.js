import Container from "./Container";
import raf from "raf";

jest.mock("./processConfig");
jest.mock("./adjustContainer");
jest.mock("raf", () => jest.fn(cb => cb()));

test("should instantiate properly", () => {
    const processConfig = require("./processConfig").default;
    const adjustContainer = require("./adjustContainer").default;

    const containerElement = {};
    const config = {};
    const processedConfig = {};
    processConfig.mockImplementation(() => processedConfig);

    const containerInstance = new Container(containerElement, config);
    containerInstance.adjust();
    containerInstance.adjust();
    containerInstance.adjust();

    expect(raf).toHaveBeenCalledTimes(1);
    expect(processConfig).toHaveBeenCalledTimes(1);
    expect(adjustContainer).toHaveBeenCalledTimes(4);
    expect(adjustContainer.mock.calls[0][0]).toBe(containerElement);
    expect(adjustContainer.mock.calls[0][1]).toBe(processedConfig);
    expect(adjustContainer.mock.calls[1][0]).toBe(containerElement);
    expect(adjustContainer.mock.calls[1][1]).toBe(processedConfig);
});
