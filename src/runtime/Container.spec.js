import Container from "./Container";

console.warn = jest.fn();
jest.mock("./processConfig", () => jest.fn(config => config));
jest.mock("./adjustContainer", () => jest.fn());
jest.mock("raf", () => jest.fn(cb => cb()));

jest.mock("resize-observer-polyfill", () => {
    const mock = jest.fn(cb => {
        mock.triggerResizeEvent = cb;
    });

    // mock.default = mock;
    mock.prototype.observe = jest.fn();
    mock.prototype.unobserve = jest.fn();

    return mock;
});

beforeEach(() => {
    require("raf").mockClear();
    require("./adjustContainer").mockClear();
});

test("should instantiate properly", () => {
    const ResizeObserver = require("resize-observer-polyfill");
    const processConfig = require("./processConfig");
    const adjustContainer = require("./adjustContainer");
    const raf = require("raf");

    const containerElement = {};
    const config = {};
    const processedConfig = {};

    const containerInstance = new Container(containerElement, config);
    containerInstance.adjust();
    containerInstance.adjust();
    containerInstance.adjust();

    expect(ResizeObserver).toHaveBeenCalledTimes(1);
    expect(ResizeObserver.prototype.observe).toHaveBeenCalledTimes(0);
    expect(raf).toHaveBeenCalledTimes(1);
    expect(processConfig).toHaveBeenCalledTimes(1);
    expect(processConfig.mock.calls[0][0]).toBe(config);
    expect(adjustContainer).toHaveBeenCalledTimes(4);
    expect(adjustContainer.mock.calls[0][0]).toBe(containerElement);
    expect(adjustContainer.mock.calls[0][1]).toEqual(processedConfig);
    expect(adjustContainer.mock.calls[1][0]).toBe(containerElement);
    expect(adjustContainer.mock.calls[1][1]).toEqual(processedConfig);
});

test("should be able to observe resize events and switch off initial adjust call", () => {
    const ResizeObserver = require("resize-observer-polyfill");
    const raf = require("raf");
    const adjustContainer = require("./adjustContainer");

    const containerElement = {};
    const config = {};

    const containerInstance = new Container(containerElement, config, {
        adjustOnInstantiation: false,
        adjustOnResize: true
    });
    containerInstance.observeResize();
    containerInstance.unobserveResize();
    containerInstance.observeResize();

    expect(raf).toHaveBeenCalledTimes(0);
    expect(adjustContainer).toHaveBeenCalledTimes(0);
    expect(ResizeObserver).toHaveBeenCalledTimes(1);
    expect(ResizeObserver.prototype.observe).toHaveBeenCalledTimes(3);
    expect(ResizeObserver.prototype.unobserve).toHaveBeenCalledTimes(1);
    expect(ResizeObserver.prototype.observe.mock.calls[0][0]).toBe(
        containerElement
    );
    expect(ResizeObserver.prototype.observe.mock.calls[1][0]).toBe(
        containerElement
    );
    expect(ResizeObserver.prototype.observe.mock.calls[2][0]).toBe(
        containerElement
    );
    expect(ResizeObserver.prototype.unobserve.mock.calls[0][0]).toBe(
        containerElement
    );
});

test("should call adjust() on resize changes", () => {
    const ResizeObserver = require("resize-observer-polyfill");
    const containerElement = "<ContainerElement>";
    const config = {};
    const containerInstance = new Container(containerElement, config, {
        adjustOnInstantiation: false,
        adjustOnResize: true
    });

    expect(ResizeObserver).toHaveBeenCalledTimes(1);
    expect(typeof ResizeObserver.triggerResizeEvent).toBe("function");
    expect(() => ResizeObserver.triggerResizeEvent()).not.toThrow();
    expect(() => {
        ResizeObserver.triggerResizeEvent([
            {
                target: "<HTMLElement>"
            }
        ]);
    }).not.toThrow();
    expect(console.warn).toHaveBeenCalledTimes(1);

    containerInstance.adjust = jest.fn();
    expect(() => {
        ResizeObserver.triggerResizeEvent([
            {
                target: containerElement,
                contentRect: {
                    width: 1,
                    height: 2
                }
            }
        ]);
    }).not.toThrow();
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(containerInstance.adjust).toHaveBeenCalledTimes(1);
    expect(containerInstance.adjust).toHaveBeenCalledWith({
        width: 1,
        height: 2
    });
});
