import React, { Component } from "react";
import "./App.css";
import App from "./App";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import { db, auth, userName } from "../fire/firestore";
import { connect } from "react-redux";
import { postMssage, writeMessage } from "../store";
import MessageList from "./GeneralChat/MessageList";
import GeneralChat from "./GeneralChat/index";
import WagerComponent from "./WagerComponent";
import {
  Header,
  Icon,
  Image,
  Segment,
  Grid,
  Button,
  Card,
  Label
} from "semantic-ui-react";

import Wager from "../ether/wagers";
import web3 from "../ether/web3";

class SingleWagerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      address: this.props.match.params.address,
      currentUser: "",
      minimumBet: "",
      pot: "",
      totalUsers: "",
      sideOne: "",
      sideTwo: "",
      manager: "",
      currentUser: this.props.currentUser,
      loading: false,
      errorMessage: '',
      leftSide: '',
      rightSide: '',
      title: '',
      accounts: []
    };
    this.onClick = this.onClick.bind(this);
    this.renderCards = this.renderCards.bind(this);
    this.betSideOne = this.betSideOne.bind(this);
    this.betSideTwo = this.betSideTwo.bind(this);
    this.paySideOne = this.paySideOne.bind(this);
    this.paySideTwo = this.paySideTwo.bind(this);
  }

  componentWillMount() {
    var email;

    auth.onAuthStateChanged(function(user) {
      if (user) {
        email = user.email;
      }
    });

    this.setState({
      currentUser: this.props.currentUser
    });
  }

  async componentDidMount() {

      try {
        const accounts = await web3.eth.getAccounts()
        const wager = Wager(this.props.match.params.address);
        const summary = await wager.methods.getWagerSummary().call();
        const left = summary[6].split(" vs. ")[0];
        const right = summary[6].split(" vs. ")[1];

        this.setState({
          minimumBet: summary[0],
          pot: summary[1],
          totalUsers: summary[2],
          sideOne: summary[3],
          sideTwo: summary[4],
          manager: summary[5],
          leftSide: left,
          rightSide: right,
          title: summary[6],
          accounts: accounts
        });
        console.log('FIRSTSTATE', this.state.accounts)
    } catch (err) {
      console.error(err);
    }
  }

  onClick = event => {
    event.preventDefault();
    this.props.history.push("/wagers")
  }

  renderPayoutButton() {
    if(this.state.accounts.includes(this.state.manager)){
      return (
        <div>
          <Button onClick={this.paySideOne}>
            {this.state.leftSide} Won!
          </Button>
          <Button onClick={this.paySideTwo}>
            {this.state.rightSide} Won!
          </Button>
        </div>
      )
    }
  }

  async paySideOne(event) {
    event.preventDefault()
    console.log('SCONDSTATE', this.state.accounts)
    if(this.state.accounts.includes(this.state.manager)){
      const wager = Wager(this.props.match.params.address);
      const manager = await wager.methods.manager().call();

      await wager.methods.payout(true).send({
        from: manager
      })
    }
    this.props.history.push('/wagers');
  }

  async paySideTwo(event) {
    event.preventDefault()
    console.log('SCONDSTATE', this.state.accounts)
    if(this.state.accounts.includes(this.state.manager)){
      const wager = Wager(this.props.match.params.address);
      const manager = await wager.methods.manager().call();

      await wager.methods.payout(true).send({
        from: manager
      })
    }
    this.props.history.push('/wagers');
  }

  renderCards() {
    const items = [{
      header: `The Current Pot is ${web3.utils.fromWei(this.state.pot, 'ether')} ether!`,
      meta: this.state.title,
      description: `There are ${this.state.totalUsers} people invovled in this Wager! Place Your Wagers Below!`
    }];
    return <Card.Group items={items} />;
  }

  async betSideOne(event) {
    event.preventDefault();
    const wager = Wager(this.props.match.params.address);

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await wager.methods.joinBet(true).send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.minimumBet, 'ether')
      });
      const summary = await wager.methods.getWagerSummary().call();
      this.setState({
        pot: summary[1],
        totalUsers: summary[2],
        sideOne: summary[3],
        sideTwo: summary[4],
      });
    } catch (err) {
      this.setState({errorMessage: err.message})
    }

  }

  async betSideTwo(event) {
    event.preventDefault();
    const wager = Wager(this.props.match.params.address);

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await wager.methods.joinBet(false).send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.minimumBet, 'ether')
      });
      const summary = await wager.methods.getWagerSummary().call();
      this.setState({
        pot: summary[1],
        totalUsers: summary[2],
        sideOne: summary[3],
        sideTwo: summary[4],
      });
    } catch (err) {
      this.setState({errorMessage: err.message})
    }

  }

  render() {
    let email;



    if (this.state.currentUser) {
    return this.state.manager === "" ? null : (
      <div className="App">
        <Segment inverted>
          <Header inverted as="h2" icon textAlign="center">
            <Grid columns={3}>
              <Grid.Column>
                <Button circular onClick={this.onClick}>
                  <Icon name="home" circular />
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Icon name="users" circular />
              </Grid.Column>
            </Grid>
            <Header.Content>
              {this.state.leftSide} vs. {this.state.rightSide}
            </Header.Content>
          </Header>
        </Segment>
        <Grid columns={2}>
          <Grid.Column width={8}>
            <GeneralChat wager={this.state.address} />
          </Grid.Column>
          <Grid.Column width={10}>
            {this.renderCards()}
          </Grid.Column>
          <Grid.Column width={8}>

          </Grid.Column>
          <Grid.Row>
            <Button as='div' labelPosition='right'>
            <Button color='red' value={this.state.sideOne} onClick={this.betSideOne}>
              <Icon name='ethereum' />
              { this.state.leftSide }
            </Button>
            <Label as='a' basic color='red' pointing='left'>{this.state.sideOne}  Bets Placed</Label>
          </Button>
          <Button as='div' labelPosition='right'>
            <Button color='blue' value={this.state.sideTwo} onClick={this.betSideTwo}>
              <Icon name='ethereum' />
              { this.state.rightSide }
            </Button>
            <Label as='a' basic color='blue' pointing='left'>{this.state.sideTwo}  Bets Placed</Label>
          </Button>
            <Grid.Column width={6} />
          </Grid.Row>
          {this.renderPayoutButton()}
        </Grid>
      </div>
    )
  } else {
    this.props.history.push('/')
    return null
    }
  }
}

const mapStateToProps = function(state, ownProps) {
  return {
    currentUser: state.user
  };
};

export default withRouter(connect(mapStateToProps, null)(SingleWagerView));
