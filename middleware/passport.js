const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const validPassword = require("../lib/utils").validPassword;

const authenticateUser = (username, password, done) => {
  User.findOne({ username: username }, (err, user) => {
    if (err) return done(err);

    if (!user) {
      return done(null, false, { usernameExists: false });
    }

    if (validPassword(password, user.hash, user.salt)) {
      return done(null, user);
    } else {
      console.log("password incorrect")
      return done(null, false, { usernameExists: true });
    }
  });
};

passport.use(new LocalStrategy(authenticateUser));
