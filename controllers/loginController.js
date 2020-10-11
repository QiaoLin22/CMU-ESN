const {
  updateOnlineStatus,
  findUserByUsername,
  validateUsernamePassword,
} = require('../models/user');
const { validPassword, createToken } = require('../lib/utils');

function changeLoginStatus(username, io) {
  updateOnlineStatus()
    .then((obj) => {
      console.log(`Updated online status: ${obj}`);
      io.emit('updateDirectory');
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
}

class LoginController {
  static async login(req, res, next) {
    const { username, password } = req.body;

    try {
      const user = await findUserByUsername(username);
      // if (err) return next(err);

      // username does not exists
      if (!user) {
        try {
          validateUsernamePassword(username, password);
          // ask the user to confirm the creation of a new user
          res.status(200).send({ message: 'create new user?' });
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      }

      // user exists, check if password is correct
      if (validPassword(password, user.hash, user.salt)) {
        // generate jwt and return it in response
        const token = createToken(user);
        const cookieMaxAge = 3 * 24 * 60 * 60;
        res.cookie('jwt', token, {
          maxAge: cookieMaxAge * 1000,
        });
        changeLoginStatus(username, req.io);
        res.location('/main').json({});
      } else {
        res.status(400).json({
          error: 'Password incorrect',
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = LoginController;
