import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';


<<<<<<< HEAD
var config = {
=======
  var config = {
>>>>>>> bfe4065d071d6330815c8aa594350bc2b421ae91
    apiKey: "AIzaSyDQ8PyUdkx6JpYqj30QvvvOwY2xPoHobig",
    authDomain: "pc-slack-clone.firebaseapp.com",
    databaseURL: "https://pc-slack-clone.firebaseio.com",
    projectId: "pc-slack-clone",
    storageBucket: "pc-slack-clone.appspot.com",
    messagingSenderId: "410911827163"
  };
firebase.initializeApp(config);

export default firebase;
