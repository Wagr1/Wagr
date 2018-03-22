import React, { Component } from "react";
import "./app.css";
import App from "./app";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import { db, auth, userName } from "../fire/firestore";
import { connect } from "react-redux";
import { postMssage, writeMessage } from "../store";
import MessageList from "./GeneralChat/messageList";
import GeneralChat from "./GeneralChat/index";
import WagerComponent from "./wagerComponent";
import { Header, Icon, Image, Segment, Grid, Button } from "semantic-ui-react";

class SingleWagerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      wager: this.props.match.params.address,
      authUser: "",
    };
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    var email;
    auth.onAuthStateChanged(function(user) {
      if (user) {
        email = user.email;
      }
    });
    db.collection('wagers').onSnapshot(snapshot => {
    this.setState({
      authUser : email
    })
  })
  }

  onClick = event => {
    event.preventDefault();
    this.props.history.push("/wagers");
  };

  render() {
    let email;
    // auth.onAuthStateChanged(function(user) {
    //   if (user) {
    //     // User is signed in.
    //     email = user.email;
    //   }}
    // )
    const wagerA = this.state.wager.split("vs")[0];
    const wagerB = this.state.wager.split("vs")[1];
    console.log("auth: ", auth.currentUser);
    console.log("state: ", this.state.currentUser);
    return (this.state.currentUser) ? (
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
              {wagerA} vs. {wagerB}
            </Header.Content>
            <Grid.Column>
              <Header.Content>
                Current logged in as {this.state.currentUser}
              </Header.Content>
            </Grid.Column>
          </Header>
        </Segment>
        <Grid>
          <Grid.Column width={8}>
            <GeneralChat wager={this.state.wager} />
          </Grid.Column>
          <Grid.Column width={8}>
            <WagerComponent wager={this.state.wager} />
          </Grid.Column>
        </Grid>
      </div>
    ) : (
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
            <Header.Content>Pleaes Sign In To See Wager Details</Header.Content>
          </Header>
        </Segment>
      </div>
    );
  }
}

// const mapStateToProps = function (state, ownProps) {
//   return {
//     newMessageEntry: state.newMessageEntry,
//     name: state.name
//   };
// };

// const mapDispatchToProps = function (dispatch, ownProps) {
//   return {
//     handleChange (evt) {
//       dispatch(writeMessage(evt.target.value));
//     },
//     handleSubmit (name, content, evt) {
//       evt.preventDefault();

//       // const { channelId } = ownProps;

//       dispatch(postMessage({ name, content, evt }));
//       // dispatch(writeMessage(''));
//     }
//   };
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(InitialGameView);

export default withRouter(SingleWagerView);
