//below two are necessay for communicating with firebase cloud database and storage
const db2 = firebase.firestore();
const storageRef = firebase.storage().ref(); // global const
var listButtons = []; // undefined initially
document.getElementById('home').addEventListener('click', handleHome, false);
document.getElementById('signout_from_profile').addEventListener('click', handleSignout, false);
// document.getElementById('cancelEdit').style.visibility = 'hidden';
document.getElementById('editprofile').addEventListener('click', handleEditProfile, false);
document.getElementById('cancelEdit').addEventListener('click', handleCancelEdit, false);
// document.getElementById('addpost').addEventListener('click', handleAddPosts, false);
//document.getElementById('addpost').addEventListener('click', handleAddPosts, false);
//document.getElementById('addpost').addEventListener('click', handleAddPosts, false);
document.getElementById('addtags').addEventListener('click', handleAddTags, false);
document.getElementById('addtitle').addEventListener('click', handleAddTitle, false);
document.getElementById('addingredients').addEventListener('click', handleAddIngredients, false);
document.getElementById('adddirections').addEventListener('click', handleAddDirections, false);
document.getElementById('adddescription').addEventListener('click', handleAddDescription, false);
document.getElementById('uploadpost').addEventListener('click', handleFileUploadbutton, false);


// function loadProfile below means to upload a new profile photo
// also: new image selcted will be uploaded into firebase storage and
// new photo url will overwrite the current user's data field: photoUrl
// once load file is called, that means we want to update profile image
// loadProfile is from the HTML
var loadProfile = function(files) {
  var image = document.getElementById('profileImgId');
  image.src = URL.createObjectURL(event.target.files[0]); // get a new photo
  //TODO: upload the new profile image to the user in database
  // console.log("image: " + image.src);
  // store images into profileImages in firebase storage
  UpdatePhotoUrl(files);
};

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

// initiall load profile image, name, all the posts and stuff
firebase.auth().onAuthStateChanged(function(user) {
  // user is a firebase built-in variable, firebase knows user
  var displayName = user.displayName;
  var email = user.email;
  var emailVerified = user.emailVerified;
  var photoURL = user.photoURL;
  var isAnonymous = user.isAnonymous;
  var uid = user.uid;
  var providerData = user.providerData;

  if (user) {
    const myprofile = db2.collection('users').doc(uid);
    myprofile.onSnapshot(doc => {
      const data = doc.data();
      // *Important*: data.XXX: XXX is the data field from the database users document
      document.getElementsByTagName("h4")[0].innerHTML= data.username;
      //console.log("photoUrl: " + data.photoUrl);
      // TODO: load profile image
      document.getElementById("profileImgId").src = data.photoUrl;
      // load username firstname lastname and email
      document.getElementById('profile_username').value = data.username;
      document.getElementById('profile_fname').value = data.firstname;
      document.getElementById('profile_lname').value = data.lastname;
      document.getElementById('profile_email').value = data.email;

      // load all its posts: title and image for the profile page
      //console.log("size of allPostsIDs = " + data.allPostsIDs.length);
      var allPosts = data.allPostsIDs; // get the user's all post ids
      var theWholeDiv = [];
      var len = allPosts.length;

      var index = 0;
      allPosts.forEach(pid => {
        const mypost = db2.collection('posts').doc(pid);
        mypost.onSnapshot(doc => {
          const postdata = doc.data();
          //var viewMoreBtnId = postdata.title; // maybe not necessary
          var post_div = createOnePost(postdata.title, postdata.foodUrl, index); // create a post
          index++;
          viewMoreButton = post_div.getElementsByTagName("button")[0]; // get the button from the div

          document.getElementById('mypostslists').appendChild(post_div);
          //console.log("viewMoreButton.id " + viewMoreButton.id);
          viewMoreButton.addEventListener('click', function(){handleViewMore(pid)}, false);

        });
      })
    });
  }

});

