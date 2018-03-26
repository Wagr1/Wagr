import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import wagers from './wagers';
import newMessageEntry from './newMessageEntry';
import user from './user'
import loggingMiddleware from 'redux-logger'

const reducer = combineReducers({ wagers, newMessageEntry, user })

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(
    thunkMiddleware,
    loggingMiddleware
  ))
);

export default store

export * from './wagers';
export * from './newMessageEntry';
export * from './user';
export * from './DirectChat'
