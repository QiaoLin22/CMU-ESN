const { Schema } = require('mongoose');
const reservedUsernames = require('../lib/reserved_usernames.json').usernames;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
  },
  hash: String,
  salt: String,
  online: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: 'Undefined',
  },
  timestamp: {
    type: String,
    required: [true, 'Timestamp is required'],
  },
});

class User {
  static createNewUser(username, hash, salt) {
    const newUser = new User({
      username: username,
      hash,
      salt,
      online: false,
      status: 'Undefined',
      timestamp: new Date(Date.now()).toISOString(),
    });

    return newUser.save();
  }

  static retrieveUsers() {
    return this.find(
      {},
      { username: 1, online: 1, status: 1 },
      { sort: { online: -1, username: 1 } }
    );
  }

  static findUserByUsername(username) {
    return this.findOne({ username: username });
  }

  static updateOnlineStatus(username, online) {
    return this.updateOne(
      { username: username }, // Filter
      { $set: { online: online } } // Update
    );
  }

  static updateStatusIcon(username, status) {
    const timestamp = new Date(Date.now()).toISOString();
    return this.updateOne(
      { username: username },
      { $set: { status: status } },
      { $set: { timestamp: timestamp } }
    );
  }

  static getStatusByUsername(username) {
    return this.findOne({ username: username }, { status: 1 });
  }

  static validateUsernamePassword(username, password) {
    if (!username.length >= 3)
      throw Error('Username should be at least 3 characters long');

    if (reservedUsernames.includes(username))
      throw Error('Username is reserved');

    if (!password.length >= 4)
      throw Error('Passwords should be at least 4 characters long');
  }
}

userSchema.loadClass(User);

module.exports = userSchema;
