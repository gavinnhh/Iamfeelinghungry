

// var fname = $('input[id="firstname"]').val();
//var submitBtn = document.querySelector('input[type="button"]');
// document.getElementById('signupbtn').addEventListener('click', toggleSignUp, false);

function handleSignIn()
{
    console.log('sign in/out button clicked');
    var email = document.getElementById('name/email').value;
    var password = document.getElementById('signin-password').value;

    // Sign in with email and pass.
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      console.log('signed in!!!');
    });

    // Make sign in pop up window go away
    $('#signInModal').modal('hide');
    return false;
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

    // Make sign up pop up window go away
    $('#signUpModal').modal('hide');
    return false;
}

function signout()
{
    console.log('home sign in(signout) clicked');
    // var getValue = $(this).attr("data-target");
    // console.log(getValue);
    // user signed, Sign Out is showing on home page
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    }
}

function profile()
{
  console.log('home sign up(profile) clicked');
  // TODO: create a user profile

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

      });
      // [END authstatelistener]
      document.getElementById('siginbtn').addEventListener('click', handleSignIn, false);
      document.getElementById('signupbtn').addEventListener('click', handleSignUp, false);
      document.getElementById('home-signin').addEventListener('click', signout, false);
      document.getElementById('home-signup').addEventListener('click', profile, false);
      // document.getElementById('verify-email').addEventListener('click', sendEmailVerification, false);
      // document.getElementById('password-reset').addEventListener('click', sendPasswordReset, false);
}

window.onload = function() {
  initApp();
};
