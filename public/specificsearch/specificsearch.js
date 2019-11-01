document.getElementById('home').addEventListener('click', handlelHome, false);

function handlelHome(){
  console.log('home clicked from specific search');
  window.location.href = "../index.html";
}
