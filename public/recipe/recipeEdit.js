
const storageRef_recipeDisplay = firebase.storage().ref(); // global const
const db_recipe = firebase.firestore();
var currpostid = localStorage.getItem('sendCurrentPid2Display');
var imageHasBeenUpdated = false;

document.getElementById('home').addEventListener('click', goHome, false);
document.getElementById('cancelEdit').addEventListener('click', handleCancelEdit, false);
document.getElementById('savePost').addEventListener('click', handleSavePost, false);
document.getElementById('deletePost').addEventListener('click', handledeletePost, false);
document.getElementById('addMoreIng').addEventListener('click', handleAddMoreIng, false);
document.getElementById('addMoreDir').addEventListener('click', handleAddMoreDir, false);

function handleCancelEdit(){
  window.location.href = "recipeDisplay.html";
}

function handleSavePost(){
  firebase.auth().onAuthStateChanged(function(user) {
    // user is a firebase built-in variable, firebase knows user
    if (user) {
            console.log("handleSavePost clicked");
            var ingArray = document.getElementById('ingList'); // get txt area
            var inglen = ingArray.getElementsByTagName('div').length;

            // print each ingredient
            ingContents = [];
            for(i = 0; i < inglen; i++){
              var ingcontent = ingArray.getElementsByTagName('textarea')[i].value;
              ingContents.push(ingcontent);
              //console.log(content);
            }

            var dirArray = document.getElementById('dirList'); // get txt area
            var dirlen = dirArray.getElementsByTagName('div').length;

            // print each ingredient
            dirContents = [];
            for(i = 0; i < dirlen; i++){
              var dircontent = dirArray.getElementsByTagName('textarea')[i].value;
              dirContents.push(dircontent);
              //console.log(content);
            }

            //var ingredientsList = document.getElementById("profile_username").value;
            // var directionList = document.getElementById("profile_fname").value;
            // var newlastname = document.getElementById("profile_lname").value;
            // *update user post names starts*
            // first download the url first

            var user = firebase.auth().currentUser;
            // update the current user photoUrl
            var updatePosts = db_recipe.collection("posts").doc(currpostid);
            // Set the "PhotoUrl" field of the the document user.uid
            return updatePosts.update({
                ingredient: ingContents,
                direction: dirContents
            })
            .then(function() {
                console.log("post successfully updated!");
                window.location.href = "recipeDisplay.html";
            })
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating names: ", error);
      });
      // *update user post names ends*

    }else{
      alert('You are not signed in!!!')
    }
  })
}

function goHome(){
  window.location.href = "../index.html";
}

function handledeletePost(){
  console.log("delete post clicked");
  var count = 0;
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // first delete from posts collection
      db_recipe.collection("posts").doc(currpostid).delete().then(function() {
          console.log("Post successfully deleted!");
          window.location.href = "../profile/profile.html";
      }).catch(function(error) {
          console.error("Error removing post: ", error);
      });

      // delete the post id in current user's allPostsIds
      // get allPostsIds
      count++;
      // start if
      if(count <= 1){
        var deleteCurrentPostInUser = db_recipe.collection("users").doc(user.uid);
        deleteCurrentPostInUser.onSnapshot(doc => {
           var allpostids = doc.data().allPostsIDs;
           for(i = 0; i < allpostids.length; i++){
             if(allpostids[i] === currpostid){
               allpostids.splice(i, 1);
               break;
             }
           }

           return deleteCurrentPostInUser.update({
                                 allPostsIDs: allpostids
                             })
                             .then(function() {
                                 console.log("allPostsIDs successfully updated!");

                             })
                             .catch(function(error) {
                                 // The document probably doesn't exist.
                                 console.error("Error updating allPostsIDs: ", error);
                             });
        })
      }
      // end if
    }else{
      alert("You are not signed in!!!");
    }
  });

}

