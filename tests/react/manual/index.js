import React from "react";
import { clearDOM, waitForElementToHaveStyle } from "../../utils";
import "./styles.dist.pcss";
import Container from "../../../packages/container-query/dist/bundle.esm";
import meta from "./styles.meta.json";

// Features covered:
// - Should work in any environment, regardless of UI / component lib
// - Multiple containers should work in a single stylesheet
// - Uses `getMetadataFromMessages` to get the meta and save it as a JSON before
//   bundling it with webpack
describe("Manual", () => {
  const refs = {};
  beforeAll(() => {
    clearDOM();
    refs.root = document.createElement("div");

    refs.container1 = document.createElement("div");
    refs.container1.className = "ContainerType1";

    refs.container2 = document.createElement("div");
    refs.container2.className = "ContainerType1";

    refs.container3 = document.createElement("div");
    refs.container3.className = "ContainerType2";

    refs.container4 = document.createElement("div");
    refs.container4.className = "ContainerType2";

    refs.root.appendChild(refs.container1);
    refs.root.appendChild(refs.container2);
    refs.root.appendChild(refs.container3);
    refs.root.appendChild(refs.container4);

    document.body.appendChild(refs.root);

    // `new Container` gets in an endless for loop if it's attached to an element
    // that's not yet added to the dom for some reason.
    new Container(refs.container1, meta[".ContainerType1"]);
    new Container(refs.container2, meta[".ContainerType1"]);
    new Container(refs.container3, meta[".ContainerType2"]);
    new Container(refs.container4, meta[".ContainerType2"]);
  });

  it("should not see container query styles on start", async () => {
    await waitForElementToHaveStyle(refs.container1, {
      backgroundColor: "rgb(255, 0, 0)"
    });
    await waitForElementToHaveStyle(refs.container2, {
      backgroundColor: "rgb(255, 0, 0)"
    });
    await waitForElementToHaveStyle(refs.container3, {
      backgroundColor: "rgb(255, 0, 0)"
    });
    await waitForElementToHaveStyle(refs.container4, {
      backgroundColor: "rgb(255, 0, 0)"
    });
  });

  it("should see a change in container1 but not the rest", async () => {
    refs.container1.style.width = "200px";

    await waitForElementToHaveStyle(refs.container1, {
      backgroundColor: "rgb(0, 255, 0)"
    });
  });

  it("should see a change in container2 but not the rest", async () => {
    refs.container2.style.width = "200px";

    await waitForElementToHaveStyle(refs.container2, {
      backgroundColor: "rgb(0, 255, 0)"
    });
  });

  it("should see a change in container3 but not the rest", async () => {
    refs.container3.style.height = "60px";

    await waitForElementToHaveStyle(refs.container3, {
      backgroundColor: "rgb(0, 255, 0)"
    });
  });

  it("should see a change in container4 but not the rest", async () => {
    refs.container4.style.height = "60px";

    await waitForElementToHaveStyle(refs.container4, {
      backgroundColor: "rgb(0, 255, 0)"
    });
  });

  it("should revert the changes in all containers", async () => {
    refs.container1.style.width = "";
    refs.container2.style.width = "";
    refs.container3.style.height = "";
    refs.container4.style.height = "";

    await waitForElementToHaveStyle(refs.container1, {
      backgroundColor: "rgb(255, 0, 0)"
    });
    await waitForElementToHaveStyle(refs.container2, {
      backgroundColor: "rgb(255, 0, 0)"
    });
    await waitForElementToHaveStyle(refs.container3, {
      backgroundColor: "rgb(255, 0, 0)"
    });
    await waitForElementToHaveStyle(refs.container4, {
      backgroundColor: "rgb(255, 0, 0)"
    });
  });
});
