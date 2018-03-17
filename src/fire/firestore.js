import * as firebase from 'firebase';
import 'firebase/firestore';

const config = {
  apiKey: "AIzaSyD-SRNhQPjUTiCCFjb8miJPkvaNwaEIvxA",
  authDomain: "mafia-blockchain.firebaseapp.com",
  databaseURL: "https://mafia-blockchain.firebaseio.com",
  projectId: "mafia-blockchain",
  storageBucket: "mafia-blockchain.appspot.com",
  messagingSenderId: "291156435310"
};

firebase.initializeApp(config);

export const db = firebase.firestore();
export const auth = firebase.auth();

export default firebase;