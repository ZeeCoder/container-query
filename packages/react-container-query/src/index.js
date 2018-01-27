import React, { Component } from "react";
import ReactDOM from "react-dom";
import Container from "@zeecoder/container-query";

/**
 * A HoC to initialise a single `Container` based on the given stats.
 *
 * @param {Component} WrappedComponent
 * @param {{}} stats
 * @param {{}} [options]
 * @return {Component}
 */
const withContainerQuery = (WrappedComponent, stats, options = {}) => {
  const HoC = class extends Component {
    componentDidMount() {
      new Container(ReactDOM.findDOMNode(this), stats, options);
    }

    render() {
      const { wrappedComponentRef, ...wrappedProps } = this.props;

      return <WrappedComponent ref={wrappedComponentRef} {...wrappedProps} />;
    }
  };

  HoC.displayName =
    "withContainerQuery(" +
    (WrappedComponent.displayName || WrappedComponent.name) +
    ")";
  HoC.WrappedComponent = WrappedComponent;

  return HoC;
};

export default withContainerQuery;
