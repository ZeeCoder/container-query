import Container from "./Container";

console.warn = jest.fn();
jest.mock("./processConfig", () => jest.fn(config => config));
jest.mock("./adjustContainer", () => jest.fn());
jest.mock("raf", () => jest.fn(cb => cb()));
jest.mock("es6-weak-map", () => {
    const mock = jest.fn();

    mock.prototype.set = jest.fn();
    mock.prototype.get = jest.fn();
    mock.prototype.has = jest.fn();
    mock.prototype.delete = jest.fn();

    return mock;
});

jest.mock("resize-observer-polyfill", () => {
    const mock = jest.fn(cb => {
        mock.triggerEvent = cb;
    });

    mock.prototype.observe = jest.fn();
    mock.prototype.unobserve = jest.fn();

    return mock;
});

jest.mock("mutation-observer", () => {
    const mock = jest.fn(cb => {
        mock.triggerEvent = cb;
    });

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

    const containerElement = {
        parentNode: document.createElement("div")
    };

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
    expect(adjustContainer.mock.calls[1][0]).toBe(containerElement);
});

test("should be able to observe resize events and switch off initial adjust call", () => {
    const ResizeObserver = require("resize-observer-polyfill");
    const raf = require("raf");
    const adjustContainer = require("./adjustContainer");

    const containerElement = {
        parentNode: document.createElement("div")
    };
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
    const WeakMap = require("es6-weak-map");
    WeakMap.prototype.set = jest.fn();
    WeakMap.prototype.get.mockImplementationOnce(() => undefined);
    WeakMap.prototype.get.mockImplementationOnce(element => {
        expect(element).toBe(containerElement);

        return registeredContainer;
    });
    const ResizeObserver = require("resize-observer-polyfill");
    const parentElement = document.createElement("div");
    const containerElement = document.createElement("div");
    parentElement.appendChild(containerElement);
    const config = {};
    const containerInstance = new Container(containerElement, config, {
        adjustOnInstantiation: false,
        adjustOnResize: true
    });
    const registeredContainer = {
        instance: containerInstance,
        jsonStats: {},
        queryState: []
    };
    expect(WeakMap.prototype.set).toHaveBeenCalledTimes(1);
    expect(WeakMap.prototype.set).toHaveBeenCalledWith(
        containerElement,
        registeredContainer
    );

    expect(ResizeObserver).toHaveBeenCalledTimes(1);
    expect(typeof ResizeObserver.triggerEvent).toBe("function");
    expect(() => ResizeObserver.triggerEvent()).not.toThrow();
    expect(() => {
        ResizeObserver.triggerEvent([
            {
                target: "<HTMLElement>"
            }
        ]);
    }).not.toThrow();
    expect(console.warn).toHaveBeenCalledTimes(1);

    containerInstance.adjust = jest.fn();
    expect(() => {
        ResizeObserver.triggerEvent([
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
    expect(WeakMap.prototype.get).toHaveBeenCalledTimes(2);
    expect(containerInstance.adjust).toHaveBeenCalledTimes(1);
    expect(containerInstance.adjust).toHaveBeenCalledWith({
        width: 1,
        height: 2
    });
});

test("should clean up after container element is detached from the DOM", () => {
    const WeakMap = require("es6-weak-map");
    WeakMap.prototype.set = jest.fn();
    WeakMap.prototype.has = jest.fn(() => true);
    const MutationObserver = require("mutation-observer");
    const ResizeObserver = require("resize-observer-polyfill");
    ResizeObserver.prototype.unobserve = jest.fn();
    const parentElement = document.createElement("div");
    const containerElement = document.createElement("div");
    parentElement.appendChild(containerElement);
    const config = {};
    const containerInstance = new Container(containerElement, config, {
        adjustOnInstantiation: false,
        adjustOnResize: false
    });
    const registeredContainer = {
        instance: containerInstance,
        jsonStats: {},
        queryState: []
    };
    expect(WeakMap.prototype.set).toHaveBeenCalledTimes(1);
    expect(WeakMap.prototype.set).toHaveBeenCalledWith(
        containerElement,
        registeredContainer
    );

    let mutationRecords = [
        {
            removedNodes: [containerElement]
        }
    ];

    MutationObserver.triggerEvent(mutationRecords);

    expect(WeakMap.prototype.has).toHaveBeenCalledTimes(1);
    expect(WeakMap.prototype.delete).toHaveBeenCalledTimes(1);
    expect(ResizeObserver.prototype.unobserve).toHaveBeenCalledTimes(1);
    expect(WeakMap.prototype.delete).toHaveBeenCalledWith(containerElement);
    expect(ResizeObserver.prototype.unobserve).toHaveBeenCalledWith(
        containerElement
    );

    // Should not clean up after non-container elements
    mutationRecords = [
        {
            removedNodes: [document.createElement("div")]
        }
    ];

    WeakMap.prototype.has = jest.fn(() => false);
    MutationObserver.triggerEvent(mutationRecords);

    expect(WeakMap.prototype.has).toHaveBeenCalledTimes(1);
    expect(WeakMap.prototype.delete).toHaveBeenCalledTimes(1);
    expect(ResizeObserver.prototype.unobserve).toHaveBeenCalledTimes(1);
});
