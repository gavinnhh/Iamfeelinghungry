// retrive data from firebase database
const database = firebase.firestore();
const menuDoc = database.collection('dropdown menu').doc("food_tags");
menuDoc.get().then(function(doc) {
  var options = doc.data().tags
  localStorage.setItem('opts', JSON.stringify(options));
});

var arr = JSON.parse(localStorage.getItem("opts"));
createOption(arr)

// populate items in dropdown menu
function createOption(arr) {
  console.log("inside");
  console.log(arr.length);
  var select = document.getElementById("select");
  for(var i = 0; i < arr.length; i++) {
    var opt = arr[i];
    var el = document.createElement("option");

    var el_text = document.createTextNode(opt);
    el.appendChild(el_text);
    //el.textContent = opt;
    //el.value = opt;
    select.appendChild(el);
  }
}
