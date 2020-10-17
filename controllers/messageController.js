const {
  getHistoricalMessages,
  createNewMessage,
} = require('../models/message');

const { getStatusByUsername } = require('../models/user');

class messageController {
  static createMessage(req, res) {
    const { username, message } = req.body;

    createNewMessage(username, message)
      .then((newMessage) => {
        // const status = getStatusByUsername(username);
        req.io.emit('new message', newMessage);
        res.status(201).send({ message: 'successfully create a message' });
      })
      .catch((e) => {
        console.log(e);
        res.status(400).send(e);
      });
  }

  static getMessage(req, res) {
    getHistoricalMessages().then((messages) => res.send(messages));
  }
}

module.exports = messageController;
