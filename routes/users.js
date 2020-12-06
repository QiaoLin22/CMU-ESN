const router = require('express').Router();
const { authenticateUser } = require('../middleware/auth');
const RBAC = require('../middleware/RBAC');

const LoginLogoutController = require('../controllers/login-logout-controller');
const UserController = require('../controllers/user-controller');
const MapController = require('../controllers/map-controller');

router.get('/', authenticateUser, UserController.retrieveUsers);

router.get('/locations', authenticateUser, MapController.retrieveLocations);

router.get('/location', authenticateUser, MapController.retrieveLocation);

router.get(
  '/profile/:username',
  authenticateUser,
  UserController.getUserProfile
);

router.post('/', UserController.createUser);

router.post('/login', LoginLogoutController.login);

router.post('/location', authenticateUser, MapController.updateLocation);

router.put('/logout', authenticateUser, LoginLogoutController.logout);

router.put('/', authenticateUser, UserController.updateStatus);

router.put('/location', authenticateUser, MapController.deleteLocation);

router.put(
  '/:username/profile',
  authenticateUser,
  RBAC.validateAdministrator,
  UserController.updateUserProfile
);

router.get('/:username/zip', authenticateUser, UserController.getZip);

router.put('/:username/zip', authenticateUser, UserController.updateZip);

module.exports = router;
