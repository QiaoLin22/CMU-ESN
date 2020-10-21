const mongoose = require('mongoose');
require('dotenv').config();

const { getStatusByUsername } = require('./user');

/*const dbString = process.env.DB_STRING;

mongoose
  .connect(dbString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((e) => console.log(e));*/

const MessageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
  },
  timestamp: {
    type: String,
    required: [true, 'Timestamp is required'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  roomId: {
    type: String,
    required: [true, 'Room ID is required'],
  },
  status: {
    type: String,
    enum: ['OK', 'Emergency', 'Help', 'Undefined'],
  },
  read: {
    type: Boolean,
    required: [true, 'Read status is required'],
    default: false,
  },
});

const Message = mongoose.model('Message', MessageSchema);

async function createNewMessage(username, message, roomId) {
  const status = await getStatusByUsername(username);

  const newMessage = new Message({
    username: username,
    timestamp: new Date(Date.now()).toISOString(),
    message: message,
    roomId: roomId,
    status: status.status,
    read: false,
  });

  return newMessage.save();
}

async function getHistoricalMessages(roomId) {
  return Message.find({ roomId: roomId });
}

function updateAllToRead(roomId) {
  return Message.updateMany({ roomId: roomId }, { read: true });
}

function checkUnreadMessage(username, otherUsername) {
  const roomId =
    username < otherUsername
      ? `${username}${otherUsername}`
      : `${otherUsername}${username}`;
  return Message.find({
    roomId: roomId,
    read: false,
    username: { $ne: username },
  });
}

module.exports = {
  Message,
  createNewMessage,
  getHistoricalMessages,
  checkUnreadMessage,
  updateAllToRead,
};
