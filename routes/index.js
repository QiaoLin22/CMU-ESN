const router = require('express').Router();
const { requireAuth } = require('../middleware/authmiddleware');

const LoginController = require('../controllers/loginController');
const UserController = require('../controllers/userController');
const LogoutController = require('../controllers/logoutController');

router.get('/main', requireAuth, (req, res) => {
  res.render('main')
});

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/api/login', LoginController.login);

router.get('/api/logout', LogoutController.logout,(req,res) => {
  res.redirect('/')
});

router.post('/api/users', UserController.createUser);

module.exports = router;
