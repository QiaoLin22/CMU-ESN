const router = require('express').Router();
const { authenticateUser } = require('../middleware/auth');

const LoginLogoutController = require('../controllers/login-logout-controller');
const UserController = require('../controllers/user-controller');
const MapController = require('../controllers/map-controller');

router.get('/', authenticateUser, UserController.retrieveUsers);

router.get('/locations', authenticateUser, MapController.retrieveLocations);

router.get('/location', authenticateUser, MapController.retrieveLocation);

router.post('/', UserController.createUser);

router.post('/login', LoginLogoutController.login);

router.post('/location', MapController.updateLocation);

router.put('/logout', authenticateUser, LoginLogoutController.logout);

router.put('/', UserController.updateStatus);

router.put('/location', MapController.deleteLocation);
router.get('/:username/zip', UserController.getZip);

router.put('/:username/zip', UserController.updateZip);

module.exports = router;
