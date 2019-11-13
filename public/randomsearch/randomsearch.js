const storageRef = firebase.storage().ref(); // global const
const db_randomsearch = firebase.firestore();

// random loadimages should allow anyone 
function loadImages(){
  // postsColections = db_randomsearch.collection("cities")
  // TODO: get two random images from posts, but not /images in firestorage
  // Get all documents id from the database
  var postsColections = []
  db_randomsearch.collection("posts").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        postsColections.push(doc.data().foodUrl)
    });
    //console.log("postsColections.len " + postsColections.length);
    getTwoRandomUrls(postsColections)
});

function getTwoRandomUrls(allPosts){
  random1 = Math.floor(Math.random() * allPosts.length);
  random2 = Math.floor(Math.random() * allPosts.length);
  while(random1 === random2){
    random2 = Math.floor(Math.random() * allPosts.length);
  }
  // console.log(allUrls[random1]);
  // console.log(allUrls[random2]);
  // set the two random display images
  document.getElementById("imgID").src = allPosts[random1];
  document.getElementById("imgID2").src = allPosts[random2];
}

}
//   var allUrls = [];
//   // Create a reference under which you want to list
//   var listRef = storageRef.child('images');
//
//   // Find all the prefixes and items.
//   listRef.listAll().then(function(res) {
//     res.items.forEach(function(itemRef) {
//         // All the items under listRef.
//         // console.log('list all: ');
//
//         // console.log(itemRef.location);
//         itemRef.getDownloadURL().then(function(url) {
//           // console.log('url: ' + url); // url is string
//           allUrls.push(url);
//           if (allUrls.length === res.items.length){
//               // console.log('allUrls size = ' + allUrls.length);
//               random1 = Math.floor(Math.random() * allUrls.length);
//               random2 = Math.floor(Math.random() * allUrls.length);
//               while(random1 === random2){
//                 random2 = Math.floor(Math.random() * allUrls.length);
//               }
//               // console.log(allUrls[random1]);
//               // console.log(allUrls[random2]);
//               // set the two random display images
//               document.getElementById("imgID").src = allUrls[random1];
//               document.getElementById("imgID2").src = allUrls[random2];
//         }
//
//         }).catch(function(error){alert(error)});
//
//
//     });
//
//
//   }).catch(function(error) {
//     alert("You have no access at this point");
//   });
//
// }

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
