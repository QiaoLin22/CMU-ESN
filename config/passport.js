const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const validatePs = require("../middleware/psMiddleware").validatePs;

// assuming username exists
const authenticateUser = (username, password, done) => {
  console.log("hello");

  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return done(null, false, { message: "Username does not exist" });
      }

      console.log("username exists");
      if (validatePs(password, user.hash, user.salt)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    })
    .catch((err) => done(err));

  // user is not defined
  // if (validatePs(password, user.hash, user.salt)) {
  //   return done(null, user);
  // } else {
  //   return done(null, false, { message: "Password incorrect" });
  // }
};

passport.use(new LocalStrategy(authenticateUser));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((userId, done) => {
//   User.findById(userId)
//     .then((user) => {
//       done(null, user);
//     })
//     .catch((err) => done(err));
// });
