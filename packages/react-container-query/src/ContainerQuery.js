import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Container from "@zeecoder/container-query";

export default class ContainerQuery extends Component {
  constructor(props) {
    super(props);

    this.state = { width: 0, height: 0 };

    this.containerOptions = { ...this.props.options };

    // Listen to size changes only if needed
    if (typeof this.props.children === "function") {
      this.containerOptions.handleResize = this.handleResize;
    }
  }

  handleResize = size => {
    if (this.__willUnmount) {
      return;
    }

    this.setState({ size });
  };

  componentDidMount() {
    if (!this.props.meta) {
      return;
    }

    this.lastContainer = ReactDOM.findDOMNode(this);
    new Container(this.lastContainer, this.props.meta, this.containerOptions);
  }

  componentDidUpdate() {
    if (!this.props.meta) {
      return;
    }

    const element = ReactDOM.findDOMNode(this);
    if (this.lastContainer !== element) {
      this.lastContainer = element;
      new Container(this.lastContainer, this.props.meta, this.containerOptions);
    }
  }

  componentWillUnmount() {
    this.__willUnmount = true;
  }

  render() {
    if (typeof this.props.children === "function") {
      return this.props.children(this.state.size);
    } else if (this.props.children) {
      return this.props.children;
    }

    return null;
  }
}

ContainerQuery.defaultProps = {
  meta: null,
  options: {}
};

ContainerQuery.propTypes = {
  meta: PropTypes.object,
  options: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
};
