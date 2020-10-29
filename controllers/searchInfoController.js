const stopwords = require('../lib/stopwords.json').stopwords;
const Messages = require('../models/message');

const Users = require('../models/user');


function filterStopwords(keywords) {
  let filteredKeywords = keywords.filter(
    keyword => !stopwords.includes(keyword) &&  keyword !== ''
  );
  return filteredKeywords.join(' ');
}

function getAnotherUsername(roomId, username){
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
    console.log(roomId);
    const keywordsArray = keywords.split(/[^A-Za-z0-9]/);
    const filteredKeywords = filterStopwords(keywordsArray);
    Messages.searchMessage(roomId, filteredKeywords).then((data)=>res.send(data));
  }

  static searchStatus(req, res) {
    const { roomId } = req.params;
    const { username } = res.locals;
    console.log(username);
    const anotherUsername = getAnotherUsername(roomId, username);
    Users.findUserStatus(anotherUsername).then((data)=>res.send(data));
   
  }
  
}

module.exports = searchInfoController;
