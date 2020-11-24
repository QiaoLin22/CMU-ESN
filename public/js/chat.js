/* global io */
const socket = io();

const username = $('#username-data').val();
socket.emit('join room', username);

/* get roomId */
const roomId = (() => {
  // check if this is private chat
  const urlList = window.location.href.split('/');
  const lastStr = urlList[urlList.length - 1];
  return lastStr === 'public-wall' ? 'public' : lastStr;
})();

const otherUsername = (() => {
  if (roomId === 'public') return 'public';

  const startRegex = new RegExp(`^${username}`);
  const endRegex = new RegExp(`${username}$`);

  if (roomId.match(startRegex)) {
    return roomId.replace(startRegex, '');
  } else if (roomId.match(endRegex)) {
    return roomId.replace(endRegex, '');
  }

  // TODO Needs to change
  return '';
})();

$('#roomId-data').text(otherUsername);

const chatContainer = $('.chat-container');
const chatMessages = $('.chat-messages');
const msgEle = $('#msg');

function toBase64(arr) {
  //arr = new Uint8Array(arr) if it's an ArrayBuffer
  return btoa(
     arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
}

/* display chat message */
function outputMessage(message) {
  let icon = '';
  const { status } = message;
  // get status icon
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
  if(message.photo === undefined){
    msg.innerHTML = `<p class="meta mb-1"> ${message.sender} <span>${icon}</span> <span class="ml-3"> ${timestamp} </span></p> <p class="text"> ${message.message} </p>`;
  }else{
    msg.innerHTML = `<p class="meta mb-1"> ${message.sender} <span>${icon}</span> <span class="ml-3"> ${timestamp} </span></p> 
    <p class="text"> ${message.message} </p><img class="img-thumbnail" src="data:image/png;base64,${toBase64( message.photo.data.data)}">`;
  }
  chatMessages.append(msg);

  // scroll to the bottom
  chatContainer.scrollTop(chatContainer[0].scrollHeight);
}

/* retrieve historical messages with specific roomId */
function loadMessages() {
  // fetch "/api/messages/public"
  // or "/api/messages/private/{roomId}" request to retrieve historical messages
  const fetchURL =
    roomId === 'public'
      ? '/api/messages/public'
      : `/api/messages/private/${roomId}`;
  fetch(fetchURL, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((json) => {
      json.forEach((message) => {
        outputMessage(message);
      });
    })
    .catch((e) => {
      console.log(e);
    });
}

jQuery(loadMessages);

/* new public message request handler */
socket.on('new public message', (newMsg) => {
  // if user is in  public room, display message
  if (roomId === 'public') {
    outputMessage(newMsg);
  }
});

function updateReadStatus(_roomId) {
  fetch(`/api/messages/${_roomId}/read`, {
    method: 'PUT',
  });
}

function displayNotification(_username) {
  $('.toast-body').replaceWith(
    `<div class="toast-body pl-3 pt-2 pr-2 pb-2">${_username} just sent you a message</div>`
  );
  $('.toast').css('zIndex', 1000);
  $('.toast').toast('show');
}

/*  new private message request handler */
socket.on('new private message', (newMsg) => {
  // if user is in the same room with the sender of the new message
  // display the new message
  if (newMsg.roomId === roomId) {
    // if the message is not send by current user
    // mark the message as read
    if (newMsg.sender !== username) {
      updateReadStatus(roomId);
    }
    outputMessage(newMsg);
  } else {
    // if user is not in the same room with the sender of the new message
    // send notification
    console.log('ok');
    displayNotification(newMsg.sender);
  }
});

/* input new Message */
$('#submitBtn').on('click', (element) => {
  element.preventDefault();

  const newMsg = {
    sender: username,
    recipient: otherUsername,
    message: msgEle.val(),
    roomId: roomId,
  };

  const partialUrl = roomId === 'public' ? 'public' : `private/${roomId}`;

  fetch(`/api/messages/${partialUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newMsg),
  })
    .then(() => {
      msgEle.val('');
    })
    .catch((e) => {
      console.log(e);
    });
});

$('#searchBtn').on('click', () => {
  const fetchURL = `/search?context=message&roomid=${roomId}`;
  window.location.href = fetchURL;
});
