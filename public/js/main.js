let modal = document.getElementById("welcome");
let closeBtn = document.getElementById("modalClose");

//modal close: click on x button
closeBtn.onclick = function() {
    modal.style.display = "none";
}

//modal close: click on anywhere outside the modal
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}
