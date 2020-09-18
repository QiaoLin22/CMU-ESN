const router = require('express').Router();   
const connection = require('../models/user');
const User = connection.models.User;
const utils = require('../lib/utils');
const { requireAuth } = require('../middleware/authmiddleware');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'qlin22', {
    expiresIn: maxAge
  });
};

router.get('/main', requireAuth, (req, res, next) => {
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
                const token = createToken(user._id);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                res.status(201).json({ success: true,user: user._id,msg:"Token created", token:token});

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
                res.redirect('/login');
            }
            else{
                res.json({ success: false, msg: "username exists" });
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