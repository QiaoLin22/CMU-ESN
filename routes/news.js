const router = require('express').Router();
const { authenticateUser } = require('../middleware/auth');

const NewsController = require('../controllers/news-controller');

router.post('/', authenticateUser, NewsController.createNews);

router.get(
  '/:cityname',
  authenticateUser,
  NewsController.getHistoricalNews
);

module.exports = router;