function UpdatePhotoUrl(files){
  var user = firebase.auth().currentUser;
  const current_user_profile = db2.collection('users').doc(user.uid);

  current_user_profile.get().then(function(doc) {
    if (doc.exists) {
      updateProfileImage(files, user.uid);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }).catch(function(error) {
    console.log("Error getting document:", error);
  });

}

function updateProfileImage(files, username){

  var user_pro_img = username + ".jpg";
  // WARNING: make sure fire storage does not have a such a name already existed. But usually it barely happens
  // considering the small amout of users.
  const logoRef = storageRef.child('profileImages/' + user_pro_img);

  // upload file from local folder
  const file = files.item(0);
  const task = logoRef.put(file);

  task.then(snapshot => {
    console.log(snapshot); // shows success upload cred
    // Get the download URL
    logoRef.getDownloadURL().then(function(url) {

      // *update user profile image starts*
      // first download the url first
      var user = firebase.auth().currentUser;
      // update the current user photoUrl
      var updatePhotoUrl = db2.collection("users").doc(user.uid);
      // Set the "PhotoUrl" field of the the document user.uid
      return updatePhotoUrl.update({
        photoUrl: url
      })
      .then(function() {
        console.log("photoUrl successfully updated!");
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating photoUrl: ", error);
      });
      // *update user profile image ends*

    }).catch(function(error) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
        alert("File does not exist in firebase storage");
        break;

        case 'storage/unauthorized':
        albert("User doesn't have permission to access the object")
        break;

        case 'storage/canceled':
        // User canceled the upload
        break;

        case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        break;
      }
    });
  })
}

// update the changed name in the database and UI
function updateProfileInfo(){
  console.log("set save back to edit profile");
  document.getElementById("editprofile").innerText = "Edit profile";
  document.getElementById("profile_username").style.backgroundColor = "transparent";
  document.getElementById('profile_username').setAttribute('readonly', true);
  document.getElementById("profile_fname").style.backgroundColor = "transparent";
  document.getElementById('profile_fname').setAttribute('readonly', true);
  document.getElementById("profile_lname").style.backgroundColor = "transparent";
  document.getElementById('profile_lname').setAttribute('readonly', true);

  //TODO: update the changed new name in the database
  console.log('updating new names...');
  var newusername = document.getElementById("profile_username").value;
  var newfirstname = document.getElementById("profile_fname").value;
  var newlastname = document.getElementById("profile_lname").value;
  console.log(newusername + " " + newfirstname + " " + newlastname);

  // *update user profile names starts*
  // first download the url first
  var user = firebase.auth().currentUser;
  // update the current user photoUrl
  var updateNames = db2.collection("users").doc(user.uid);
  // Set the "PhotoUrl" field of the the document user.uid
  return updateNames.update({
    username: newusername,
    firstname: newfirstname,
    lastname: newlastname
  })
  .then(function() {
    console.log("names successfully updated!");
  })
  .catch(function(error) {
    // The document probably doesn't exist.
    console.error("Error updating names: ", error);
  });
  // *update user profile names ends*

}

function handleEditProfile(){
  console.log("editprofile clicked");

  // document.getElementById('cancelEdit').style.visibility = 'visible';
  // another way to toggle show/hidden
  var x = document.getElementById("cancelEdit");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";

  }
  if(document.getElementById("editprofile").innerText === "Save"){
    //document.getElementById("editprofile").innerText = "Edit profile";
    updateProfileInfo();

  }else{
    document.getElementById("editprofile").innerText= "Save";
    document.getElementById("profile_username").style.backgroundColor = "white";
    document.getElementById('profile_username').removeAttribute('readonly');
    document.getElementById("profile_fname").style.backgroundColor = "white";
    document.getElementById('profile_fname').removeAttribute('readonly');
    document.getElementById("profile_lname").style.backgroundColor = "white";
    document.getElementById('profile_lname').removeAttribute('readonly');
  }

}

function handleCancelEdit(){
  console.log("Cancel clicked");

  var x = document.getElementById("cancelEdit");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  //TODO: make sure the original name is loaded
  // first load names stuff
  var user = firebase.auth().currentUser;
  if (user) {
    const mypost = db2.collection('users').doc(user.uid);
    mypost.onSnapshot(doc => {
      //console.log("user id = " + user.uid);
      const data = doc.data();
      // load username firstname lastname and email
      document.getElementById('profile_username').value = data.username;
      document.getElementById('profile_fname').value = data.firstname;
      document.getElementById('profile_lname').value = data.lastname;
    });
  }
  // document.getElementById('cancelEdit').style.visibility = 'hidden';
  document.getElementById("editprofile").innerText= "Edit profile";
  document.getElementById("profile_username").style.backgroundColor = "transparent";
  document.getElementById('profile_username').setAttribute('readonly', true);
  document.getElementById("profile_fname").style.backgroundColor = "transparent";
  document.getElementById('profile_fname').setAttribute('readonly', true);
  document.getElementById("profile_lname").style.backgroundColor = "transparent";
  document.getElementById('profile_lname').setAttribute('readonly', true);
}

