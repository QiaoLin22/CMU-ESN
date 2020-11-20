const router = require('express').Router();
const { authenticateUser } = require('../middleware/auth');

const contactController = require('../controllers/contact-controller');

router.post('/', authenticateUser, contactController.createContact);

router.post('/sms', authenticateUser, contactController.notifyEmergencyContact);

router.get('/', authenticateUser, contactController.getAllContacts);

router.put('/', authenticateUser, contactController.removeContact);

module.exports = router;
