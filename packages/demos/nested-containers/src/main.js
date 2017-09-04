// polyfilling
import "core-js/fn/object/assign";

import ReactDOM from "react-dom";
import React from "react";
import App from "./components/App/App";

ReactDOM.render(<App />, document.getElementById("app"));
