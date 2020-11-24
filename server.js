const http = require('http');
const socketIO = require('socket.io');
const app = require('./app');
require('./services/db-production');

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port);

// Socket.io
const io = socketIO.listen(server);

// pass io to following middleware/router
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });
app.set('io', io);

const User = require('./models/user');

io.on('connection', (socket) => {
  // console.log(`${socket.id} connected`);

  socket.on('join room', async (username) => {
    const userList = await User.retrieveUsers();

    userList.forEach((user) => {
      const otherUsername = user.username;
      if (otherUsername !== username) {
        const roomId =
          username < otherUsername
            ? `${username}${otherUsername}`
            : `${otherUsername}${username}`;
        // console.log(roomId);
        socket.join(roomId);
      }
    });
  });

  socket.on('disconnect', () => {
    // console.log(`${socket.id} disconnected`);
    io.emit('displayUsers');
  });
});
