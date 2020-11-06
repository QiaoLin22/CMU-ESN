const router = require('express').Router();
const { authenticateUser, verifyRoomId } = require('../middleware/auth');

const SearchInfoController = require('../controllers/searchInfoController');

// router.post('/public', authenticateUser, MessageController.createPublicMessage);

router.get(
  '/messages/:roomId/:keywords/:pagination',
  authenticateUser,
  verifyRoomId,
  SearchInfoController.searchMessage
);

router.get(
  '/messages/:roomId',
  authenticateUser,
  verifyRoomId,
  SearchInfoController.searchStatus
);

router.get(
  '/users/:keywords',
  authenticateUser,
  SearchInfoController.searchUser
);

router.get(
  '/announcements/:keywords/:pagination',
  authenticateUser,
  SearchInfoController.searchAnnouncement
)

module.exports = router;
