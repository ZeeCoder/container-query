import applyStylesToElements from "./applyStylesToElements";

test("should apply all declarations to all the elements", () => {
  const element1 = {
    style: {
      setProperty: jest.fn()
    }
  };
  const element2 = {
    style: {
      setProperty: jest.fn()
    }
  };

  const elements = [element1, element2];

  const style = {
    "font-size": "42px",
    "line-height": "50px"
  };

  applyStylesToElements(style, elements);

  expect(element1.style.setProperty).toHaveBeenCalledTimes(2);
  expect(element1.style.setProperty).toHaveBeenCalledWith("font-size", "42px");
  expect(element1.style.setProperty).toHaveBeenCalledWith(
    "line-height",
    "50px"
  );

  expect(element2.style.setProperty).toHaveBeenCalledTimes(2);
  expect(element2.style.setProperty).toHaveBeenCalledWith("font-size", "42px");
  expect(element2.style.setProperty).toHaveBeenCalledWith(
    "line-height",
    "50px"
  );
});
