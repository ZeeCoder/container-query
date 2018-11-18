import React, { Component } from "react";
import ReactDOM from "react-dom";
import Container from "@zeecoder/container-query";
import { meta } from "./SocialContainer.pcss";

export default class SocialContainer extends Component {
  componentDidMount() {
    const element = ReactDOM.findDOMNode(this);
    new Container(element, meta);
  }

  renderChildren() {
    return this.props.children.map((component, index) => {
      return (
        <div className="SocialContainer__cell" key={index}>
          {component}
        </div>
      );
    });
  }

  render() {
    return <div className="SocialContainer">{this.renderChildren()}</div>;
  }
}
