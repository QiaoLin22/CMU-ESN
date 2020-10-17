/* global io */
const socket = io();

const chatContainer = $('.chat-container');
const chatMessages = $('.chat-messages');
const msgEle = $('#msg');
const username = $('#username-data');

function outputMessage(message, status) {
  let icon = '';
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

function getGetOptions() {
  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

function loadMessages() {
  chatMessages.empty();
  const statusMap = retrieveStatus();
  console.log(statusMap)
  fetch('/api/messages/public', {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((json) => {
      json.forEach((message) => {
        // console.log(statusMap.get(message.username));
        // console.log(message.username);
        outputMessage(message, statusMap.get(message.username));
      });
    })
    .catch((e) => {
      console.log(e);
    });
}

function retrieveStatus() {
  const statusMap = new Map();
  fetch('/api/users', getGetOptions())
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      data.users.forEach((user) => {
        statusMap.set(user.username, user.status);
      });
    })
    .catch((e) => {
      console.log(e);
    });
  return statusMap;
}

jQuery(loadMessages);

socket.on('new message', (newMsg,status) => {
  outputMessage(newMsg,status.status);
});

socket.on('updateMsgStatus', () => {
  loadMessages();
  // const statusMap = retrieveStatus();
  // console.log(statusMap);
  // const status = statusMap.get(username);
  // console.log(status);
  // console.log(username);
});

// input new Message
$('#submitBtn').on('click', (element) => {
  element.preventDefault();

  const newMsg = {
    username: username.val(),
    message: msgEle.val(),
  };

  fetch('/api/messages/public', {
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


