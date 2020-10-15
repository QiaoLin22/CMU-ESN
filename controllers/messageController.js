const {
  getHistoricalMessages,
  createNewMessage,
} = require('../models/message');

class messageController {
  static createMessage(req, res) {
    const { username, message, roomID } = req.body;

    createNewMessage(username, message, roomID)
      .then((newMessage) => {
        req.io.emit('new message', newMessage);
        res.status(201).send({ message: 'successfully create a message' });
      })
      .catch((e) => {
        console.log(e);
        res.status(400).send(e);
      });
  }

  static getMessage(req, res) {
    const { roomId } = req.params;
    getHistoricalMessages(roomId).then((messages) => res.send(messages));
  }
}

module.exports = messageController;
