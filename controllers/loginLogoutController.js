const {
  updateOnlineStatus,
  findUserByUsername,
  validateUsernamePassword,
} = require('../models/user');
const { validPassword, createToken } = require('../lib/utils');

class LoginLogoutController {
  static async login(req, res) {
    const { username, password } = req.body;

    try {
      const user = await findUserByUsername(username);

      // username does not exists
      if (!user) {
        validateUsernamePassword(username, password);
        // ask the user to confirm the creation of a new user
        res.status(200).send({ message: 'create new user?' });
      }

      // user exists, check if password is correct
      if (validPassword(password, user.hash, user.salt)) {
        // generate jwt and return it in response
        const token = createToken(user);
        const cookieMaxAge = 3 * 24 * 60 * 60;
        res.cookie('jwt', token, {
          maxAge: cookieMaxAge * 1000,
        });

        updateOnlineStatus(username, true).then(() => {
          req.io.emit('updateDirectory');
          res.location('/main').json({});
        });
      } else {
        res.status(400).json({
          error: 'Password incorrect',
        });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static logout(req, res) {
    const { username } = res.locals;
    updateOnlineStatus(username, false)
      .then(() => {
        req.io.emit('updateDirectory');
        res.status(200).end();
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
  }
}

module.exports = LoginLogoutController;
