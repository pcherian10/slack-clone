import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';


var config = {
    apiKey: "AIzaSyDQ8PyUdkx6JpYqj30QvvvOwY2xPoHobig",
    authDomain: "pc-slack-clone.firebaseapp.com",
    databaseURL: "https://pc-slack-clone.firebaseio.com",
    projectId: "pc-slack-clone",
    storageBucket: "pc-slack-clone.appspot.com",
    messagingSenderId: "410911827163"
  };
firebase.initializeApp(config);

export default firebase;
