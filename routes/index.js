// const mongoose = require('mongoose');
// const router = require('express').Router();   
// const connection = require('../models/user');
// const User = connection.models.User;
// const utils = require('../lib/utils');

// router.get('/main', passport.authenticate('jwt', { session: false }), (req, res, next) => {
//     res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
// });

// router.post('/login', function(req, res, next){
//     User.findOne({ username: req.body.username })
//         .then((user) => {

//             if (!user) {
//                 res.status(401).json({ success: false, msg: "could not find user" });
//             }
            
//             const isValid = utils.validPassword(req.body.password, user.hash, user.salt);
            
//             if (isValid) {

//                 const tokenObject = utils.issueJWT(user);
//                 res.cookie('jwt',tokenObject, {httpOnly:true, maxAge: 1000*60*60*24})
//                 res.status(200).json({ success: true, user: user });

//             } else {

//                 res.status(401).json({ success: false, msg: "you entered the wrong password" });

//             }

//         })
//         .catch((err) => {
//             next(err);
//         });
// });

// // Register a new user
// router.post('/register', function(req, res, next){
//     const username = req.body.username
//     User.findOne({ username: username })
//         .then((user) => {
//             if (!user){
//                 const saltHash = utils.genPassword(req.body.password);
//                 const salt = saltHash.salt;
//                 const hash = saltHash.hash;
//                 const newUser = new User({
//                     username: req.body.username,
//                     hash: hash,
//                     salt: salt
//                 });
//                 newUser.save()
//                 .then((user) => {
//                     res.json({ success: true, user: user });
//                 });
//                 res.redirect('/');
//             }
//             else{
//                 res.json({ success: false, msg: "username-taken" });
//             }
//         })
//         .catch((err) => {   
//             res.json({ success: false, msg: err });
//     });

// });

// router.get('/login', (req, res) => {
//     res.render('login')
// });
// router.get('/register', (req, res) => {
//     res.render('login')

const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user");
const utils = require('../lib/utils');

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
  const hashAndSalt = utils.genHashAndSalt(password);
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
