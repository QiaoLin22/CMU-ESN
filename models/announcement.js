const mongoose = require('mongoose');
const User = require('./user');

const AnnouncementSchema = mongoose.Schema({
  sender: {
    type: String,
    required: [true, 'Sender is required'],
  },
  timestamp: {
    type: String,
    required: [true, 'Timestamp is required'],
    default: () => new Date(Date.now()).toISOString(),
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

function createNewAnnouncement(sender, message) {
  const newAnnouncement = new Announcement({
    sender: sender,
    message: message,
  });

  return newAnnouncement.save();
}

async function getAllAnnouncements() {
  const active = [];
  await User.getActiveUsers()
    .then((activeUsers) => {
      activeUsers.forEach((data) => active.push(data.username));
    })
    .catch((e) => {
      console.log(e);
    });

  return Announcement.find({})
    .then((datas) => {
      const result = datas.filter((data) => active.includes(data.sender));
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
}

function searchAnnouncement(filteredKeywords, pagination) {
  const query = [];
  filteredKeywords.forEach((keyword) => {
    query.push({ message: { $regex: keyword, $options: 'i' } });
  });
  return Announcement.find({ $and: query })
    .sort({ timestamp: -1 })
    .skip(pagination * 10)
    .limit(10);
}

module.exports = {
  Announcement,
  createNewAnnouncement,
  getAllAnnouncements,
  searchAnnouncement,
};
