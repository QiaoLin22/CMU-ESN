const router = require('express').Router();
const { requireAuth } = require('../middleware/authmiddleware');
const { getUsername } = require('../middleware/getUsername');

const LoginController = require('../controllers/loginController');
const UserController = require('../controllers/userController');
const MessageController = require('../controllers/messageController');

router.get('/main', requireAuth, (req, res) => {
  res.render('main');
});

router.get('/main/public', requireAuth, getUsername, (req, res) => {
  const authUsername = res.locals.username;
  res.render('chat', { username: authUsername });
});

router.get('/messages/public', MessageController.getMessage);

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/api/login', LoginController.login);

router.post('/api/users', UserController.createUser);

router.post('/messages/public', MessageController.createMessage);

module.exports = router;
