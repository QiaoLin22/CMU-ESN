const router = require('express').Router();
const { authenticateUser } = require('../middleware/auth');

const userController = require('../controllers/user-controller');

router.post('/', authenticateUser, userController.createContact);

router.post('/sms', authenticateUser, userController.notifyEmergencyContact);

router.get('/', authenticateUser, userController.getAllContacts);

router.put('/', authenticateUser, userController.removeContact);

module.exports = router;
