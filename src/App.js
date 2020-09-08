import React from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './Firebase.config';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function App() {

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      // console.log(res);
      const { displayName, email, photoURL } = res.user;
      console.log(displayName, email, photoURL)
    })
  }

  return (
    <div className="App">
      <button onClick={handleSignIn}> Sign In </button>
  {/* <p>{displayName, email, photoURL}</p> */}
    </div>
  );
}

export default App;
