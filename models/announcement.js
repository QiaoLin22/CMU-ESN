const mongoose = require('mongoose');

const AnnouncementSchema = mongoose.Schema({
  sender: {
    type: String,
    required: [true, 'Sender is required'],
  },
  timestamp: {
    type: String,
    required: [true, 'Timestamp is required'],
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
    timestamp: new Date(Date.now()).toISOString(),
    message: message,
  });

  return newAnnouncement.save();
}

function getAllAnnouncements() {
  return Announcement.find({});
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
