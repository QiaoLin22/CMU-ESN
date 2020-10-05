const socket = io();

const messageForm = $('#chatForm');
const chatMessages = $('.chat-messages');

socket.emit('joinRoom', 'public');