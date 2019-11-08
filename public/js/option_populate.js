// retrive data from firebase database
const database = firebase.firestore();
const menuDoc = database.collection('dropdown menu').doc("food_tags");
menuDoc.get().then(function(doc) {
  var arr = doc.data().tags;
  createOption(arr);
});

// populate items in dropdown menu
function createOption(arr) {
  var dddiv = document.getElementById('dropdown-menu');
  var select = document.createElement('select');
  select.id = "select";
  select.multiple = true;
  select.setAttribute("class", "dropdown-content");
  dddiv.appendChild(select);
  for(var i = 0; i < arr.length; i++) {
    var opt = arr[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
  }
  tail.select('#select', {
    search: true,
    descriptions: true,
    multilimit: 15,
    hideSelected: true,
    hideDisabled: true,
    multiShowCount: false,
    multiContainer: '.move-container'
  });
}
