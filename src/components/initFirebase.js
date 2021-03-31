import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'; // If using Firebase database
import 'firebase/storage';  // If using Firebase storage

var config = {

  apiKey: "AIzaSyDktgQND4Vg_rSftOsNvK0LOe0sL9H4yrY",
  authDomain: "unjobs-post.firebaseapp.com",
  databaseURL: "https://unjobs-post.firebaseio.com",
  projectId: "unjobs-post",
  storageBucket: "unjobs-post.appspot.com",
  messagingSenderId: "654532906512",
  appId: "1:654532906512:web:8de7b7ea721243667fc495",
  measurementId: "G-YXE9PDKKNS"
	
	
};
if (!firebase.apps.length) {
	firebase.initializeApp(config);
}



export default firebase;
