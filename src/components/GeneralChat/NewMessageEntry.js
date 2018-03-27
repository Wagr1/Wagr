import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { db, auth } from "../../fire/firestore";
import { connect } from "react-redux";
import { writeMessage } from "../../store";
import { Form, Button } from "semantic-ui-react";
import "../App.css"

class NewMessageEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wager: this.props.wager,
      chatType: this.props.chatType
    };
    this.sendMessage = this.sendMessage.bind(this);
  }

  sendMessage = (evt, message) => {
    if (this.state.chatType === 'wager'){
    let wager = this.state.wager;
    evt.preventDefault();

    db
      .collection("wagers")
      .doc(wager)
      .collection("wagerChat")
      .add({
        uid: auth.currentUser.displayName,
        content: message,
        sentAt: Date(Date.now()).toString()
      });
    this.props.clearForm();
    }
    else {
      evt.preventDefault();
      db
        .collection('generalChat')
        .add({
          uid: auth.currentUser.displayName,
          content: message,
          sentAt: Date(Date.now()).toString()
        });
      this.props.clearForm();
    }
  };

  render() {
    const { name, newMessageEntry, handleChange, handleSubmit } = this.props;
    return (
      <Form reply onSubmit={evt => this.sendMessage(evt, newMessageEntry)}>
      <div id= "chat">
        <Form.TextArea
          type="text"
          value={newMessageEntry}
          onChange={handleChange}
          placeholder="Say something nice..."
          />
        </div>
        <Button content="Add Reply" labelPosition="left" icon="edit" primary />
      </Form>
    );
  }
}

const mapStateToProps = function(state, ownProps) {
  return {
    newMessageEntry: state.newMessageEntry
  };
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    handleChange(evt) {
      dispatch(writeMessage(evt.target.value));
    },
    clearForm() {
      dispatch(writeMessage(""));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewMessageEntry);