var ingNum=1;
var directionNum=1;
//adding tags ingredients and directions strts here<---------------------------
var tagNum = 1;
function handleAddTags(){
  var inputDiv = document.createElement('div');
  inputDiv.id = "inputdivID" + tagNum;
  var allDeleteBtns = [];

  var brtag = document.createElement('br');
  var diTag = document.getElementById('taginput');
  inputDiv.appendChild(brtag);
  var input = document.createElement('input');
  var brtag2 = document.createElement('br');
  input.style.background = 'white';
  input.style.width = '80%';
  input.placeholder= "New Tag";
  inputDiv.appendChild(input);
  inputDiv.innerHTML += '<button id="remove'+tagNum+'" class="btn"><i class="fas fa-trash"></i>&nbsp;</button>';
  inputDiv.appendChild(brtag2);
  input.id = "ingredientNum" + tagNum;
  tagNum++;

  diTag.appendChild(inputDiv);
  deleteBtn = inputDiv.getElementsByTagName("button")[0];
  allDeleteBtns.push(deleteBtn);
  //console.log(allDeleteBtns);
  // diTag.innerHTML += '<button id="remove" class="btn btn-info rounded-pill shadow" data-toggle="modal" data-target="#"><i class="fas fa-trash"></i>&nbsp;</button>';
  allDeleteBtns.forEach(function(eachdeletebtn){
    eachdeletebtn.addEventListener('click', function(){console.log(eachdeletebtn.id + "clicked");this.parentNode.remove();}, false);

  });
}

var titleNum = 1;
function handleAddTitle(){
  if(titleNum < 2){
    var inputDiv = document.createElement('div');
    inputDiv.id = "inputdivID" + titleNum;
    var allDeleteBtns = [];

    var brtag = document.createElement('br');
    var diTag = document.getElementById('titleinput');
    inputDiv.appendChild(brtag);
    var input = document.createElement('input');
    var brtag2 = document.createElement('br');
    input.style.background = 'white';
    input.style.width = '80%';
    input.placeholder= "New Title";
    input.id = 'foodtitle';
    inputDiv.appendChild(input);
    inputDiv.innerHTML += '<button id="remove'+titleNum+'" class="btn"><i class="fas fa-trash"></i>&nbsp;</button>';
    inputDiv.appendChild(brtag2);
    input.id = "ingredientNum" + titleNum;
    titleNum++;

    diTag.appendChild(inputDiv);
    deleteBtn = inputDiv.getElementsByTagName("button")[0];
    allDeleteBtns.push(deleteBtn);
    //console.log(allDeleteBtns);
    // diTag.innerHTML += '<button id="remove" class="btn btn-info rounded-pill shadow" data-toggle="modal" data-target="#"><i class="fas fa-trash"></i>&nbsp;</button>';
    allDeleteBtns.forEach(function(eachdeletebtn){
      eachdeletebtn.addEventListener('click', function(){console.log(eachdeletebtn.id + "clicked");this.parentNode.remove(); titleNum--;}, false);

    });
  }
}

var ingredientNum = 1;
function handleAddIngredients(){
  var inputDiv = document.createElement('div');
  inputDiv.id = "ing_inputdivID" + ingredientNum;
  var allDeleteBtns = [];

  var brtag = document.createElement('br');
  var diTag = document.getElementById('ingredientinput');
  inputDiv.appendChild(brtag);
  var input = document.createElement('input');
  var brtag2 = document.createElement('br');
  input.style.background = 'white';
  input.style.width = '80%';
  input.placeholder= "New Ingredient";
  inputDiv.appendChild(input);
  inputDiv.innerHTML += '<button id="remove'+ingredientNum+'" class="btn"><i class="fas fa-trash"></i>&nbsp;</button>';
  inputDiv.appendChild(brtag2);
  input.id = "ingredientNum" + ingredientNum;
  ingredientNum++;

  diTag.appendChild(inputDiv);
  deleteBtn = inputDiv.getElementsByTagName("button")[0];
  allDeleteBtns.push(deleteBtn);
  //console.log(allDeleteBtns);
  // diTag.innerHTML += '<button id="remove" class="btn btn-info rounded-pill shadow" data-toggle="modal" data-target="#"><i class="fas fa-trash"></i>&nbsp;</button>';
  allDeleteBtns.forEach(function(eachdeletebtn){
    eachdeletebtn.addEventListener('click', function(){console.log(eachdeletebtn.id + "clicked");this.parentNode.remove();}, false);
  });
}

