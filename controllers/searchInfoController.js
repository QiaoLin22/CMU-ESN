const stopwords = require('../lib/stopwords.json').stopwords;
const Messages = require('../models/message');
const Users = require('../models/user');
const Annoucement = require('../models/announcement');

function filterStopwords(keywords) {
  let filteredKeywords = keywords.filter(
    (keyword) => !stopwords.includes(keyword) && keyword !== ''
  );
  return filteredKeywords;
}

function getAnotherUsername(roomId, username) {
  const usernameIndex = roomId.indexOf(username);
  let otherUsername;

  if (usernameIndex > -1) {
    if (usernameIndex === 0) {
      otherUsername = roomId.substring(username.length);
    } else {
      otherUsername = roomId.substring(0, usernameIndex);
    }
  }
  return otherUsername;
}

class searchInfoController {
  static searchMessage(req, res) {
    const { roomId } = req.params;
    const { keywords } = req.params;
    const { pagination } = req.params;
    const keywordsArray = keywords.split(/[^A-Za-z0-9]/);
    const filteredKeywords = filterStopwords(keywordsArray);
    Messages.searchMessage(roomId, filteredKeywords, pagination).then((data)=>res.send(data));
  }

  static searchStatus(req, res) {
    const { roomId } = req.params;
    const { username } = res.locals;
    const anotherUsername = getAnotherUsername(roomId, username);
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

  static searchAnnouncement(req, res){
    const { keywords } = req.params;
    const { pagination } = req.params;
    const keywordsArray = keywords.split(/[^A-Za-z0-9]/);
    const filteredKeywords = filterStopwords(keywordsArray);
    Annoucement.searchAnnoucement(filteredKeywords, pagination).then((data)=>res.send(data));
  }
}

module.exports = searchInfoController;
