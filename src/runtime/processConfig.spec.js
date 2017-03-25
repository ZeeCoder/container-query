import processConfig from "./processConfig";

jest.mock("./getConditionFunction");

test("should turn conditions to functions", () => {
    const getConditionFunction = require("./getConditionFunction").default;
    getConditionFunction
        .mockImplementationOnce(() => () => 1)
        .mockImplementationOnce(() => () => 2)
        .mockImplementationOnce(() => () => 3);

    const origConfig = {
        selector: ".some-container",
        queries: [
            { conditions: [["orientation", ":", "landscape"]] },
            { conditions: [["orientation", ":", "portrait"]] },
            { conditions: [["width", ">", 100]] }
        ]
    };

    const processedConfig = processConfig(origConfig);

    expect(origConfig).not.toBe(processedConfig);
    expect(getConditionFunction).toHaveBeenCalledTimes(3);
    expect(getConditionFunction.mock.calls[0][0]).toEqual([
        ["orientation", ":", "landscape"]
    ]);
    expect(getConditionFunction.mock.calls[1][0]).toEqual([
        ["orientation", ":", "portrait"]
    ]);
    expect(getConditionFunction.mock.calls[2][0]).toEqual([
        ["width", ">", 100]
    ]);
    expect(typeof processedConfig.queries[0].conditionFunction).toBe(
        "function"
    );
    expect(processedConfig.queries[0].conditionFunction()).toBe(1);
    expect(typeof processedConfig.queries[1].conditionFunction).toBe(
        "function"
    );
    expect(processedConfig.queries[1].conditionFunction()).toBe(2);
    expect(typeof processedConfig.queries[2].conditionFunction).toBe(
        "function"
    );
    expect(processedConfig.queries[2].conditionFunction()).toBe(3);
});

test("should return null for invalid configurations", () => {
    expect(processConfig()).toEqual(null);
    expect(processConfig({})).toEqual(null);
    expect(processConfig([])).toEqual(null);
    expect(processConfig("")).toEqual(null);
    expect(processConfig(false)).toEqual(null);
    expect(processConfig(42)).toEqual(null);
});
