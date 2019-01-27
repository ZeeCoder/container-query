import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Container from "@zeecoder/container-query";

export default class ContainerQuery extends Component {
  constructor(props) {
    super(props);

    this.state = { size: null };

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
    if (!this.props.meta && !this.props.stats) {
      return;
    }

    this.lastContainer = ReactDOM.findDOMNode(this);
    const meta = this.props.meta || this.props.stats;
    new Container(this.lastContainer, meta, this.containerOptions);
  }

  componentDidUpdate() {
    if (!this.props.meta && !this.props.stats) {
      return;
    }

    const meta = this.props.meta || this.props.stats;

    const element = ReactDOM.findDOMNode(this);
    if (this.lastContainer !== element) {
      this.lastContainer = element;
      new Container(this.lastContainer, meta, this.containerOptions);
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
  stats: null,
  meta: null,
  options: {}
};

ContainerQuery.propTypes = {
  stats: PropTypes.object,
  meta: PropTypes.object,
  options: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
};
