import React from "react";
import ReactDOM from "react-dom";

const Test = () => <div id="asd" style={{ background: "grey" }} />;

// todo figure out how to make async-await work in parcel
// todo make sure parcel transpiles down to IE10 (example: async and "Set" doesn't work properly)
it("should render", () => {
  const div = document.createElement("div");
  document.body.appendChild(div);

  ReactDOM.render(<Test />, div);

  const rendered = document.querySelector("#asd");

  expect(rendered.style.backgroundColor).toBe("grey");
});
