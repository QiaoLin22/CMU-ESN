const {
  createNewNews,
  getAllNews,
} = require('../models/news');

class NewsController {
  static createNews(req, res) {
    const { sender, message, cityname } = req.body;
    console.log(cityname)
    createNewNews(sender, message, cityname)
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
    getAllNews(cityname).then((news) => console.log(news));//res.send(announcements));
  }
}

module.exports = NewsController;
