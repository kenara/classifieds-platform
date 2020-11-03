import React, { Component, createRef } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, NavLink, Link} from "react-router-dom"
import Newpost1 from "./Newpost1.js"
import ManagePosts from "./ManagePosts.js"
import firebase from "firebase/app"
import $ from "jquery"
import toastr from "toastr"
import BookSVG from "../img/book.svg"
import Button from "@material-ui/core/Button"
import StateContext from "./StateProvider"
import FadeIn from "react-fade-in"
import FacebookIcon from "@material-ui/icons/Facebook"

export default class Header extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      popupTrue: true,
      redirect: false,
      emailVerified: false
    }
    this.checkboxRef = createRef()
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
        firebase
          .database()
          .ref("users/" + this.context.user?.uid + "userSetting")
          .set({
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
    const { user, setUser } = this.context
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
        this.context.setUser(user)
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
            name: this.context.user.displayName,
            displayPicture: this.context.user.photoURL,
            email: user.email
          })
        self.setState({
          username: user.displayName,
          email: user.email,
          displayPicture: this.context.user.photoURL,
          redirect: true
        })
        this.context.setUser(user)
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
    const { user, setUser } = this.context
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
            displayPicture: this.context.user.photoURL,
            email: user.email
          })
        self.setState({
          username: user.displayName,
          displayPicture: this.context.user.photoURL,
          email: user.email,
          redirect: true
        })
        this.context.setUser(user)
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

  componentDidMount() {
    this.setState({
      user: this.context.user
    })
  }
  toggleNav = () => {
    this.checkboxRef.current.checked = false
  }

  render() {
    return (
      <div className="mainheader">
        <header>
          <section className="leftmenu">
            <div>
              <Link to={"/"}>
                <div className="logo logoheader">
                  <img src={BookSVG} alt="logo"></img>
                  <h4>Golden Catalog</h4>
                </div>
              </Link>
              {!this.context.user ? (
                <a href="#login">
                  <Button variant="outlined" size="medium">
                    <div className="post">
                      <p>Post To Classifieds</p>
                    </div>
                  </Button>
                </a>
              ) : (
                <Link to={"/Newpost1"}>
                  <Button variant="outlined" size="medium">
                    <div className="post">
                      <p>Post To Classifieds</p>
                    </div>
                  </Button>
                </Link>
              )}
            </div>
          </section>
          <section className="rightmenu">
            <div className="user">
              <div className="userimg">
                <img src={JSON.parse(localStorage.getItem("classifiedsToken"))?.photoURL} alt=""></img>
              </div>
              <span className="username">{JSON.parse(localStorage.getItem("classifiedsToken"))?.displayName}</span>
            </div>
          </section>
          <div className="navigation">
            <input ref={this.checkboxRef} type="checkbox" className="navigation__checkbox" id="navi-toggle" />

            <label htmlFor="navi-toggle" className="navigation__button">
              <span className="navigation__icon">&nbsp;</span>
            </label>

            <div className="navigation__background">&nbsp;</div>

            <nav className="navigation__nav">
              <ul className="navigation__list">
                <li className="navigation__item" onClick={this.toggleNav}>
                  {!this.context.user ? (
                    <a href="#login" className="navigation__link">
                      <span>01</span>Post to Classifieds
                    </a>
                  ) : (
                    <Link to="/Newpost1" className="navigation__link">
                      <span>01</span>Post to Classifieds
                    </Link>
                  )}
                </li>
                <li className="navigation__item" onClick={this.toggleNav}>
                  {!this.context.user ? (
                    <a href="#login" className="navigation__link">
                      <span>02</span>Manage my Posts
                    </a>
                  ) : (
                    <Link to="/managePosts" className="navigation__link">
                      <span>02</span>Manage my Posts
                    </Link>
                  )}
                </li>
                <li className="navigation__item">
                  <Link onClick={this.props.signOut} to="/" className="navigation__link ">
                    <span>03</span>Log out
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <div className="popup" id="login">
          <FadeIn>
            <div className="popup__content">
              <a onClick={() => this.setState({ popupTrue: false })} href="#EditCancel" className="popup__close">
                &times;
              </a>
              <h6>Login to your account</h6>
              <div className="auth">
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
                      Need to sign up? <a href="#signup">Join the Community</a>
                    </div>
                  </section>
                  <div className="oauth">
                    <div className="google" onClick={this.signInGoogle}>
                      <section>
                        <img className="googlelogo" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="google logo"></img>
                      </section>
                      <p className="googleContainer">Continue with Google</p>
                    </div>
                    <div className="fb" onClick={this.signInFacebook}>
                      <section>
                        <FacebookIcon />
                      </section>
                      <p className="fbContainer">Continue with Facebook</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
          {/* )} */}
        </div>

        <div className="popup" id="signup">
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
      </div>
    )
  }
}
Header.contextType = StateContext
