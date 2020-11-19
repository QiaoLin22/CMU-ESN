const router = require('express').Router();
const { authenticateUser } = require('../middleware/auth');
const {upload, resize} = require('../middleware/upload');

const NewsController = require('../controllers/news-controller');


router.post('/', authenticateUser,upload.single('photo'), NewsController.createNews);

router.get(
  '/:cityname',
  authenticateUser,
  NewsController.getHistoricalNews
);

module.exports = router;
