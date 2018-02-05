import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import ResizeObserver from "resize-observer-polyfill";
import WeakMap from "es6-weak-map";

const registry = new WeakMap();

const resizeObserver = new ResizeObserver(entries => {
  entries.forEach(entry => {
    const instance = registry.get(entry.target);
    if (!instance) {
      return;
    }

    instance.handleResize(entry.contentRect);
  });
});

export default class ResizeObserverComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { size: null };

    this.lastRegisteredElement = null;
  }

  componentDidMount() {
    const element = ReactDOM.findDOMNode(this);

    if (element) {
      registry.set(element, this);
      resizeObserver.observe(element);
      this.lastRegisteredElement = element;
    }
  }

  handleResize(size) {
    this.setState({ size });
  }

  componentWillUnmount() {
    if (this.lastRegisteredElement) {
      registry.delete(this.lastRegisteredElement);
      resizeObserver.unobserve(this.lastRegisteredElement);
    }
  }

  componentDidUpdate() {
    const element = ReactDOM.findDOMNode(this);
    if (this.lastRegisteredElement === element) {
      return;
    }

    if (this.lastRegisteredElement !== null) {
      registry.delete(this.lastRegisteredElement);
      resizeObserver.unobserve(this.lastRegisteredElement);
      this.lastRegisteredElement = null;
    }

    if (element) {
      registry.set(element, this);
      resizeObserver.observe(element);
      this.lastRegisteredElement = element;
    }
  }

  render() {
    return this.props.render(this.state.size);
  }
}

ResizeObserverComponent.propTypes = {
  render: PropTypes.func
};
