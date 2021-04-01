import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'; // If using Firebase database
import 'firebase/storage';  // If using Firebase storage

var config = {

    apiKey: "AIzaSyCQ12wZofISeWA_YQ6_maxipAWLyBE4dqc",
    authDomain: "unjobs-community.firebaseapp.com",
    databaseURL: "https://unjobs-community.firebaseio.com",
    projectId: "unjobs-community",
    storageBucket: "unjobs-community.appspot.com",
    messagingSenderId: "954677983380",
    appId: "1:954677983380:web:22426725296c24b9851c81"
	
};
if (!firebase.apps.length) {
	firebase.initializeApp(config);
}



export default firebase;
