const chatContainer = $('.chat-container');
const chatMessages = $('.chat-messages');
const msgEle = $('#msg');
const urlParams = new URLSearchParams(window.location.search);
const searchContext = urlParams.get('context');
document.getElementById("loadBtn").style.visibility = "hidden";
let pagination = 0;

/*display no result alert*/
function displayNotification(notificationMessage) {
  $('.toast-body').replaceWith(
    `<div class="toast-body pl-3 pt-2 pr-2 pb-2">${notificationMessage}</div>`
  );
  $('.toast').css('zIndex', 1000);
  $('.toast').toast('show');
}

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
  msg.innerHTML = `<p class="meta mb-1"> ${message.sender} <span>${icon}</span> <span class="ml-3"> ${timestamp} </span></p> <p class="text"> ${message.message} </p>`;
  chatMessages.append(msg);

  // scroll to the bottom
  chatContainer.scrollTop(chatContainer[0].scrollHeight);
}

/* display searched status list */
function outputStatus(anotherUsername, statusArray) {
  statusArray.reverse().forEach((statusObj) => {
    let icon = '';
    //get status icon
    if (statusObj.status === 'OK') {
      icon = '<i class="far fa-check-circle ml-1" style="color: #18b87e"></i>';
    } else if (statusObj.status === 'Help') {
      icon = '<i class="fas fa-info-circle ml-1" style="color: #ffd500"></i>';
    } else if (statusObj.status === 'Emergency') {
      icon = '<i class="fas fa-first-aid ml-1" style="color: #fb5252"></i>';
    } else if (
      statusObj.status === undefined ||
      statusObj.status === 'Undefined'
    ) {
      icon =
        '<i class="far fa-question-circle ml-1" style="color: #d8d8d8"></i>';
    }

    const timestamp = new Date(statusObj.timestamp).toLocaleString();
    const msg = document.createElement('div');
    msg.classList.add('message');
    msg.innerHTML = `<p class="meta mb-1"> ${anotherUsername} <span>${icon}</span> <span class="ml-3"> ${timestamp} </span> </p>`;
    chatMessages.append(msg);

    // scroll to the bottom
    chatContainer.scrollTop(chatContainer[0].scrollHeight);
  });
}

/* display searched user list */
function outputUser(result) {
  let icon = '';
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

/* display searched announcement */
function outputAnnouncement(newAnnouncement) {
  const timestamp = new Date(newAnnouncement.timestamp).toLocaleString();
  const announce = document.createElement('div');
  announce.classList.add('announcement');
  announce.classList.add('p-3');
  //TODO: need unique id to replace collapseExample -> each announcement matches with one show button
  //TODO: show button won't show unless the announcement is long
  const announcementId = `ann-${newAnnouncement._id}`;
  announce.innerHTML = `<p class="meta mb-1"> ${newAnnouncement.sender} <span class="ml-3"> ${timestamp} </span></p><p class="collapse" id=${announcementId} aria-expanded="false"> ${newAnnouncement.message} </p><a role="button" class="collapsed" data-toggle="collapse" href="#${announcementId}"aria-expanded="false" aria-controls=${announcementId}></a>`;
  chatMessages.prepend(announce);
}

function searchUser(keywords) {
  fetch(`/api/search/users/${keywords}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((res) => res.json())
  .then((json) => {
    if(json.length === 0)
      displayNotification("no result found");
    else{
      json.forEach((result) => {
        outputUser(result);
      });
    }
  })
    .catch((e) => {
      console.log(e);
    });
}

function searchMessage(keywords, roomId, pagination){
  fetch(`/api/search/messages/${roomId}/${keywords}/${pagination}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((res) => res.json())
  .then((json) => {
    if(json.error === "no valid keyword"){
      displayNotification("Please enter a valid keyword");
    }else if(json.length === 0)
      displayNotification("no result found");
    else{
      json.forEach((result) => {
        outputMessage(result);
      });
    }
  })
    .catch((e) => {
      console.log(e);
    });
}

function searchAnnouncement(keywords, pagination){
  fetch(`/api/search/announcement/${keywords}/${pagination}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((res) => res.json())
  .then((json) => {
    if(json.error === "no valid keyword"){
      displayNotification("Please enter a valid keyword");
    }else if(json.length === 0)
      displayNotification("no result found");
    else{
      json.forEach((result) => {
        outputAnnouncement(result);
      });
    }
  })
    .catch((e) => {
      console.log(e);
    });
}

function searchStatus(roomId) {
  fetch(`/api/search/messages/${roomId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((res) => res.json())
  .then((json) => {
    if(json.length === 0)
      displayNotification("no result found");
    else{
      json.forEach((result) => {
        outputStatus(result.username, result.statusArray);
      });
    }
  })
    .catch((e) => {
      console.log(e);
    });
}

$('#submitBtn').on('click', (element) => {
  element.preventDefault();
  pagination = 0;
  const keywords = msgEle.val();
  //TODO clear chat container
  if(!keywords){
    displayNotification("please enter a keyword");
  }else{
    if (searchContext === 'directory') {
      searchUser(keywords);
    } else if (searchContext === 'message') {
      const roomId = urlParams.get('roomid');
      if (keywords === 'status') {
        searchStatus(roomId);
      }else{
        document.getElementById("loadBtn").style.visibility = "visible";
        searchMessage(keywords, roomId, pagination);
      }
    } else {
      searchAnnouncement(keywords, pagination);
    }
  }
});

$('#backBtn').on('click', (element) => {
  element.preventDefault();
  const keywords = msgEle.val();
  if (searchContext === 'directory') {
    window.location.href = '/main';
  } else if (searchContext === 'message') {
    const roomId = urlParams.get('roomid');
    roomId === 'public'
      ? (window.location.href = '/public-wall')
      : (window.location.href = `/private-chat/${roomId}`);
  } else {
    window.location.href = '/announcement';
  }
});

$('#loadBtn').on('click', (element) => {
 if(searchContext === 'message'){
    pagination++;
    const keywords = msgEle.val();
    const roomId = urlParams.get('roomid');
    if(keywords === 'status'){
      searchStatus(roomId);
    }else{
      searchMessage(keywords, roomId, pagination);
    }
  }else if(searchContext === 'announcement'){
    searchAnnouncement(keywords, pagination);
  }
});
