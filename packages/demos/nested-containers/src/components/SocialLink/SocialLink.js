import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Container from "@zeecoder/container-query";

require("./SocialLink.pcss");
const queryStats = require("./SocialLink.pcss.json");

export default class SocialLink extends Component {
  componentDidMount() {
    const element = ReactDOM.findDOMNode(this);
    new Container(element, queryStats);
  }

  render() {
    if (this.props.type === "twitter") {
      return (
        <a className="SocialLink" href="https://twitter.com/ZeeCoder">
          <i className="SocialLink__icon fa fa-twitter" />
          <div className="SocialLink__name">Twitter</div>
        </a>
      );
    } else if (this.props.type === "instagram") {
      return (
        <a className="SocialLink" href="https://instagram.com/zeecoder">
          <i className="SocialLink__icon fa fa-instagram" />
          <div className="SocialLink__name">Instagram</div>
        </a>
      );
    } else if (this.props.type === "github") {
      return (
        <a className="SocialLink" href="https://github.com/ZeeCoder">
          <i className="SocialLink__icon fa fa-github" />
          <div className="SocialLink__name">GitHub</div>
        </a>
      );
    } else if (this.props.type === "linkedin") {
      return (
        <a
          className="SocialLink"
          href="https://www.linkedin.com/in/hubertviktor/"
        >
          <i className="SocialLink__icon fa fa-linkedin" />
          <div className="SocialLink__name">LinkedIn</div>
        </a>
      );
    } else if (this.props.type === "medium") {
      return (
        <a className="SocialLink" href="https://medium.com/@ZeeCoder">
          <i className="SocialLink__icon fa fa-medium" />
          <div className="SocialLink__name">Medium</div>
        </a>
      );
    }
  }
}

SocialLink.propTypes = {
  type: PropTypes.string
};
