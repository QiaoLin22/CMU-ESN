require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages');

const PORT = process.env.PORT || 3000;

// pass io to following middleware/router
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);

server.listen(PORT);

io.on('connection', (socket) => {
  // console.log(`${socket.id} connected`);

  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
  });

  socket.on('disconnect', () => {
    // console.log(`${socket.id} disconnected`);
    io.emit('displayUsers');
  });
});
