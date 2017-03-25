import isEmptyObject from "./isEmptyObject";

test("should return true if object is empty", () => {
    expect(isEmptyObject({})).toBe(true);

    const obj = {
        val: 42,
        val2: 24
    };

    obj.hasOwnProperty = jest.fn(() => true);

    expect(isEmptyObject(obj)).toBe(false);
    expect(obj.hasOwnProperty).toHaveBeenCalledTimes(1);
});

test("should not include properties from the prototype chain", () => {
    const parentObj = { parentProperty: "parent value" };
    const childObj = Object.create(parentObj);

    expect(isEmptyObject(childObj)).toBe(true);

    childObj.childProperty = "child value";
    expect(isEmptyObject(childObj)).toBe(false);
});
