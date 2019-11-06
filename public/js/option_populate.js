// retrive data from firebase database
const database = firebase.firestore();
const menuDoc = database.collection('dropdown menu').doc("food_tags");
menuDoc.get().then(function(doc) {
  var options = doc.data().tags
  // console.log(options.length)
  createOption(options);
});

// var arr = ["Chinese", "American", "Vietnamese", "Mexican", "Japanese", "Korean"];
// createOption(arr);

// populate items in dropdown menu
function createOption(arr) {
  console.log("inside");
  console.log(arr.length);
  var select = document.getElementById("select");
  for(var i = 0; i < arr.length; i++) {
    var opt = arr[i];
    console.log("opt = " + opt);
    var el = document.createElement("option");
    var el_text = document.createTextNode(opt);
    el.appendChild(el_text);
    //el.textContent = opt;
    //el.value = opt;
    select.appendChild(el);
  }
}
