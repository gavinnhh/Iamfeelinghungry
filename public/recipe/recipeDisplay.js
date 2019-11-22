//const storageRef_recipeDisplay = firebase.storage().ref(); // global const
const db_recipeDsiaply = firebase.firestore();
document.getElementById('home').addEventListener('click', goHome, false);

checkUserLoggedIn(); // edit button will show as long as there is a user logged in

function goHome(){
  window.location.href = "../index.html";
}

function handleEditPost(postid){
  console.log("edit post clicked ");
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      localStorage.setItem('sendCurrentPid2Display', postid); // send pid to recipe.js
      window.location.href = "recipeEdit.html";
    }else{
      alert("You are not signed in!!!");
    }
  });


}

var currpostidDisplay = localStorage.getItem('currentPid'); // get pid from profile.js
document.getElementById('editPost').addEventListener('click', function(){handleEditPost(currpostidDisplay)}, false);


// console.log("retrivedAllPosts in recipe: " + retrivedAllPosts);
// console.log("retrivedAllPosts in recipe length = " + retrivedAllPosts.length);
const mypostDisplay = db_recipeDsiaply.collection('posts').doc(currpostidDisplay);
mypostDisplay.onSnapshot(doc => {

        const postdata = doc.data();

        document.getElementById('name').innerHTML = postdata.title;
        document.getElementById('imgID').src = postdata.foodUrl;
        var ingList = postdata.ingredient;
        var ingredientsTag = document.getElementById('ingList');
        for(i = 0; i < ingList.length; i++){
          var ing = document.createTextNode(ingList[i]);
          ingredientsTag.appendChild(ing);
          var brtag = document.createElement("br");
          var brtag2 = document.createElement("br");
          ingredientsTag.appendChild(brtag);// add a new line
          ingredientsTag.appendChild(brtag2);
        }

        var dirList = postdata.direction;
        var directionsTag = document.getElementById('dirList');
        for(i = 0; i < dirList.length; i++){
          var dir = document.createTextNode(dirList[i]);
          directionsTag.appendChild(dir);
          var brtag = document.createElement("br");
          var brtag2 = document.createElement("br");
          directionsTag.appendChild(brtag);// add a new line
          directionsTag.appendChild(brtag2);
        }

});


function checkUserLoggedIn(){
  firebase.auth().onAuthStateChanged(function(user) {
    // user is a firebase built-in variable, firebase knows user
    console.log("current user.id = " + user.uid);
    const mypostDisplay = db_recipeDsiaply.collection('posts').doc(currpostidDisplay);
    mypostDisplay.onSnapshot(doc => {
            const postdata = doc.data();
            console.log("postdata.fromUser = " + postdata.fromUser);
            if (user.uid === postdata.fromUser) {
              // edit button will show as long as there is a user logged in
              // and the displayed image user is equal to current signed in user account
              console.log("show edit");
              document.getElementById('editPost').style.display='block';
            }})
    })

}
