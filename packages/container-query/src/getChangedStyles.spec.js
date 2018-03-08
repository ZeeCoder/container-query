import getChangedStyles from "./getChangedStyles";
import {
  QUERIES,
  SELECTOR,
  ELEMENTS,
  STYLES,
  VALUES
} from "@zeecoder/container-query-meta-builder";

jest.mock("./containerRegistry", () => ({
  get: jest.fn()
}));

test("should return empty object if the element is not registered", () => {
  const element = document.createElement("div");
  const size = { width: 100, height: 100 };
  expect(getChangedStyles(element, size)).toEqual({});
});

test("should apply default queries without a condition function", () => {
  const containerRegistry = require("./containerRegistry");
  containerRegistry.get.mockImplementation(() => {
    return {
      instance: { opts: { valuePrecision: 3 } },
      queryState: [false, false],
      meta: {
        [QUERIES]: [
          {
            [ELEMENTS]: [
              {
                [SELECTOR]: ".Container",
                [VALUES]: {
                  fontSize: `2rh`,
                  lineHeight: `1rh`
                }
              },
              {
                [SELECTOR]: ".Container__element",
                [VALUES]: {
                  lineHeight: `3rh`
                }
              }
            ]
          },
          {
            conditionFunction: () => true,
            [ELEMENTS]: [
              {
                [SELECTOR]: ".Container",
                [VALUES]: {
                  fontSize: `4rh`,
                  lineHeight: `2rh`
                }
              },
              {
                [SELECTOR]: ".Container__element",
                [STYLES]: {
                  lineHeight: "10px"
                }
              }
            ]
          }
        ]
      }
    };
  });

  const element = document.createElement("div");
  const size = { width: 100, height: 100 };
  expect(getChangedStyles(element, size)).toEqual({
    ".Container": {
      addStyle: {
        fontSize: "4.000px",
        lineHeight: "2.000px"
      }
    },
    ".Container__element": {
      addStyle: {
        lineHeight: "10px"
      }
    }
  });
});

test("should return change sets on first run", () => {
  const registryData = {
    instance: { opts: { valuePrecision: 2 } },
    queryState: [false, false],
    meta: {
      [QUERIES]: [
        {
          conditionFunction: jest.fn(() => true),
          [ELEMENTS]: [
            {
              [SELECTOR]: ".Container__element",
              [STYLES]: {
                fontSize: "12px",
                background: "#ccc"
              },
              [VALUES]: {
                lineHeight: `1rh`
              }
            }
          ]
        },
        {
          conditionFunction: jest.fn(() => true),
          [ELEMENTS]: [
            {
              [SELECTOR]: ".Container",
              [STYLES]: {
                background: "#000"
              }
            },
            {
              [SELECTOR]: ".Container__element",
              [STYLES]: {
                fontSize: "14px"
              }
            }
          ]
        }
      ]
    }
  };

  const containerRegistry = require("./containerRegistry");
  containerRegistry.get.mockImplementation(() => registryData);

  const element = document.createElement("div");
  const size = { width: 100, height: 100 };
  expect(getChangedStyles(element, size)).toEqual({
    ".Container": {
      addStyle: {
        background: "#000"
      }
    },
    ".Container__element": {
      addStyle: {
        fontSize: "14px",
        lineHeight: "1.00px",
        background: "#ccc"
      }
    }
  });
  expect(registryData.meta[QUERIES][0].conditionFunction).toHaveBeenCalledTimes(
    1
  );
  expect(registryData.meta[QUERIES][0].conditionFunction).toHaveBeenCalledWith(
    size
  );
  expect(registryData.meta[QUERIES][1].conditionFunction).toHaveBeenCalledTimes(
    1
  );
  expect(registryData.meta[QUERIES][1].conditionFunction).toHaveBeenCalledWith(
    size
  );
  expect(registryData.queryState).toEqual([true, true]);
});

