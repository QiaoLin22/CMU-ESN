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

router.post("/", (req, res) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return res.send(err);

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
          info.message = "Username does not comply to rules";
          console.log(info.message);
          return res.status(400).json({
            error: "Username does not comply to rules",
          });
        }
      }
    }

    // user authenticated
    console.log("authenticated");
    req.logIn(user, { session: false }, (err) => {
      if (err) return res.status(500).end();

      // TODO: generate jwt and return it in response
      return res.redirect("/");
    });
  })(req, res);
});

// TODO: Not sure where to put this
function createNewUser(username, password) {
  // create new user and save to db
  const hashAndSalt = genHashAndSalt(password);
  const newUser = new User({
    username: username,
    hash: hashAndSalt.hash,
    salt: hashAndSalt.salt,
  });
  newUser.save().then((user) => {
    console.log(user);
  });
  res.redirect("/welcome");
}

//Old session authenticate logic

// router.get('/main', (req, res) => {
//     if(req.session.passport === undefined){
//         res.redirect('/')
//     }
//     else {
//             const id = (req.session.passport.user)

//         if (req.isAuthenticated()) {
//             User.findOne({ _id: id })
//             .then((user) => {
//                 var username = user.username
//                 res.render('index',{username : username})
//             })
//             .catch((err) => {
//                 console.log(err)
//             });

//         } else {
//             res.send('<h1>You are not authenticated</h1><p><a href="/">Login</a></p>');
//         }
//     }

// });

//new JWT TO DO #
router.get("/main", (req, res) => {
  res.render("main");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
router.get("/wrong-password", (req, res) => {
  res.send("<h1>Login failed</h1>");
});
router.get("/username-taken", (req, res) => {
  res.send("<h1>Username already taken.</h1>");
});

module.exports = router;
