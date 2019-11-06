// // retrive data from firebase database
// const database = firebase.firestore();
// const menuDoc = database.collection('dropdown menu').doc("food_tags");
// menuDoc.get().then(function(doc) {
//   var options = doc.data().tags
//   createOption(options);
// });

var arr = ["Chinese", "American", "Vietnamese", "Mexican", "Japanese", "Korean"];
createOption(arr);

// populate items in dropdown menu
function createOption(arr) {
  var select = document.getElementById("select");
  for(var i = 0; i < arr.length; i++) {
    var opt = arr[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
  }
}
