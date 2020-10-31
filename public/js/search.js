const chatContainer = $('.chat-container');
const chatMessages = $('.chat-messages');
const msgEle = $('#msg');
const urlParams = new URLSearchParams(window.location.search);
const searchContext = urlParams.get('context');

/* display searched message */
function outputMessage(message) {
  let icon = '';
  const { status } = message;
  //get status icon
  if (status === 'OK') {
    icon = '<i class="far fa-check-circle ml-1" style="color: #18b87e"></i>';
  } else if (status === 'Help') {
    icon = '<i class="fas fa-info-circle ml-1" style="color: #ffd500"></i>';
  } else if (status === 'Emergency') {
    icon = '<i class="fas fa-first-aid ml-1" style="color: #fb5252"></i>';
  } else if (status === undefined || status === 'Undefined') {
    icon = '<i class="far fa-question-circle ml-1" style="color: #d8d8d8"></i>';
  }

  const timestamp = new Date(message.timestamp).toLocaleString();
  const msg = document.createElement('div');
  msg.classList.add('message');
  msg.innerHTML = `<p class="meta mb-1"> ${message.username} <span>${icon}</span> <span class="ml-3"> ${timestamp} </span></p> <p class="text"> ${message.message} </p>`;
  chatMessages.append(msg);

  // scroll to the bottom
  chatContainer.scrollTop(chatContainer[0].scrollHeight);
}


/* display chat message */
function outputStatus(anotherUsername, statusArray) {
  statusArray.reverse().forEach((statusObj)=>{
    let icon = '';
    //get status icon
    if (statusObj.status === 'OK') {
      icon = '<i class="far fa-check-circle ml-1" style="color: #18b87e"></i>';
    } else if (statusObj.status === 'Help') {
      icon = '<i class="fas fa-info-circle ml-1" style="color: #ffd500"></i>';
    } else if (statusObj.status === 'Emergency') {
      icon = '<i class="fas fa-first-aid ml-1" style="color: #fb5252"></i>';
    } else if (statusObj.status === undefined || statusObj.status === 'Undefined') {
      icon = '<i class="far fa-question-circle ml-1" style="color: #d8d8d8"></i>';
    }
  
    const timestamp = new Date(statusObj.timestamp).toLocaleString();
    const msg = document.createElement('div');
    msg.classList.add('message');
    msg.innerHTML = `<p class="meta mb-1"> ${anotherUsername} <span>${icon}</span> <span class="ml-3"> ${timestamp} </span> </p>`;
    chatMessages.append(msg);
  
    // scroll to the bottom
    chatContainer.scrollTop(chatContainer[0].scrollHeight);
  }

  );
}

function outputUser(result) {
  let icon = '';
  console.log(result);
  const { status } = result.statusArray[result.statusArray.length - 1];
  if (status === 'OK') {
    icon = '<i class="far fa-check-circle ml-1" style="color: #18b87e"></i>';
  } else if (status === 'Help') {
    icon = '<i class="fas fa-info-circle ml-1" style="color: #ffd500"></i>';
  } else if (status === 'Emergency') {
    icon = '<i class="fas fa-first-aid ml-1" style="color: #fb5252"></i>';
  } else if (status === undefined || status === 'Undefined') {
    icon = '<i class="far fa-question-circle ml-1" style="color: #d8d8d8"></i>';
  }

  const user = document.createElement('div');
  user.classList.add('online-item');
  if (result.online) {
    user.innerHTML = `<li class="list-group-item list-group-item-action online-list-item" >${`${`${result.username}${icon}`}`}</li>`;
    chatMessages.append(user);
  } else {
    user.innerHTML = `<li class="list-group-item list-group-item-action offline-list-item">${`${`${result.username}${icon}`}`}</>`;
    chatMessages.append(user);
  }
}

function searchUser(keywords){
  console.log(keywords);
  fetch(`/api/search/users/${keywords}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((res) => res.json())
  .then((json) => {
    json.forEach((result) => {
      outputUser(result);
    });
  })
    .catch((e) => {
      console.log(e);
    });
}

function searchMessage(keywords, roomId){
  fetch(`/api/search/messages/${roomId}/${keywords}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((res) => res.json())
  .then((json) => {
    json.forEach((result) => {
      outputMessage(result);
    });
  })
    .catch((e) => {
      console.log(e);
    });
}

function searchStatus(roomId){
  fetch(`/api/search/messages/${roomId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((res) => res.json())
  .then((json) => {
    //console.log(json);
    json.forEach((result) => {
      outputStatus(result.username, result.statusArray);
    });
  })
    .catch((e) => {
      console.log(e);
    });
}

$('#submitBtn').on('click', (element) => {
  element.preventDefault();
  const keywords = msgEle.val();
  if(searchContext === 'directory'){
    searchUser(keywords);
  }else if(searchContext === 'message'){
    const roomId = urlParams.get('roomid');
    if(keywords === 'status'){
      searchStatus(roomId);
    }else{
      searchMessage(keywords, roomId);
    }
  }else{

  }
});

$('#backBtn').on('click', (element) => {
  element.preventDefault();
  const keywords = msgEle.val();
  if(searchContext === 'directory'){
    window.location.href = '/main';
  }else if(searchContext === 'message'){
    const roomId = urlParams.get('roomid');
    (roomId === 'public')? window.location.href = '/public-wall': window.location.href = `/private-chat/${roomId}`;
  }else{

  }
});
