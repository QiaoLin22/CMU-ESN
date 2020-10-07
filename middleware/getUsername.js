const User = require('../models/user');

const getUsername = (req, res, next) => {
  const findId = res.locals.userId;
  User.findOne({ _id: findId })
    .then((user) => {
      res.locals.username = user.username;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { getUsername };
