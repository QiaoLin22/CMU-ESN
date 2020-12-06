const router = require('express').Router();
const { authenticateUser } = require('../middleware/auth');
const { authenticateAnnouncement } = require('../middleware/announcementAuth');

const AnnouncementController = require('../controllers/announcement-controller');

router.post(
  '/',
  authenticateUser,
  authenticateAnnouncement,
  AnnouncementController.createAnnouncement
);

router.get(
  '/',
  authenticateUser,
  AnnouncementController.getHistoricalAnnouncements
);

module.exports = router;
