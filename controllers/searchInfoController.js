const stopwords = require('../lib/stopwords.json').stopwords;
const Messages = require('../models/message');
const Users = require('../models/user');
const { extractUsernames } = require('../lib/room-id');
const Annoucement = require('../models/announcement');

function filterStopwords(keywords) {
  let filteredKeywords = keywords.filter(
    (keyword) => !stopwords.includes(keyword) && keyword !== ''
  );
  return filteredKeywords;
}

class searchInfoController {
  static searchMessage(req, res) {
    const { roomId } = req.params;
    const { keywords } = req.params;
    const { pagination } = req.params;
    const keywordsArray = keywords.split(/[^A-Za-z0-9]/);
    const filteredKeywords = filterStopwords(keywordsArray);
    console.log(roomId);
    if (filteredKeywords.length === 0)
      res.status(400).json({ error: 'no valid keyword' });
    else
      Messages.searchMessage(
        roomId,
        filteredKeywords,
        pagination
      ).then((data) => res.send(data));
  }

  static searchStatus(req, res) {
    const { roomId } = req.params;
    const { username } = res.locals;
    const { username1, username2 } = extractUsernames(roomId, username);
    const anotherUsername = username1 === username ? username2 : username1;
    Users.retrieveUserStatus(anotherUsername).then((data) => res.send(data));
  }

  static searchUser(req, res) {
    const { keywords } = req.params;
    if (keywords === 'OK' || keywords === 'Help' || keywords === 'Emergency') {
      Users.findUserByStatus(keywords).then((data) => res.send(data));
    } else {
      Users.findUserByKeyword(keywords).then((data) => res.send(data));
    }
  }

  static searchAnnouncement(req, res) {
    const { keywords } = req.params;
    const { pagination } = req.params;
    const keywordsArray = keywords.split(/[^A-Za-z0-9]/);
    const filteredKeywords = filterStopwords(keywordsArray);
    if (filteredKeywords.length === 0)
      res.status(400).json({ error: 'no valid keyword' });
    else
      Annoucement.searchAnnoucement(filteredKeywords, pagination).then((data) =>
        res.send(data)
      );
  }
}

module.exports = searchInfoController;
