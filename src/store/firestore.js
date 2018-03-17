const firebase = require("firebase");
require("firebase/firestore");


var config = {
  apiKey: "AIzaSyD-SRNhQPjUTiCCFjb8miJPkvaNwaEIvxA",
  authDomain: "mafia-blockchain.firebaseapp.com",
  databaseURL: "https://mafia-blockchain.firebaseio.com",
  projectId: "mafia-blockchain",
  storageBucket: "mafia-blockchain.appspot.com",
  messagingSenderId: "291156435310"
};

firebase.initializeApp(config);

var db = firebase.firestore();

export default db;