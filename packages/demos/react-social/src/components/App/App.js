import React, { Component } from "react";
import Post from "../Post/Post";
import _random from "lodash/random";

require("./App.pcss");

const postData = [
  {
    name: "Name",
    username: "username"
  }
];

export default class App extends Component {
  renderPosts() {
    const posts = [];
    const postCount = 50;

    for (let i = 0; i < postCount; i++) {
      let post = Object.assign({}, postData[_random(0, postData.length - 1)], {
        since: `${_random(1, 24)}h`
      });

      posts.push(
        <div className="App__post" key={i}>
          <Post post={post} />
        </div>
      );
    }

    return posts;
  }

  render() {
    return <div className="App">{this.renderPosts()}</div>;
  }
}
