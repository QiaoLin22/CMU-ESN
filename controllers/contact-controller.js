const User = require('../models/user');
const createNewSMS = require('../lib/sms');

class ContactController {
  static createContact(req, res) {
    const { username, name, phone } = req.body;
    User.createNewEmergencyContact(username, name, phone)
      .then(() => {
        const newContact = { name: name, phone: phone };
        req.app.get('io').emit('create new contact', newContact);
        res.status(201).send({ message: 'send' });
      })
      .catch(() => {
        // console.log(err);
        res.status(401);
      });
  }

  static getAllContacts(req, res) {
    User.getEmergencyContacts(res.locals.username)
      .then((contacts) => {
        res.send(contacts[0].emergencyContact);
      })
      .catch(() => {
        res.status(401);
      });
  }

  static removeContact(req, res) {
    const { username, name } = req.body;
    User.removeEmergencyContact(username, name)
      .then(() => {
        req.app.get('io').emit('remove a contact', username);
        res.status(200).send({ message: 'success' });
      })
      .catch(() => {
        // console.log(err);
        res.status(401);
      });
  }

  static notifyEmergencyContact(req, res) {
    const { username } = res.locals;
    User.getEmergencyContacts(username)
      .then((contacts) => {
        contacts[0].emergencyContact.forEach((contact) => {
          createNewSMS(username, contact.name, contact.phone);
        });
        res.status(200).send({ message: 'success' });
      })
      .catch(() => {
        // console.log(err);
        res.status(401);
      });
  }
}

module.exports = ContactController;
