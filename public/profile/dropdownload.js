//load tags into drop down options
const db3 = firebase.firestore();
const menuDoc = db3.collection('dropdown menu').doc("food_tags");
menuDoc.get().then(function(doc) {
  var arr = doc.data().tags;
  fillDropDown(arr);
});
function fillDropDown(arr){
  var dropdown = document.getElementById("tagDropdown");
  var htmlOptions = "";
  for(var i = 0; i<arr.length; i++){
    var option = arr[i];
    htmlOptions +="<option>"+option+"</option>\n";
    //console.log("added tag :" + arr[i]);
  }
  //console.log(htmlOptions);
  dropdown.innerHTML = htmlOptions;
  $('.selectpicker').selectpicker('refresh');
}
