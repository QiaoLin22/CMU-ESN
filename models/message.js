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
});

const Message = mongoose.model('Message', MessageSchema);

function createNewMessage(username, message, roomID) {
  const newMessage = new Message({
    username: username,
    timestamp: new Date(Date.now()).toISOString(),
    message: message,
    roomID: roomID,
  });

  return newMessage.save();
}

function getHistoricalMessages(roomID) {
  return Message.find({roomID: roomID});
}

module.exports = { createNewMessage, getHistoricalMessages};
