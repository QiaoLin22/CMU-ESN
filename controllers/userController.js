const User = require('../models/user');
const utils = require('../lib/utils');

class UserController {
  static createUser(req, res) {
    const { username, password } = req.body;

    // create new user and save to db
    const hashAndSalt = utils.genHashAndSalt(password);
    const newUser = new User({
      username: username,
      ...hashAndSalt,
      online: false,
    });

    newUser
      .save()
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
    User.find(
      {},
      { username: 1, online: 1 },
      { sort: { online: -1, username: 1 } },
      (err, users) => {
        if (err) return next(err);
        return res.status(200).json({ users });
      }
    );
  }
}

module.exports = UserController;
