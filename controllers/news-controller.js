const {
  createNewNews,
  getAllNews,
  getNewsByNewsId,
} = require('../models/news');
// const Users = require('../models/user');
const { createNewNewsMessage } = require('../models/message');

class NewsController {
  static createNews(req, res) {
    const { sender, message, zipCode } = req.body;
    let photo;
    if (req.file !== undefined) {
      photo = req.file.path;
    }
    createNewNews(sender, message, zipCode, photo)
      .then((newNews) => {
        req.app.get('io').emit('new news', newNews);
        res.status(201).send({ message: 'successfully create an news' });
      })
      .catch((e) => {
        res.status(400).json({ error: e });
      });
  }

  static getHistoricalNews(req, res) {
    const { zipcode } = req.params;
    getAllNews(zipcode).then((news) => res.send(news));
  }

  static async forwardNews(req, res) {
    const { sender, recipient, newsId, roomId } = req.body;
    if (!sender || !recipient || !newsId || !roomId) {
      res.status(400).end();
    } else {
      const news = await getNewsByNewsId(newsId);
      const message = news[0].message === '' ? ' ' : news[0].message;
      await createNewNewsMessage(
        sender,
        recipient,
        message,
        roomId,
        news[0].photo
      )
        .then((newMessage) => {
          req.app.get('io').in(roomId).emit('new private message', newMessage);
          req.app.get('io').emit('updateDirectory');
          res.status(201).send({ message: 'Forward Successfully' });
        })
        .catch((e) => {
          console.log(e);
          res.status(400).send(e);
        });
    }
  }
}

module.exports = NewsController;
