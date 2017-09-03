import React, { Component } from "react";
import User from "../User/User";

export default class App extends Component {
  renderUsers() {
    const users = [<User key={0} first={true} animate={true} />];
    // Increase to test performance
    const userCount = 1;

    for (let i = 0; i < userCount; i++) {
      users.push(<User key={i + 1} />);
    }

    return users;
  }

  render() {
    return <div>{this.renderUsers()}</div>;
  }
}