var directionNum = 1;
function handleAddDirections(){
  var inputDiv = document.createElement('div');
  var allDeleteBtns = [];
  inputDiv.id = "inputdivID" + directionNum;

  var brtag = document.createElement('br');
  var diTag = document.getElementById('directioninput');
  inputDiv.appendChild(brtag);
  var input = document.createElement('textarea');
  var brtag2 = document.createElement('br');
  input.style.background = 'white';
  input.style.border = 'none';
  input.style.width = '80%';
  input.placeholder= "Next Step";
  inputDiv.appendChild(input);
  inputDiv.innerHTML += '<button id="remove'+directionNum+'" class="btn"><i class="fas fa-trash"></i>&nbsp;</button>';
  inputDiv.appendChild(brtag2);
  input.id = "directionNum" + directionNum;
  directionNum++;

  diTag.appendChild(inputDiv);
  deleteBtn = inputDiv.getElementsByTagName("button")[0];
  allDeleteBtns.push(deleteBtn);
  //console.log(allDeleteBtns);
  // diTag.innerHTML += '<button id="remove" class="btn btn-info rounded-pill shadow" data-toggle="modal" data-target="#"><i class="fas fa-trash"></i>&nbsp;</button>';
  allDeleteBtns.forEach(function(eachdeletebtn){
    eachdeletebtn.addEventListener('click', function(){console.log(eachdeletebtn.id + "clicked");this.parentNode.remove();}, false);

  });
}

var descriptionNum = 1;
function handleAddDescription(){
  if(descriptionNum < 2)
  var inputDiv = document.createElement('div');
  var allDeleteBtns = [];
  inputDiv.id = "inputdivID" + directionNum;

  var brtag = document.createElement('br');
  var diTag = document.getElementById('descriptioninput');
  inputDiv.appendChild(brtag);
  var input = document.createElement('textarea');
  var brtag2 = document.createElement('br');
  input.style.background = 'white';
  input.style.border = "none";
  input.style.width = '80%';
  input.placeholder= "Add a short description";
  input.id = 'fooddescription';
  inputDiv.appendChild(input);
  inputDiv.innerHTML += '<button id="remove'+descriptionNum+'" class="btn"><i class="fas fa-trash"></i>&nbsp;</button>';
  inputDiv.appendChild(brtag2);
  input.id = "directionNum" + descriptionNum;
  descriptionNum++;

  diTag.appendChild(inputDiv);
  deleteBtn = inputDiv.getElementsByTagName("button")[0];
  allDeleteBtns.push(deleteBtn);
  //console.log(allDeleteBtns);
  // diTag.innerHTML += '<button id="remove" class="btn btn-info rounded-pill shadow" data-toggle="modal" data-target="#"><i class="fas fa-trash"></i>&nbsp;</button>';
  allDeleteBtns.forEach(function(eachdeletebtn){
    eachdeletebtn.addEventListener('click', function(){console.log(eachdeletebtn.id + "clicked");this.parentNode.remove(); descriptionNum--;}, false);

  });
}


// file uplaod js starts here <--------------------------

//Upload button handler
function handleFileUploadbutton(){
  console.log("handleFileUploadbutton clikced");
  handleFileUpload(files,obj); // upload file first and it will set the global var fileName
}

