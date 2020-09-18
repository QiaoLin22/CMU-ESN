const router = require('express').Router();
const passport = require('passport');
const savePassword = require('../middleware/psMiddleware').genPs;
const connectdb = require('../models/model')
const User = connectdb.models.User;

 router.post('/', passport.authenticate('local', {
      failureRedirect: '/wrong-password', 
      successRedirect: '/main' 
 }));

 router.post('/register', (req, res) => {
    const checkname = req.body.username
    User.findOne({ username: checkname })
        .then((user) => {
            if (!user){
                const helper = savePassword(req.body.password);
                const newUser = new User({
                username: req.body.username,
                hash: helper.hash,
                salt: helper.salt
                });

                newUser.save()
                .then((user) => {
                    console.log(user);
                });
                res.redirect('/');
            }
            else{
                res.redirect('/username-taken');
            }
        })
        .catch((err) => {   
            console.log(err)
    });
    
 });

router.get('/', (req, res) => {
    res.render('login')
});

router.get('/welcome', (req, res) => {
    res.render('welcome')
});

router.get('/register', (req, res) => {
    res.render('register')
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
router.get('/main', (req, res) => {

    res.render('main')
    
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});
router.get('/wrong-password', (req, res) => {
    res.send('<h1>Login failed</h1>');
});
router.get('/username-taken', (req, res) => {
    res.send('<h1>Username already taken.</h1>');
});

module.exports = router;