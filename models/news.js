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
    required: [true, 'Message is required'],
  },
  photo: {
    type: Buffer,
    required: true
  },
  photoType: {
    type: String,
    required: true
  },
  cityname:{
    type: String,
    required: [true, 'City name is required'],
  },
});

const News = mongoose.model('News', NewsSchema);

NewsSchema.virtual('photoPath').get(()=>{
  if (this.photo != null && this.photoType != null) {
    return `data:${this.photoType};charset=utf-8;base64,${this.photo.toString('base64')}`;
  }
});

function savePhoto(newNews, photoEncoded) {
  if (photoEncoded == null) return;
  const photo = JSON.parse(photoEncoded);
  if (photo != null && imageMimeTypes.includes(photo.type)) {
    newNews.photo = new Buffer.from(photo.data, 'base64');
    newNews.photoType = photo.type;
  }
}
function createNewNews(sender, message, cityname, photoEncoded) {
  const newNews= new News({
    sender: sender,
    message: message,
    cityname: cityname,
  });
  savePhoto(newNews, photoEncoded)
  return newNews.save();
}

function getAllNews(cityname) {
  //TODO: case insensitive search
  return News.find({ cityname:  { $regex : new RegExp(cityname, "i") }});
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
}*/

module.exports = {
  News,
  createNewNews,
  getAllNews,
  //searchAnnouncement,
};
