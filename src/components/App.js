import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import { db } from '../fire/firestore';
import history from '../history';
import store from '../store';
import { browserHistory } from 'react-router';


class App extends Component {
  constructor(props) {
    super(props)

    this.enterGame = this.enterGame.bind(this)
  }

  enterGame = () => {
    //random name generator
    let name = ["abandoned", "able", "absolute", "adorable", "adventurous", "academic", "acceptable", "acclaimed"]
    let nameIndex = Math.floor((Math.random() * name.length));
    let name2 = ["people", "history", "way", "art", "world", "information", "map", "family", "government", "health"]
    let name2Index = Math.floor((Math.random() * name2.length));
    let randomName = name[nameIndex] + "  " + name2[name2Index]

    //random number generator for ether
    let randomEtherAmount = Math.floor((Math.random() * 100) + 75);
    let playerRef = db.collection("rooms").doc("room1").collection("players")
    playerRef.get()
      .then(querySnapshot => {
      let docs = querySnapshot.docs;
      for (let doc of docs) {
        console.log(`Document found at path: ${doc.ref.path}`);
      }})

    playerRef
      .doc(randomName)
      .set({
        name: randomName,
        ether: randomEtherAmount,
      })
      .then(() => {
        playerRef
          .doc(randomName)
          .collection("inbox")
          .add({
            user: "admin",
            message: randomName + "has entered the game"
          })
      })
      .then(() => {
        this.props.history.push('/game')
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Mafia on da bloc</h1>
        </header>
        <h2>Don't know how to play? Click here for instructions.</h2>
        <h2>To join a game:</h2>

        <button onClick={this.enterGame}>Click here!</button>
      </div>
    )
  }
}

export default withRouter(App);
