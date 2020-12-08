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
  },
  photo: {
    type: String,
  },
  zipcode: {
    type: String,
    required: [true, 'Zip code is required'],
  },
});

const News = mongoose.model('News', NewsSchema);

function createNewNews(sender, message, zipcode, photo) {
  const newNews = new News({
    sender: sender,
    message: message,
    zipcode: zipcode,
    photo: photo,
  });
  return newNews.save();
}

function getAllNews(zipcode) {
  // TODO: case insensitive search
  return News.find({ zipcode: zipcode });
}

function getNewsByNewsId(newsId) {
  return News.find({ _id: newsId });
}

module.exports = {
  News,
  createNewNews,
  getAllNews,
  getNewsByNewsId,
};
