import adjustContainer from "./adjustContainer";
import containerRegistry from "./containerRegistry";
import { SELECTOR, QUERIES } from "@zeecoder/container-query-meta-builder";
import getContainerSize from "./getContainerSize";
import getChangedStyles from "./getChangedStyles";

jest.mock("./getChangedStyles");
jest.mock("./getContainerSize");

beforeEach(() => {
  getChangedStyles.mockClear();
  getContainerSize.mockClear();
});

test("should ignore call if the element is not registered", () => {
  const containerElement = document.createElement("div");
  adjustContainer(containerElement);
  expect(getContainerSize).toHaveBeenCalledTimes(0);
});

test("should be able to get the container size itself, and ignore empty change sets", () => {
  const containerElement = document.createElement("div");
  const containerSize = { width: 1, height: 2 };
  getContainerSize.mockImplementationOnce(() => containerSize);
  containerRegistry.set(containerElement, {
    queryState: [],
    meta: {
      [QUERIES]: []
    }
  });

  getChangedStyles.mockImplementationOnce(() => ({
    ".Container": {}
  }));

  adjustContainer(containerElement);

  expect(getContainerSize).toHaveBeenCalledWith(containerElement);
  expect(getChangedStyles).toHaveBeenCalledWith(
    containerElement,
    containerSize
  );

  expect(containerElement.style._values).toEqual({});
});

test("should apply changed styles", () => {
  const containerElement = document.createElement("div");
  const containerChildElement1 = document.createElement("div");
  const containerChildElement2 = document.createElement("div");
  const containerChildren = [containerChildElement1, containerChildElement2];
  containerElement.querySelectorAll = jest.fn(() => containerChildren);

  const containerSize = { width: 1, height: 2 };
  containerRegistry.set(containerElement, {
    queryState: [],
    meta: {
      [SELECTOR]: ".Container",
      [QUERIES]: []
    }
  });

  getChangedStyles.mockImplementationOnce(() => ({
    ".Container": {
      addStyle: {
        "line-height": "10px",
        background: "none"
      },
      removeProps: ["fontSize", "border"]
    },
    ".Container__unchangedElement": {},
    ".Container__element": {
      addStyle: {
        border: "none"
      }
    }
  }));

  adjustContainer(containerElement, containerSize);

  expect(containerElement.querySelectorAll).toHaveBeenCalledWith(
    ".Container__element"
  );
  expect(getContainerSize).toHaveBeenCalledTimes(0);
  expect(getChangedStyles).toHaveBeenCalledWith(
    containerElement,
    containerSize
  );

  // This proves that empty change sets are ignored
  expect(containerElement.style.background).toBe("none");
  expect(containerElement.style.lineHeight).toBe("10px");
  expect(containerElement.style.fontSize).toBe("");
  expect(containerElement.style.border).toBe("");
  // Note: `border: "none"` is normalised to empty string
  expect(containerChildElement1.style.border).toBe("");
  expect(containerChildElement2.style.border).toBe("");
});

test("should respect container boundaries while applying styles", () => {
  const container1 = document.createElement("div");
  const container2 = document.createElement("div");
  const container1Descendant1 = document.createElement("div");
  const container2Descendant = document.createElement("div");
  const container1Descendant2 = document.createElement("div");
  const container1Descendant2Parent = document.createElement("div");
  container1.appendChild(container1Descendant1);
  container1.appendChild(container1Descendant2Parent);
  container1Descendant2Parent.appendChild(container1Descendant2);
  container1.appendChild(container2);
  container2.appendChild(container2Descendant);

  // Simulate the case where Container2 is nested under Container1, and where
  // all child elements respond to the "div" selector
  container1.querySelectorAll = jest.fn(() => [
    container1Descendant1,
    container1Descendant2,
    container2Descendant
  ]);

  containerRegistry.set(container1, {
    queryState: [],
    meta: {
      [SELECTOR]: ".Container",
      [QUERIES]: []
    }
  });

  containerRegistry.set(container2, {
    queryState: [],
    meta: {
      [SELECTOR]: ".Container2",
      [QUERIES]: []
    }
  });

  const containerSize = { width: 1, height: 2 };
  getChangedStyles.mockImplementationOnce(() => ({
    div: {
      addStyle: {
        background: "red"
      }
    },
    // Covers `adjustContainer`'s fallback to an empty `addStyle` object
    ".some-nonexistent-selector-with-empty-change-sets": { removeProps: [] }
  }));

  adjustContainer(container1, containerSize);

  expect(container1Descendant1.style.background).toBe("red");
  expect(container1Descendant2.style.background).toBe("red");
  expect(container2Descendant.style.background).toBe("");
});
