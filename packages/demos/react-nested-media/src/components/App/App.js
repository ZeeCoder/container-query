import React, { Component } from "react";
import Comment from "../Comment/Comment";
import "./App.pcss";

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

export default App;
