//below two are necessay for communicating with firebase cloud database and storage
const db = firebase.firestore();
const storageRef = firebase.storage().ref(); // global const

document.getElementById('home').addEventListener('click', handleHome, false);

function handleHome(){
  console.log('Navigating to Home');
  window.location.href = "../index.html";
}
