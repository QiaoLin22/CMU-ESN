const mongoose = require('mongoose');
const reservedUsernames = require('../lib/reserved-usernames.json').usernames;

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
        timestamp: () => new Date(Date.now()).toISOString(),
        status: 'Undefined',
      },
    ],
  },
  emergencyContact: {
    type: [
      {
        name: {
          type: String,
          unique: true,
        },
        phone: { type: String },
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
        timestamp: () => new Date(Date.now()).toISOString(),
        status: 'Undefined',
      },
    ],
    emergencyContact: [],
  });

  return newUser.save();
}

async function retrieveUsers(username) {
  return User.aggregate([
    {
      $lookup: {
        from: 'messages',
        let: { curr_username: '$username' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$recipient', username] },
                  { $eq: ['$sender', '$$curr_username'] },
                  { $eq: ['$read', false] },
                ],
              },
            },
          },
        ],
        as: 'unreadMessages',
      },
    },
    {
      $project: {
        username: 1,
        online: 1,
        latestStatus: { $arrayElemAt: ['$statusArray', -1] },
        numUnreadMessages: { $size: '$unreadMessages' },
      },
    },
    { $sort: { online: -1, username: 1 } },
  ]);
}

function findUserByUsername(username) {
  return User.findOne({ username: username }, { _id: 0, __v: 0 });
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
  );
}

function createNewEmergencyContact(username, name, phone) {
  const newContact = { name: name, phone: phone };
  console.log(`create ${name}`);
  return User.update(
    { username: username },
    { $push: { emergencyContact: newContact } }
  );
}

function removeEmergencyContact(username, name) {
  console.log(`remove ${name}`);
  return User.update(
    { username: username },
    { $pull: { emergencyContact: { name: name } } }
  );
}

function getEmergencyContacts(username) {
  return User.find({ username: username }, { emergencyContact: 1 });
}

async function getStatusByUsername(username) {
  const result = await User.aggregate([
    { $match: { username: username } },
    { $project: { status: { $arrayElemAt: ['$statusArray', -1] } } },
  ]);

  return result[0].status;
}

function validateUsernamePassword(username, password) {
  if (!username.length >= 3)
    throw Error('Username should be at least 3 characters long');

  if (reservedUsernames.includes(username)) throw Error('Username is reserved');

  if (!password.length >= 4)
    throw Error('Passwords should be at least 4 characters long');
}

function retrieveUserStatus(username) {
  return User.find({ username: username }, { statusArray: { $slice: -10 } });
}

function findUserByKeyword(keyword) {
  return User.find(
    { username: { $regex: keyword } },
    { _id: 0, __v: 0 },
    { sort: { online: -1, username: 1 } }
  );
}

function findUserByStatus(keyword) {
  return User.find(
    {
      $expr: { $eq: [{ $arrayElemAt: ['$statusArray.status', -1] }, keyword] },
    },
    { _id: 0, __v: 0 },
    { sort: { online: -1, username: 1 } }
  );
}

module.exports = {
  User,
  createNewUser,
  retrieveUsers,
  findUserByUsername,
  updateOnlineStatus,
  updateStatusIcon,
  getStatusByUsername,
  createNewEmergencyContact,
  removeEmergencyContact,
  getEmergencyContacts,
  validateUsernamePassword,
  retrieveUserStatus,
  findUserByKeyword,
  findUserByStatus,
};
