
const storageRef_recipe = firebase.storage().ref(); // global const
const db_recipe = firebase.firestore();
document.getElementById('home').addEventListener('click', goHome, false);
function goHome(){
  window.location.href = "../index.html";
}

var currpostid = localStorage.getItem('currentPid');
console.log("currentpostid = " + currpostid);

// console.log("retrivedAllPosts in recipe: " + retrivedAllPosts);
// console.log("retrivedAllPosts in recipe length = " + retrivedAllPosts.length);
const mypost = db_recipe.collection('posts').doc(currpostid);
mypost.onSnapshot(doc => {
        const postdata = doc.data();

        document.getElementById('name').innerHTML = postdata.title;
        document.getElementById('imgID').src = postdata.foodUrl;
        var ingList = postdata.ingredient;
        var ingredientsTag = document.getElementById('ingList');
        for(i = 0; i < ingList.length; i++){
          var ing = document.createTextNode("• " + ingList[i]);
          ingredientsTag.appendChild(ing);
          var brtag = document.createElement("br");
          var brtag2 = document.createElement("br");
          ingredientsTag.appendChild(brtag);// add a new line
          ingredientsTag.appendChild(brtag2);
        }

        var dirList = postdata.direction;
        var directionsTag = document.getElementById('dirList');
        for(i = 0; i < dirList.length; i++){
          var dir = document.createTextNode("• " + dirList[i]);
          directionsTag.appendChild(dir);
          var brtag = document.createElement("br");
          var brtag2 = document.createElement("br");
          directionsTag.appendChild(brtag);// add a new line
          directionsTag.appendChild(brtag2);
        }

        //document.getElementById('ingList').innerHTML = postdata.ingredient;
        //document.getElementById('dirList').innerHTML = postdata.direction;
});
