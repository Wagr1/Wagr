import React, { Component } from "react";
import logo from "../logo.svg";
import "./app.css";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import { db, auth, userById } from "../fire/firestore";
import history from "../history";
import store from "../store";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import web3 from "../web3";
import mafiaContract from "../mafiaContract";
import SingleWagerView from "./singleWagerView";
import { writeUsername } from "../store";
import { writePassword } from "../store";
import { Header, Icon, Image, Segment, Grid, Button, Card, Form, Checkbox } from 'semantic-ui-react'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
    this.login = this.login.bind(this)
    this.signUp = this.signUp.bind(this)
  }

  componentDidMount() {

  }

  signUp = event => {

    this.props.history.push('/');
  }

  login = event => {
    event.preventDefault();
    let username = this.props.newUsernameEntry
    let password = this.props.newPasswordEntry
    auth.signInWithEmailAndPassword(username, password)
    .then(() => {
      this.props.history.push('/wagers');
    })
    .catch(error => {
      console.log(error.message)
    });
    // console.log(auth.currentUser.email)

  }

  render() {
    const { name, newUsernameEntry, newPasswordEntry, handleChangeUsername, handleChangePassword } = this.props;

    return (
      <div>
        <Segment inverted>
          <Header inverted as="h2" icon textAlign="center">
            <Icon name="ethereum" circular />
            <Header.Content>
              <h2 className="ui red header">
                Welcome 2 Wagr
            </h2>
            </Header.Content>
            <Header.Content>
              <h2 className="ui red header">
                Please sign in to enter!
              </h2>
            </Header.Content>
          </Header>
        </Segment>
        <Grid>
        <Grid.Row centered>
        <Form onSignUp={evt => this.signUp(evt)}
              onLogin={evt => this.login(evt)}>
          <label>User Name</label>
          <input placeholder='User Name' onChange={handleChangeUsername} value={newUsernameEntry} />
          <label>Password</label>
          <input placeholder='Password' onChange={handleChangePassword} value={newPasswordEntry} />
          <label>     </label>
          <Button type='signUp' onClick={this.signUp}>Submit</Button>
          <Button type='login' onClick={this.login}>Login</Button>
      </Form>
      </Grid.Row>
      </Grid>
      </div>
    );
  }
}
const mapStateToProps = function(state, ownProps) {
  return {
    newUsernameEntry: state.newUsernameEntry,
    newPasswordEntry: state.newPasswordEntry
  };
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    handleChangeUsername(evt) {
      dispatch(writeUsername(evt.target.value));
    },
    handleChangePassword(evt) {
      dispatch(writePassword(evt.target.value));
    },
    clearForm() {
      dispatch(writeUsername(""));
    }
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
