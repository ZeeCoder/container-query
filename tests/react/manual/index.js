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
// todo test multiple instances of the same container
describe("Manual", () => {
  const refs = {};
  beforeAll(() => {
    clearDOM();
    refs.root = document.createElement("div");

    refs.container1 = document.createElement("div");
    refs.container1.className = "Container1";

    refs.container2 = document.createElement("div");
    refs.container2.className = "Container2";

    refs.root.appendChild(refs.container1);
    refs.root.appendChild(refs.container2);

    refs.root.style.width = "100px";
    document.body.appendChild(refs.root);

    // todo Fix potential endless loop
    // `new Container` gets in an endless for loop if it's attached to an element
    // that's not yet added to the dom for some reason.
    new Container(refs.container1, meta[".Container1"]);
    new Container(refs.container2, meta[".Container2"]);
  });

  it("should not see container query styles on start", async () => {
    await waitForElementToHaveStyle(refs.container1, {
      backgroundColor: "rgb(255, 0, 0)"
    });
  });

  it("should see a change in Container1 but not Container2", async () => {
    refs.root.style.width = "101px";

    await waitForElementToHaveStyle(refs.container1, {
      backgroundColor: "rgb(0, 255, 0)"
    });
  });

  it("should see changes in both Container1 and Container2", async () => {
    refs.container2.style.height = "31px";

    await waitForElementToHaveStyle(refs.container2, {
      backgroundColor: "rgb(0, 255, 0)"
    });
  });

  it("should revert changes in Container1", async () => {
    refs.root.style.width = "100px";

    await waitForElementToHaveStyle(refs.container1, {
      backgroundColor: "rgb(255, 0, 0)"
    });
  });

  it("should revert changes in both Container1 and Container2", async () => {
    refs.container2.style.height = "";

    await waitForElementToHaveStyle(refs.container1, {
      backgroundColor: "rgb(255, 0, 0)"
    });

    await waitForElementToHaveStyle(refs.container2, {
      backgroundColor: "rgb(255, 0, 0)"
    });
  });
});