test("should generate remove change set", () => {
  const registryData = {
    instance: { opts: { valuePrecision: 2 } },
    queryState: [true, true, true],
    meta: {
      [QUERIES]: [
        {
          conditionFunction: () => true,
          [ELEMENTS]: [
            {
              [SELECTOR]: ".Container",
              [STYLES]: {
                background: "#aaa"
              },
              [VALUES]: {}
            },
            {
              [SELECTOR]: ".Container__element",
              [STYLES]: {
                background: "#bbb"
              }
            }
          ]
        },
        {
          conditionFunction: () => true,
          [ELEMENTS]: [
            {
              [SELECTOR]: ".Container",
              [STYLES]: {},
              [VALUES]: {
                lineHeight: `10rh`
              }
            }
          ]
        },
        {
          conditionFunction: () => false,
          [ELEMENTS]: [
            {
              [SELECTOR]: ".Container",
              [STYLES]: {
                fontSize: "14px",
                background: "#bbb"
              },
              [VALUES]: {
                lineHeight: `2rh`
              }
            },
            {
              [SELECTOR]: ".Container__element",
              [STYLES]: {
                background: "#ccc",
                border: "none"
              },
              [VALUES]: {
                fontSize: `1rh`
              }
            }
          ]
        }
      ]
    }
  };

  const containerRegistry = require("./containerRegistry");
  containerRegistry.get.mockImplementation(() => registryData);

  const element = document.createElement("div");
  const size = { width: 100, height: 100 };
  expect(getChangedStyles(element, size)).toEqual({
    ".Container": {
      addStyle: {
        background: "#aaa",
        lineHeight: "10.00px"
      },
      removeProps: ["fontSize"]
    },
    ".Container__element": {
      addStyle: {
        background: "#bbb"
      },
      removeProps: ["border", "fontSize"]
    }
  });
  expect(registryData.queryState).toEqual([true, true, false]);
});

test("should generate empty change set if conditions allow", () => {
  const registryData = {
    instance: { opts: { valuePrecision: 2 } },
    queryState: [true, true],
    meta: {
      [QUERIES]: [
        {
          conditionFunction: () => false,
          [ELEMENTS]: [
            {
              [SELECTOR]: ".Container",
              [STYLES]: {
                fontSize: "14px",
                background: "#bbb",
                lineHeight: "16px"
              }
            },
            {
              [SELECTOR]: ".Container__element",
              [STYLES]: {
                fontSize: "8px",
                background: "#eee"
              }
            }
          ]
        },
        {
          conditionFunction: () => true,
          [ELEMENTS]: [
            {
              [SELECTOR]: ".Container",
              [STYLES]: {
                fontSize: "16px",
                background: "#ccc",
                lineHeight: "18px"
              }
            },
            {
              [SELECTOR]: ".Container__element",
              [STYLES]: {
                fontSize: "9px",
                background: "#fff"
              }
            }
          ]
        }
      ]
    }
  };

  const containerRegistry = require("./containerRegistry");
  containerRegistry.get.mockImplementation(() => registryData);

  const element = document.createElement("div");
  const size = { width: 100, height: 100 };
  expect(getChangedStyles(element, size)).toEqual({
    ".Container": {},
    ".Container__element": {}
  });
  expect(registryData.queryState).toEqual([false, true]);
});

