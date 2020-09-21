function clearInputBox(){
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

function checkUsernamePassword(username, password){
  if(username.length < 3){
    $("#alertModal").on("show.bs.modal", function() {
      $("#alertMessage").text("Username should be at least 3 characters long");
    })
    $("#alertModal").modal("toggle");
    return false;
  }
  if(password.length < 4){
    $("#alertModal").on("show.bs.modal", function() {
      $("#alertMessage").text("Passwords should be at least 4 characters long");
    })
    $("#alertModal").modal("toggle");
    return false;
  }
  return true;
}

$("#submitBtn").on("click", function(){
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if(!checkUsernamePassword(username, password)){
    clearInputBox();
    return;
  }

  const data = {username, password};
  const postOptions = {
    method: 'POST',
    headers:{
     'Content-Type':'application/json'
    },
    body: JSON.stringify(data)
  }
  //fetch "/api/login" request
  fetch("/api/login", postOptions)
  .then(response => 
    response.json().then(message => ({
        message: message,
        status: response.status
    })
  ).then(res => {
    //if both username and password are valid
    if(res.message.message == "create new user?"){
      //ask user to confirm registration
      $("#comfirmModal").modal("toggle");
      $("#comfirmModal").on("click", "#comfirmBtn", function() {
        //fetch "/api/users" request to create a new user
        fetch("/api/users", postOptions)
        .then(response=>
          response.json().then(message=>({
            message: message,
            status: response.status
          }))
        ).then(res=> {
          //if registration is successful, popup welcome message
          if(res.message.message == "success"){
            $("#exampleModal").modal("toggle");
            $("#exampleModal").on("shown.bs.modal", function() {
              $("#modalNextBtn").on("click", function(){
                if($("#defaultCheck1").is(":checked")){
                  $("#exampleModal").modal("hide");
                  clearInputBox();
                }
              })
            })
          }else{
            console.log(res.status, res.message);
            alert(res.message.error);
          }
        })
     });
    }
    else{
      if(!res.message.success){
        //if username or password is not valid
        $("#alertModal").on("show.bs.modal", function() {
          $("#alertMessage").text(res.message.error);
        })
        $("#alertModal").modal("toggle");
        clearInputBox();
      }
    }
  }));
})

