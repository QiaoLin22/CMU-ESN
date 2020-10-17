/* global io */
const socket = io();

const username = $('#username-data').val();
socket.emit('join room', username);

const roomId = (() => {
  // check if this is private chat
  const urlList = window.location.href.split('/');
  const lastStr = urlList[urlList.length - 1];

  return lastStr === 'public-wall' ? "public" : lastStr;
})();

$('#roomId-data').text(roomId);
const chatContainer = $('.chat-container');
const chatMessages = $('.chat-messages');
const msgEle = $('#msg');

function outputMessage(message) {
  const timestamp = new Date(message.timestamp).toLocaleString();

  const msg = document.createElement('div');
  msg.classList.add('message');
  msg.innerHTML = `<p class="meta mb-1"> ${message.username} <span><i class="far fa-check-circle ml-2"></i></span> <span class="ml-3"> ${timestamp} </span></p> <p class="text"> ${message.message} </p>`;
  chatMessages.append(msg);

  // scroll to the bottom
  chatContainer.scrollTop(chatContainer[0].scrollHeight);
}


function loadMessages() {
  const fetchURL =  roomId === "public" ? '/api/messages/public' : `/api/messages/private/${roomId}`;
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

socket.on('new public message', (newMsg) => {
  if(roomId === "public"){
    outputMessage(newMsg);
  }
});

socket.on('new private message', (newMsg) => {
  if(newMsg.roomId === roomId){
    outputMessage(newMsg);
  }
});

// input new Message
$('#submitBtn').on('click', (element) => {
  element.preventDefault();

  const newMsg = {
    // TODO: get username
    username: username,
    message: msgEle.val(),
    roomId: roomId,
  };

  const publicOrPrivate = roomId === "public" ? 'public' : 'private';
  fetch(`/api/messages/${publicOrPrivate}`, {
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
