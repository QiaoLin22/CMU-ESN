const message = require('../models/message');
const {
  getHistoricalMessages,
  createNewMessage,
  checkUnreadMessage,
  updateAllToRead,
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
        req.io.emit('updateDirectory');
        res.status(201).send({ message: 'successfully create a message' });
      })
      .catch((e) => {
        console.log(e);
        res.status(400).send(e);
      });
  }

  static createNewAnnouncement(req, res) {
    const { username, announcement, roomId } = req.body;
    createNewMessage(username, announcement, roomId)
      .then((newAnnouncement) => {
        req.io.in(roomId).emit('new announcement', newAnnouncement);
        res
          .status(201)
          .send({ message: 'successfully create an announcement' });
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

  static getAnnouncement(req, res) {
    getHistoricalMessages('announcement').then((messages) =>
      res.send(messages)
    );
  }

  static checkExistingUnreadMessage(req, res) {
    const { otherUsername } = req.params;
    const { username } = res.locals;
    checkUnreadMessage(username, otherUsername).then((data) => {
      if (data.length === 0) {
        res.send(false);
      } else {
        res.send(true);
      }
    });
  }

  static updateReadStatus(req, res) {
    const { roomId } = req.params;
    updateAllToRead(roomId).then(() => res.status(200).end());
  }
}

module.exports = messageController;
