const router = require('express').Router();
const { authenticateUser } = require('../middleware/authMiddleware');

const MessageController = require('../controllers/messageController');

router.post('/public', authenticateUser, MessageController.createMessage);

router.get('/public', authenticateUser, MessageController.getMessage);

module.exports = router;
