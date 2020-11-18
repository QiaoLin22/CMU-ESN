const router = require('express').Router();
const { authenticateUser } = require('../middleware/auth');

const LoginLogoutController = require('../controllers/login-logout-controller');
const UserController = require('../controllers/user-controller');

router.get('/', authenticateUser, UserController.retrieveUsers);

router.get('/locations', authenticateUser, UserController.retrieveLocations);

router.get('/location', authenticateUser, UserController.retrieveLocation);

router.post('/', UserController.createUser);

router.post('/login', LoginLogoutController.login);

router.post('/location', UserController.updateLocation);

router.put('/logout', authenticateUser, LoginLogoutController.logout);

router.put('/', UserController.updateStatus);

router.put('/location', UserController.deleteLocation);

module.exports = router;
