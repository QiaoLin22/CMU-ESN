const router = require('express').Router();
const { authenticateUser, verifyRoomId } = require('../middleware/auth');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/main', authenticateUser, (req, res) => {
  res.render('main', { username: res.locals.username });
});

router.get('/announcement', authenticateUser, (req, res) => {
  res.render('announcements');
});

router.get('/news', authenticateUser, (req, res) => {
  res.render('news', { username: res.locals.username });
});

router.get('/profile', authenticateUser, (req, res) => {
  res.render('profile', { username: res.locals.username });
});

router.get('/public-wall', authenticateUser, (req, res) => {
  res.render('chat', { username: res.locals.username });
});

router.get(
  '/private-chat/:roomId',
  authenticateUser,
  verifyRoomId,
  (req, res) => {
    res.render('chat', { username: res.locals.username });
  }
);

router.get('/search', authenticateUser, (req, res) => {
  res.render('search', { username: res.locals.username });
});

module.exports = router;
