const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToPrivKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const pathToPubKey = path.join(__dirname, '..', 'id_rsa_pub.pem');

let PRIV_KEY;
let PUB_KEY;
try {
  PRIV_KEY = fs.readFileSync(pathToPrivKey, 'utf8');
} catch (e) {
  PRIV_KEY = process.env.JWT_PRIV_KEY.replace(/\\n/g, '\n');
}
try {
  PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8');
} catch (e) {
  PUB_KEY = process.env.JWT_PUB_KEY.replace(/\\n/g, '\n');
}

// create json web token
const createToken = (user) => {
  const { _id, username } = user;
  const maxAge = 3 * 24 * 60 * 60;
  return jwt.sign(
    { _id, username },
    PRIV_KEY,
    { algorithm: 'RS256' },
    { expiresIn: maxAge }
  );
};

const verifyToken = (token, cb) => {
  return jwt.verify(token, PUB_KEY, { algorithms: ['RS256'] }, cb);
};

module.exports = { createToken, verifyToken };
