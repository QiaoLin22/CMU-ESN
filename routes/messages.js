const router = require('express').Router();
const { authenticateUser } = require('../middleware/authMiddleware');

const MessageController = require('../controllers/messageController');

router.post('/public', authenticateUser, MessageController.createMessage);

router.get('/public', authenticateUser, MessageController.getMessage);

router.get('/private', authenticateUser, MessageController.getMessage);

router.post('/private/{roomID}', authenticateUser, MessageController.createMessage);

module.exports = router;
