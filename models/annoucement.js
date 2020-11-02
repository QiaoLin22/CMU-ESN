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

  return Announcement.save();
}

function getAllAnnouncements() {
  return Message.find({});
}

module.exports = {
  Announcement,
  createNewAnnouncement,
  getAllAnnouncements,
};
