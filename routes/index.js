const router = require('express').Router();
const {
  authenticateUser,
  verifyRoomId,
} = require('../middleware/authMiddleware');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/main', authenticateUser, (req, res) => {
  res.render('main', { username: res.locals.username });
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

router.get('/private/:roomId/search', authenticateUser, (req, res) => {
  res.render('search', { username: res.locals.username });
});
module.exports = router;
