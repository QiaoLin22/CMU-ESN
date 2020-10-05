const socket = io();

const messageForm = $('#chatForm');
const chatMessages = $('.chat-messages');

function outputMessage(message) {
  const msg = document.createElement('div');
  msg.classList.add('chat-messages mb-3');
  msg.innerHTML = `<p class="meta">${message.username}<span>${message.timestamp}</span></p><p class="text"> ${message.message} </p>`;
  chatMessages.appendChild(msg);
}

socket.emit('joinRoom', 'public');

socket.on('outputMessage', (message) => {
  if (message.length) {
    for (let i = 0; i < message.length; i++) {
      console.log(message[i]);
      outputMessage(message[i]);
    }
  } else {
    console.log(message);
    outputMessage(message);
  }
});

// input Message
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit('input', msg);
  e.target.elements.msg.value = '';
});
