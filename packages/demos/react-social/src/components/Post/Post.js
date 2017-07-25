import ReactDOM from "react-dom";
import React, { Component } from "react";
import Container from "@zeecoder/container-query";
import PropTypes from "prop-types";

require("./Post.pcss");
const queryStats = require("./Post.pcss.json");

export default class Post extends Component {
  componentDidMount() {
    new Container(ReactDOM.findDOMNode(this), queryStats);
  }

  render() {
    return (
      <div className="Post">
        <div className="Post__info">
          <div className="Post__avatar" />
          <div className="Post__name">
            {this.props.post.name}
          </div>
          <div className="Post__username">
            {this.props.post.username}
          </div>
          <div className="Post__since">
            {this.props.post.since}
          </div>
        </div>
        <div className="Post__image" />
        <div className="Post__actions">
          <div className="Post__action">
            <i className="fa fa-retweet" />
          </div>
          <div className="Post__action">
            <i className="fa fa-comment" />
          </div>
          <div className="Post__action">
            <i className="fa fa-heart" />
          </div>
          <div className="Post__action">
            <i className="fa fa-flag" />
          </div>
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  post: PropTypes.shape({
    name: PropTypes.string,
    username: PropTypes.string,
    since: PropTypes.string
  })
};
