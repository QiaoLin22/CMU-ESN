const fs = require('fs');
const {
  createNewNews,
  getAllNews,
  getNewsByNewsId,
} = require('../models/news');
//const Users = require('../models/user');
const {createNewNewsMessage} = require('../models/message');

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

  /*
  static getUserList(req, res){
    console.log(res.locals.username)
    Users.retrieveUsers(res.locals.username)
      .then((users) => res.status(200).json(users))
      .catch((err) => next(err));
  }*/
  

  static async forwardNews(req, res){
    const {sender, recipient, newsId} = req.body;
    const news = await getNewsByNewsId(newsId);
    const roomId =
    sender < recipient
      ? `${sender}${recipient}`
      : `${recipient}${sender}`;
    await createNewNewsMessage(sender, recipient, news[0].message, roomId, news[0].photo)
    .then((newMessage) => {
      req.app.get('io').in(roomId).emit('new private message', newMessage);
      req.app.get('io').emit('updateDirectory');
      res.status(201).send({ message: 'success' });
    })
    .catch((e) => {
      console.log(e);
      res.status(400).send(e);
    });
  }
}

module.exports = NewsController;
