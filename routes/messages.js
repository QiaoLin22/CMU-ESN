const router = require('express').Router();
const MessageController = require('../controllers/messageController');

router.post('/public', MessageController.createMessage);

router.get('/public', MessageController.getMessage);

module.exports = router;
