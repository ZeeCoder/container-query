import React, { Component } from "react";
import withContainerQuery from "@zeecoder/react-container-query";
import "./Comment.pcss";
import stats from "./Comment.pcss.json";

class Comment extends Component {
  renderChildren() {
    if (!this.props.children) {
      return null;
    }

    return <div className="Comment__container">{this.props.children}</div>;
  }

  render() {
    return (
      <div className="Comment">
        <div className="Comment__main">
          <div className="Comment__avatar" />
          <div className="Comment__text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores
            hic incidunt
          </div>
        </div>
        {this.renderChildren()}
      </div>
    );
  }
}

export default withContainerQuery(Comment, stats);
