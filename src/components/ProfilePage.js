import React, { Component } from "react";
import logo from "../logo.svg";
import "./App.css";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import { db, auth } from "../fire/firestore";
import history from "../history";
import store from "../store";
import { browserHistory } from "react-router";
import basketball from "./basketball.png";
import { Header, Icon, Image, Segment, Grid, Button, Card, Dropdown } from 'semantic-ui-react'
import { connect } from "react-redux";
import Wager from "../ether/wagers";
import web3 from "../ether/web3";


class ProfilePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      wager: this.props.wager,
      metamask: "",
      listOfWagers: []
    }
    this.goHome = this.goHome.bind(this)
  }

  goHome = (event) => {
    this.props.history.push('/wagers')
  }

  async componentDidMount() {
    try {
      const accounts = await web3.eth.getAccounts()
      this.setState({
        metamask: accounts[0]
      })
    } catch (err) {
      console.error(err);
    }
  }


  render() {
    console.log("metamask: ", this.props.currentUser)
    console.log("props: ", this.props.listOfWagers)

    const wagerList = this.props.listOfWagers

    const managedWagers = wagerList.filter(wager => {
      return (wager.manager === this.state.metamask && !wager.complete)
    })

    const inTheseWagers = wagerList.filter(wager => {
      return ((wager.side1).concat(wager.side2)).indexOf(this.state.metamask) > -1
    })

    console.log("managed: ", managedWagers)
    return (
      <div>
        <Segment inverted>
          <Header as="h2" icon textAlign="center">
          <i className="ethereum icon circular"></i>
            <Header.Content>
              <h2 className="ui blue header">
                Hello {auth.currentUser.displayName}
              </h2>
            </Header.Content>
            <Header.Content>
              <Grid columns={4}>
                <Grid.Column>
                  <Button className="ui left floated primary button" circular onClick={this.goHome}>
                    <Icon name="home" circular />
                  </Button>
                </Grid.Column>
              </Grid>
            </Header.Content>
          </Header>
        </Segment>
        <h2>  
          Wagers you are currently managing:
        </h2>
        <Grid columns={5}>
          {managedWagers.map(wager =>
            wager.complete ? null :
              (
                <Grid.Column>
                  <Card key={wager.address} className="ui segment centered">
                    <Image src={basketball} />
                    <Card.Header />
                    <Link to={`/wagers/${wager.address}`} key={wager.address} value={wager.address}>
                      Click here to bet on
                    <br></br>
                      {wager.title}
                    </Link>
                    Ante: {wager.ante} Ether
                  <br />
                    Current Pot Size: {web3.utils.fromWei(wager.pot, 'ether')} Ether
                </Card>
                </Grid.Column>
              ))}
        </Grid>
        <h2> 
          Wagers you are currently participating in:
        </h2>
        <Grid columns={5}>
          {inTheseWagers.map(wager =>
            wager.complete ? null :
              (
                <Grid.Column>
                  <Card key={wager.address} className="ui segment centered">
                    <Image src={basketball} />
                    <Card.Header />
                    <Link to={`/wagers/${wager.address}`} key={wager.address} value={wager.address}>
                      Click here to bet on
                    <br></br>
                      {wager.title}
                    </Link>
                    Ante: {wager.ante} Ether
                  <br />
                    Current Pot Size: {web3.utils.fromWei(wager.pot, 'ether')} Ether
                </Card>
                </Grid.Column>
              ))}
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = function (state, ownProps) {
  return {
    currentUser: state.user,
    listOfWagers: state.wagers
  };
};

export default withRouter(connect(mapStateToProps, null)(ProfilePage))


