const router = require('express').Router();
const {
  authenticateUser,
  verifyRoomId,
} = require('../middleware/authMiddleware');

const MessageController = require('../controllers/messageController');

router.post('/public', authenticateUser, MessageController.createPublicMessage);

router.get('/public', authenticateUser, MessageController.getPublicMessage);

router.get(
  '/private/:roomId',
  authenticateUser,
  verifyRoomId,
  MessageController.getPrivateMessage
);

router.post(
  '/private',
  authenticateUser,
  MessageController.createPrivateMessage
);

router.get(
  '/unread/:otherUsername',
  authenticateUser,
  MessageController.checkUnreadMessage
);

router.put('/:roomId/read',
authenticateUser,
MessageController.updateReadStatus
);

module.exports = router;
