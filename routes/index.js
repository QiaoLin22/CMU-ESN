const router = require('express').Router();
const { authenticateUser, verifyRoomId } = require('../middleware/auth');
const RBAC = require('../middleware/RBAC');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/main', authenticateUser, (req, res) => {
  res.render('main', { username: res.locals.username });
});

router.get('/announcement', authenticateUser, (req, res) => {
  res.render('announcements');
});

router.get('/map', authenticateUser, (req, res) => {
  res.render('map');
});
router.get('/news', authenticateUser, (req, res) => {
  res.render('news', { username: res.locals.username });
});

router.get(
  '/profile',
  authenticateUser,
  RBAC.accessPrivilegeLevel,
  (req, res) => {
    res.render('profile', {
      username: res.locals.username,
      privilegeLevel: req.privilegeLevel,
    });
  }
);

router.get('/profile/emergency', authenticateUser, (req, res) => {
  res.render('emergency-contact', { username: res.locals.username });
});

router.get('/public-wall', authenticateUser, (req, res) => {
  res.render('chat', { username: res.locals.username });
});

router.get(
  '/private-chat/:roomId',
  authenticateUser,
  verifyRoomId,
  (req, res) => {
    res.render('chat', { username: res.locals.username });
  }
);

router.get('/search', authenticateUser, (req, res) => {
  res.render('search', { username: res.locals.username });
});

router.get('/resources', authenticateUser, (req, res) => {
  res.render('resources', { username: res.locals.username });
});

router.get('/resources/posts/:postId', authenticateUser, (req, res) => {
  res.render('resource-post', { username: res.locals.username });
});

router.get(
  '/administrator',
  authenticateUser,
  RBAC.validateAdministrator,
  (req, res) => {
    res.render('administrator', {
      username: res.locals.username,
    });
  }
);

module.exports = router;
