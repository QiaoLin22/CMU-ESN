const { findUserByUsername } = require('../models/user');
const { verifyToken } = require('../lib/jwt');

const authenticateUser = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exists & is verified
  if (token) {
    verifyToken((err, decodedToken) => {
      if (err) {
        res.redirect('/');
      } else {
        res.locals.username = decodedToken.username;
        next();
      }
    });
  } else {
    res.redirect('/');
  }
};

const verifyRoomId = (req, res, next) => {
  const { roomId } = req.params;
  const { username } = res.locals;

  const usernameIndex = roomId.indexOf(username);
  let otherUsername;

  if (usernameIndex > -1) {
    if (usernameIndex === 0) {
      otherUsername = roomId.substring(username.length);
    } else {
      otherUsername = roomId.substring(0, usernameIndex);
    }

    if (username === otherUsername) {
      res.status(400).send('room id is not valid');
    } else {
      findUserByUsername(otherUsername).then((user) => {
        if (user) {
          next();
        } else {
          res.status(400).send('room id is not valid');
        }
      });
    }
  } else {
    res.status(400).send('room id is not valid');
  }
};

module.exports = { authenticateUser, verifyRoomId };
