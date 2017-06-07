import getContainerDimensions from "./getContainerDimensions";

test("should return an object with the expected width and height data", () => {
    const container = {
        clientWidth: 100,
        clientHeight: 50
    };

    expect(getContainerDimensions(container)).toEqual({
        width: 100,
        height: 50
    });
});
