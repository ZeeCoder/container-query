import Container from "./Container";
import { QUERIES } from "@zeecoder/container-query-meta-builder";
import raf from "raf";
import processMeta from "./processMeta";
import adjustContainer from "./adjustContainer";
import containerRegistry from "./containerRegistry";
import ResizeObserver from "resize-observer-polyfill";
import MutationObserver from "mutation-observer";

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
  raf.mockClear();
  processMeta.mockClear();
  adjustContainer.mockClear();
  ResizeObserver.prototype.observe.mockClear();
  ResizeObserver.prototype.unobserve.mockClear();
  containerRegistry.get.mockClear();
  containerRegistry.set.mockClear();
  containerRegistry.has.mockClear();
  containerRegistry.delete.mockClear();
});

test("should instantiate properly", () => {
  const containerElement = {
    parentNode: document.createElement("div")
  };

  const meta = {};

  const containerInstance = new Container(
    containerElement,
    `'${JSON.stringify(meta)}'`
  );
  containerInstance.adjust();
  containerInstance.adjust();
  containerInstance.adjust();

  expect(containerRegistry.set).toHaveBeenCalledTimes(1);
  expect(containerRegistry.set).toHaveBeenCalledWith(containerElement, {
    instance: containerInstance,
    meta,
    queryState: []
  });

  expect(ResizeObserver).toHaveBeenCalledTimes(1);
  expect(ResizeObserver.prototype.observe).toHaveBeenCalledTimes(1);
  expect(raf).toHaveBeenCalledTimes(1);
  expect(processMeta).toHaveBeenCalledTimes(1);
  expect(processMeta.mock.calls[0][0]).toEqual(meta);
  expect(adjustContainer).toHaveBeenCalledTimes(4);
  expect(adjustContainer.mock.calls[0][0]).toBe(containerElement);
  expect(adjustContainer.mock.calls[1][0]).toBe(containerElement);
});

test("should create the initial query state based on the number of queries", () => {
  const containerElement = {
    parentNode: document.createElement("div")
  };

  const meta = { [QUERIES]: [{}, {}] };

  const containerInstance = new Container(containerElement, meta);

  expect(containerRegistry.set).toHaveBeenCalledTimes(1);
  expect(containerRegistry.set).toHaveBeenCalledWith(containerElement, {
    instance: containerInstance,
    meta,
    queryState: [false, false]
  });
});

test("should not call adjust if disabled by the options", () => {
  const containerElement = {
    parentNode: document.createElement("div")
  };

  const meta = {};

  new Container(containerElement, meta, {
    adjustOnResize: false,
    adjustOnInstantiation: false
  });

  expect(ResizeObserver).toHaveBeenCalledTimes(1);
  expect(ResizeObserver.prototype.observe).toHaveBeenCalledTimes(0);
  expect(raf).toHaveBeenCalledTimes(0);
  expect(processMeta).toHaveBeenCalledTimes(1);
  expect(processMeta.mock.calls[0][0]).toBe(meta);
  expect(adjustContainer).toHaveBeenCalledTimes(0);
});

test("should be able to observe resize events and switch off initial adjust call", () => {
  const containerElement = {
    parentNode: document.createElement("div")
  };
  const meta = {};

  const containerInstance = new Container(containerElement, meta, {
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
  const randomElement = document.createElement("div");
  containerRegistry.get.mockImplementationOnce(queriedContainerElement => {
    expect(queriedContainerElement).toBe(randomElement);

    return undefined;
  });
  containerRegistry.get.mockImplementationOnce(queriedContainerElement => {
    expect(queriedContainerElement).toBe(containerElement);

    return registryData;
  });
  const parentElement = document.createElement("div");
  const containerElement = document.createElement("div");
  parentElement.appendChild(containerElement);
  const meta = {};
  const containerInstance = new Container(containerElement, meta, {
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
  containerRegistry.has.mockImplementationOnce(() => true);
  ResizeObserver.prototype.unobserve = jest.fn();
  const parentElement = document.createElement("div");
  const containerElement = document.createElement("div");
  parentElement.appendChild(containerElement);
  const meta = {};
  const containerInstance = new Container(containerElement, meta, {
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

test("should call handleResize when `adjust` is called", () => {
  const containerElement = document.createElement("div");
  const handleResize = jest.fn();

  new Container(containerElement, {}, { handleResize });

  expect(handleResize).toHaveBeenCalledTimes(1);
  expect(handleResize).toHaveBeenCalledWith(null);
});
