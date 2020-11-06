const { findUserByUsername } = require('../models/user');
const { verifyToken } = require('../lib/jwt');
const { extractUsernames } = require('../lib/room-id');

const authenticateUser = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exists & is verified
  if (token) {
    verifyToken(token, (err, decodedToken) => {
      if (err) {
        console.log(err);
        // res.redirect('/');
        res.status(401).end();
      } else {
        res.locals.username = decodedToken.username;
        next();
      }
    });
  } else {
    // res.redirect('/');
    res.status(401).end();
  }
};

const verifyRoomId = async (req, res, next) => {
  const { roomId } = req.params;
  if (roomId === 'public') next();
  else {
    const currUsername = res.locals.username;

    try {
      const { username1, username2 } = extractUsernames(roomId, currUsername);

      // check two usernames are not the same
      if (username1 === username2) throw Error();

      // check two usernames are ordered
      if (username1 > username2) throw Error();

      // check two usernames exist in db
      const user1 = findUserByUsername(username1);
      if (!user1) throw Error();

      const user2 = findUserByUsername(username2);
      if (!user2) throw Error();

      next();
    } catch (e) {
      res.status(400).send('room id is not valid');
    }
  }
};

module.exports = { authenticateUser, verifyRoomId };
