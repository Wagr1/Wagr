import React, { Component } from "react";
import logo from "../logo.svg";
import "./App.css";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import { db, auth } from "../fire/firestore";
import history from "../history";
import store from "../store";
import { browserHistory } from "react-router";
import basketball from "./basketball.png";
import {
  Header,
  Icon,
  Image,
  Segment,
  Grid,
  Button,
  Card,
  Dropdown
} from "semantic-ui-react";
import { connect } from "react-redux";
import Wager from "../ether/wagers";
import web3 from "../ether/web3";
import NavBar from './NavBar'
import HomeButton from './HomeButton'
import RenderWagers from "./RenderWagers";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wager: this.props.wager,
      metamask: "",
      listOfWagers: []
    };
    this.goHome = this.goHome.bind(this);
  }

  goHome = event => {
    this.props.history.push("/wagers");
  };

  async componentDidMount() {
    try {
      const accounts = await web3.eth.getAccounts();
      this.setState({
        metamask: accounts[0]
      });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const headerMessage = "Hello " + auth.currentUser.displayName
    const wagerList = this.props.listOfWagers;

    const managedWagers = wagerList.filter(wager => {
      return wager.manager === this.state.metamask && !wager.complete;
    });

    const inTheseWagers = wagerList.filter(wager => {
      return wager.side1.concat(wager.side2).indexOf(this.state.metamask) > -1;
    });

    return (
      <div>
        <Segment inverted textAlign="center">
          <NavBar message={headerMessage} />
          <HomeButton goHome={this.goHome} />
        </Segment>

        <Header as="h1" icon textAlign="center">
          <Icon name="hourglass half" circular />
          <Header.Content>Wager Status</Header.Content>
        </Header>

        <Grid columns={2}>
          <Grid.Column>
            <Header as='h2' textAlign='centered'>Wagers you are currently managing:</Header>
            {managedWagers.length ? (
              <RenderWagers wagerList={managedWagers} columns={3} />
            ) : (
                <div>
                  <Grid.Column />
                  <Grid.Column>
                    <br /><br />
                    <Header as='h3' textAlign='centered'>You are not currently managing any wagers.</Header>
                  </Grid.Column>
                </div>
              )}
          </Grid.Column>
          <Grid.Column>
            <Header as='h2' textAlign='centered'>Wagers you are currently participating in:</Header>
            {inTheseWagers.length ? (
              <RenderWagers wagerList={inTheseWagers} columns={3} />
            ) : (
                <div>
                  <Grid.Column />
                  <Grid.Column>
                    <br /><br />
                    <Header as='h3' textAlign='centered'>You are not current participating in any wagers.</Header>
                  </Grid.Column>
                </div>
              )}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}


const mapStateToProps = function (state, ownProps) {
  return {
    currentUser: state.user,
    listOfWagers: state.wagers
  };
};

export default withRouter(connect(mapStateToProps, null)(ProfilePage));
