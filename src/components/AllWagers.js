import React, { Component } from "react";
import logo from "../logo.svg";
import "./App.css";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import { db, auth, userById, email } from "../fire/firestore";
import history from "../history";
import store, { getAllWagers, getSortedWagers } from "../store";
import { browserHistory } from "react-router";
import web3 from "../ether/web3";
import GeneralChat from "./GeneralChat/";
import SingleWagerView from "./SingleWagerView";
import basketball from "./basketball.png";
import { Header, Icon, Image, Segment, Grid, Button, Card, Dropdown } from 'semantic-ui-react'
import factory from '../ether/factory'
import { connect } from "react-redux";
import App from './App'
import Wager from "../ether/wagers";
import NavBar from './NavBar'
import HeaderButtons from './HeaderButtons'
import { writeMessage } from "../store";

const DropDownSort = () => {
  return (
    <Grid columns={5}>
      <Grid.Column></Grid.Column><Grid.Column></Grid.Column><Grid.Column></Grid.Column><Grid.Column></Grid.Column>
      <Grid.Column>
        <Dropdown text='Sort By' icon='filter' floating labeled button className='icon'>
          <Dropdown.Menu>
            <Dropdown.Item label={{ color: 'red', empty: true, circular: true }} text='Ante: Low-High' value="ante-low-high" onClick={this.onClickSort} />
            <Dropdown.Item label={{ color: 'blue', empty: true, circular: true }} text='Ante: High-Low' value="ante-high-low" onClick={this.onClickSort} />
            <Dropdown.Item label={{ color: 'red', empty: true, circular: true }} text='Pot Size: Low-High' value="pot-low-high" onClick={this.onClickSort} />
            <Dropdown.Item label={{ color: 'blue', empty: true, circular: true }} text='Pot Size: High-Low' value="pot-high-low" onClick={this.onClickSort} />
          </Dropdown.Menu>
        </Dropdown>
      </Grid.Column>
    </Grid>
  )
}
class AllWagers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wager: "",
      listOfWagers: [],
      currentUser: this.props.currentUser
    };
    this.signUp = this.signUp.bind(this);
    this.logout = this.logout.bind(this)
    this.onClickSort = this.onClickSort.bind(this)
  }

  componentDidMount() {
    this.props.fetchAllWagers()
    console.log("this should be after we in here")
    this.setState({ listOfWagers: this.props.listOfWagers })
  }

  signUp = event => {
    event.preventDefault();
    this.props.history.push('/wagers/signup');
  }

  logout = () => {
    auth.signOut()
      .then(() => {
        this.setState({
          currentUser: ""
        })
      })
      .then(() => {
        this.props.history.push('/')
      })
  }

  createContract = (event) => {
    event.preventDefault()
    this.props.history.push('/new-wager')
  }

  onClickSort = (event, data) => {
    event.preventDefault()
    let listOfWagersSorted = this.props.listOfWagers.slice()
    let type = data.value.split("-")[0]
    let order = data.value.split("-")[1] + "-" + data.value.split("-")[2]
    if (order === 'low-high') {
      var sortedList = listOfWagersSorted.sort(function (a, b) {
        return parseInt(a[type]) - parseFloat(b[type])
      })
    } else {
      var sortedList = listOfWagersSorted.sort(function (a, b) {
        return parseInt(b[type]) - parseFloat(a[type])
      })
    }
    this.props.fetchSortedWagers(sortedList)
  }

  profilePage = (event) => {
    event.preventDefault();
    this.props.history.push("/your-profile")
  }


  render() {
    var user = auth.currentUser;
    const wagerList = this.props.listOfWagers;
    if (this.state.currentUser && this.props.listOfWagers) {
      return (
        <div>
          <Segment inverted>
            <NavBar />
            <HeaderButtons
              logout={this.logout}
              createContract={this.createContract}
              profilePage={this.profilePage} />
          </Segment>
          <div className='borderFix'>
            <DropDownSort />
            <Grid columns={2}>
              <Grid.Column width="6">
                <GeneralChat chatType='general' />
              </Grid.Column>
              <Grid.Column width="10">
                <Grid columns={4}>
                  {wagerList.map(wager =>
                    wager.complete ? null :
                      (
                        <Grid.Column width="4">
                          <Card key={wager.address} className="ui segment centered">
                            <Image src={basketball} />
                            <Card.Header />
                            <Link to={`/wagers/${wager.address}`} value={wager.address}>
                              Click here to bet on
                            <br />
                              {wager.title}
                            </Link>
                            Ante: {wager.ante} Ether
                          <br />
                            Current Pot Size: {web3.utils.fromWei(wager.pot, 'ether')} Ether
                        </Card>
                        </Grid.Column>
                      ))}
                </Grid>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      )
    } else if (this.state.currentUser) {
      return (
        <div>Loading...</div>
      )
    } else {
      this.props.history.push('/')
      return null
    }
  }
}

const mapStateToProps = function (state, ownProps) {
  return {
    currentUser: state.user,
    listOfWagers: state.wagers
  };
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    fetchAllWagers() {
      dispatch(getAllWagers())
    },
    fetchSortedWagers(listOfWagers) {
      dispatch(getSortedWagers(listOfWagers))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllWagers))

