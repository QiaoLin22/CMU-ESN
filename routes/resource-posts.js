const router = require('express').Router();
const { authenticateUser } = require('../middleware/auth');

const ResourcePostController = require('../controllers/resource-post-controller');

router.post('/', authenticateUser, ResourcePostController.createResourcePost);

router.get('/', authenticateUser, ResourcePostController.getAllResourcePosts);

router.get(
  '/:postId',
  authenticateUser,
  ResourcePostController.getResourcePostById
);

router.post(
  '/:postId/comments',
  authenticateUser,
  ResourcePostController.createResourcePostComment
);

module.exports = router;
