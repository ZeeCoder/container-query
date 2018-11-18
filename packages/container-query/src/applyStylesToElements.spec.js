import applyStylesToElements from "./applyStylesToElements";

// For some reason "setProperty" here in Node doesn't work with custom props for
// elements created via `document.createElement`, that's why I'm mocking the
// styles object here.
class Style {
  constructor() {
    this.style = {};
  }

  setProperty(name, value) {
    this.style[name] = value;
  }

  getPropertyValue(name) {
    return this.style[name];
  }
}

test("should apply all declarations to all the elements", () => {
  const element1 = {
    style: new Style()
  };
  const element2 = {
    style: new Style()
  };

  const elements = [element1, element2];

  const style = {
    "font-size": "42px",
    "line-height": "50px",
    "--custom-prop": "50px"
  };

  applyStylesToElements(style, elements);

  elements.forEach(element => {
    expect(element.style.getPropertyValue("font-size")).toEqual(
      style["font-size"]
    );
    expect(element.style.getPropertyValue("line-height")).toEqual(
      style["line-height"]
    );
    expect(element.style.getPropertyValue("custom-prop")).toEqual(
      style["custom-prop"]
    );
  });
});
