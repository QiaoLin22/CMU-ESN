const router = require('express').Router();
const { authenticateUser, verifyRoomId } = require('../middleware/auth');

const MessageController = require('../controllers/message-controller');

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
  verifyRoomId,
  MessageController.createPrivateMessage
);

router.put(
  '/:roomId/read',
  authenticateUser,
  MessageController.updateReadStatus
);

router.get(
  '/unread/:otherUsername',
  authenticateUser,
  MessageController.checkExistingUnreadMessage
);

module.exports = router;
