const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const authenticateUser = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, PUB_KEY, { algorithm: 'RS256' }, (err, decodedToken) => {
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

module.exports = { authenticateUser };
