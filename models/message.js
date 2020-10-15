const mongoose = require('mongoose');
require('dotenv').config();

const dbString = process.env.DB_STRING;

mongoose
  .connect(dbString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((e) => console.log(e));

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
    default: undefined,
  },
});

const Message = mongoose.model('Message', MessageSchema);

function createNewMessage(username, message, roomId) {
  const newMessage = new Message({
    username: username,
    timestamp: new Date(Date.now()).toISOString(),
    message: message,
    roomId: roomId,
  });

  return newMessage.save();
}

function getHistoricalMessages(roomId) {
  return Message.find({ roomId: roomId });
}

module.exports = { createNewMessage, getHistoricalMessages };
