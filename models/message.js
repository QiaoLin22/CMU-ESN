const mongoose = require('mongoose');
const { getStatusByUsername } = require('./user');

const MessageSchema = mongoose.Schema({
  sender: {
    type: String,
    required: [true, 'Sender is required'],
  },
  recipient: {
    type: String,
    required: [true, 'Recipient is required'],
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

async function createNewMessage(sender, recipient, message, roomId) {
  const latestStatus = await getStatusByUsername(sender);

  const newMessage = new Message({
    sender: sender,
    recipient: recipient,
    timestamp: new Date(Date.now()).toISOString(),
    message: message,
    roomId: roomId,
    status: latestStatus.status,
    read: false,
  });

  return newMessage.save();
}

function getHistoricalMessages(roomId) {
  return Message.find({ roomId: roomId });
}

function updateAllToRead(roomId) {
  return Message.updateMany({ roomId: roomId }, { read: true });
}

function searchMessage(roomId, filteredKeywords) {
  return Message.find({
    roomId: roomId,
    message: { $regex: filteredKeywords },
  }).limit(10);
}

module.exports = {
  Message,
  createNewMessage,
  getHistoricalMessages,
  updateAllToRead,
  searchMessage,
};
