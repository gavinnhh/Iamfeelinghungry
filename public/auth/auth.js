/**
* auth.js handles user every auth thing. Sign In, Sign Up, Sign out
*/
// var fname = $('input[id="firstname"]').val();
//var submitBtn = document.querySelector('input[type="button"]');
// document.getElementById('signupbtn').addEventListener('click', toggleSignUp, false);
const db = firebase.firestore();
function handleSignIn(){
  console.log('sign in/out button clicked');
  var email = document.getElementById('name/email').value;
  var password = document.getElementById('signin-password').value;

  // Sign in with email and pass.
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    console.log(error);
    alert(error);
  });


  // Make sign in pop up window go away
  $('#signInModal').modal('hide');
  return false;
}

function handleSignUp(){
  console.log('sign up clicked');
  var fname = document.getElementById('firstname').value;
  var lname = document.getElementById('lastname').value;
  var username = document.getElementById('username').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var passalert = document.getElementById('pass-alert-message');
  var useralert = document.getElementById('user-alert-message');
  var allPostsIDsArray = [];
  if(!(profanityRegex.test(username))){
    useralert.classList.add("hide")
    if(zxcvbn(password).score >= 3){
      passalert.classList.add("hide")
      console.log('username = ' + username);
      // another way to create user: https://firebase.google.com/docs/auth/admin/manage-users
      firebase.auth().createUserWithEmailAndPassword(email, password).then(cred => {
        console.log(cred);

        // Add a new document in collection "users", meaning add a new user
        db.collection("users").doc(cred.user.uid).set({
            allPostsIDs:allPostsIDsArray,
            firstname: fname,
            lastname: lname,
            username: username,
            email: email,
            photoUrl: "../load_user.gif"
        })
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });

        // Make sign up pop up window go away
        $('#signUpModal').modal('hide');
        return false;
      });

    }else{
      passalert.classList.remove("hide")
    }
  }else{
    useralert.classList.remove("hide")
  }
}

function signout(){
  console.log('home sign in(signout) clicked');
  // var getValue = $(this).attr("data-target");
  // console.log(getValue);
  // user signed, Sign Out is showing on home page
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  }
}

function profile(){
  console.log('home sign up(profile) clicked');
  // TODO: create a user profile. This should direct to a new page
  //window.location.href = "../profile/profile.html";

}

function handleNoAccountSignup(){
  // This is to hide the sign in window when clicking sign up in this sign in window
  $('#signInModal').modal('hide');
  return false;
}

function handleForgotpw(){
  $('#signInModal').modal('hide');
  return false;
}

// handleResetpwbtn will send an email to the spicified email
function handleResetpwbtn(){
  var email = document.getElementById('sendemail').value;
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    alert('Password Reset Email Sent!');
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
  });
  // after send, hide the reset modal
  $('#resetpwModal').modal('hide');
  return false;
}

function handleGoogleSigninbtn(){
    console.log('Sign in with google clicked!');
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // auth2 is initialized with gapi.auth2.init() and a user is signed in.
        var displayName = user.displayName;
        var fullnames = displayName.split(" ");
        var username = fullnames[0];
        var firstname = fullnames[0];
        var lastname = fullnames[1];
        var email = user.email;
        var imgUrl = user.photoURL;
        var allPostsIDsArray = [];
        // add a new user into database
        db.collection("users").doc(user.uid).set({
            allPostsIDs:allPostsIDsArray,
            username: username,
            firstname: firstname,
            lastname:lastname,
            email: email,
            photoUrl: imgUrl
        })
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });

    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });

    // Make sign in pop up window go away
    $('#signInModal').modal('hide');
    return false;

}

function handleSetting(){
  console.log('handleSetting is clicked');
  window.location.href = "../profile/profile.html";
}

// function handleHome()
// {
//   console.log('Home is clicked');
//   window.location.href = "index.html";
// }
function initApp() {
  // Listening for auth state changes.
  // [START authstatelistener]
  // onAuthStateChanged is like a while loop constantly checking the user status
  firebase.auth().onAuthStateChanged(function(user) {
    // user is a firebase built-in variable, firebase knows user
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;

      console.log('user logged in with email = ' + email);

      const mypost = db.collection('users').doc(uid);
      mypost.onSnapshot(doc => {
              const data = doc.data();
              var greeting = 'Hi, ' + data.username;
              document.getElementById('home-signup').textContent = greeting;
              document.getElementById('home-signin').textContent = 'Sign out';
              // document.getElementById('setting').textContent = 'my profile';
              document.getElementById('setting').style.visibility = 'visible';
              // document.getElementById("display").innerHTML = data.major;
      })

      // [START_EXCLUDE]
      //console.log(document.getElementById('home-signin').textContent);
      // document.getElementById('home-signin').textContent = 'Sign Out';
      // document.getElementById('home-signup').textContent = email;

      // To avoid window pop up since already signed in
      $('#home-signin').attr('data-target','#disabled');
      $('#home-signup').attr('data-target','#disabled');
      // [END_EXCLUDE]
    } else {
      console.log('Currently no user signed in/up');
      document.getElementById('setting').style.visibility = 'hidden';
      // User is signed out. So return Sign In and Sign Up on home page
      document.getElementById('home-signin').textContent = 'Sign In';
      document.getElementById('home-signup').textContent = 'Sign Up';

      // To make window pop up again
      $('#home-signin').attr('data-target','#signInModal');
      $('#home-signup').attr('data-target','#signUpModal');

    }

  });
  // [END authstatelistener]
  document.getElementById('siginbtn').addEventListener('click', handleSignIn, false);
  document.getElementById('signupbtn').addEventListener('click', handleSignUp, false);
  document.getElementById('home-signin').addEventListener('click', signout, false);
  // document.getElementById('home-signup').addEventListener('click', profile, false);
  document.getElementById('noAccountSignup').addEventListener('click', handleNoAccountSignup, false);
  document.getElementById('forgotpw').addEventListener('click', handleForgotpw, false);
  document.getElementById('resetpwbtn').addEventListener('click', handleResetpwbtn, false);
  document.getElementById('siginbtnwithgoogle').addEventListener('click', handleGoogleSigninbtn, false);
  document.getElementById('setting').addEventListener('click', handleSetting, false);
  // document.getElementById('home').addEventListener('click', handleHome, false);
  // document.getElementById('password-reset').addEventListener('click', sendPasswordReset, false);
}

window.onload = function() {
  initApp();
};
