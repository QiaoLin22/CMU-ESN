const router = require('express').Router();
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/main', authenticateUser, (req, res) => {
  res.render('main');
});

router.get('/main/public', authenticateUser, (req, res) => {
  res.render('chat');
});

module.exports = router;
