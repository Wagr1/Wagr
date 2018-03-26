import React, { Component } from "react";
import logo from "../logo.svg";
import "./App.css";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import { db, auth, userById } from "../fire/firestore";
import history from "../history";
import store from "../store";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import web3 from "../web3";
import mafiaContract from "../mafiaContract";
import GeneralChat from "./GeneralChat/";
import SingleWagerView from "./SingleWagerView";
import { setUser } from "../store";
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
    const username = event.target.username.value
    const email = event.target.email.value
    const password = event.target.password.value

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
    const email = event.target.email.value
    const password = event.target.password.value
    auth.signInWithEmailAndPassword(email, password)
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
    const { name } = this.props;


    return (
      this.state.signUp ?
      <div>
        <Segment inverted>
          <Header inverted as="h2" icon textAlign="center">
            <Icon name="ethereum" circular />
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
        <Form onSubmit={this.signUp}>
          <label>User Name</label>
          <input name="username" placeholder='User Name' />
          <label>E-mail</label>
          <input name="email" placeholder='Email' />
          <label>Password</label>
          <input name="password" type="password" placeholder='Password' />
          <Button type='submit'>Sign Up</Button>
      </Form>
      </Grid.Row>
      </Grid>
      </div>
      :
      <div>
        <Segment inverted>
          <Header inverted as="h2" icon textAlign="center">
            <Icon name="ethereum" circular />
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
        <Form onSubmit={this.login}>
          <label>E-mail</label>
          <input name="email" placeholder='User Name'/>
          <label id="password">Password</label>
          <input name="password" placeholder='Password' type='password' />
          <Button type='signUp' onClick={this.goToSignUp}>Sign Up</Button>
          <Button type='submit'>Login</Button>
      </Form>
      </Grid.Row>
      </Grid>
      </div>
    );
  }
}

const mapStateToProps = function(state, ownProps) {
  return {
    currentUser: state.user
  };
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    setUser(user) {
      dispatch(setUser(user))
    }
  };
};

export default withRouter(withAlert(connect(mapStateToProps, mapDispatchToProps)(App)))
