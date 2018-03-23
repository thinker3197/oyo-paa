const firebase = require('firebase');

const config = {
  apiKey: "AIzaSyALjqmgkTQa6zaKHx8qCR-FWM-whOpeclg",
  authDomain: "oyo-paa.firebaseapp.com",
  databaseURL: "https://oyo-paa.firebaseio.com",
  projectId: "oyo-paa",
  storageBucket: "oyo-paa.appspot.com",
  messagingSenderId: "434104200190"
};

const app = firebase.initializeApp(config);

module.exports = firebase.database();