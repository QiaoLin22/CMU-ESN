const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const validatePs = require("../middleware/psMiddleware").validatePs;

const authenticateUser = (username, password, done) => {
  User.findOne({ username: username }, (err, user) => {
    if (err) return done(err);

    if (!user) {
      return done(null, false, { usernameExists: false });
    }

    if (validatePs(password, user.hash, user.salt)) {
      return done(null, user);
    } else {
      return done(null, false, {
        message: "Password incorrect",
        usernameExists: true,
      });
    }
  });
};

passport.use(new LocalStrategy(authenticateUser));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
