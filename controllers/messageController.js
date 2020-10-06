const Message = require('../models/message');

class messageController {
  static createMessage(req, res) {
    const { username, timestamp, message } = req.body;

    const newMessage = new Message({
      username: username,
      timestamp: timestamp,
      message: message,
    });

    newMessage
      .save()
      .then(() => {
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
