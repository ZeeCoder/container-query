import Container from "./Container";

// TODO fix the tests

console.warn = jest.fn();
jest.mock("./processMeta", () => jest.fn(config => config));
jest.mock("./adjustContainer", () => jest.fn());
jest.mock("raf", () => jest.fn(cb => cb()));
jest.mock("./containerRegistry", () => ({
  set: jest.fn(),
  get: jest.fn(),
  has: jest.fn(),
  delete: jest.fn()
}));

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
  require("./processMeta").mockClear();
  require("./adjustContainer").mockClear();
  const ResizeObserver = require("resize-observer-polyfill");
  ResizeObserver.prototype.observe.mockClear();
  ResizeObserver.prototype.unobserve.mockClear();
  const containerRegistry = require("./containerRegistry");
  containerRegistry.get.mockClear();
  containerRegistry.set.mockClear();
  containerRegistry.has.mockClear();
  containerRegistry.delete.mockClear();
});

test("should instantiate properly", () => {
  const ResizeObserver = require("resize-observer-polyfill");
  const processMeta = require("./processMeta");
  const adjustContainer = require("./adjustContainer");
  const containerRegistry = require("./containerRegistry");
  const raf = require("raf");

  const containerElement = {
    parentNode: document.createElement("div")
  };

  const config = {};

  const containerInstance = new Container(containerElement, config);
  containerInstance.adjust();
  containerInstance.adjust();
  containerInstance.adjust();

  expect(containerRegistry.set).toHaveBeenCalledTimes(1);
  expect(containerRegistry.set).toHaveBeenCalledWith(containerElement, {
    instance: containerInstance,
    meta: config,
    queryState: []
  });

  expect(ResizeObserver).toHaveBeenCalledTimes(1);
  expect(ResizeObserver.prototype.observe).toHaveBeenCalledTimes(1);
  expect(raf).toHaveBeenCalledTimes(1);
  expect(processMeta).toHaveBeenCalledTimes(1);
  expect(processMeta.mock.calls[0][0]).toBe(config);
  expect(adjustContainer).toHaveBeenCalledTimes(4);
  expect(adjustContainer.mock.calls[0][0]).toBe(containerElement);
  expect(adjustContainer.mock.calls[1][0]).toBe(containerElement);
});

test("should create the initial query state based on the number of queries", () => {
  const containerRegistry = require("./containerRegistry");

  const containerElement = {
    parentNode: document.createElement("div")
  };

  const config = { queries: [{}, {}] };

  const containerInstance = new Container(containerElement, config);

  expect(containerRegistry.set).toHaveBeenCalledTimes(1);
  expect(containerRegistry.set).toHaveBeenCalledWith(containerElement, {
    instance: containerInstance,
    meta: config,
    queryState: [false, false]
  });
});

test("should not call adjust if disabled by the options", () => {
  const ResizeObserver = require("resize-observer-polyfill");
  const processMeta = require("./processMeta");
  const adjustContainer = require("./adjustContainer");
  const raf = require("raf");

  const containerElement = {
    parentNode: document.createElement("div")
  };

  const config = {};

  const containerInstance = new Container(containerElement, config, {
    adjustOnResize: false,
    adjustOnInstantiation: false
  });

  expect(ResizeObserver).toHaveBeenCalledTimes(1);
  expect(ResizeObserver.prototype.observe).toHaveBeenCalledTimes(0);
  expect(raf).toHaveBeenCalledTimes(0);
  expect(processMeta).toHaveBeenCalledTimes(1);
  expect(processMeta.mock.calls[0][0]).toBe(config);
  expect(adjustContainer).toHaveBeenCalledTimes(0);
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
  const containerRegistry = require("./containerRegistry");
  const randomElement = document.createElement("div");
  containerRegistry.get.mockImplementationOnce(queriedContainerElement => {
    expect(queriedContainerElement).toBe(randomElement);

    return undefined;
  });
  containerRegistry.get.mockImplementationOnce(queriedContainerElement => {
    expect(queriedContainerElement).toBe(containerElement);

    return registryData;
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
  const registryData = {
    instance: containerInstance,
    meta: {},
    queryState: []
  };

  expect(containerRegistry.set).toHaveBeenCalledTimes(1);
  expect(containerRegistry.set).toHaveBeenCalledWith(
    containerElement,
    registryData
  );

  expect(ResizeObserver).toHaveBeenCalledTimes(1);
  expect(typeof ResizeObserver.triggerEvent).toBe("function");
  expect(() => ResizeObserver.triggerEvent()).not.toThrow();
  expect(() => {
    ResizeObserver.triggerEvent([
      {
        target: randomElement
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
  expect(containerRegistry.get).toHaveBeenCalledTimes(2);
  expect(containerInstance.adjust).toHaveBeenCalledTimes(1);
  expect(containerInstance.adjust).toHaveBeenCalledWith({
    width: 1,
    height: 2
  });
});

test("should clean up after container element is detached from the DOM", () => {
  const containerRegistry = require("./containerRegistry");
  containerRegistry.has.mockImplementationOnce(() => true);
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
  const registryData = {
    instance: containerInstance,
    meta: {},
    queryState: []
  };
  expect(containerRegistry.set).toHaveBeenCalledTimes(1);
  expect(containerRegistry.set).toHaveBeenCalledWith(
    containerElement,
    registryData
  );

  let mutationRecords = [
    {
      removedNodes: [containerElement]
    }
  ];

  MutationObserver.triggerEvent(mutationRecords);

  expect(containerRegistry.has).toHaveBeenCalledTimes(1);
  expect(containerRegistry.delete).toHaveBeenCalledTimes(1);
  expect(ResizeObserver.prototype.unobserve).toHaveBeenCalledTimes(1);
  expect(containerRegistry.delete).toHaveBeenCalledWith(containerElement);
  expect(ResizeObserver.prototype.unobserve).toHaveBeenCalledWith(
    containerElement
  );

  // Should not clean up after non-container elements
  mutationRecords = [
    {
      removedNodes: [document.createElement("div")]
    }
  ];

  containerRegistry.has = jest.fn(() => false);
  MutationObserver.triggerEvent(mutationRecords);

  expect(containerRegistry.has).toHaveBeenCalledTimes(1);
  expect(containerRegistry.delete).toHaveBeenCalledTimes(1);
  expect(ResizeObserver.prototype.unobserve).toHaveBeenCalledTimes(1);
});
