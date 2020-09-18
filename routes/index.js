const router = require("express").Router();
const passport = require("passport");
const genHashAndSalt = require("../middleware/psMiddleware").genPs;
const User = require("../models/user");

router.get("/", (req, res) => {
  res.render("login");
});

// TODO
function isValidUsername(username) {
  return false;
}

router.post("/", (req, res, next) => {
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
      return res.redirect("/");
    });
  })(req, res);
});

router.post("/create-user", (req, res, next) => {
  const { username, password } = req.body;

  // create new user and save to db
  const hashAndSalt = genHashAndSalt(password);
  const newUser = new User({
    username: username,
    hash: hashAndSalt.hash,
    salt: hashAndSalt.salt,
  });

  newUser
    .save()
    .then((user) => {
      console.log(user);
      res.status(201).send("success");
    })
    .catch((err) => next(err));
});


//new JWT TO DO #
router.get("/main", (req, res) => {
  res.render("main");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
