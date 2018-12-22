import React, { Component } from "react";
import PropTypes from "prop-types";
import Container from "@zeecoder/container-query";

class ContainerQuery extends Component {
  constructor(props) {
    super(props);

    this.options = { ...this.props.options };

    // Listen to size changes only if needed
    if (typeof this.props.children === "function") {
      this.options.handleResize = this.handleResize;
    }
  }

  state = { width: 1, height: 1 };

  ref = React.createRef();

  handleResize = size => {
    if (this.__willUnmount) {
      return;
    }

    this.setState(size);
  };

  componentDidMount() {
    new Container(this.ref.current, this.props.meta, this.options);
  }

  componentWillUnmount() {
    this.__willUnmount = true;
  }

  render() {
    // Removing all props only used by this component, and only passing
    // through the rest that was supposedly meant for the wrapped child
    const { options, as, meta, children, ...props } = this.props;

    // Needs to start with a capital letter for the jsx compiler.
    // @see https://stackoverflow.com/a/38823404
    const TagName = as;

    return (
      <TagName {...props} ref={this.ref}>
        {this.doRender()}
      </TagName>
    );
  }

  doRender() {
    if (typeof this.props.children === "function") {
      return this.props.children(this.state.width, this.state.height);
    } else if (this.props.children) {
      return this.props.children;
    }

    return null;
  }
}

ContainerQuery.defaultProps = {
  options: {},
  as: "div"
};

ContainerQuery.propTypes = {
  options: PropTypes.object,
  as: PropTypes.string,
  meta: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired
};

export default ContainerQuery;
