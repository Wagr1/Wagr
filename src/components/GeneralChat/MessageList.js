import React, { Component } from "react";
// import './App.css';
// import App from './App'
import { Switch, Route, Link, withRouter } from "react-router-dom";
import { db, auth, userById } from "../../fire/firestore";
import { connect } from "react-redux";
import Message from "./Message";
import logo from "../../logo.svg";
import { Comment } from "semantic-ui-react";
import { ScrollBox } from "react-scroll-box";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      currentUser: "",
      userName: '',
      recipientName: '',
      wager: this.props.wager,
      wagerA: [],
      wagerB: [],
      chatType: this.props.chatType
    };
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentDidMount() {
    if (this.props.recipientName) this.setState({recipientName: this.props.recipientName})
    console.log(this.state)
    if (this.state.chatType === "wager") {
      let wager = this.state.wager;

      db
        .collection("wagers")
        .doc(wager)
        .collection("wagerChat")
        .orderBy("sentAt")
        .onSnapshot(snapshot => {
          this.setState({
            messages: snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.ref.id,
                content: data.content,
                from: data.uid,
                sentAt: (data.sentAt).toString()
              };
            })
          });
        });
      // this.scrollToBottom();
    } else if (this.state.chatType === 'general') {
      db
        .collection("generalChat")
        .orderBy("sentAt")
        .onSnapshot(snapshot => {
          this.setState({
            messages: snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.ref.id,
                content: data.content,
                from: data.uid,
                sentAt: (data.sentAt).toString()
              };
            })
          });
        });
      // this.scrollToBottom();
    }
    else {
      console.log(this.props)
      db
        .collection("privateChats")
        .doc(this.props.recipientName)
        .collection('messages')
        .orderBy("sentAt")
        .onSnapshot(snapshot => {
          this.setState({
            messages: snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.ref.id,
                content: data.content,
                from: data.uid,
                sentAt: (data.sentAt).toString()
              };
            })
          });
        });
      }
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  render() {
    const { messages } = this.state;
    return (
      <div className="overflow">
        <Comment.Group>
          {messages.map(message => (
            <Message
              key={message.id}
              message={message}
              wager={this.state.wager}
              sentAt={this.state.sentAt}
            />
          ))}
          <div
            style={{ float: "left", clear: "both" }}
            ref={el => {
              this.messagesEnd = el;
            }}
          />
        </Comment.Group>
      </div>
    );
  }
}

const mapStateToProps = function(state, ownProps) {
  return {
    recipientName: state.DirectChat,
    userName: state.userName
  }
}

export default withRouter(connect(mapStateToProps, null)(MessageList));
