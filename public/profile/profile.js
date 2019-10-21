//below two are necessay for communicating with firebase cloud database and storage
const db = firebase.firestore();
const storageRef = firebase.storage().ref(); // global const

document.getElementById('home').addEventListener('click', handleHome, false);
document.getElementById('signout').addEventListener('click', handleSignout, false);

function handleHome(){
  console.log('Navigating to Home');
  window.location.href = "../index.html";
}

function handleSignout(){
  console.log('user sign out clicked from profile page');
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  }
    window.location.href = "../index.html";
}
