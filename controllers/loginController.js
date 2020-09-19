const User = require("../models/user");
const validPassword = require("../lib/utils").validPassword;
const createToken = require("../lib/utils").createToken;
const reserved_usernames = require("../lib/reserved_usernames.json").usernames;

function isValidUsername(username) {
  return username.length >= 3 && !reserved_usernames.includes(username);
}

class LoginController {
  static login(req, res, next) {
    const { username, password } = req.body;

    User.findOne({ username: username }, (err, user) => {
      if (err) return next(err);

      // username does not exists
      if (!user) {
        console.log("username does not exists");

        if (isValidUsername(req.body.username)) {
          // ask the user to confirm the creation of a new user
          console.log("create new user?");
          return res.status(200).send("create new user?");
        } else {
          // prompt user to re-enter
          return res.status(400).json({
            error: "Username is reserved",
          });
        }
      }

      // user exists, check if password is correct
      if (validPassword(password, user.hash, user.salt)) {
        console.log("authenticated");

        // TODO: generate jwt and return it in response
        const token = createToken(user._id);
        const cookieMaxAge = 3 * 24 * 60 * 60;
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: cookieMaxAge * 1000,
        });
        return res.status(201).json({
          success: true,
          user: user._id,
          msg: "Token created",
          token: token,
        });
      } else {
        return res.status(400).json({
          error: "Password incorrect",
        });
      }
    });
  }
}

module.exports = LoginController;
