// alert("Hi, you are in the sign in page")
// var fname = $('input[id="firstname"]').val();

//var submitBtn = document.querySelector('input[type="button"]');
// document.getElementById('signupbtn').addEventListener('click', toggleSignUp, false);

function handleSignIn()
{
    console.log('sign in/out button clicked');
    // if already signed in, sign in button text has been changed to Sign Out, click that to sign out below here
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();

    } else { // if not signed in already, proceed to sign in
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          console.log('signed in!!!');

        // document.getElementById('home-signin').textContent = 'Sign out';
        // document.getElementById('home-signup').textContent = email;
      });


      // [END authwithemail]
    }// end else
}

function handleSignUp()
{
  console.log('sign up clicked');
  var fname = document.getElementById('firstname').value;
  var lname = document.getElementById('lastname').value;
  var username = document.getElementById('username').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  console.log('fname = ' + fname);
  firebase.auth().createUserWithEmailAndPassword(email, password).then(cred => {
                console.log(cred);
              });

    // var signup = document.getElementById('signupbtn');
    // if(signup != null){
    //     console.log(signup.value);
    // }else{
    //   console.log('signup is null');
    // }

    // after sign up, disable this button on home page
    //document.getElementById('home-signup').disabled = false;
    window.location.reload();
}

function handleHomeSignIn()
{
  console.log('home sign in clicked');
    var getValue = $(this).attr("data-target");
    console.log(getValue);
    // use this code to stop window pop up
    // $('#home-signin').attr('data-target','#disabledModal');
    // var getValue2 = $(this).attr("data-target");

    // user signed, Sign Out is showing on home page
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        //$('#home-signin').attr('data-target','#disabledModal');

        // [END signout]
    }
    //else{
        // $('#home-signin').attr('data-target','#signInModal');
        // $('#home-signup').attr('data-target','#signUpModal');
        // document.getElementById('home-signin').textContent = 'Sign In';
        // document.getElementById('home-signup').textContent = 'Sign Up';
    //}

}

function handleHomeSignUp()
{
  console.log('home sign up clicked');
  // if (firebase.auth().currentUser) {
  //     // TODO: Here we could have another Modal to pop up user profile window
  //     $('#home-signup').attr('data-target','#disabledModal');
  // }
}


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
          // [START_EXCLUDE]
          //console.log(document.getElementById('home-signin').textContent);
          document.getElementById('home-signin').textContent = 'Sign out';
          document.getElementById('home-signup').textContent = email;

          // To avoid window pop up since already signed in
          $('#home-signin').attr('data-target','#disabled');
          $('#home-signup').attr('data-target','#disabled');
          // [END_EXCLUDE]
        } else {
          console.log('Currently no user signed in/up');
          // User is signed out. So return Sign In and Sign Up on home page
          document.getElementById('home-signin').textContent = 'Sign In';
          document.getElementById('home-signup').textContent = 'Sign Up';

          // To make window pop up again
          $('#home-signin').attr('data-target','#signInModal');
          $('#home-signup').attr('data-target','#signUpModal');

        }
        // [START_EXCLUDE silent]
        //document.getElementById('home-signin').disabled = false;
        // [END_EXCLUDE]
      });
      // [END authstatelistener]
      document.getElementById('siginbtn').addEventListener('click', handleSignIn, false);
      document.getElementById('signupbtn').addEventListener('click', handleSignUp, false);
      document.getElementById('home-signin').addEventListener('click', handleHomeSignIn, false);
      document.getElementById('home-signup').addEventListener('click', handleHomeSignUp, false);
      // document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
      // document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
}

window.onload = function() {
  initApp();
};
