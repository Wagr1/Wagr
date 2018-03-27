import React, { Component } from "react";
import logo from "../logo.svg";
import "./App.css";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import { db, auth, userById } from "../fire/firestore";
import history from "../history";
import store from "../store";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import web3 from "../ether/web3";
import GeneralChat from "./GeneralChat/";
import SingleWagerView from "./SingleWagerView";
import { writeUsername, writePassword, writeEmail, setUser } from "../store";
import { withAlert } from 'react-alert'
import { Header, Icon, Image, Segment, Grid, Button, Card, Form, Checkbox } from 'semantic-ui-react'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signUp: false
    };
    this.login = this.login.bind(this)
    this.signUp = this.signUp.bind(this)
    this.goToSignUp = this.goToSignUp.bind(this)
  }


  signUp = event => {
    event.preventDefault();
    let username = this.props.newUsernameEntry
    let email = this.props.newEmailEntry
    let password = this.props.newPasswordEntry

    auth.createUserWithEmailAndPassword(email, password)
    .then(async (user) => {
      await user.updateProfile({
        displayName: username
      })
      this.props.setUser(user)
      this.props.history.push('/wagers');
    })
    .catch(error => {
      this.props.alert.show(error.message)
  })
}

  login = event => {
    event.preventDefault();
    let username = this.props.newEmailEntry
    let password = this.props.newPasswordEntry
    auth.signInWithEmailAndPassword(username, password)
    .then((user) => {
      this.props.setUser(user)
      this.props.history.push('/wagers');
    })
    .catch(error => {
      this.props.alert.show(error.message)

    });
  }

  goToSignUp = event => {
    event.preventDefault();
    this.setState({
      signUp: true
    })
  }

  render() {
    const { name, newEmailEntry, newUsernameEntry, newPasswordEntry, handleChangeEmail, handleChangeUsername, handleChangePassword } = this.props;


    return (
      this.state.signUp ?
      <div style={{
        fontFamily: "Courier New, Courier, monospace"
      }} >
        <Segment inverted>
          <Header inverted as="h2" icon textAlign="center">
          <i className="ethereum icon circular"></i>
            <Header.Content>
              <h2 className="ui blue header">
                Welcome 2 Wagr
            </h2>
            </Header.Content>
            <Header.Content>
              <h2 className="ui blue header">
                Sign up for an account!
              </h2>
            </Header.Content>
          </Header>
        </Segment>
        <Grid>
        <Grid.Row centered>
        <Form className= "signup">
          <label>User Name</label>
          <input placeholder='User Name' onChange={handleChangeUsername} value={newUsernameEntry} />
          <label>E-mail</label>
          <input placeholder='Email' onChange={handleChangeEmail} value={newEmailEntry} />
          <label>Password</label>
          <input placeholder='Password' onChange={handleChangePassword} value={newPasswordEntry} type='password' />
          <Button type='signUp' onClick={this.signUp}>Sign Up</Button>
      </Form>
      </Grid.Row>
      </Grid>
      </div>
      :
      <div>
        <Segment inverted>
          <Header inverted as="h2" icon textAlign="center">
          <i className="ethereum icon circular"></i>
            <Header.Content>
              <h2 className="ui blue header">
                Welcome 2 Wagr
            </h2>
            </Header.Content>
            <Header.Content>
              <h2 className="ui blue header">
                Please login to continue. Don't Have an account? Sign up for one!
              </h2>
            </Header.Content>
          </Header>
        </Segment>
        <Grid>
        <Grid.Row centered>
        <Form className= "signin">
          <label>E-mail</label>
          <input placeholder='User Name' onChange={handleChangeEmail} value={newEmailEntry} />
          <label>Password</label>
          <input placeholder='Password' onChange={handleChangePassword} value={newPasswordEntry} type='password' />
          <Button type='signUp' onClick={this.goToSignUp}>Sign Up</Button>
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
    newEmailEntry: state.newEmailEntry,
    newPasswordEntry: state.newPasswordEntry,
    currentUser: state.user
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
    handleChangeEmail(evt) {
      dispatch(writeEmail(evt.target.value))
    },
    clearForm() {
      dispatch(writeUsername(""));
    },
    setUser(user) {
      dispatch(setUser(user))
    }
  };
};

export default withRouter(withAlert(connect(mapStateToProps, mapDispatchToProps)(App)))
