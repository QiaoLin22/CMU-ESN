const mongoose = require('mongoose');
const reservedUsernames = require('../lib/reserved-usernames.json').usernames;

const userSchema = mongoose.Schema({
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
  zip: String,
});

class UserClass {
  static createNewUser(username, hash, salt) {
    return this.create({
      username,
      hash,
      salt,
    });
  }

  static retrieveUsers(username) {
    return this.aggregate([
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

  static findUserByUsername(username) {
    return this.findOne({ username: username }, { _id: 0, __v: 0 });
  }

  static updateOnlineStatus(username, online) {
    return this.updateOne(
      { username: username }, // Filter
      { $set: { online: online } } // Update
    );
  }

  static updateStatusIcon(username, status) {
    const timestamp = new Date(Date.now()).toISOString();
    const objStatus = { timestamp: timestamp, status: status };
    return this.update(
      { username: username },
      { $push: { statusArray: objStatus } }
    );
  }

  static async getStatusByUsername(username) {
    const result = await this.aggregate([
      { $match: { username: username } },
      { $project: { status: { $arrayElemAt: ['$statusArray', -1] } } },
    ]);

    return result[0].status;
  }

  static validateUsernamePassword(username, password) {
    if (!username.length >= 3)
      throw Error('Username should be at least 3 characters long');

    if (reservedUsernames.includes(username))
      throw Error('Username is reserved');

    if (!password.length >= 4)
      throw Error('Passwords should be at least 4 characters long');
  }

  static retrieveUserStatus(username) {
    return this.find({ username: username }, { statusArray: { $slice: -10 } });
  }

  static findUserByKeyword(keyword) {
    return this.find(
      { username: { $regex: keyword } },
      { _id: 0, __v: 0 },
      { sort: { online: -1, username: 1 } }
    );
  }

  static findUserByStatus(keyword) {
    return this.find(
      {
        $expr: {
          $eq: [{ $arrayElemAt: ['$statusArray.status', -1] }, keyword],
        },
      },
      { _id: 0, __v: 0 },
      { sort: { online: -1, username: 1 } }
    );
  }

  static getZip(username) {
    return this.findOne({ username }, { zip: 1 });
  }

  static updateZip(username, zip) {
    console.log(zip);
    return this.updateOne({ username }, { $set: { zip } });
  }
}

userSchema.loadClass(UserClass);

const User = mongoose.model('User', userSchema);

module.exports = User;
