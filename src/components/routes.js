import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom'
//import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
// import store from './store';
import App from './App';
import InitialGameView from './InitialGameView';

class Routes extends Component {
  componentDidMount () {
  
  }
  render () {
    return (
      <Switch>
        <Route exact path="/game" component={InitialGameView} />  
        <Route exact path="/" component={ App } />
      </Switch>
    )
  }
}

const mapState = state => {
  return {
  }
};

const mapDispatch = dispatch => {
  return {
  }
}

export default withRouter(connect(mapState, mapDispatch)(Routes))