//---------------------upload new post starts---------------------
function uploadHelper(downloadURL){
  var ingredientDivArray = document.getElementById('ingredientinput'); // get txt area
  var inglen = ingredientDivArray.getElementsByTagName('div').length;

  // get each ingredient
  ingContents = [];
  for(i = 0; i < inglen; i++){
    var ingcontent = ingredientDivArray.getElementsByTagName('input')[i].value;
    ingContents.push(ingcontent);
  }

  var directionDivArray = document.getElementById('directioninput'); // get txt area
  var dirlen = directionDivArray.getElementsByTagName('div').length;

  // get each ingredient
  dirContents = [];
  for(i = 0; i < dirlen; i++){
    var dircontent = directionDivArray.getElementsByTagName('textarea')[i].value;
    dirContents.push(dircontent);

  }

  var title = 'No title...';
  titleElement = document.getElementById('foodtitle');
  if(titleElement != null){
    title = titleElement.value;
  }

  var description = 'No description';
  descriptionElement = document.getElementById('fooddescription');
  if(descriptionElement != null){
    description = descriptionElement.value;
  }

  var tags = []

  var count = 0;
    db2.collection("posts").add({
              description: description,
              direction: dirContents,
              foodUrl: downloadURL,
              fromUser: firebase.auth().currentUser.uid,
              ingredient: ingContents,
              tags: tags,
              title: title
          })
          .then(function(docRef) {
              console.log("Document written with ID: ", docRef.id);
              var addNewPost2CurrentUser = db2.collection("users").doc(firebase.auth().currentUser.uid);
              addNewPost2CurrentUser.onSnapshot(doc => {
                 var allpostids = doc.data().allPostsIDs;
                 count++;
                 // the reason we do a count is that for some reason this nested promise call
                 // is getting called mutiple times. So in order to avoid duplicate post created
                 // we make a count so that the post gets created only once each time we click upload
                 if(count <= 1){

                   console.log("!!!Adding post into the current user's allPostsIds!!!");
                   allpostids.push(docRef.id);
                   return addNewPost2CurrentUser.update({
                                         allPostsIDs: allpostids
                                     })
                                     .then(function() {
                                         console.log("allPostsIDs successfully updated!");

                                     })
                                     .catch(function(error) {
                                         // The document probably doesn't exist.
                                         console.error("Error updating allPostsIDs: ", error);
                                     });

                 }

              })
              if(count <= 1){
                 alert("SUCCESS!!!");
                window.location.href = "profile.html";
              }
          })
          .catch(function(error) {
              console.error("Error adding document: ", error);
          });

}
//---------------------upload new post ends---------------------

//drag and drop handler-------------------------
var obj = $("#drop-zone");
var files;
obj.on('dragenter', function (e) {
  e.stopPropagation();
  e.preventDefault();
  $(this).css('border', '2px solid #0B85A1');
});
obj.on('dragover', function (e) {
  e.stopPropagation();
  e.preventDefault();
});
obj.on('drop', function (e) {
  $(this).css('border', '2px dotted #0B85A1');
  e.preventDefault();
  files = e.originalEvent.dataTransfer.files;

  //We need to send dropped files to firebase
  //handleFileUpload(files,obj);
  document.getElementById('notification').innerHTML = "File is ready for Upload!!";
});

//choose file handler--------------------------
// automatically submit the form on file select
$('#drop-zone-file').on('change', function (e) {
  files = $('#drop-zone-file')[0].files;
  //handleFileUpload(files, obj);
  document.getElementById('notification').innerHTML = "File is ready for Upload!!";
});

//provent files from being opened in the browser
$(document).on('dragenter', function (e)
{
  e.stopPropagation();
  e.preventDefault();
});
$(document).on('dragover', function (e)
{
  e.stopPropagation();
  e.preventDefault();
  obj.css('border', '2px dotted #0B85A1');
});
$(document).on('drop', function (e)
{
  e.stopPropagation();
  e.preventDefault();
});

//file uplaoder handler
function handleFileUpload(files, obj) {
    for (var i = 0; i < files.length; i++) {
        var fd = new FormData();
        fd.append('file', files[i]);

        console.log(files[i]);
        fileName = files[i].name;

        fireBaseImageUpload({
            'file': files[i],
            'path': '/images' //path_to_where_you_to_store_the_file
        }, function (data) {
            //console.log(data);
            if (!data.error) {
                if (data.progress) {
                    // progress update to view here
                }
                if (data.downloadURL) {
                    // update done
                    // download URL here "data.downloadURL"
                    //  console.log("downloadURL " + downloadURL);
                    //localStorage.setItem('currentPhotoUrl', data.downloadURL);
                }
            } else {
                console.log(data.error + ' Firebase image upload error');
            }
        });
    }
};

