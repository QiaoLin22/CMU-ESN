/* global io */
const socket = io();

const chatContainer = $('.chat-container');
const chatMessages = $('.chat-messages');
const msgEle = $('#msg');
const username = $('#username-data');

function outputMessage(message,status) {
  const timestamp = new Date(message.timestamp).toLocaleString();

  const msg = document.createElement('div');
  msg.classList.add('message');
  msg.innerHTML = `<p class="meta mb-1"> ${message.username} <span></span> <span class="ml-3"> ${timestamp} </span></p> <p class="text"> ${message.message} </p>`;
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

async function loadMessages() {
  const statusMap = await retrieveStatus()
  console.log(statusMap)
  fetch('/api/messages/public', {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((json) => {
      json.forEach((message) => {
        const status = statusMap.get(message.username)
        console.log(status)
        console.log(message.username)
        outputMessage(message,status);
      });
    })
    .catch((e) => {
      console.log(e);
    });
}

function retrieveStatus() {
  let statusMap = new Map()
  fetch('/api/users', getGetOptions())
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      data.users.forEach((user) => {
        statusMap.set(user.username,user.status)
      });
      return statusMap
    })
    .catch((e) => {
      console.log(e);
    });
}

jQuery(loadMessages);

socket.on('new message', async(newMsg) => {
  const statusMap = await retrieveStatus()
  const status = statusMap.get(newMsg.username)
  outputMessage(newMsg,status);
});

// input new Message
$('#submitBtn').on('click', (element) => {
  element.preventDefault();

  const newMsg = {
    // TODO: get username
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


