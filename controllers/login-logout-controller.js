const User = require('../models/user');
const { validatePassword } = require('../lib/password');
const { createToken } = require('../lib/jwt');

class LoginLogoutController {
  static async login(req, res) {
    const { username, password } = req.body;

    try {
      const user = await User.findUserByUsername(username);

      // username does not exists
      if (!user) {
        User.validateUsername(username);
        User.validatePassword(password);
        // ask the user to confirm the creation of a new user
        res.status(200).send({ message: 'create new user?' });
      }
      // user exists, check if password is correct
      else if (validatePassword(password, user.hash, user.salt)) {
        // generate jwt and return it in response
        const token = createToken(user);
        const cookieMaxAge = 3 * 24 * 60 * 60;
        res.cookie('jwt', token, {
          maxAge: cookieMaxAge * 1000,
        });

        User.updateOnlineStatus(username, true).then(() => {
          req.app.get('io').emit('updateDirectory');
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
    User.updateOnlineStatus(username, false)
      .then(() => {
        req.app.get('io').emit('updateDirectory');
        res.status(200).end();
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
  }
}

module.exports = LoginLogoutController;
