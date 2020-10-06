const router = require('express').Router();

const LoginController = require('../controllers/loginController');
const UserController = require('../controllers/userController');
const LogoutController = require('../controllers/logoutController');

router.post('/login', LoginController.login);

router.get('/logout', LogoutController.logout, (req, res) => {
  res.redirect('/');
});

router.get('/', UserController.retrieveUsers);

router.post('/', UserController.createUser);

module.exports = router;
