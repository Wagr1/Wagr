import React, { Component } from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom'
//import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
// import store from './store';
import AllWagers from './AllWagers';
import App from './App'
import SingleWagerView from './SingleWagerView';
import SignUp from './SignUp'
import CreateWager from './CreateWager';
import ProfilePage from './ProfilePage'
import DirectChatCreation from './DirectChat/index'
import GeneralChat from './GeneralChat'
import NBASchedule from './NBASchedule'


class Routes extends Component {

  render () {
    return (
      <Switch>
        <Route exact path="/" component={ App } />
        <Route exact path="/signup" component={ SignUp } />
        <Route exact path='/new-wager' component={ CreateWager } />
        <Route exact path="/wagers" component={ AllWagers } />
        <Route exact path="/wagers/:address" component={SingleWagerView} />
        <Route exact path="/your-profile" component={ProfilePage} />
        <Route exact path='/newPrivateMessage' component={DirectChatCreation} />
        <Route exact path='/privateChat' component={ GeneralChat } />
        <Route exact path='/nbaschedule' component={ NBASchedule } />
        <Redirect from="*" to="/" />
      </Switch>
    )
  }
}

export default withRouter(Routes)
