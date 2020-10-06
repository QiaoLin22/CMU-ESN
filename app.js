const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const socketServer = require('socket.io')(5000);
const routes = require('./routes');
const User = require('./models/user');
const UserController = require('./controllers/userController');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(routes);

app.listen(3000);

socketServer.on('connection', (socket) => {
  console.log(`${socket.id} connected`);

  socketServer.emit('displayUsers');


  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
  });

  socket.emit('displayHistoricalMsg');

  socket.on('input', (message) => {
    socketServer.emit('output', message);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
    socketServer.emit('displayUsers');
  });
});

