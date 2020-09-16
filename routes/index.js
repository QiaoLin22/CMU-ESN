const router = require("express").Router();
const passport = require("passport");
const genHashAndSalt = require("../middleware/psMiddleware").genPs;
const User = require("../models/user");

// router.post(
//   "/",
//   passport.authenticate("local", {
//     failureRedirect: "/wrong-password",
//     successRedirect: "/main",
//   })
// );

// TODO
function isValidUsername(username) {
  return false;
}

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

function checkUsername(req, res, next) {}

router.post("/", (req, res) => {
  const { username } = req.body;
  //   res.status(200).send("hi")

  // check if username exists
  User.findOne({ username: username })
    .then((user) => {
      // username doesn't exist
      if (!user) {
        // check if username satisfy username rule
        if (isValidUsername(username)) {
          // ask the user to confirm the creation of a new user
          res.status(200).send("create new user?");
        } else {
          // prompt user to re-enter
          res.status(400).send("username does not comply to rules");
        }
      }
      // username exists
      else {
        passport.authenticate("local", (err, user) => {
          // password incorrect, prompt user to re-enter;
          if (!user) {
            res.status(400).send("password incorrect");
          }

          // password correct, nothing happens
          res.status(200).send("success");
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/", (req, res) => {
  res.render("login");
});

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
