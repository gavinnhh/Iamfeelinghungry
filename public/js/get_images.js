// retrive data from firebase database
const dabase = firebase.firestore();
const posts = dabase.collection('posts');
var chosen_tags = [];
//var temp_chosen_tags = [];
for (var i = 0; i < localStorage.length; i++) {
  chosen_tags.push(localStorage[i]);
  //temp_chosen_tags.push(localStorage[i]);
}
var temp_chosen_tag;
var food_urls = [];
var img_divs = [document.getElementById("img-div1"),
document.getElementById("img-div4"),
document.getElementById("img-div2"),
document.getElementById("img-div5"),
document.getElementById("img-div3"),
document.getElementById("img-div6")];
var info_button = [document.getElementById("button1"),
document.getElementById("button4"),
document.getElementById("button2"),
document.getElementById("button5"),
document.getElementById("button3"),
document.getElementById("button6")];
var userImg = [document.getElementById("userImg1"),
document.getElementById("userImg4"),
document.getElementById("userImg2"),
document.getElementById("userImg5"),
document.getElementById("userImg3"),
document.getElementById("userImg6")];
var username = [document.getElementById("username1"),
document.getElementById("username4"),
document.getElementById("username2"),
document.getElementById("username5"),
document.getElementById("username3"),
document.getElementById("username6")];
var title = [];
var user = [];
var postid = [];

posts.get().then(snapshot => {
  snapshot.forEach(doc => {
    if (food_urls.length != 6) {
      var arr = doc.data().tags;
      loop:
      for (var i = 0; i < chosen_tags.length; i++) {
        for (var j = 0; j < arr.length; j++) {
          if (chosen_tags[i] == arr[j]) {
            food_urls.push(doc.data().foodUrl);
            title.push(doc.data().title);
            user.push(doc.data().fromUser);
            temp_chosen_tag = chosen_tags[i];
            chosen_tags.splice(i ,1);
            chosen_tags.push(temp_chosen_tag);
            break loop;
          }
        }
      }
    }
    else {
      return true;
    }
  });
  for (var i = 0; i < food_urls.length; i++) {
    loadImg(img_divs[i], i);
    loadImgInfo(info_button[i], userImg[i], username[i], i);
  }
});

// posts.get().then(snapshot => {
//   snapshot.forEach(doc => {
//     if (food_urls.length != 6) {
//       if (chosen_tags.length == 0) {
//         console.log("push");
//         for (var i = 0; i < temp_chosen_tags.length; i++) {
//           chosen_tags.push(temp_chosen_tags[i]);
//         }
//       }
//       var arr = doc.data().tags;
//       loop:
//       for (var i = 0; i < chosen_tags.length; i++) {
//         for (var j = 0; j < arr.length; j++) {
//           if (chosen_tags[i] == arr[j]) {
//             food_urls.push(doc.data().foodUrl);
//             chosen_tags.splice(i ,1);
//             break loop;
//           }
//         }
//       }
//     }
//     else {
//       return true;
//     }
//     console.log(chosen_tags);
//   });
//   for (var i = 0; i < food_urls.length; i++) {
//     loadImg(img_divs[i], i);
//   }
// });

function loadImg(div, index) {
  var imgDiv = div;
  var img = document.createElement('img');
  img.src = food_urls[index];
  img.setAttribute("style", "width: 100%");
  img.setAttribute("id", "foodImg");
  imgDiv.prepend(img);
}

function loadImgInfo(button, user_img, user_name, index) {
  button.innerText = title[index];
  const userDoc = dabase.collection('users').doc(user[index]);
  userDoc.get().then(function(doc) {
    user_img.src = doc.data().photoUrl;
    user_name.innerText = doc.data().username;
    button.addEventListener('click', function(){handleViewMore(doc.data().allPostsIDs)}, false);
  });
}

function handleViewMore(postid){
  console.log("current value: " + postid);
  console.log("handleViewMore clicked");
  localStorage.setItem('currentPid', postid); // use localStorage to send postid to recipe.js
  window.location.href = "../recipe/recipe.html";
}
