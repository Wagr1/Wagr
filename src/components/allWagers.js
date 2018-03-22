import React, { Component } from "react";
import logo from "../logo.svg";
import "./app.css";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import { db, auth, userById } from "../fire/firestore";
import history from "../history";
import store from "../store";
import { browserHistory } from "react-router";
import web3 from "../web3";
import mafiaContract from "../mafiaContract";
import { definedRole, randomNameGenerator } from "../utils";
import SingleWagerView from "./singleWagerView";
import basketball from "./basketball.png";
import {
  Header,
  Icon,
  Image,
  Segment,
  Grid,
  Button,
  Card
} from "semantic-ui-react";

class AllWagers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wager: "",
      listOfWagers: [],
      currentUser: ""
    };

    this.enterGame = this.enterGame.bind(this);
    this.signUp = this.signUp.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    var email;
    auth.onAuthStateChanged(function(user) {
      if (user) {
        email = user.email;
      }
    });

    db.collection("wagers").onSnapshot(snapshot => {
      this.setState({
        listOfWagers: snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.ref.id
          };
        }),
        currentUser: email
      });
    });
  }

  componentWillUnmount() {
    var unsubscribe = auth.onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
      }
    });

    unsubscribe();
  }

  enterGame = event => {
    event.preventDefault();

    if (!this.state.currentUser) {
      alert("Please sign in to see wager detail");
    } else {
      let wager = event.target.value;

      var data = {
        wager: wager
      };

      var setDoc = db
        .collection("wagers")
        .doc(wager)
        .set(data);
      this.setState({
        wager: event.target.value
      });
      this.props.history.push(`/wagers/${wager}`);
    }

    // userById(auth.currentUser.uid).set({ id: auth.currentUser.uid });
  };

  signUp = event => {
    event.preventDefault();
    this.props.history.push("/game/signup");
  };

  logout = () => {
    auth.signOut().then(() => {
      this.setState({
        currentUser: ""
      });
    });
  };

  render() {
    // console.log("list: ", this.state.listOfWagers);
    // console.log(auth);

    var user = auth.currentUser;

    if (user) {
      console.log("user: ", user);
    } else {
      console.log("else: ", user);
    }

    console.log("state: ", this.state.currentUser);
    const wagerList = this.state.listOfWagers;
    console.log("wagerlist: ", wagerList);

    return this.state.currentUser ? (
      <div>
        <Segment inverted>
          <Header inverted as="h2" icon textAlign="center">
            <Icon name="ethereum" circular />
            <Header.Content>
              <h2 className="ui red header">
                Welcome {this.state.currentUser} !
              </h2>
            </Header.Content>
            <Header.Content>
              <h2 className="ui red header">
                See a wager that you like? Cick to see more
              </h2>
            </Header.Content>
            <Header.Content>
              <Button onClick={this.logout}>Logout</Button>
            </Header.Content>
          </Header>
        </Segment>
        <Grid columns={5}>
          {wagerList.map(wager => (
            <Grid.Column key={wager.id}>
              <Card key={wager.id} className="ui segment centered">
                <Image src={basketball} />
                <Card.Header />
                <Button
                  key={wager.id}
                  value={wager.id}
                  onClick={this.enterGame}
                >
                  Click here to bet on {wager.id.split("vs").join(" vs. ")}
                </Button>
              </Card>
            </Grid.Column>
          ))}
        </Grid>
      </div>
    ) : (
      <div>
        <Segment inverted>
          <Header inverted as="h2" icon textAlign="center">
            <Icon name="ethereum" circular />
            <Header.Content>
              <h2 className="ui red header">Welcome 2 Wagr</h2>
            </Header.Content>
            <Header.Content>
              <h2 className="ui red header">
                See a wager that you like? Click on it to ante up!
              </h2>
            </Header.Content>
            <Header.Content>
              <Button onClick={this.signUp}>Sign up/Sign in</Button>
            </Header.Content>
          </Header>
        </Segment>
        <Grid columns={5}>
          {wagerList.map(wager => (
            <Grid.Column>
              <Card key={wager.id} className="ui segment centered">
                <Image src={basketball} />
                <Card.Header />
                <Button
                  key={wager.id}
                  value={wager.id}
                  onClick={this.enterGame}
                >
                  Click here to bet on {wager.id.split("vs").join(" vs. ")}
                </Button>
              </Card>
            </Grid.Column>
          ))}
        </Grid>
      </div>
    );
  }
}

export default withRouter(AllWagers);
