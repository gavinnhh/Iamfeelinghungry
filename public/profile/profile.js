//below two are necessay for communicating with firebase cloud database and storage
const db = firebase.firestore();
const storageRef = firebase.storage().ref(); // global const

document.getElementById('home').addEventListener('click', handleHome, false);
document.getElementById('signout').addEventListener('click', handleSignout, false);

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

// initiall load profile image, name and stuff
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
    const mypost = db.collection('users').doc(uid);
    mypost.onSnapshot(doc => {
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
    });
  }

});

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

function UpdatePhotoUrl(files){
  var user = firebase.auth().currentUser;
  const current_user_profile = db.collection('users').doc(user.uid);

  current_user_profile.get().then(function(doc) {
    if (doc.exists) {
        updateProfileImage(files, doc.data().username);
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
        var updatePhotoUrl = db.collection("users").doc(user.uid);
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
  var updateNames = db.collection("users").doc(user.uid);
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
    const mypost = db.collection('users').doc(user.uid);
    mypost.onSnapshot(doc => {
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

// document.getElementById('cancelEdit').style.visibility = 'hidden';
document.getElementById('editprofile').addEventListener('click', handleEditProfile, false);
document.getElementById('cancelEdit').addEventListener('click', handleCancelEdit, false);
