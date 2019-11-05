/**

Note: db has been defined in auth.js so no need to define again in this file

*/
const storageRef_recipe = firebase.storage().ref(); // global const
const db_recipe = firebase.firestore();
document.getElementById('home').addEventListener('click', goHome, false);
function goHome(){
  window.location.href = "../index.html";
}

console.log(listButtons);
