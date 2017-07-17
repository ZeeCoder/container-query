import getChangedStyles from "./getChangedStyles";
import { HEIGHT_UNIT } from "../../common/src/constants";

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
      jsonStats: {
        queries: [
          {
            elements: [
              {
                selector: ".Container",
                values: {
                  fontSize: `2${HEIGHT_UNIT}`,
                  lineHeight: `1${HEIGHT_UNIT}`
                }
              },
              {
                selector: ".Container__element",
                values: {
                  lineHeight: `3${HEIGHT_UNIT}`
                }
              }
            ]
          },
          {
            conditionFunction: () => true,
            elements: [
              {
                selector: ".Container",
                values: {
                  fontSize: `4${HEIGHT_UNIT}`,
                  lineHeight: `2${HEIGHT_UNIT}`
                }
              },
              {
                selector: ".Container__element",
                styles: {
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
      },
      removeProps: []
    },
    ".Container__element": {
      addStyle: {
        lineHeight: "10px"
      },
      removeProps: []
    }
  });
});

test("should return change sets on first run", () => {
  const registryData = {
    instance: { opts: { valuePrecision: 2 } },
    queryState: [false, false],
    jsonStats: {
      queries: [
        {
          conditionFunction: jest.fn(() => true),
          elements: [
            {
              selector: ".Container__element",
              styles: {
                fontSize: "12px",
                background: "#ccc"
              },
              values: {
                lineHeight: `1${HEIGHT_UNIT}`
              }
            }
          ]
        },
        {
          conditionFunction: jest.fn(() => true),
          elements: [
            {
              selector: ".Container",
              styles: {
                background: "#000"
              }
            },
            {
              selector: ".Container__element",
              styles: {
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
      },
      removeProps: []
    },
    ".Container__element": {
      addStyle: {
        fontSize: "14px",
        lineHeight: "1.00px",
        background: "#ccc"
      },
      removeProps: []
    }
  });
  expect(
    registryData.jsonStats.queries[0].conditionFunction
  ).toHaveBeenCalledTimes(1);
  expect(
    registryData.jsonStats.queries[0].conditionFunction
  ).toHaveBeenCalledWith(size);
  expect(
    registryData.jsonStats.queries[1].conditionFunction
  ).toHaveBeenCalledTimes(1);
  expect(
    registryData.jsonStats.queries[1].conditionFunction
  ).toHaveBeenCalledWith(size);
  expect(registryData.queryState).toEqual([true, true]);
});

test("should generate remove change set", () => {
  const registryData = {
    instance: { opts: { valuePrecision: 2 } },
    queryState: [true, true, true],
    jsonStats: {
      queries: [
        {
          conditionFunction: () => true,
          elements: [
            {
              selector: ".Container",
              styles: {
                background: "#aaa"
              },
              values: {}
            },
            {
              selector: ".Container__element",
              styles: {
                background: "#bbb"
              }
            }
          ]
        },
        {
          conditionFunction: () => true,
          elements: [
            {
              selector: ".Container",
              styles: {},
              values: {
                lineHeight: `10${HEIGHT_UNIT}`
              }
            }
          ]
        },
        {
          conditionFunction: () => false,
          elements: [
            {
              selector: ".Container",
              styles: {
                fontSize: "14px",
                background: "#bbb"
              },
              values: {
                lineHeight: `2${HEIGHT_UNIT}`
              }
            },
            {
              selector: ".Container__element",
              styles: {
                background: "#ccc",
                border: "none"
              },
              values: {
                fontSize: `1${HEIGHT_UNIT}`
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
    jsonStats: {
      queries: [
        {
          conditionFunction: () => false,
          elements: [
            {
              selector: ".Container",
              styles: {
                fontSize: "14px",
                background: "#bbb",
                lineHeight: "16px"
              }
            },
            {
              selector: ".Container__element",
              styles: {
                fontSize: "8px",
                background: "#eee"
              }
            }
          ]
        },
        {
          conditionFunction: () => true,
          elements: [
            {
              selector: ".Container",
              styles: {
                fontSize: "16px",
                background: "#ccc",
                lineHeight: "18px"
              }
            },
            {
              selector: ".Container__element",
              styles: {
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
    ".Container": {
      addStyle: {},
      removeProps: []
    },
    ".Container__element": {
      addStyle: {},
      removeProps: []
    }
  });
  expect(registryData.queryState).toEqual([false, true]);
});

test("should always recalculate values", () => {
  const registryData = {
    instance: { opts: { valuePrecision: 2 } },
    queryState: [true, false, true],
    jsonStats: {
      queries: [
        {
          conditionFunction: () => true,
          elements: [
            {
              selector: ".Container",
              values: {
                fontSize: `2${HEIGHT_UNIT}`
              }
            },
            {
              selector: ".Container__element",
              values: {
                fontSize: `4${HEIGHT_UNIT}`
              }
            }
          ]
        },
        {
          conditionFunction: () => true,
          elements: [
            {
              selector: ".Container",
              values: {
                fontSize: `3${HEIGHT_UNIT}`
              }
            }
          ]
        },
        {
          conditionFunction: () => true,
          elements: [
            {
              selector: ".Container",
              values: {
                lineHeight: `4${HEIGHT_UNIT}`
              }
            },
            {
              selector: ".Container__element",
              values: {
                lineHeight: `3${HEIGHT_UNIT}`
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
      },
      removeProps: []
    },
    ".Container__element": {
      addStyle: {
        lineHeight: "6.00px",
        fontSize: "8.00px"
      },
      removeProps: []
    }
  });
  expect(registryData.queryState).toEqual([true, true, true]);
});

test("should be able to limit the precision of generated css values", () => {
  const registryData = {
    instance: { opts: { valuePrecision: 2 } },
    queryState: [false],
    jsonStats: {
      queries: [
        {
          conditionFunction: () => true,
          elements: [
            {
              selector: ".Container",
              values: {
                fontSize: `22.5${HEIGHT_UNIT}`,
                lineHeight: `22.4${HEIGHT_UNIT}`
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
      },
      removeProps: []
    }
  });
  expect(registryData.queryState).toEqual([true]);
});

test("should handle multiple prop removal over multiple queries", () => {
  const registryData = {
    instance: { opts: { valuePrecision: 2 } },
    queryState: [false, false, true],
    jsonStats: {
      queries: [
        {
          conditionFunction: () => true,
          elements: [
            {
              selector: ".Container",
              styles: {
                border: "none",
                fontSize: "12px",
                lineHeight: "15px"
              }
            }
          ]
        },
        {
          conditionFunction: () => true,
          elements: [
            {
              selector: ".Container",
              styles: {
                fontSize: "13px"
              }
            }
          ]
        },
        {
          conditionFunction: () => false,
          elements: [
            {
              selector: ".Container",
              styles: {
                border: "1px solid"
              },
              values: {
                lineHeight: `2${HEIGHT_UNIT}`
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
      },
      removeProps: []
    }
  });
  expect(registryData.queryState).toEqual([true, true, false]);
});
