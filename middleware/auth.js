const { verifyToken } = require('../lib/jwt');
const { isRoomIdValid } = require('../lib/room-id');
const User = require('../models/user');

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

    if (await isRoomIdValid(roomId, currUsername)) {
      next();
    } else {
      res.status(400).send('room id is not valid');
    }
  }
};

const checkInactive = async (req, res, next) => {
  const { username } = req.body;
  User.getAccountStatusByUsername(username)
    .then((status) => {
      if (status[0].accountStatus === true) {
        next();
      } else {
        res.status(403).json({ error: 'your account is Forbidden' });
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports = { authenticateUser, verifyRoomId, checkInactive };
