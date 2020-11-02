const router = require('express').Router();
const { authenticateUser } = require('../middleware/auth');

const AnnouncementController = require('../controllers/announcement-controller');

router.post('/', authenticateUser, AnnouncementController.createAnnouncement);

router.get(
  '/',
  authenticateUser,
  AnnouncementController.getHistoricalAnnouncements
);

module.exports = router;
