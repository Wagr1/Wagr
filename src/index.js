import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routes from './components/routes'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';
import createHistory from 'history/createBrowserHistory'
import createMemoryHistory from 'history/createMemoryHistory'
import store from './store'

const history = process.env.NODE_ENV === 'test' ? createMemoryHistory() : createHistory()

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Routes />
    </Router>
  </Provider>,
    document.getElementById('root'));
registerServiceWorker();
