import getContainerSize from "./getContainerSize";

test("should return an object with the expected width and height data", () => {
  const container = {
    clientWidth: 100,
    clientHeight: 50
  };

  expect(getContainerSize(container)).toEqual({
    width: 100,
    height: 50
  });
});
