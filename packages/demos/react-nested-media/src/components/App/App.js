import React, { Component } from "react";
import Comment from "../Comment/Comment";
import withContainerQuery from "@zeecoder/react-container-query";
import "./App.pcss";
import stats from "./App.pcss.json";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Comment>
          <Comment />
          <Comment />
        </Comment>
        <Comment>
          <Comment>
            <Comment />
            <Comment />
          </Comment>
          <Comment />
        </Comment>
      </div>
    );
  }
}

export default withContainerQuery(App, stats);
