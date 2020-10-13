const router = require('express').Router();
const { authenticateUser } = require('../middleware/authMiddleware');

const LoginLogoutController = require('../controllers/loginLogoutController');
const UserController = require('../controllers/userController');

router.get('/', authenticateUser, UserController.retrieveUsers);

router.post('/', UserController.createUser);

router.post('/login', LoginLogoutController.login);

router.put('/logout', authenticateUser, LoginLogoutController.logout);

module.exports = router;
