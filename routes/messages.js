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

router.get(
  '/announcements',
  authenticateUser,
  MessageController.getAnnouncement
);

router.post(
  '/private/:roomId',
  authenticateUser,
  verifyRoomId,
  MessageController.createPrivateMessage
);

router.post(
  '/announcements',
  authenticateUser,
  MessageController.createNewAnnouncement
);

router.put(
  '/:roomId/read',
  authenticateUser,
  MessageController.updateReadStatus
);

module.exports = router;
