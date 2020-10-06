const router = require('express').Router();
const { authenticateUser } = require('../middleware/authMiddleware');

const LoginController = require('../controllers/loginController');
const UserController = require('../controllers/userController');
const LogoutController = require('../controllers/logoutController');

router.get('/', authenticateUser, UserController.retrieveUsers);

router.post('/', authenticateUser, UserController.createUser);

router.post('/login', LoginController.login);

router.get('/logout', authenticateUser, LogoutController.logout, (req, res) => {
  res.redirect('/');
});

module.exports = router;
