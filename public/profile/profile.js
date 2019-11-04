//below two are necessay for communicating with firebase cloud database and storage
const db2 = firebase.firestore();
const storageRef = firebase.storage().ref(); // global const
var listButtons = []; // undefined initially
document.getElementById('home').addEventListener('click', handleHome, false);
document.getElementById('signout_from_profile').addEventListener('click', handleSignout, false);
// document.getElementById('cancelEdit').style.visibility = 'hidden';
document.getElementById('editprofile').addEventListener('click', handleEditProfile, false);
document.getElementById('cancelEdit').addEventListener('click', handleCancelEdit, false);
//document.getElementById('addpost').addEventListener('click', handleAddPosts, false);
//document.getElementById('addpost').addEventListener('click', handleAddPosts, false);


// function loadProfile below means to upload a new profile photo
// also: new image selcted will be uploaded into firebase storage and
// new photo url will overwrite the current user's data field: photoUrl
// once load file is called, that means we want to update profile image
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
            console.log("photoUrl: " + data.photoUrl);
            // TODO: load profile image
            document.getElementById("profileImgId").src = data.photoUrl;
            // load username firstname lastname and email
            document.getElementById('profile_username').value = data.username;
            document.getElementById('profile_fname').value = data.firstname;
            document.getElementById('profile_lname').value = data.lastname;
            document.getElementById('profile_email').value = data.email;

            // load all its posts: title and image for the profile page
            //console.log("size of allPostsIDs = " + data.allPostsIDs.length);
            var allPosts = data.allPostsIDs;
            var len = allPosts.length;
            //console.log("index 0 " + allPosts[0]);

            for(i = 0; i < len; i++){
              var pid = allPosts[i];
              const mypost = db2.collection('posts').doc(pid);
              mypost.onSnapshot(doc => {
                      const postdata = doc.data();
                      //var viewMoreBtnId = postdata.title; // maybe not necessary
                      listButtons[i] = postdata.foodUrl;
                      var post_div = createOnePost(postdata.title, postdata.foodUrl); // create a post
                      document.getElementById('mypostslists').appendChild(post_div);
                      viewMoreButton = post_div.getElementsByTagName("button")[0]; // get the button from the div
                      viewMoreButton.addEventListener('click', handleViewMore, false);
              });
            }


    });
  }

});
console.log("listButton: " + listButtons);

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

// file uplaod js starts here <--------------------------

//drag and drop handler-------------------------
var obj = $("#drop-zone");
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
     var files = e.originalEvent.dataTransfer.files;

     //We need to send dropped files to firebase
     handleFileUpload(files,obj);
});

//choose file handler--------------------------
// automatically submit the form on file select
$('#drop-zone-file').on('change', function (e) {
    var files = $('#drop-zone-file')[0].files;
    handleFileUpload(files, obj);
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
        var downloadURL = uploadFile.snapshot.downloadURL;
        callBackData({
              downloadURL: downloadURL,
              element: name,
              fileSize: fileSize,
              fileType: fileType,
              fileName: n});
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

function handleAddPosts(){
  console.log("handleAddPosts clicked");
}

function createOnePost(Title, foodUrl){
  var post_div = document.createElement("div");
  console.log(post_div);

  var postLabel = document.createElement("label");
  var postLabeltext = document.createTextNode(Title);
  postLabel.appendChild(postLabeltext);

  var viewMoreBtn = document.createElement("button");
  //  var id = viewMoreBtn.id = "viewMoreBtnID";
  var viewMoreBtnText = document.createTextNode("View detail...");
  viewMoreBtn.style.backgroundColor = "transparent";
  viewMoreBtn.style.border = "none";
  viewMoreBtn.appendChild(viewMoreBtnText);
  //viewMoreBtn.attachEvent('OnClick', handleAddPosts());
  //viewMoreBtn.onclick = handleAddPosts(); // this will create infinnite loop

  var elem = document.createElement("img");
  elem.src = foodUrl;
  elem.width = "500"
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
function handleViewMore(){
  console.log("handleViewMore clicked");
  window.location.href = "../recipe/recipe.html";
  console.log(listButtons);
}

function handleAddPosts(){
  console.log("addpost clicked");
  var post_div = createOnePost(); // create a post
  document.getElementById('mypostslists').appendChild(post_div);


  // var singlePost = document.getElementById("mySinglePost").lastChild;
  // // Copy the <mySinglePost> element and its child nodes
  // var mySinglePost_clone = mySinglePost.cloneNode(true);
  // console.log("clone...");
  // document.getElementById("mypostslists").appendChild(mySinglePost_clone);
}
