import React, { Component } from "react"
import ReactDOM from "react-dom"
import firebase from "firebase/app"
import { BrowserRouter as Router, Route, Link, Navlink, browserHistory, Switch, Redirect } from "react-router-dom"
import toastr from "toastr"
import $ from "jquery"
import StateContext from "./StateProvider"
export default class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      emailVerified: false
    }
    this.authWithEmailPassword = this.authWithEmailPassword.bind(this)
    this.signInGoogle = this.signInGoogle.bind(this)
    this.signInFacebook = this.signInFacebook.bind(this)
  }

  createEmailPassword = event => {
    event.preventDefault()
    const email = this.emailNewInput.value
    const password = this.passwordNewInput.value

    firebase
      .auth()
      .fetchSignInMethodsForEmail(email)
      .then(providers => {
        if (providers.length === 0) {
          //create user
          //('user created')
          this.loginForm.reset()

          //            toastr.info('Click the Verify Email button to continue to sign in.')
          $(".submit").removeAttr("id")
          //('Here are our providers', providers)
          return firebase.auth().createUserWithEmailAndPassword(email, password)
        }
      })
      .then(() => {
        var self = this
        //('verification enter')
        toastr.info("We have sent you an email to verify your account. Check your inbox to continue.")
        firebase
          .auth()
          .currentUser.sendEmailVerification()
          .then(function () {
            //('Email Sent!')
            self.setState(
              {
                emailVerified: true
              },
              () => {
                //('I have posted email verification to state')
                //  window.location.reload();
              }
            )
          })
          .catch(function (error) {
            // An error happened.
            //('oops', error)
          })
      })
      .then(() => {
        //('check for uid', user.uid)
        firebase.database().ref(`users/${firebase.auth().currentUser.uid}/userSetting`).set({
          authLogin: "emailpass",
          name: null,
          displayPicture: null,
          email: this.emailInput.value
        })
      })
      .catch(error => {
        var errorCode = error.code
        var errorMessage = error.message
        // The email of the user's account used.
        var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential
      })
  }
  authWithEmailPassword = event => {
    var self = this
    event.preventDefault()
    const email = this.emailInput.value
    const password = this.passwordInput.value
    //(email, password)
    firebase
      .auth()
      .fetchSignInMethodsForEmail(email)
      .then(providers => {
        //(providers)
        if (providers.length === 0) {
          toastr.error("Email and password information not found. It looks like you have not signed up!")
          this.loginForm.reset()
        }
        if (providers.indexOf("password") === -1) {
          //they used facebook, google
          this.loginForm.reset()
          toastr.info("Please use another form of signin to continue.")
          //('You should not use this type of authentication')
        } else {
          //sign user in
          //('user signedin')

          return firebase.auth().signInWithEmailAndPassword(email, password)
        }
      })
      .then(user => {
        //('new promise user', user)

        this.loginForm.reset()
        //('user and email exists')
        if (firebase.auth().currentUser.emailVerified === false) {
          //('User is NOT verfied')
          toastr.info("Please make sure to verify your account to continue.")
          user
            .sendEmailVerification()
            .then(function () {
              //('Email Sent!')
            })
            .catch(function (error) {
              // An error happened.
              //('oops', error)
            })
        } else if (firebase.auth().currentUser.emailVerified) {
          //('user IS verified')

          this.setState(
            {
              redirect: true
            },
            () => {
              //('final redirect'))
            }
          )
        }
      })
      .catch(error => {
        var errorCode = error.code
        var errorMessage = error.message
        // The email of the user's account used.
        var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential
      })
  }
  signInGoogle() {
    var self = this
    var provider = new firebase.auth.GoogleAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken
        // The signed-in user info.
        var user = result.user
        //('This my image', user)
        firebase
          .database()
          .ref("users/" + user.uid + "/userSetting")
          .set({
            authLogin: "google",
            name: user.displayName,
            displayPicture: user.photoURL,
            email: user.email
          })
        self.setState({
          username: user.displayName,
          email: user.email,
          displayPicture: user.photoURL,
          redirect: true
        })
        //(self.state)
        // ...
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        // The email of the user's account used.
        var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential
        // ...
      })
  }
  signInFacebook() {
    var self = this
    var provider = new firebase.auth.FacebookAuthProvider()
    provider.addScope("email")
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken
        // The signed-in user info.
        var user = result.user
        firebase
          .database()
          .ref("users/" + user.uid + "/userSetting")
          .set({
            authLogin: "facebook",
            name: user.displayName,
            displayPicture: user.photoURL,
            email: user.email
          })
        self.setState(
          {
            username: user.displayName,
            displayPicture: user.photoURL,
            email: user.email,
            redirect: true
          },
          () => {
            //('Done', self.state)
          }
        )
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        // The email of the user's account used.
        var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential
        // ...
      })
  }

  render() {
    //('Redirect State', this.props)
    if (this.state.redirect === true) {
      //('we really did redirect')
      return <Redirect to="/Homepage" />
    }

    return (
      <div className="signInHome">
        <div className="container">
          <div className="auth">
            <div
              className="logo"
              style={{
                backgroundImage: `url('https://www.kiruweb.com/img/craiglistlogo.png')`
              }}
            ></div>
            <div className="login">
              <section className="emailpass">
                <form
                  autoComplete="off"
                  onSubmit={event => {
                    this.authWithEmailPassword(event)
                  }}
                  ref={form => {
                    this.loginForm = form
                  }}
                >
                  <div className="wrapper">
                    <input
                      className="pt-input"
                      name="email"
                      type="email"
                      ref={input => {
                        this.emailInput = input
                      }}
                      placeholder="Email"
                      required
                    />
                    <label>Email</label>
                  </div>
                  <div className="wrapper">
                    <input
                      className="pt-input"
                      pattern=".{6,}"
                      title="6 characters minimum"
                      name="password"
                      type="password"
                      ref={input => {
                        this.passwordInput = input
                      }}
                      placeholder="Password"
                      required
                    />
                    <label> Password</label>
                    <input type="submit" className="submit" value="Log In"></input>
                  </div>
                </form>
                <div className="joinTag">
                  Need to sign up? <a href="#popup">Join gggdddthe Community</a>
                </div>
                <div className="popup" id="popup">
                  <div className="popup__content">
                    <a href="#signInHome" className="popup__close">
                      &times;
                    </a>
                    <h3>Join the Community</h3>
                    <form
                      autoComplete="off"
                      onSubmit={event => {
                        this.createEmailPassword(event)
                      }}
                      ref={form => {
                        this.loginForm = form
                      }}
                    >
                      <div className="wrapper">
                        <input
                          className="pt-input"
                          name="email"
                          type="email"
                          ref={input => {
                            this.emailNewInput = input
                          }}
                          placeholder="Email"
                          required
                        />
                        <label>Email</label>
                      </div>
                      <div className="wrapper">
                        <input
                          className="pt-input"
                          pattern=".{6,}"
                          title="6 characters minimum"
                          name="password"
                          type="password"
                          ref={input => {
                            this.passwordNewInput = input
                          }}
                          placeholder="Password"
                          required
                        />
                        <label> Password</label>
                        <input type="submit" className="submit" value="Sign Up"></input>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
              {/* <div className="oauth">
                <div className="google" onClick={this.signInGoogle}>
                  <img className="googlelogo" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="google logo"></img>
                  <p>Continue with Google</p>
                </div>
                <div className="fb" onClick={this.signInFacebook}>
                  <i className="fab fa-facebook-f"></i>
                  <p>Continue with Facebook</p>
                </div>
              </div> */}
            </div>
          </div>
          <section className="info">
            <div className="header">
              <section className="promo">
                <h3>
                  <i className="fas fa-search"></i>
                  Search for ads that fulfill your needs.
                </h3>
                <h3>
                  <i className="fas fa-pencil-alt"></i>
                  Create posts for your community to see.
                </h3>
                <h3>
                  <i className="far fa-comment"></i>
                  Join your campus classifieds wall.
                </h3>
              </section>
            </div>
          </section>
        </div>
      </div>
    )
  }
}
SignIn.contextType = StateContext
