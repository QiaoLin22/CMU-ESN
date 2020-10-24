const {
  getHistoricalMessages,
  createNewMessage,
  updateAllToRead,
} = require('../models/message');

class MessageController {
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
        req.io.emit('updateDirectory');
        res.status(201).send({ message: 'successfully create a message' });
      })
      .catch((e) => {
        console.log(e);
        res.status(400).send(e);
      });
  }

  static getPublicMessage(req, res) {
    getHistoricalMessages('public').then((messages) => res.send(messages));
  }

  static getPrivateMessage(req, res) {
    const { roomId } = req.params;
    updateAllToRead(roomId).then(() =>
      getHistoricalMessages(roomId).then((messages) => res.send(messages))
    );
  }

  static updateReadStatus(req, res) {
    const { roomId } = req.params;
    updateAllToRead(roomId).then(() => res.status(200).end());
  }
}

module.exports = MessageController;
