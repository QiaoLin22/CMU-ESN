const mongoose = require('mongoose');
const router = require('express').Router();   
const connection = require('../models/user');
const User = connection.models.User;
const utils = require('../lib/utils');

router.get('/main', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
});

router.post('/login', function(req, res, next){
    User.findOne({ username: req.body.username })
        .then((user) => {

            if (!user) {
                res.status(401).json({ success: false, msg: "could not find user" });
            }
            
            const isValid = utils.validPassword(req.body.password, user.hash, user.salt);
            
            if (isValid) {

                const tokenObject = utils.issueJWT(user);
                res.cookie('jwt',tokenObject, {httpOnly:true, maxAge: 1000*60*60*24})
                res.status(200).json({ success: true, user: user });

            } else {

                res.status(401).json({ success: false, msg: "you entered the wrong password" });

            }

        })
        .catch((err) => {
            next(err);
        });
});

// Register a new user
router.post('/register', function(req, res, next){
    const username = req.body.username
    User.findOne({ username: username })
        .then((user) => {
            if (!user){
                const saltHash = utils.genPassword(req.body.password);
                const salt = saltHash.salt;
                const hash = saltHash.hash;
                const newUser = new User({
                    username: req.body.username,
                    hash: hash,
                    salt: salt
                });
                newUser.save()
                .then((user) => {
                    res.json({ success: true, user: user });
                });
                res.redirect('/');
            }
            else{
                res.json({ success: false, msg: "username-taken" });
            }
        })
        .catch((err) => {   
            res.json({ success: false, msg: err });
    });

});

router.get('/login', (req, res) => {
    res.render('login')
});
router.get('/register', (req, res) => {
    res.render('login')
});

module.exports = router;