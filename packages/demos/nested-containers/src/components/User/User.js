import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Container from "@zeecoder/container-query";
import SocialContainer from "../SocialContainer/SocialContainer";
import SocialLink from "../SocialLink/SocialLink";

require("./User.pcss");
const queryStats = require("./User.pcss.json");

export default class User extends Component {
  componentDidMount() {
    const element = ReactDOM.findDOMNode(this);
    new Container(element, queryStats);

    if (!this.props.animate) {
      return;
    }

    const startAnimating = () => {
      let isWide = false;

      const doAnimate = () => {
        if (isWide) {
          element.style.setProperty("width", "100px");
        } else {
          element.style.setProperty("width", "700px");
        }

        isWide = !isWide;

        setTimeout(doAnimate, 1000);
      };

      doAnimate();
    };

    setTimeout(startAnimating, 3000);
  }

  render() {
    return (
      <div className={`User ${this.props.first ? "User--1" : "User--2"}`}>
        <div className="User__info">
          <div>
            <div className="User__image" />
          </div>
          <div className="User__name">Some Long Name</div>
        </div>

        <div className="User__social">
          <SocialContainer>
            <SocialLink type="twitter" />
            <SocialLink type="instagram" />
            <SocialLink type="github" />
            <SocialLink type="linkedin" />
            <SocialLink type="medium" />
          </SocialContainer>
        </div>
      </div>
    );
  }
}

User.defaultProps = {
  first: false,
  animate: false
};

User.propTypes = {
  first: PropTypes.bool,
  animate: PropTypes.bool
};
