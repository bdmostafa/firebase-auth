import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './Firebase.config';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photoURL: ''
  });

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, email, photoURL } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email,
          photoURL
        }
        setUser(signedInUser)
        // console.log(displayName, email, photoURL);
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photoURL: ''
        }
        setUser(signedOutUser)
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  const { isSignedIn, name, email, photoURL } = user;

  return (
    <div className="App">
      {
        isSignedIn
          ? <button onClick={handleSignOut}> Sign Out </button>
          : <button onClick={handleSignIn}> Sign In </button>
      }
      {
        isSignedIn
        && <div>
          <p>Congratulations, {name}!</p>
          <img src={photoURL} alt="" />
          <p>You have signed in successfully.</p>
          <p>Your email: {email}</p>
        </div>
      }
    </div>
  );
}

export default App;
