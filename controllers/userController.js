const User = require('../models/user');
const utils = require('../lib/utils');

class UserController {
  static createUser(req, res) {
    const { username, password } = req.body;

    // create new user and save to db
    const hashAndSalt = utils.genHashAndSalt(password);
    const newUser = new User({
      username: username,
      ...hashAndSalt,
      online: false
    });

    newUser
      .save()
      .then(() => {
        res.status(201).send({ message: 'success' });
      })
      .catch((err) => {
        let message;

        if (err.code === 11000) {
          message = 'Username already exists';
        } else {
          message = Object.values(err.errors)[0].properties.message;
        }
        res.status(400).json({ error: message });
      });
  }

  static retrieveUsers(req, res, next){
    User.find({online:true},(err, online_users)=>{
      if(err) return next(err);
      User.find({online:false},(err, offline_users)=>{
        if(err) return next(err);
        console.log("get");
        res.json({online: online_users,
                offline: offline_users});
      }).sort({username:1})
    }).sort({username:1});
  }
}

module.exports = UserController;
