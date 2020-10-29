const router = require('express').Router();
const {
  authenticateUser,
  verifyRoomId,
} = require('../middleware/authMiddleware');

const SearchInfoController = require('../controllers/searchInfoController');

// router.post('/public', authenticateUser, MessageController.createPublicMessage);

router.get(
  '/messages/:roomId/:keywords',
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
module.exports = router;
