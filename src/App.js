import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './Firebase.config';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photoURL: '',
    error: '',
    success: false
  });

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  var FBProvider = new firebase.auth.FacebookAuthProvider();

  const handleFBSignIn = () => {
    firebase.auth().signInWithPopup(FBProvider)
      .then(res => {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = res.credential.accessToken;
        // The signed-in user info.
        var user = res.user;
        // ...
      })
      .catch(err => {
        // Handle Errors here.
        var errorCode = err.code;
        var errMessage = err.message;
        // The email of the user's account used.
        var email = err.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = err.credential;
        // ...
      });
  }

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(googleProvider)
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

  const handleSubmit = (e) => {
    // console.log(user.email, user.password);

    // For new user
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = { ...user }
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          verifyEmail();
          updateUserName(user.name);
        })
        .catch(error => {
          const newUserInfo = { ...user }
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }

    // For old users
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = { ...user }
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log('sign in user info', res.user)
        })
        .catch(function (error) {
          const newUserInfo = { ...user }
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }


    e.preventDefault();
  }

  // const handleOnChange = (e) => {
  // console.log(e.target.name, e.target.value);
  // }

  const handleBlur = (e) => {
    // debugger;
    let isFieldValid = true;

    if (e.target.name === 'email') {
      // isFieldValid = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(e.target.value)
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value)
      // console.log(isFieldValid);
    }

    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6
      const hasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && hasNumber;
    }

    // Update user state
    if (isFieldValid) {
      const newUserInfo = { ...user }
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo)
    }

  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
      photoURL: "https://example.com/jane-q-user/profile.jpg"
    }).then(() => {
      console.log('Update successful')
    }).catch(err => {
      console.log(err)
    });
  }

  const verifyEmail = () => {
    var user = firebase.auth().currentUser;

    user.sendEmailVerification().then(function () {
      // Email sent.
    }).catch(function (error) {
      // An error happened.
    });
  }

  const resetPassword = email => {
    let auth = firebase.auth();

    auth.sendPasswordResetEmail(email).then(function () {
      // Email sent.
    }).catch(function (error) {
      // An error happened.
    });
  }
  const { isSignedIn, name, email, photoURL } = user;

  return (
    <div className="App">
      <button onClick={handleFBSignIn}> FB Sign In </button>
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

      <h1>Our Athentication</h1>
      <input onChange={() => setNewUser(!newUser)} type="checkbox" name="newUser" id="newUser" />
      <label htmlFor="newUser">New User Sign Up</label>
      <form action="" onSubmit={handleSubmit}>
        {
          newUser
          && <>
            <input onBlur={handleBlur} type="text" name="name" placeholder="Your name"></input><br />
          </>
        }
        <input onBlur={handleBlur} type="text" name="email" placeholder="Your email addess" required></input><br />
        <input onBlur={handleBlur} type="password" name="password" placeholder="Your password" required></input><br />
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
        <button onClick={() => resetPassword(user.email)}>Forget or Reset Password</button>
        {/* <p>Name: {user.name} </p>
        <p>Email: {user.email}</p>
        <p>Pass: {user.password} </p> */}
        <p style={{ color: 'red' }}> {user.error} </p>
        {
          user.success
          && <p style={{ color: 'green' }}> User  {newUser ? 'created' : 'logged in'} successfully. </p>
        }
      </form>
    </div>
  );
}

export default App;
