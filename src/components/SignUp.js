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
import { setUser } from "../store";
import { withAlert } from 'react-alert'
import NavBar from './NavBar'
import { Header, Icon, Image, Segment, Grid, Button, Card, Form, Checkbox } from 'semantic-ui-react'

const SignUpForm = props => (
  <Grid>
    <Grid.Row centered>
      <Form onSubmit={props.onSubmit} className="signup">
        <label>User Name</label>
        <input name="username" placeholder="User Name" />
        <label>E-mail</label>
        <input name="email" placeholder="Email" />
        <label>Password</label>
        <input name="password" type="password" placeholder="Password" />
        <Button type="submit">Sign Up</Button>
      </Form>
    </Grid.Row>
  </Grid>
)

class SignUp extends Component {
  constructor(props) {
    super(props);
  }

  signUp = async event => {
    event.preventDefault();
    try {
      const username = event.target.username.value
      const email = event.target.email.value
      const password = event.target.password.value

      const user = await auth.createUserWithEmailAndPassword(email, password)
      await user.updateProfile({ displayName: username })
      this.props.setUser(user)
      this.props.history.push('/wagers');
    } catch (error) {
      this.props.alert.show(error.message)
    }
  }

  render() {
    return (
      <div>
      <Segment inverted>
        <NavBar message={'Sign up for an account!'} />
      </Segment>
        <SignUpForm onSubmit={this.signUp} />
      </div>
    );
  }
}

// const mapStateToProps = function(state, ownProps) {
//   return {
//     currentUser: state.user
//   };
// };

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    setUser(user) {
      dispatch(setUser(user))
    }
  };
};

export default withRouter(withAlert(connect(null, mapDispatchToProps)(SignUp)))
