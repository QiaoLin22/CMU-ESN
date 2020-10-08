const Message = require('../models/message');

class messageController {
  static createMessage(req, res) {
    const { username, message } = req.body;

    const newMessage = new Message({
      username: username,
      timestamp: new Date(Date.now()).toISOString(),
      message: message,
    });

    newMessage
      .save()
      .then(() => {
        req.io.emit('new message', newMessage);
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
