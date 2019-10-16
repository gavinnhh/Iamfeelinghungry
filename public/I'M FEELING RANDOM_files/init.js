if (typeof firebase === 'undefined') throw new Error('hosting/init-error: Firebase SDK not detected. You must include it before /__/firebase/init.js');
firebase.initializeApp({
  "projectId": "i-am-feeling-hungry",
  "appId": "1:478024235219:web:213bcfd5fbd09a78",
  "databaseURL": "https://i-am-feeling-hungry.firebaseio.com",
  "storageBucket": "i-am-feeling-hungry.appspot.com",
  "locationId": "us-central",
  "apiKey": "AIzaSyBJjuNNBDtW2RgK_C-nwce_DGr3ObKYfZA",
  "authDomain": "i-am-feeling-hungry.firebaseapp.com",
  "messagingSenderId": "478024235219"
});
