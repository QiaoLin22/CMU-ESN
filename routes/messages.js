const router = require('express').Router();
const { authenticateUser } = require('../middleware/authMiddleware');

const MessageController = require('../controllers/messageController');

router.post('/public', authenticateUser, MessageController.createPublicMessage);

router.get('/public', authenticateUser, MessageController.getPublicMessage);

router.get('/private/:roomId', authenticateUser, MessageController.getPrivateMessage);

router.post('/private', authenticateUser, MessageController.createPrivateMessage);

module.exports = router;
