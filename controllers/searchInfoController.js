const stopwords = require('../lib/stopwords.json').stopwords;
const {
  getHistoricalMessages,
  createNewMessage,
  checkUnreadMessage,
  updateAllToRead,
} = require('../models/message');

class searchInfoController {
  static searchMessage(req, res) {
    const { roomId } = req.params;
    const { keywords } = req.params;

    console.log(keywords);
  }
  static filterStopwords(keywords) {
    let filteredKeywords = keywords.filter(
      (keyword) => !stopwords.includes(keyword)
    );
    console.log(filteredKeywords);
  }
}

module.exports = searchInfoController;
