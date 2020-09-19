const passport = require("passport");
const createToken = require("../lib/utils").createToken;

function isValidUsername(username) {
    return false;
}

const postIndex = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      // username exists, password incorrect, prompt user to re-enter
      if (info.usernameExists) {
        return res.status(400).json({
          error: "Password incorrect",
        });
      }
      // username doesn't exist, check new username
      else {
        console.log("username does not exists");
        if (isValidUsername(req.body.username)) {
          // ask the user to confirm the creation of a new user
          console.log("create new user?");
          return res.status(200).send("create new user?");
        } else {
          // prompt user to re-enter
          console.log(info.message);
          return res.status(400).json({
            error: "Username is reserved",
          });
        }
      }
    }

    // user authenticated
    console.log("authenticated");
    req.logIn(user, { session: false }, (err) => {
      if (err) return next(err);

      // TODO: generate jwt and return it in response
      const token = createToken(user._id);
      const cookieMaxAge = 3 * 24 * 60 * 60;
      res.cookie("jwt", token, { httpOnly: true, maxAge: cookieMaxAge * 1000 });
      return res.status(201).json({
        success: true,
        user: user._id,
        msg: "Token created",
        token: token,
      });

      return res.redirect("/");
    });
  })(req, res, next);
}

module.exports = postIndex;
