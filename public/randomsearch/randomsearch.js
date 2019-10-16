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

// console.log(db);

// document.addEventListener("DOMContentLoaded", event => {
//   const mypost = db.collection('posts').doc('firstpost');
//   mypost.onSnapshot(doc => {
//           const data = doc.data();
//           console.log(data.name);
//           console.log(data.SID);
//           console.log(data.major);
//           document.getElementById("display").innerHTML = data.major;
//         })
//
//
// });

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

const storageRef = firebase.storage().ref(); // global const

// function uploadFile(files){
//   // const storageRef = firebase.storage().ref();
//   const logoRef = storageRef.child('images/test2.jpg');
//
//   // upload file from local folder
//   const file = files.item(0);
//   const task = logoRef.put(file);
//   task.then(snapshot => {
//     console.log(snapshot); // shows success upload cred
//     // Get the download URL
//     logoRef.getDownloadURL().then(function(url) {
//       // Insert url into an <img> tag to display
//       console.log('download url: ');
//       console.log(url);
//       document.getElementById("imgID").src = url;
//     }).catch(function(error) {
//           // A full list of error codes is available at
//           // https://firebase.google.com/docs/storage/web/handle-errors
//           switch (error.code) {
//             case 'storage/object-not-found':
//               alert("File does not exist in firebase storage");
//               break;
//
//             case 'storage/unauthorized':
//               albert("User doesn't have permission to access the object")
//               break;
//
//             case 'storage/canceled':
//               // User canceled the upload
//               break;
//
//             case 'storage/unknown':
//               // Unknown error occurred, inspect the server response
//               break;
//           }
//         });
//    })
//
//}
function loadImages(){
  var allUrls = [];
  // Create a reference under which you want to list
  var listRef = storageRef.child('images');
  // Find all the prefixes and items.
  listRef.listAll().then(function(res) {
    res.items.forEach(function(itemRef) {
        // All the items under listRef.
        // console.log('list all: ');
        // console.log(itemRef.location);
        itemRef.getDownloadURL().then(function(url) {
          // console.log('url: ' + url); // url is string
          allUrls.push(url);
          if (allUrls.length === res.items.length){
              // console.log('allUrls size = ' + allUrls.length);
              random1 = Math.floor(Math.random() * allUrls.length);
              random2 = Math.floor(Math.random() * allUrls.length);
              while(random1 === random2){
                random2 = Math.floor(Math.random() * allUrls.length);
              }
              // console.log(allUrls[random1]);
              // console.log(allUrls[random2]);
              // set the two random display images
              document.getElementById("imgID").src = allUrls[random1];
              document.getElementById("imgID2").src = allUrls[random2];
        }

        }).catch(function(error){alert(error)});


    });


  }).catch(function(error) {
    albert(error);
  });

}

loadImages(); // load images when first loading the website
document.getElementById('reroll').addEventListener('click', handleReroll, false);
document.getElementById('home').addEventListener('click', handlelHome, false);

function handleReroll()
{
    loadImages();
}

function handlelHome(){
  console.log('home clicked from random search');
  window.location.href = "../index.html";
}
