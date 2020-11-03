const router = require('express').Router();
const { authenticateUser } = require('../middleware/auth');

const LoginLogoutController = require('../controllers/login-logout-controller');
const UserController = require('../controllers/user-controller');

router.get('/', authenticateUser, UserController.retrieveUsers);

router.post('/', UserController.createUser);

router.post('/login', LoginLogoutController.login);

router.put('/logout', authenticateUser, LoginLogoutController.logout);

router.put('/', UserController.updateStatus);

module.exports = router;
