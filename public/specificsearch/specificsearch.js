document.getElementById('home').addEventListener('click', handlelHome, false);

function handlelHome(){
  console.log('home clicked from specific search');
  window.location.href = "../index.html";
}

var tagsContainer = document.getElementById('tags-container');
for (var i = 0; i < localStorage.length; i++) {
  var tag = localStorage.getItem(i);
  var la = document.createElement("label");
  la.setAttribute("class", "tag");
  la.textContent = tag;
  tagsContainer.appendChild(la);
}
