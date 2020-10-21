const mongoose = require('mongoose');
const reservedUsernames = require('../lib/reserved_usernames.json').usernames;
require('dotenv').config();

// const dbString = process.env.DB_STRING;

// mongoose
//   .connect(dbString, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .catch((e) => console.log(e));

const UserSchema = new mongoose.Schema({
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
  statusArray: [{
    timestamp: {type: String}, 
    status: {type: String}, 
}]
});

const User = mongoose.model('User', UserSchema);

function createNewUser(username, hash, salt) {
  const newUser = new User({
    username: username,
    hash,
    salt,
    online: false,
    status: 'Undefined',
    timestamp: new Date(Date.now()).toISOString(),
    statusArray:[{
      timestamp: new Date(Date.now()).toISOString(),
      status: 'Undefined'
    }]
  });

  return newUser.save();
}

function retrieveUsers() {
  return User.find(
    {},
    {},
    { sort: { online: -1, username: 1} }
  );
}

function findUserByUsername(username) {
  return User.findOne({ username: username });
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
  return User.findOneAndUpdate(
    { username: username },
    { $set: { status: status } },
    { $set: { timestamp: timestamp } }
  ).then((user) => {
    user.statusArray.push(objStatus);
    user.save();
  })
}

function getStatusByUsername(username) {
  return User.findOne({ username: username }, { status: 1 });
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
  validateUsernamePassword,
  updateStatusIcon,
  getStatusByUsername,
};
