const mongoose = require('mongoose');

const NewsSchema = mongoose.Schema({
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
    // required: [true, 'Message is required'],
  },
  photo: {
    // data: Buffer,
    // contentType: String,
    type: String,
  },
  cityname: {
    type: String,
    required: [true, 'City name is required'],
  },
});

const News = mongoose.model('News', NewsSchema);

function createNewNews(sender, message, cityname, photo) {
  const newNews = new News({
    sender: sender,
    message: message,
    cityname: cityname,
    photo: photo,
  });
  return newNews.save();
}

function getAllNews(cityname) {
  // TODO: case insensitive search
  return News.find({ cityname: { $regex: new RegExp(cityname, 'i') } });
}

function getNewsByNewsId(newsId) {
  return News.find({ _id: newsId });
}
/*
function searchAnnouncement(filteredKeywords, pagination) {
  const query = [];
  filteredKeywords.forEach((keyword) => {
    query.push({ message: { $regex: keyword, $options: 'i' } });
  });
  return Announcement.find({ $and: query })
    .sort({ timestamp: -1 })
    .skip(pagination * 10)
    .limit(10);
} */

module.exports = {
  News,
  createNewNews,
  getAllNews,
  getNewsByNewsId,
  // searchAnnouncement,
};