//firebase upload with call back
function fireBaseImageUpload(parameters, callBackData) {

  // expected parameters to start storage upload
  var file = parameters.file;
  var path = parameters.path;
  var name;

  //just some error check
  if (!file) { callBackData({error: 'file required to interact with Firebase storage'}); }
  if (!path) { callBackData({error: 'Node name required to interact with Firebase storage'}); }

  var metaData = {'contentType': file.type};
  var arr = file.name.split('.');
  var fileSize = formatBytes(file.size); // get clean file size (function below)
  var fileType = file.type;
  var n = file.name;

  // generate random string to identify each upload instance
  name = generateRandomString(12); //(location function below)

  //var fullPath = path + '/' + name + '.' + arr.slice(-1)[0];
  var fullPath = path + '/' + file.name;

  var uploadFile = storageRef.child(fullPath).put(file, metaData);

  // first instance identifier
  callBackData({id: name, fileSize: fileSize, fileType: fileType, fileName: n});

  uploadFile.on('state_changed', function (snapshot) {
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    progress = Math.floor(progress);
    callBackData({
      progress: progress,
      element: name,
      fileSize: fileSize,
      fileType: fileType,
      fileName: n});
    }, function (error) {
      callBackData({error: error});
    }, function () {

      uploadFile.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            uploadHelper(downloadURL); // call helper to uplaod the post
            callBackData({
              downloadURL: downloadURL,
              element: name,
              fileSize: fileSize,
              fileType: fileType,
              fileName: n});
            });
        });


    }

    // function to generate random string to use in what creating firebase storage instance
    function generateRandomString(length) {
      var chars = "abcdefghijklmnopqrstuvwxyz";
      var pass = "";
      for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
      }
      return pass;
    }

    function formatBytes(bytes, decimals) {
      if (bytes == 0) return '0 Byte';
      var k = 1000;
      var dm = decimals + 1 || 3;
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      var i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }


function downloadFoodUrl(fileName){
  console.log("in downloadFoodUrl....");
  // Create a reference to the file we want to download
  var starsRef = storageRef.child('images/'+fileName);
  // Get the download URL
  starsRef.getDownloadURL().then(function(url) {
    // Insert url into an <img> tag to "download"

  }).catch(function(error) {
    alert("Error happened when getting file url")
});

return getUrl;

}

// Below is to show the post in the middle
function createOnePost(Title, foodUrl, index){
  var post_div = document.createElement("div");

  var postLabel = document.createElement("label");
  var postLabeltext = document.createTextNode(Title);
  postLabel.appendChild(postLabeltext);

  var viewMoreBtn = document.createElement("button");
  //  var id = viewMoreBtn.id = "viewMoreBtnID";
  var viewMoreBtnText = document.createTextNode("View detail...");
  viewMoreBtn.style.backgroundColor = "transparent";
  viewMoreBtn.style.border = "none";
  //viewMoreBtn.value = "view" + index;
  viewMoreBtn.id = "view" + index;
  viewMoreBtn.appendChild(viewMoreBtnText);
  //viewMoreBtn.attachEvent('OnClick', handleAddPosts());
  //viewMoreBtn.onclick = handleAddPosts(); // this will create infinnite loop

  var elem = document.createElement("img");
  elem.src = foodUrl;
  //elem.src = "../food.png";
  elem.width = "500"
  elem.height = "280"
  elem.style.borderRadius = "5%";
  elem.style.border = "3px solid white"

  var brtag = document.createElement("br");
  var hrtag = document.createElement("hr");

  post_div.appendChild(postLabel);
  post_div.appendChild(viewMoreBtn);
  post_div.appendChild(brtag);
  post_div.appendChild(elem);
  post_div.appendChild(brtag);
  post_div.appendChild(hrtag);

  return post_div;
}

// load to recipe web page
function handleViewMore(postid){
  console.log("handleViewMore clicked");
  localStorage.setItem('currentPid', postid); // use localStorage to send postid to recipe.js
  window.location.href = "../recipe/recipeDisplay.html";
}
