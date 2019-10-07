

// function handleRandomSearch()
// {
//   console.log("random search clicked");
//   window.location.href = "/randomsearch/randomsearchresults.html";
//
//
// }
//
// document.getElementById('randomsearchbtn').addEventListener('click', handleRandomSearch, false);
// const app = firebase.app();
// console.log(app);
const db = firebase.firestore();
// console.log(db);

document.addEventListener("DOMContentLoaded", event => {
  const mypost = db.collection('posts').doc('firstpost');
  mypost.onSnapshot(doc => {
          const data = doc.data();
          console.log(data.name);
          console.log(data.SID);
          console.log(data.major);
          document.getElementById("display").innerHTML = data.major;
        })


});
/*Below is how to add stuff into firestore*/
// db.collection("posts").add({
//     name: "Ada",
//     SID: 111111111,
//     major: "Accounting"
// })
// .then(function(docRef) {
//     console.log("Document written with ID: ", docRef.id);
// })
// .catch(function(error) {
//     console.error("Error adding document: ", error);
// });


function uploadFile(files){
  const storageRef = firebase.storage().ref();
  const logoRef = storageRef.child('logo.jpg');

  const file = files.item(0);
  const task = logoRef.put(file);
  task.then(snapshot => {
    console.log(snapshot); // shows success

    const downloadUrl = snapshot.getDownloadURL().subscribe(url => {
      const Url = url;
      this.url = url;
      console.log('Url: ' + Url);
    })
    // document.querySelector('#imgUpload').setAttribute('src', url);
  })


}
