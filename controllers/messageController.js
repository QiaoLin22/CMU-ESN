const {
  getHistoricalMessages,
  createNewMessage,
} = require('../models/message');

class messageController {
  static createPublicMessage(req, res) {
    const { username, message, roomId } = req.body;
    createNewMessage(username, message, roomId)
      .then((newMessage) => {
        req.io.emit('new public message', newMessage);
        res.status(201).send({ message: 'successfully create a message' });
      })
      .catch((e) => {
        console.log(e);
        res.status(400).send(e);
      });
  }

  static createPrivateMessage(req, res) {
    const { username, message, roomId } = req.body;
    createNewMessage(username, message, roomId)
      .then((newMessage) => {
        req.io.in(roomId).emit('new private message', newMessage);
        res.status(201).send({ message: 'successfully create a message' });
      })
      .catch((e) => {
        console.log(e);
        res.status(400).send(e);
      });
  }

  static getPublicMessage(req, res) {
    getHistoricalMessages("public").then((messages) => res.send(messages));
  }

  static getPrivateMessage(req, res) {
    const { roomId } = req.params;
    getHistoricalMessages(roomId).then((messages) => res.send(messages));
  }
}

module.exports = messageController;
