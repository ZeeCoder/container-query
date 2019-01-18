import React from "react";
import Container, { styles } from "./Container/Container";
import {
  renderTestComponent,
  changeRootSize,
  clearDOM,
  waitForElementToHaveStyle
} from "../../utils";
import { getByTestId } from "dom-testing-library";

// Features covered:
// - Non OOCSS classes should work (for example, if it's not BEM)
// - If an "element" class is used somewhere, but has no container, then it shouldn't change styles
// - Containers should have boundaries: a container that has another container
//   as a child, should not affect the latter even if they're the same container types
// - Tests whether the lib can work with CSS-modules built in to css-loader
// - Tests r-units
// todo add css-modules, and export the classes for reuse
describe("Non OOCSS", () => {
  const refs = {};
  beforeAll(() => {
    clearDOM();
    renderTestComponent(
      <Container id="1">
        <Container id="2">
          <Container id="3" />
        </Container>
      </Container>,
      {
        width: 100,
        height: 100
      }
    );

    refs.root1 = getByTestId(document.body, "root-1");
    refs.marker1 = getByTestId(refs.root1, "marker-1");
    refs.child1 = getByTestId(refs.root1, "child-1");
    refs.root2 = getByTestId(document.body, "root-2");
    refs.marker2 = getByTestId(refs.root2, "marker-2");
    refs.child2 = getByTestId(refs.root2, "child-2");
    refs.root3 = getByTestId(document.body, "root-3");
    refs.marker3 = getByTestId(refs.root3, "marker-3");

    const wrapper = document.createElement("div");
    wrapper.style.width = "100px";
    wrapper.style.height = "100px";
    wrapper.style.position = "absolute";
    wrapper.style.left = "0";
    wrapper.style.bottom = "0";

    refs.unrelatedContainer = document.createElement("div");
    refs.unrelatedContainer.className = styles.container;
    wrapper.appendChild(refs.unrelatedContainer);
    refs.unrelatedMarker = document.createElement("div");
    refs.unrelatedMarker.className = styles.marker;
    wrapper.appendChild(refs.unrelatedMarker);
    refs.unrelatedChild = document.createElement("div");
    refs.unrelatedChild.className = styles.child;
    wrapper.appendChild(refs.unrelatedChild);

    document.body.appendChild(wrapper);
  });

  /**
   * Even though these elements have the classes used in the tested containers,
   * they should at no point change styles, as they are not inside a container.
   * @return {Promise}
   */
  const expectUnrelatedElementsToBeUntouched = async () => {
    await waitForElementToHaveStyle(refs.unrelatedContainer, {
      width: "100px",
      height: "100px"
    });
    await waitForElementToHaveStyle(refs.unrelatedMarker, {
      width: "0px",
      height: "100px",
      backgroundColor: "rgb(255, 0, 0)"
    });
    await waitForElementToHaveStyle(refs.unrelatedChild, {
      width: "0px",
      height: "0px"
    });
  };

  it("should render container query styles with non-oocss classnames", async () => {
    await waitForElementToHaveStyle(refs.marker1, {
      backgroundColor: "rgb(255, 0, 0)",
      width: "30px"
    });

    await waitForElementToHaveStyle(refs.marker2, {
      backgroundColor: "rgb(255, 0, 0)",
      width: "21px"
    });

    await waitForElementToHaveStyle(refs.marker3, {
      backgroundColor: "rgb(255, 0, 0)",
      width: "15px"
    });

    // Child wrappers should be adjusted with rh
    await waitForElementToHaveStyle(refs.child1, {
      height: "90px"
    });
    await waitForElementToHaveStyle(refs.child2, {
      height: "81px"
    });

    await expectUnrelatedElementsToBeUntouched();
  });

  it("should change the first container's styles only", async () => {
    changeRootSize({ width: 101 });

    await waitForElementToHaveStyle(refs.marker1, {
      backgroundColor: "rgb(0, 255, 0)",
      width: "30px"
    });

    await waitForElementToHaveStyle(refs.marker2, {
      backgroundColor: "rgb(255, 0, 0)",
      width: "21px"
    });

    await waitForElementToHaveStyle(refs.marker3, {
      backgroundColor: "rgb(255, 0, 0)",
      width: "15px"
    });

    // Child wrapper heights should not change
    await waitForElementToHaveStyle(refs.child1, {
      height: "90px"
    });
    await waitForElementToHaveStyle(refs.child2, {
      height: "81px"
    });

    await expectUnrelatedElementsToBeUntouched();
  });

  it("should change the second container's styles only", async () => {
    changeRootSize({ width: 144 });

    await waitForElementToHaveStyle(refs.marker1, {
      backgroundColor: "rgb(0, 0, 255)",
      width: "43px"
    });

    await waitForElementToHaveStyle(refs.marker2, {
      backgroundColor: "rgb(0, 255, 0)",
      width: "30px"
    });

    await waitForElementToHaveStyle(refs.marker3, {
      backgroundColor: "rgb(255, 0, 0)",
      width: "21px"
    });

    // Child wrapper heights should not change
    await waitForElementToHaveStyle(refs.child1, {
      height: "90px"
    });
    await waitForElementToHaveStyle(refs.child2, {
      height: "81px"
    });

    await expectUnrelatedElementsToBeUntouched();
  });

  it("should change the third container's styles only", async () => {
    changeRootSize({ width: 205 });

    await waitForElementToHaveStyle(refs.marker1, {
      backgroundColor: "rgb(0, 0, 255)",
      width: "62px"
    });

    await waitForElementToHaveStyle(refs.marker2, {
      backgroundColor: "rgb(0, 0, 255)",
      width: "43px"
    });

    await waitForElementToHaveStyle(refs.marker3, {
      backgroundColor: "rgb(0, 255, 0)",
      width: "30px"
    });

    // Child wrapper heights should not change
    await waitForElementToHaveStyle(refs.child1, {
      height: "90px"
    });
    await waitForElementToHaveStyle(refs.child2, {
      height: "81px"
    });

    await expectUnrelatedElementsToBeUntouched();
  });

  it("should change the last container once again", async () => {
    changeRootSize({ width: 287 });

    await waitForElementToHaveStyle(refs.marker1, {
      backgroundColor: "rgb(0, 0, 255)",
      width: "86px"
    });

    await waitForElementToHaveStyle(refs.marker2, {
      backgroundColor: "rgb(0, 0, 255)",
      width: "60px"
    });

    await waitForElementToHaveStyle(refs.marker3, {
      backgroundColor: "rgb(0, 0, 255)",
      width: "42px"
    });

    // Child wrapper heights should not change
    await waitForElementToHaveStyle(refs.child1, {
      height: "90px"
    });
    await waitForElementToHaveStyle(refs.child2, {
      height: "81px"
    });

    await expectUnrelatedElementsToBeUntouched();
  });

  it("should be able reset to the default styles, with a different height", async () => {
    changeRootSize({ width: 100, height: 200 });

    await waitForElementToHaveStyle(refs.marker1, {
      backgroundColor: "rgb(255, 0, 0)",
      width: "30px"
    });

    await waitForElementToHaveStyle(refs.marker2, {
      backgroundColor: "rgb(255, 0, 0)",
      width: "21px"
    });

    await waitForElementToHaveStyle(refs.marker3, {
      backgroundColor: "rgb(255, 0, 0)",
      width: "15px"
    });

    // Child wrappers should be adjusted with rh
    await waitForElementToHaveStyle(refs.child1, {
      height: "180px"
    });
    await waitForElementToHaveStyle(refs.child2, {
      height: "162px"
    });

    await expectUnrelatedElementsToBeUntouched();
  });
});
