const storageRef = firebase.storage().ref(); // global const
const db_randomsearch = firebase.firestore();
var leftpostpid = ''
var rightpostid = ''
// random loadimages should allow anyone
// ................loadImages starts ................
function loadImages(){
  // postsColections = db_randomsearch.collection("cities")
  // get two random images from posts, but not /images in firestorage
  // Get all documents id from the database
  var postsColections = []
  var allPostsIds = []

  db_randomsearch.collection("posts").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        postsColections.push(doc.data().foodUrl)
        allPostsIds.push(doc.id)
    });
    //console.log("postsColections.len " + postsColections.length);
    getTwoRandomUrls(allPostsIds)
  });

  function getTwoRandomUrls(allPostsIds){
    random1 = Math.floor(Math.random() * allPostsIds.length);
    random2 = Math.floor(Math.random() * allPostsIds.length);
    while(random1 === random2){
      random2 = Math.floor(Math.random() * allPostsIds.length);
    }
    leftpostpid = allPostsIds[random1];
    rightpostid = allPostsIds[random2];
    const randomLeftDisplay = db_randomsearch.collection('posts').doc(allPostsIds[random1]);
    randomLeftDisplay.onSnapshot(doc => {
            const leftdata = doc.data();
            document.getElementById("imgID").src = leftdata.foodUrl;
            document.getElementById('lefttitle').innerHTML = leftdata.title;
            document.getElementById('leftoverlaytext').innerHTML = leftdata.description.substring(0, 100)+'...';
    })

    const randomRightDisplay = db_randomsearch.collection('posts').doc(allPostsIds[random2]);
    randomRightDisplay.onSnapshot(doc => {
            const rightdata = doc.data();
            document.getElementById("imgID2").src = rightdata.foodUrl;
            document.getElementById('righttitle').innerHTML = rightdata.title;
            document.getElementById('rightoverlaytext').innerHTML = rightdata.description.substring(0, 100)+'...';

    })

   }


}

// ................loadImages ends ................
function seeleftdetail(){
  console.log('seeleftdetail clicked');
  localStorage.setItem('currentPid', leftpostpid);
  window.location.href = "../recipe/recipeDisplay.html";
}

function seerightdetail(){
  console.log('seerightdetail clicked');
  localStorage.setItem('currentPid', rightpostid);
  window.location.href = "../recipe/recipeDisplay.html";
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
