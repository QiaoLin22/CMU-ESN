const mongoose = require('mongoose');
const reservedUsernames = require('../lib/reserved_usernames.json').usernames;

const userSchema = new mongoose.Schema({
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
  statusArray: {
    type: [
      {
        timestamp: { type: String },
        status: { type: String },
      },
    ],
    default: [
      {
        timestamp: new Date(Date.now()).toISOString(),
        status: 'Undefined',
      },
    ],
  },
});

const User = mongoose.model('User', userSchema);

function createNewUser(username, hash, salt) {
  const newUser = new User({
    username: username,
    hash,
    salt,
    online: false,
    statusArray: [
      {
        timestamp: new Date(Date.now()).toISOString(),
        status: 'Undefined',
      },
    ],
  });

  return newUser.save();
}

function retrieveUsers() {
  return User.find(
    {},
    { _id: 0, __v: 0, hash: 0, salt: 0},
    { sort: { online: -1, username: 1 } },
  )
}

function findUserByUsername(username) {
  return User.findOne(
    { username: username },
    { _id: 0, __v: 0, hash: 0, salt: 0},
    );
}

function updateOnlineStatus(username, online) {
  return User.updateOne(
    { username: username }, // Filter
    { $set: { online: online } } // Update
  );
}

function updateStatusIcon(username, status) {
  const timestamp = new Date(Date.now()).toISOString();
  const objStatus = { timestamp: timestamp, status: status };
  return User.update(
    { username: username },
    { $push: { statusArray: objStatus } }
  )
}

function getStatusByUsername(username) {
  return User.findOne(
    { username: username }, 
    { statusArray: 1 }
    ).then((arr) => {
      return arr.statusArray[arr.statusArray.length-1].status
    }).catch((e) => {
      console.log(e)
    })
    
}

function validateUsernamePassword(username, password) {
  if (!username.length >= 3)
    throw Error('Username should be at least 3 characters long');

  if (reservedUsernames.includes(username)) throw Error('Username is reserved');

  if (!password.length >= 4)
    throw Error('Passwords should be at least 4 characters long');
}

module.exports = {
  User,
  createNewUser,
  retrieveUsers,
  findUserByUsername,
  updateOnlineStatus,
  updateStatusIcon,
  getStatusByUsername,
  validateUsernamePassword,
};
