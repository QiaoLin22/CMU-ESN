const router = require('express').Router();
const { authenticateUser } = require('../middleware/authMiddleware');

const LoginController = require('../controllers/loginController');
const UserController = require('../controllers/userController');
const LogoutController = require('../controllers/logoutController');

router.get('/', authenticateUser, UserController.retrieveUsers);

router.post('/', UserController.createUser);

router.post('/login', LoginController.login);

router.put('/logout', authenticateUser, LogoutController.logout);

module.exports = router;
