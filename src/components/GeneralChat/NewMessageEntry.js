import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { db, auth } from "../../fire/firestore";
import { connect } from "react-redux";
import { writeMessage } from "../../store";
import { Form, Button } from "semantic-ui-react";
import '../App.css'

class NewMessageEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wager: this.props.wager,
      chatType: this.props.chatType
    };
    this.sendMessage = this.sendMessage.bind(this);
  }

  sendMessage = event => {
    console.log(event.target.message.value)
    const message = event.target.message.value
    if (this.state.chatType === 'wager'){
    const wager = this.state.wager;
    event.preventDefault();

    db
      .collection("wagers")
      .doc(wager)
      .collection("wagerChat")
      .add({
        uid: auth.currentUser.displayName,
        content: message,
        sentAt: Date(Date.now()).toString()
      });
      event.target.message.value =""
    }
    else {
      event.preventDefault();
      db
        .collection('generalChat')
        .add({
          uid: auth.currentUser.displayName,
          content: message,
          sentAt: Date(Date.now()).toString()
        });
        event.target.message.value = ""
    }
  };

  render() {
    return (
      <Form onSubmit={this.sendMessage}>
        <input name="message" placeholder="Your reply" />
        <Button type="submit" content="Add Reply" labelPosition="left" icon="edit" primary />
      </Form>
    );
  }
}

export default NewMessageEntry;
