import processMeta from "./processMeta";

jest.mock("./getConditionFunction");

test("should turn conditions to functions", () => {
  const getConditionFunction = require("./getConditionFunction").default;
  getConditionFunction
    .mockImplementationOnce(() => () => 1)
    .mockImplementationOnce(() => () => 2)
    .mockImplementationOnce(() => () => 3);

  const meta = {
    selector: ".some-container",
    queries: [
      { conditions: [["orientation", ":", "landscape"]] },
      { conditions: [["orientation", ":", "portrait"]] },
      { conditions: [["width", ">", 100]] }
    ]
  };

  const processedMeta = processMeta(meta);

  expect(meta).not.toBe(processedMeta);
  expect(getConditionFunction).toHaveBeenCalledTimes(3);
  expect(getConditionFunction.mock.calls[0][0]).toEqual([
    ["orientation", ":", "landscape"]
  ]);
  expect(getConditionFunction.mock.calls[1][0]).toEqual([
    ["orientation", ":", "portrait"]
  ]);
  expect(getConditionFunction.mock.calls[2][0]).toEqual([["width", ">", 100]]);
  expect(typeof processedMeta.queries[0].conditionFunction).toBe("function");
  expect(processedMeta.queries[0].conditionFunction()).toBe(1);
  expect(typeof processedMeta.queries[1].conditionFunction).toBe("function");
  expect(processedMeta.queries[1].conditionFunction()).toBe(2);
  expect(typeof processedMeta.queries[2].conditionFunction).toBe("function");
  expect(processedMeta.queries[2].conditionFunction()).toBe(3);
});

test("should return null for invalid configurations", () => {
  const errorRegex = /^Invalid meta object/;

  expect(() => processMeta()).toThrow(errorRegex);
  expect(() => processMeta({})).toThrow(errorRegex);
  expect(() => processMeta([])).toThrow(errorRegex);
  expect(() => processMeta("")).toThrow(errorRegex);
  expect(() => processMeta(false)).toThrow(errorRegex);
  expect(() => processMeta(42)).toThrow(errorRegex);
});
