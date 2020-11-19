const fs = require('fs');
const {
  createNewNews,
  getAllNews,
} = require('../models/news');

class NewsController {
  static createNews(req, res) {
    const { sender, message, cityname  } = req.body;
    var img = fs.readFileSync(req.file.path);
    //var encodePhoto = img.toString('base64');
    var photo = {
      data:  Buffer.from(img, 'binary'),
      contentType: req.file.mimetype
   };
    createNewNews(sender, message, cityname, photo )
      .then((newNews) => {
        req.app.get('io').emit('new news', newNews);
        res
          .status(201)
          .send({ message: 'successfully create an news' });
      })
      .catch((e) => {
        res.status(400).json({ error: e });
      });
  }

  static getHistoricalNews(req, res) {
    const { cityname } = req.params;
    getAllNews(cityname).then((news) => res.send(news));
  }
}

module.exports = NewsController;