test("should always recalculate values", () => {
  const registryData = {
    instance: { opts: { valuePrecision: 2 } },
    queryState: [true, false, true],
    meta: {
      [QUERIES]: [
        {
          conditionFunction: () => true,
          [ELEMENTS]: [
            {
              [SELECTOR]: ".Container",
              [VALUES]: {
                fontSize: `2rh`
              }
            },
            {
              [SELECTOR]: ".Container__element",
              [VALUES]: {
                fontSize: `4rh`
              }
            }
          ]
        },
        {
          conditionFunction: () => true,
          [ELEMENTS]: [
            {
              [SELECTOR]: ".Container",
              [VALUES]: {
                fontSize: `3rh`
              }
            }
          ]
        },
        {
          conditionFunction: () => true,
          [ELEMENTS]: [
            {
              [SELECTOR]: ".Container",
              [VALUES]: {
                lineHeight: `4rh`
              }
            },
            {
              [SELECTOR]: ".Container__element",
              [VALUES]: {
                lineHeight: `3rh`
              }
            }
          ]
        }
      ]
    }
  };
  const containerRegistry = require("./containerRegistry");
  containerRegistry.get.mockImplementation(() => registryData);

  const element = document.createElement("div");
  const size = { width: 200, height: 200 };
  expect(getChangedStyles(element, size)).toEqual({
    ".Container": {
      addStyle: {
        lineHeight: "8.00px",
        fontSize: "6.00px"
      }
    },
    ".Container__element": {
      addStyle: {
        lineHeight: "6.00px",
        fontSize: "8.00px"
      }
    }
  });
  expect(registryData.queryState).toEqual([true, true, true]);
});

test("should be able to limit the precision of generated css values", () => {
  const registryData = {
    instance: { opts: { valuePrecision: 2 } },
    queryState: [false],
    meta: {
      [QUERIES]: [
        {
          conditionFunction: () => true,
          [ELEMENTS]: [
            {
              [SELECTOR]: ".Container",
              [VALUES]: {
                fontSize: `22.5rh`,
                lineHeight: `22.4rh`
              }
            }
          ]
        }
      ]
    }
  };

  const containerRegistry = require("./containerRegistry");
  containerRegistry.get.mockImplementation(() => registryData);

  const element = document.createElement("div");
  const size = { width: 123, height: 123 };
  expect(getChangedStyles(element, size)).toEqual({
    ".Container": {
      addStyle: {
        fontSize: "27.68px",
        lineHeight: "27.55px"
      }
    }
  });
  expect(registryData.queryState).toEqual([true]);
});

test("should handle multiple prop removal over multiple queries", () => {
  const registryData = {
    instance: { opts: { valuePrecision: 2 } },
    queryState: [false, false, true],
    meta: {
      [QUERIES]: [
        {
          conditionFunction: () => true,
          [ELEMENTS]: [
            {
              [SELECTOR]: ".Container",
              [STYLES]: {
                border: "none",
                fontSize: "12px",
                lineHeight: "15px"
              }
            }
          ]
        },
        {
          conditionFunction: () => true,
          [ELEMENTS]: [
            {
              [SELECTOR]: ".Container",
              [STYLES]: {
                fontSize: "13px"
              }
            }
          ]
        },
        {
          conditionFunction: () => false,
          [ELEMENTS]: [
            {
              [SELECTOR]: ".Container",
              [STYLES]: {
                border: "1px solid"
              },
              [VALUES]: {
                lineHeight: `2rh`
              }
            }
          ]
        }
      ]
    }
  };

  const containerRegistry = require("./containerRegistry");
  containerRegistry.get.mockImplementation(() => registryData);

  const element = document.createElement("div");
  const size = { width: 100, height: 100 };
  expect(getChangedStyles(element, size)).toEqual({
    ".Container": {
      addStyle: {
        border: "none",
        fontSize: "13px",
        lineHeight: "15px"
      }
    }
  });
  expect(registryData.queryState).toEqual([true, true, false]);
});

test("should use :self if the selector is not available", () => {
  const registryData = {
    instance: { opts: {} },
    queryState: [false],
    meta: {
      [QUERIES]: [
        {
          conditionFunction: () => true,
          [ELEMENTS]: [
            {
              [STYLES]: {
                color: "inherit"
              }
            }
          ]
        }
      ]
    }
  };

  const containerRegistry = require("./containerRegistry");
  containerRegistry.get.mockImplementation(() => registryData);

  const element = document.createElement("div");
  const size = { width: 100, height: 100 };
  expect(getChangedStyles(element, size)).toEqual({
    ":self": {
      addStyle: {
        color: "inherit"
      }
    }
  });
  expect(registryData.queryState).toEqual([true]);
});
