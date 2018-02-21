import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Container from "@zeecoder/container-query";
import objectAssign from "object-assign";

export default class ContainerQuery extends Component {
  constructor(props) {
    super(props);

    this.state = { size: null };

    this.handleResize = this.handleResize.bind(this);

    this.containerOptions = objectAssign({}, this.props.options, {
      handleResize: this.handleResize
    });
  }

  handleResize(size) {
    if (this.unMounting) {
      return;
    }

    this.setState({ size });
  }

  componentDidMount() {
    if (!this.props.stats) {
      return;
    }

    this.lastContainer = ReactDOM.findDOMNode(this);
    new Container(this.lastContainer, this.props.stats, this.containerOptions);
  }

  componentDidUpdate() {
    if (!this.props.stats) {
      return;
    }

    const element = ReactDOM.findDOMNode(this);
    if (this.lastContainer !== element) {
      this.lastContainer = element;
      new Container(
        this.lastContainer,
        this.props.stats,
        this.containerOptions
      );
    }
  }

  componentWillUnmount() {
    this.unMounting = true;
  }

  render() {
    return this.props.render(this.state.size);
  }
}

ContainerQuery.defaultProps = {
  stats: {},
  options: {}
};

ContainerQuery.propTypes = {
  render: PropTypes.func,
  stats: PropTypes.object,
  options: PropTypes.object
};
