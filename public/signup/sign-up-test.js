// alert("Hi, you are in the sign in page")


document.getElementById('signupbtn').addEventListener('click', handleSignUp, false);

/**
* handleSignUp create a new user
*/

function handleSignUp()
{
    var email = document.getElementById('email').value;
    var password = document.getElementById('psw').value;
    var pws_repeat = document.getElementById('psw-repeat').value;

    // if(password !== pws_repeat){
    //   console.log("alert??");
    //   alert("Password entered not macth");
    //   return
    //
    // }else{
    if(password.length < 20){
      firebase.auth().createUserWithEmailAndPassword(email, password).then(cred => {
              console.log(cred);
      });
        // END creating account with email

        //Handle Account Status
      firebase.auth().onAuthStateChanged(user => {
      if(user) {
        window.location = 'sign-in-test.html'; //After successful login, user will be redirected to home.html
      }
    });
      }else{
        console.log("length > 20");
      }
}

/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
  // [START sendemailverification]
  firebase.auth().currentUser.sendEmailVerification().then(function() {
    // Email Verification sent!
    // [START_EXCLUDE]
    alert('Email Verification Sent!');
    // [END_EXCLUDE]

  });
  // [END sendemailverification]
}
