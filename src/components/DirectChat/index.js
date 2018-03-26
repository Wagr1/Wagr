import React, { Component } from "react";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import { db, auth } from "../../fire/firestore";
import { connect } from "react-redux";
import logo from "../../logo.svg";
import { Form, Button } from "semantic-ui-react";

class DirectChatCreation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = event => {
    event.preventDefault();
    this.setState({user: event.target.value})
  }
  
  handleSubmit = event => {
    event.preventDefault();
    const chatName = auth.currentUser.email + this.state.user
    db
      .collection("privateChats")
      .doc('privateChats')
      .collection(chatName)
      .add({
        uid: "DM Bot",
        content: 'This is the beginning of your private message with ' + this.state.user,
        sentAt: Date(Date.now()).toString()
      })
    this.props.history.push({
      pathname: `/profile/${auth.currentUser.email}/${this.state.user}/`,
    state: {
      userName: auth.currentUser.email,
      recipientName: this.state.user
    }});
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Input onChange={this.handleChange} label="Enter User Name" default="Enter User Name" value={this.state.user} />
        <Button label='Submit'/>
        </Form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {

}

export default withRouter(DirectChatCreation);
