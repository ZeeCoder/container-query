import getChangedStyles from "./getChangedStyles";
import {
  QUERIES,
  SELECTOR,
  ELEMENTS,
  STYLES,
  VALUES
} from "@zeecoder/container-query-meta-builder";
import containerRegistry from "./containerRegistry";

jest.mock("./containerRegistry", () => ({
  get: jest.fn()
}));

test("should return empty object if the element is not registered", () => {
  const element = document.createElement("div");
  const size = { width: 100, height: 100 };
  expect(getChangedStyles(element, size)).toEqual({});
});

test("should apply default queries without a condition function", () => {
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
                  "font-size": `2rh`,
                  "line-height": `1rh`
                }
              },
              {
                [SELECTOR]: ".Container__element",
                [VALUES]: {
                  "line-height": `3rh`
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
                  "font-size": `4.1234rh`,
                  "line-height": `2rh`
                }
              },
              {
                [SELECTOR]: ".Container__element",
                [STYLES]: {
                  "line-height": "10px"
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
        "font-size": "4.123px",
        "line-height": "2px"
      }
    },
    ".Container__element": {
      addStyle: {
        "line-height": "10px"
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
                "font-size": "12px",
                background: "#ccc"
              },
              [VALUES]: {
                "line-height": `1rh`
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
                "font-size": "14px"
              }
            }
          ]
        }
      ]
    }
  };

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
        "font-size": "14px",
        "line-height": "1px",
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
                "line-height": `10rh`
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
                "font-size": "14px",
                background: "#bbb"
              },
              [VALUES]: {
                "line-height": `2rh`
              }
            },
            {
              [SELECTOR]: ".Container__element",
              [STYLES]: {
                background: "#ccc",
                border: "none"
              },
              [VALUES]: {
                "font-size": `1rh`
              }
            }
          ]
        }
      ]
    }
  };

  containerRegistry.get.mockImplementation(() => registryData);

  const element = document.createElement("div");
  const size = { width: 100, height: 100 };
  expect(getChangedStyles(element, size)).toEqual({
    ".Container": {
      addStyle: {
        background: "#aaa",
        "line-height": "10px"
      },
      removeProps: ["font-size"]
    },
    ".Container__element": {
      addStyle: {
        background: "#bbb"
      },
      removeProps: ["border", "font-size"]
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
                "font-size": "14px",
                background: "#bbb",
                "line-height": "16px"
              }
            },
            {
              [SELECTOR]: ".Container__element",
              [STYLES]: {
                "font-size": "8px",
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
                "font-size": "16px",
                background: "#ccc",
                "line-height": "18px"
              }
            },
            {
              [SELECTOR]: ".Container__element",
              [STYLES]: {
                "font-size": "9px",
                background: "#fff"
              }
            }
          ]
        }
      ]
    }
  };

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
                "font-size": `2rh`
              }
            },
            {
              [SELECTOR]: ".Container__element",
              [VALUES]: {
                "font-size": `4rh`
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
                "font-size": `3rh`
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
                "line-height": `4rh`
              }
            },
            {
              [SELECTOR]: ".Container__element",
              [VALUES]: {
                "line-height": `3.5rh`
              }
            }
          ]
        }
      ]
    }
  };
  containerRegistry.get.mockImplementation(() => registryData);

  const element = document.createElement("div");
  const size = { width: 200, height: 200 };
  expect(getChangedStyles(element, size)).toEqual({
    ".Container": {
      addStyle: {
        "line-height": "8px",
        "font-size": "6px"
      }
    },
    ".Container__element": {
      addStyle: {
        "line-height": "7px",
        "font-size": "8px"
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
                "font-size": `22.5rh`,
                "line-height": `22.4rh`
              }
            }
          ]
        }
      ]
    }
  };

  containerRegistry.get.mockImplementation(() => registryData);

  const element = document.createElement("div");
  const size = { width: 123, height: 123 };
  expect(getChangedStyles(element, size)).toEqual({
    ".Container": {
      addStyle: {
        "font-size": "27.68px",
        "line-height": "27.55px"
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
                "font-size": "12px",
                "line-height": "15px"
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
                "font-size": "13px"
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
                "line-height": `2rh`
              }
            }
          ]
        }
      ]
    }
  };

  containerRegistry.get.mockImplementation(() => registryData);

  const element = document.createElement("div");
  const size = { width: 100, height: 100 };
  expect(getChangedStyles(element, size)).toEqual({
    ".Container": {
      addStyle: {
        border: "none",
        "font-size": "13px",
        "line-height": "15px"
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
