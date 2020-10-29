const { findUserByUsername } = require('../models/user');
const { verifyToken } = require('../lib/jwt');

const authenticateUser = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exists & is verified
  if (token) {
    verifyToken(token, (err, decodedToken) => {
      if (err) {
        console.log(err);
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

const verifyRoomId = async (req, res, next) => {
  const { roomId } = req.params;
  const currUsername = res.locals.username;

  try {
    const usernames = roomId.split('-');
    const username1 = usernames[0];
    const username2 = usernames[1];

    // check if there is delimiter
    if (!username2) throw Error();

    // check if currUsername in usernames
    if (!usernames.includes(currUsername)) throw Error();

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
    console.log(e);
    res.status(400).send('room id is not valid');
  }
};

module.exports = { authenticateUser, verifyRoomId };
