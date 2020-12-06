const User = require('../models/user');
const { genHashAndSalt } = require('../lib/password');

class UserController {
  static createUser(req, res) {
    const { username, password } = req.body;

    // create new user and save to db
    const { hash, salt } = genHashAndSalt(password);
    User.createNewUser(username, hash, salt)
      .then(() => {
        req.app.get('io').emit('updateDirectory');
        res.status(201).send({ message: 'success' });
      })
      .catch((err) => {
        let message;
        // duplicate key in Mongo
        if (err.code === 11000) {
          message = 'Username already exists';
        } else {
          message = Object.values(err.errors)[0].properties.message;
        }
        res.status(400).json({ error: message });
      });
  }

  static retrieveUsers(req, res, next) {
    User.retrieveUsers(res.locals.username)
      .then((users) => res.status(200).json(users))
      .catch((err) => next(err));
  }

  static updateStatus(req, res) {
    const { status, username } = req.body;
    User.updateStatusIcon(username, status)
      .then(() => {
        req.app.get('io').emit('updateDirectory');
        req.app.get('io').emit('updateMap');
        req.app.get('io').emit('updateMsgStatus', username);
        res.status(200).send({ message: 'success' });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: err });
      });
  }

  static getZip(req, res) {
    const { username } = req.params;
    User.getZip(username).then((zip) => {
      res.status(200).send(zip);
    });
  }

  static updateZip(req, res) {
    const { username } = req.params;
    const { zip } = req.body;

    console.log(req.body);
    User.updateZip(username, zip).then(() => {
      res.status(200).send('success');
    });
  }

  static getUserProfile(req, res) {
    const { username } = req.params;
    User.getUserProfile(username)
      .then((user) => res.status(200).json(user))
      .catch((err) => next(err));
  }

  static async updateUserProfile(req, res) {
    const { username } = req.params;

    const { newUsername, password, accountStatus, privilegeLevel } = req.body;

    try {
      User.validateUsername(newUsername);
      if (password.length > 0) {
        User.validatePassword(password);
      }

      const newProfile = {
        username: newUsername,
        accountStatus: accountStatus === 'active',
        privilegeLevel,
        ...(password.length > 0 && genHashAndSalt(password)),
      };

      console.log(newProfile);

      await User.updateUserProfile(username, newProfile);

      res.status(200).send('success');
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
}

module.exports = UserController;
