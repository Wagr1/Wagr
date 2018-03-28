import React, { Component } from "react";
import "./App.css";
import App from "./App";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import { db, auth, userName } from "../fire/firestore";
import { connect } from "react-redux";
import { postMssage, writeMessage } from "../store";
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
  Label,
  Message
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
      leftSide: "",
      rightSide: "",
      title: "",
      accounts: [],
      description: "",
      errorMessage: "",
      error: ""
    };
    this.onClick = this.onClick.bind(this);
    this.renderCards = this.renderCards.bind(this);
    this.betSideOne = this.betSideOne.bind(this);
    this.betSideTwo = this.betSideTwo.bind(this);
    this.paySideOne = this.paySideOne.bind(this);
    this.paySideTwo = this.paySideTwo.bind(this);
  }

  async componentDidMount() {
    try {
      const accounts = await web3.eth.getAccounts();
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
        accounts: accounts,
        description: summary[8],
        error: "error"
      });
    } catch (err) {
      console.error(err);
    }
  }

  onClick = event => {
    event.preventDefault();
    this.props.history.push("/wagers");
  };

  renderPayoutButton() {
    if (this.state.accounts.includes(this.state.manager)) {
      return (
        <div>
          <Button onClick={this.paySideOne} error={!!this.state.errorMessage}>
            {this.state.leftSide} Won!
          </Button>
          <Button onClick={this.paySideTwo} error={!!this.state.errorMessage}>
            {this.state.rightSide} Won!
          </Button>
        </div>
      );
    }
  }

  async paySideOne(event) {
    event.preventDefault();
    const wager = Wager(this.props.match.params.address);
    const accounts = await web3.eth.getAccounts();
    const manager = await wager.methods.manager().call();

    if (accounts[0] !== this.state.manager) {
      this.setState({
        errorMessage: "You're Not The Manager Of This Weijr!",
        error: ""
      });
      } else {
        const wager = Wager(this.props.match.params.address);

        this.setState({ loading: true, errorMessage: "" });
        try {
          await wager.methods.payout(true).send({
            from: manager
          });
          this.setState({ error: "" });
        } catch (err) {
          this.setState({
            errorMessage: "You're Not The Manager Of This Weijr!",
            error: ""
          });
        }
        this.props.history.push("/wagers");
      }
    this.setState({ loading: false });
  }

  async paySideTwo(event) {
    event.preventDefault();
    const wager = Wager(this.props.match.params.address);
    const accounts = await web3.eth.getAccounts();
    const manager = await wager.methods.manager().call();

    if (accounts[0] !== this.state.manager) {
      this.setState({
        errorMessage: "You're Not The Manager Of This Weijr!",
        error: ""
      });
      } else {
      const wager = Wager(this.props.match.params.address);


      this.setState({ loading: true, errorMessage: "" });
      try {
        await wager.methods.payout(true).send({
          from: manager
        });
        this.setState({ error: "" });
      } catch (err) {
        this.setState({
          errorMessage: "You're Not The Manager Of This Weijr!",
          error: ""
        });
      }
      this.props.history.push("/wagers");
    }
    this.setState({ loading: false });
  }

  renderCards() {
    const items = [
      {
        header: `The Current Pot is ${web3.utils.fromWei(
          this.state.pot,
          "ether"
        )} ether!`,
        meta: this.state.title,
        description: `There are ${
          this.state.totalUsers
        } people invovled in this Wagr! Place Your Bets Below!`
      }
    ];
    return <Card.Group items={items} />;
  }

  async betSideOne(event) {
    event.preventDefault();
    const wager = Wager(this.props.match.params.address);
    const accounts = await web3.eth.getAccounts();
    const summaryCheck = await wager.methods.getWagerSummary().call();
    const arrayOfParticipants = summaryCheck[9];
    const check = arrayOfParticipants.includes(accounts[0])
    if (check || (accounts[0] === summaryCheck[5])) {
      this.setState({
        errorMessage:
          "You Either Don't Have Enough Ether Or You May Have Already Bet In This Weijr! You Might Even Be The Manager Of This Weijr! No Cheating!",
        error: ""
      });
    } else {
      this.setState({ loading: true, errorMessage: "" });
      try {
        await wager.methods.joinBet(true).send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.minimumBet, "ether")
        });
        const summary = await wager.methods.getWagerSummary().call();
        this.setState({
          pot: summary[1],
          totalUsers: summary[2],
          sideOne: summary[3],
          sideTwo: summary[4],
          error: "error"
        });
      } catch (err) {
        this.setState({
          errorMessage:
            "You Either Don't Have Enough Ether Or You May Have Already Bet In This Weijr! No Cheating!",
          error: ""
        });
      }
    }
    this.setState({ loading: false });
  }

  async betSideTwo(event) {
    event.preventDefault();
    const wager = Wager(this.props.match.params.address);
    const accounts = await web3.eth.getAccounts();
    const summaryCheck = await wager.methods.getWagerSummary().call();
    const arrayOfParticipants = summaryCheck[9];
    const check = arrayOfParticipants.includes(accounts[0])
    if (check || (accounts[0] === summaryCheck[5])) {
      this.setState({
        errorMessage:
          "You Either Don't Have Enough Ether Or You May Have Already Bet In This Weijr! You Might Even Be The Manager Of This Weijr! No Cheating!",
        error: ""
      });
      } else {
      this.setState({ loading: true, errorMessage: "" });

      try {
        const accounts = await web3.eth.getAccounts();
        await wager.methods.joinBet(false).send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.minimumBet, "ether")
        });
        const summary = await wager.methods.getWagerSummary().call();
        this.setState({
          pot: summary[1],
          totalUsers: summary[2],
          sideOne: summary[3],
          sideTwo: summary[4],
          error: "error"
        });
      } catch (err) {
        this.setState({
          errorMessage:
            "You Either Don't Have Enough Ether Or You May Have Already Bet In This Weijr! No Cheating!",
          error: ""
        });
      }
    }
    this.setState({ loading: false });
  }

  render() {
    let email;
    let loading = this.state.loading ? "loading" : "loading-false";


    if (this.state.currentUser) {
      return this.state.manager === "" ? null : (
        <div>
          <div id={loading} className="ui active dimmer">
            <div className="ui large text loader">
              <p className="loading-text">
                This Honestly Takes A Long Time! Be Patient! Don't Leave The
                Page!
              </p>
            </div>
          </div>
          <div className="App">
            <Segment inverted>
              <Header inverted as="h2" icon textAlign="center">
                <Header.Content>
                  <i className="ethereum icon circular" />
                </Header.Content>
                <Header.Content>
                  <Grid columns={3}>
                    <Grid.Column>
                      <Button
                        className="ui left floated primary button"
                        circular
                        onClick={this.onClick}
                      >
                        <Icon name="home" circular />
                      </Button>
                    </Grid.Column>
                    <Grid.Column>
                      <h2 className="ui blue header">
                        {this.state.leftSide} vs. {this.state.rightSide}
                      </h2>
                    </Grid.Column>
                  </Grid>
                </Header.Content>
              </Header>
            </Segment>
            <div className="borderFix">
              <Grid columns={2}>
                <Grid.Column width={9}>
                  <GeneralChat wager={this.state.title} chatType="wager" />
                </Grid.Column>
                <Grid.Column width={7} className="ui centered grid">
                  <Grid.Row>
                    <div>{this.renderCards()}</div>
                  </Grid.Row>
                  <Grid.Row>
                    <Button as="div" labelPosition="right">
                      <Button
                        color="red"
                        value={this.state.sideOne}
                        onClick={this.betSideOne}
                      >
                        <Icon name="ethereum" />
                        {this.state.leftSide}
                      </Button>
                      <Label as="a" basic color="red" pointing="left">
                        {this.state.sideOne} Bets Placed
                      </Label>
                    </Button>
                    <br />
                    <Button as="div" labelPosition="right">
                      <Button
                        color="blue"
                        value={this.state.sideTwo}
                        onClick={this.betSideTwo}
                        error={!!this.state.errorMessage}
                      >
                        <Icon name="ethereum" />
                        {this.state.rightSide}
                      </Button>
                      <Label as="a" basic color="blue" pointing="left">
                        {this.state.sideTwo} Bets Placed
                      </Label>
                    </Button>
                    <Grid.Column width={6} />
                  </Grid.Row>
                  <div className="ui raised segment">
                    <p>{this.state.description}</p>
                  </div>
                  {this.renderPayoutButton()}
                  <Message
                    id={`${this.state.error}`}
                    error
                    header="Oops!"
                    content={this.state.errorMessage}
                  />
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </div>
      );
    } else {
      this.props.history.push("/");
      return null;
    }

  }
}

const mapStateToProps = function(state, ownProps) {
  return {
    currentUser: state.user
  };
};

export default withRouter(connect(mapStateToProps, null)(SingleWagerView));
