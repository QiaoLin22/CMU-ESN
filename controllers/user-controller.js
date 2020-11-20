const {
  createNewUser,
  retrieveUsers,
  updateStatusIcon,
  createNewEmergencyContact,
  removeEmergencyContact,
  getEmergencyContacts,
} = require('../models/user');
const { genHashAndSalt } = require('../lib/password');
const createNewSMS = require('../lib/sms');

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
    retrieveUsers(res.locals.username)
      .then((users) => res.status(200).json(users))
      .catch((err) => next(err));
  }

  static updateStatus(req, res) {
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

  static createContact(req, res) {
    const { username, name, phone } = req.body;
    createNewEmergencyContact(username, name, phone)
      .then(() => {
        const newContact = { name: name, phone: phone };
        req.app.get('io').emit('create new contact', newContact);
        res.status(201).send({ message: 'send' });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: err });
      });
  }

  static getAllContacts(req, res, next) {
    getEmergencyContacts(res.locals.username)
      .then((contacts) => {
        res.send(contacts[0].emergencyContact);
      })
      .catch((err) => next(err));
  }

  static removeContact(req, res) {
    const { username, name } = req.body;
    removeEmergencyContact(username, name)
      .then(() => {
        req.app.get('io').emit('remove a contact', username);
        res.status(200).send({ message: 'success' });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: err });
      });
  }

  static notifyEmergencyContact(req, res) {
    const { username } = res.locals;
    getEmergencyContacts(username)
      .then((contacts) => {
        contacts[0].emergencyContact.forEach((contact) => {
          createNewSMS(username, contact.name, contact.phone);
        });
        res.status(200).send({ message: 'success' });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: err });
      });
  }
}

module.exports = UserController;
