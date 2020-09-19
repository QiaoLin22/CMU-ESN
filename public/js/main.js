let modal = document.getElementById("welcome");
let closeBtn = document.getElementById("modalClose");
let submitBtn = document.getElementById("submit");



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

submitBtn.onclick = function(){
  const username = document.getElementById("username").value;
  const password =  document.getElementById("password").value;
  const data = {username, password};
  const options = {
    method: 'POST',
    headers:{
     'Content-Type':'application/json'
    },
    body: JSON.stringify(data)
  }
  fetch("/api/login", options)
  .then(response => 
    response.json().then(message => ({
        message: message,
        status: response.status
    })
  ).then(res => {
    console.log(res.status, res.message)
    if(res.message.message == "create new user?"){
      if(confirm("confirm registration?")){
        fetch("/api/users", options)
        .then(response=>
          response.json().then(message=>({
            message: message,
            status: response.status
          }))
        ).then(res=> {
          console.log(res.status, res.message);
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
      alert(res.message.error);
    }
  }));
}

