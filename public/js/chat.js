/* global io */
const socket = io();

const username = $('#username-data').val();
socket.emit('join room', username);

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
})();

$('#roomId-data').text(otherUsername);

const chatContainer = $('.chat-container');
const chatMessages = $('.chat-messages');
const msgEle = $('#msg');

function outputMessage(message) {
  let icon = '';
  const { status } = message;
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

function loadMessages() {
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

socket.on('new public message', (newMsg) => {
  if (roomId === 'public') {
    outputMessage(newMsg);
  }
});

function updateReadStatus(roomId) {
  fetch(`/api/messages/${roomId}/read`, {
    method: 'PUT',
  });
}

function displayNotification(username) {
  $('.toast-body').replaceWith(
    `<div class="toast-body pl-3 pt-2 pr-2 pb-2">${username} just sent you a message</div>`
  );
  $('.toast').css('zIndex', 1000);
  $('.toast').toast('show');
  // alert(username + " just sent you a private message!");
}

socket.on('new private message', (newMsg) => {
  if (newMsg.roomId === roomId) {
    if (newMsg.username != username) {
      updateReadStatus(roomId);
    }
    outputMessage(newMsg);
  } else {
    displayNotification(newMsg.username);
  }
});

// input new Message
$('#submitBtn').on('click', (element) => {
  element.preventDefault();

  const newMsg = {
    sender: username,
    recipient: otherUsername,
    message: msgEle.val(),
    roomId: roomId,
  };

  const publicOrPrivate = roomId === 'public' ? 'public' : 'private';

  fetch(`/api/messages/${publicOrPrivate}/${roomId}`, {
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
