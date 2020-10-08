const router = require('express').Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const { getUsername } = require('../middleware/getUsername');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/main', authenticateUser, (req, res) => {
  res.render('main');
});

router.get('/main/public', authenticateUser, getUsername, (req, res) => {
  res.render('chat', { username: res.locals.username });
});

module.exports = router;
