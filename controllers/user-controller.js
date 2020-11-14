const {
  createNewUser,
  retrieveUsers,
  updateStatusIcon,
  updateUserLocation,
  retrieveLocations
} = require('../models/user');
const { genHashAndSalt } = require('../lib/password');

class UserController {
  static createUser(req, res) {
    const { username, password } = req.body;

    // create new user and save to db
    const { hash, salt } = genHashAndSalt(password);
    createNewUser(username, hash, salt)
      .then(() => {
        req.app.get('io').emit('updateDirectory');
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
    retrieveUsers(res.locals.username)
      .then((users) => res.status(200).json(users))
      .catch((err) => next(err));
  }

  static updateStatus(req, res, next) {
    const { status, username } = req.body;
    updateStatusIcon(username, status)
      .then(() => {
        req.app.get('io').emit('updateDirectory');
        req.app.get('io').emit('updateMsgStatus', username);
        res.status(200).send({ message: 'success' });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: err });
      });
  }
  static updateLocation(req, res, next) {
    const {username,longitude, latitude} = req.body;
    updateUserLocation(username,longitude,latitude)
    .then(() => {
      req.app.get('io').emit('updateMap', username);
      res.status(200).send({ message: 'success' });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: err });
    });
  }
  static retrieveUserLocations(req, res, next) {
    retrieveLocations()
      .then((locations) => res.status(200).json(locations))
      .catch((err) => next(err));
  }
}

module.exports = UserController;
