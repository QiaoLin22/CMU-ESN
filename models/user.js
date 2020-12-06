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
  emergencyContact: {
    type: [
      {
        name: {
          type: String,
        },
        phone: { type: String },
      },
    ],
    default: [],
  },
  location: {
    longitude: { type: Number },
    latitude: { type: Number },
  },
  accountStatus: {
    type: Boolean,
    required: [true, 'Account Status is required'],
    default: true,
  },
  privilegeLevel: {
    type: String,
    enum: ['Citizen', 'Coordinator', 'Administrator'],
    default: 'Citizen',
    required: [true, 'Privilege Level is required'],
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

  static async retrieveUsers(username) {
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

  static validateUsername(username) {
    if (!username) throw Error('Username needed');

    if (username.length < 3)
      throw Error('Username should be at least 3 characters long');

    if (reservedUsernames.includes(username))
      throw Error('Username is reserved');
  }

  static validatePassword(password) {
    if (!password) throw Error('Password needed');
    if (password.length < 4)
      throw Error('Password should be at least 4 characters long');
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

  static updateUserLocation(username, lo, la) {
    const newLocation = { longitude: lo, latitude: la };
    return this.updateOne(
      { username: username }, // Filter
      { $set: { location: newLocation } } // Update
    );
  }

  static createNewEmergencyContact(username, name, phone) {
    const newContact = { name: name, phone: phone };
    return this.update(
      { username: username },
      { $push: { emergencyContact: newContact } }
    );
  }

  static removeEmergencyContact(username, name) {
    return this.update(
      { username: username },
      { $pull: { emergencyContact: { name: name } } }
    );
  }

  static getEmergencyContacts(username) {
    return this.find({ username: username }, { _id: 0, emergencyContact: 1 });
  }

  static retrieveUserLocations() {
    return this.aggregate([
      { $match: { location: { $ne: null } } },
      {
        $project: {
          username: 1,
          location: 1,
          status: { $arrayElemAt: ['$statusArray', -1] },
        },
      },
    ]);
  }

  static retrieveUserLocation(username) {
    return this.findOne({ username: username }, { location: 1 });
  }

  static deleteUserLocations(username) {
    return this.updateOne({ username: username }, { $unset: { location: '' } });
  }

  static getUserProfile(username) {
    return this.findOne(
      { username: username },
      { username: 1, privilegeLevel: 1, accountStatus: 1 }
    );
  }

  static updateUserProfile(username, newProfile) {
    return this.updateOne(
      { username }, // Filter
      {
        $set: newProfile,
      }, // Update
      { runValidators: true }
    );
  }
}

userSchema.loadClass(UserClass);

const User = mongoose.model('User', userSchema);

module.exports = User;
