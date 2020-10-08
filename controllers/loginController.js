const User = require('../models/user');
const { validPassword } = require('../lib/utils');
const { createToken } = require('../lib/utils');
const reservedUsernames = require('../lib/reserved_usernames.json').usernames;

function isValidUsername(username) {
  return username.length >= 3;
}

function isValidPassword(password) {
  return password.length >= 4;
}

function isNotBannedUsername(username) {
  return !reservedUsernames.includes(username);
}
function changeLoginStatus(username, io) {
  User.updateOne(
    { username: username }, // Filter
    { $set: { online: true } } // Update
  )
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
  static login(req, res, next) {
    const { username, password } = req.body;

    User.findOne({ username: username }, (err, user) => {
      if (err) return next(err);

      // username does not exists
      if (!user) {
        if (!isValidUsername(req.body.username)) {
          return res.status(400).json({
            error: 'Username should be at least 3 characters long',
          });
        }
        if (!isNotBannedUsername(req.body.username)) {
          return res.status(400).json({
            error: 'Username is reserved',
          });
        }
        if (!isValidPassword(req.body.password)) {
          return res.status(400).json({
            error: 'Passwords should be at least 4 characters long',
          });
        }

        // ask the user to confirm the creation of a new user
        return res.status(200).send({ message: 'create new user?' });
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
        return res.location('/main').end();
      } else {
        return res.status(400).json({
          error: 'Password incorrect',
        });
      }
    });
  }
}

module.exports = LoginController;
