const router = require('express').Router();
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/', authenticateUser, (req, res) => {
  res.redirect('/main');
});

router.get('/main', authenticateUser, (req, res) => {
  res.render('main', { username: res.locals.username });
});

router.get('/public-wall', authenticateUser, (req, res) => {
  res.render('chat', { username: res.locals.username });
});

module.exports = router;