const mypost = db_recipe.collection('posts').doc(currpostid);
mypost.onSnapshot(doc => {
        const postdata = doc.data();

        document.getElementById('name').innerHTML = postdata.title;
        document.getElementById('imgID').src = postdata.foodUrl;

        var ingList = postdata.ingredient;// returning an array of ind
        var ingredientsTag = document.getElementById('ingList'); // each ingredient will be appended into this div

        ingdeleteBtns = [];
        for(i = 0; i < ingList.length; i++){

          var eachIngredientDiv = document.createElement('div');
          var eachIngredientInputTag = document.createElement('textarea');

          // var eachIngredientInputTag = document.createElement('p1'); // was gonna try p1 tag....
          // var node = document.createTextNode(ingList[i]);
          // eachIngredientInputTag.appendChild(node);
          // eachIngredientInputTag.style.color = "white";
          // eachIngredientInputTag.contentEditable = "true";
          // eachIngredientDiv.appendChild(eachIngredientInputTag);
          eachIngredientInputTag.id = "ing"+i;
          eachIngredientInputTag.rows = "2";
          eachIngredientInputTag.style.border = "none";
          eachIngredientInputTag.style.width = "90%";
          eachIngredientInputTag.innerHTML = ingList[i];
          eachIngredientDiv.appendChild(eachIngredientInputTag);

          // var remove = document.createElement('button');
          // var node = document.createTextNode('<i class="fas fa-trash"></i>');
          // remove.appendChild(node);
          // // var class = "btn"><i class="fas fa-trash"></i>
          // //remove.value = '<i class="fas fa-trash"></i>';
          // remove.className = "btn";
          //eachIngredientDiv.appendChild(remove);

          eachIngredientDiv.innerHTML += '<button id="ingremove'+i+'" class="btn"><i class="fas fa-trash"></i>&nbsp;</button>';
          ingredientsTag.appendChild(eachIngredientDiv);

          deleteBtn = eachIngredientDiv.getElementsByTagName("button")[0];
          ingdeleteBtns.push(deleteBtn);
          ingdeleteBtns.forEach(function(eachdeletebtn){
            eachdeletebtn.addEventListener('click', function(){console.log(eachdeletebtn.id + "clicked");this.parentNode.remove();}, false);

          });
        }


        var dirList = postdata.direction; // an array of dir
        var directionsTag = document.getElementById('dirList');
        dirdeleteBtns = [];
        for(i = 0; i < dirList.length; i++){
          var eachDirectionDiv = document.createElement('div');
          var eachDirectionInputTag = document.createElement('textarea');
          eachDirectionInputTag.id = "dir"+i;
          eachDirectionInputTag.style.width = "90%";
          eachDirectionInputTag.rows = "3";
          eachDirectionInputTag.style.border = "none";
          eachDirectionInputTag.innerHTML = dirList[i];
          eachDirectionDiv.appendChild(eachDirectionInputTag);
          eachDirectionDiv.innerHTML += '<button id="dirremove'+i+'" class="btn"><i class="fas fa-trash"></i>&nbsp;</button>';

          // make two more spacing for each div
          var brtag = document.createElement("br");
          var brtag2 = document.createElement("br");
          eachDirectionDiv.appendChild(brtag);// add a new line
          //eachDirectionDiv.appendChild(brtag2);
          directionsTag.appendChild(eachDirectionDiv);
          deleteBtn = eachDirectionDiv.getElementsByTagName("button")[0];
          dirdeleteBtns.push(deleteBtn);
          dirdeleteBtns.forEach(function(eachdeletebtn){
            eachdeletebtn.addEventListener('click', function(){console.log(eachdeletebtn.id + "clicked");this.parentNode.remove();}, false);

          });
        }

});

// update photo starts
var loadProfile = function(files) {
  var image = document.getElementById('imgID');
  image.src = URL.createObjectURL(event.target.files[0]); // get a new photo

  // store images into images in firebase storage
  firebase.auth().onAuthStateChanged(function(user) {
    // user is a firebase built-in variable, firebase knows user
    if (user) {
        UpdateFoodUrl(files);
    }else{
      alert("You are not signed in!!!");
    }
  });
};

