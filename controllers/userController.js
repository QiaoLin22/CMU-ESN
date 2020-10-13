const { createNewUser, retrieveUsers } = require('../models/user');
const utils = require('../lib/utils');

class UserController {
  static createUser(req, res) {
    const { username, password } = req.body;

    // create new user and save to db
    const { hash, salt } = utils.genHashAndSalt(password);
    createNewUser(username, hash, salt)
      .then(() => {
        req.io.emit('updateDirectory');
        res.status(201).send({ message: 'success' });
      })
      .catch((err) => {
        let message;

        if (err.code === 11000) {
          message = 'Username already exists';
        } else {
          message = Object.values(err.errors)[0].properties.message;
        }
        res.status(400).json({ error: message });
      });
  }

  static retrieveUsers(req, res, next) {
    retrieveUsers()
      .then((users) => res.status(200).json({ users }))
      .catch((err) => next(err));
  }
}

module.exports = UserController;
