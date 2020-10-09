/* global io */
const socket = io('http://localhost:5000');

const chatContainer = $('.chat-container');
const chatMessages = $('.chat-messages');
const msgEle = $('#msg');
const username = $('#username-data');

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
  fetch('/api/messages/public', {
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

socket.on('new message', (newMsg) => {
  outputMessage(newMsg);
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
