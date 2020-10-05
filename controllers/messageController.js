const moment = require('moment');
// const io = require('socket.io-client');
const Message = require('../models/message');

// const socket = io.connect('http://localhost:5000');

class messageController {
  static createMessage(req, res) {
    const { username, message } = req.body;

    const newMessage = new Message({
      username: username,
      timestamp: moment().format('h:mm a'),
      message: message,
    });

    newMessage
      .save()
      .then(() => {
        // socket.emit('displayMsg', newMessage);
        res.status(201).send({ message: 'successfully create a message' });
      })
      .catch((e) => {
        res.status(400).send(e);
      });
  }

  static getMessage(req, res) {
    Message.find({}, (err, messages) => {
      res.send(messages);
    });
  }
}

module.exports = messageController;
