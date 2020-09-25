import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'; // If using Firebase database
import 'firebase/storage';  // If using Firebase storage

var config = {
	apiKey: "AIzaSyCccvko6m2qAlRgNeoICbeM9CjwQSNMKZQ",
	authDomain: "kirus-craigslist.firebaseapp.com",
	databaseURL: "https://kirus-craigslist.firebaseio.com",
	projectId: "kirus-craigslist",
	storageBucket: "kirus-craigslist.appspot.com",
	messagingSenderId: "545866356812"
};
if (!firebase.apps.length) {
	firebase.initializeApp(config);
}



export default firebase;
