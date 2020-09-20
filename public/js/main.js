let modal = document.getElementById("welcome");
let closeBtn = document.getElementById("modalClose");
let nextBtn = document.getElementById("modalNext");
let checkBox = document.getElementById("welcome-check");
let submitBtn = document.getElementById("submit");



//modal close: click on x button
closeBtn.onclick = function() {
    modal.style.display = "none";
}

//modal next: click on next button, return to homepage
nextBtn.onclick = function() {
  if(checkBox.checked){
    modal.style.display = "none";
  }
}

//modal close: click on anywhere outside the modal
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}

submitBtn.onclick = function(){
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const data = {username, password};
  const options = {
    method: 'POST',
    headers:{
     'Content-Type':'application/json'
    },
    body: JSON.stringify(data)
  }
  //fetch "/api/login" request
  fetch("/api/login", options)
  .then(response => 
    response.json().then(message => ({
        message: message,
        status: response.status
    })
  ).then(res => {
    //if both username and password are valid
    if(res.message.message == "create new user?"){
      //ask user to confirm registration
      if(confirm("confirm registration?")){
        //fetch "/api/users" request to create a new user
        fetch("/api/users", options)
        .then(response=>
          response.json().then(message=>({
            message: message,
            status: response.status
          }))
        ).then(res=> {
          //if registration is successful, popup welcome message
          if(res.message.message == "success"){
            modal.style.display = "block";
          }else{
            console.log(res.status, res.message);
            alert(res.message.error);
          }
        })
      }
    }
    else{
      if(!res.message.success){
        //if username or password is not valid
        alert(res.message.error);
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
      }
    }
  }));
}

