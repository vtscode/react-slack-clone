import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAa4BNfJZlPYfD-kVz1ZnYXaRa7F8KAWaE",
  authDomain: "react-slack-clone-bd3ab.firebaseapp.com",
  projectId: "react-slack-clone-bd3ab",
  storageBucket: "react-slack-clone-bd3ab.appspot.com",
  messagingSenderId: "66040732235",
  databaseURL : 'https://react-slack-clone-bd3ab-default-rtdb.firebaseio.com/',
  appId: "1:66040732235:web:9ae00d9ffe7e9a35458bce"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase