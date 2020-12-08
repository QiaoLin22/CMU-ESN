const router = require('express').Router();
const { authenticateUser } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const NewsController = require('../controllers/news-controller');

router.get('/:zipcode', authenticateUser, NewsController.getHistoricalNews);

// router.get('/users',  authenticateUser, NewsController.getUserList);

router.post(
  '/',
  authenticateUser,
  upload.single('photo'),
  NewsController.createNews
);

router.post(
  '/forward',
  authenticateUser,
  upload.single('photo'),
  NewsController.forwardNews
);

module.exports = router;