function UpdateFoodUrl(files){
  const current_post_profile = db_recipe.collection('posts').doc(currpostid);

  current_post_profile.get().then(function(doc) {
    if (doc.exists) {
        updateFoodPhoto(files, currpostid);
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
    }).catch(function(error) {
        console.log("Error getting document:", error);
  });

}

function updateFoodPhoto(files, postId){

  var post_pro_img = postId + ".jpg";
  // WARNING: make sure fire storage does not have a such a name already existed. But usually it barely happens
  // considering the small amout of users.
  const logoRef = storageRef_recipeDisplay.child('images/' + post_pro_img);

    // upload file from local folder
    const file = files.item(0);
    const task = logoRef.put(file);

    task.then(snapshot => {
      console.log(snapshot); // shows success upload cred
      // Get the download URL
      logoRef.getDownloadURL().then(function(url) {

        // update the current post photoUrl
        var updatePhotoUrl = db_recipe.collection("posts").doc(postId);
        // Set the "PhotoUrl" field of the the document user.uid
        return updatePhotoUrl.update({
            foodUrl: url
        })
        .then(function() {
            // the weird thing is if i don't refresh the page here, ing and dir will be reloaded and append to it.
            document.location.reload(true);
            console.log("photoUrl successfully updated!");

        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating photoUrl: ", error);
        });
        // *update user profile image ends*

      }).catch(function(error) {

          });
     })

}
// update photo ends

function handleAddMoreIng(){
  console.log("handleAddMoreIng clicked");
  firebase.auth().onAuthStateChanged(function(user) {
    // user is a firebase built-in variable, firebase knows user
    if (user) {

      var ingredientsTag = document.getElementById('ingList'); // each ingredient will be appended into this div

      //console.log("length = " + ingredientsTag.getElementsByTagName('div').length);
      var currIndex = ingredientsTag.getElementsByTagName('div').length;
      var eachIngredientDiv = document.createElement('div');
      var eachIngredientInputTag = document.createElement('textarea');

      eachIngredientInputTag.id = "ing"+currIndex;
      eachIngredientInputTag.rows = "2";
      eachIngredientInputTag.style.border = "none";
      eachIngredientInputTag.style.width = "90%";
      eachIngredientInputTag.innerHTML = "";
      eachIngredientDiv.appendChild(eachIngredientInputTag);

      eachIngredientDiv.innerHTML += '<button id="ingremove'+currIndex+'" class="btn"><i class="fas fa-trash"></i>&nbsp;</button>';
      ingredientsTag.appendChild(eachIngredientDiv);

      deleteBtn = eachIngredientDiv.getElementsByTagName("button")[0];
      ingdeleteBtns.push(deleteBtn);
      ingdeleteBtns.forEach(function(eachdeletebtn){
        eachdeletebtn.addEventListener('click', function(){console.log(eachdeletebtn.id + "clicked");this.parentNode.remove();}, false);

      });

    }else{
      alert("You are not signed in!!!");
    }
  })
}

function handleAddMoreDir(){
  console.log("handleAddMoreDir clicked");
  firebase.auth().onAuthStateChanged(function(user) {
    // user is a firebase built-in variable, firebase knows user
    if (user) {

        var directionsTag = document.getElementById('dirList');
        var currIndex = directionsTag.getElementsByTagName('div').length;
        var eachDirectionDiv = document.createElement('div');
        var eachDirectionInputTag = document.createElement('textarea');
        eachDirectionInputTag.id = "dir"+currIndex;
        eachDirectionInputTag.style.width = "90%";
        eachDirectionInputTag.rows = "3";
        eachDirectionInputTag.style.border = "none";
        eachDirectionInputTag.innerHTML = "";
        eachDirectionDiv.appendChild(eachDirectionInputTag);
        eachDirectionDiv.innerHTML += '<button id="dirremove'+currIndex+'" class="btn"><i class="fas fa-trash"></i>&nbsp;</button>';

        // make two more spacing for each div
        var brtag = document.createElement("br");
        var brtag2 = document.createElement("br");
        eachDirectionDiv.appendChild(brtag);// add a new line
        //eachDirectionDiv.appendChild(brtag2);
        directionsTag.appendChild(eachDirectionDiv);
        deleteBtn = eachDirectionDiv.getElementsByTagName("button")[0];
        dirdeleteBtns.push(deleteBtn);
        dirdeleteBtns.forEach(function(eachdeletebtn){
          eachdeletebtn.addEventListener('click', function(){console.log(eachdeletebtn.id + "clicked");this.parentNode.remove();}, false);

        });

    }else{
      alert("You are not signed in!!!");
    }
  })
}
