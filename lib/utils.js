const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
let PRIV_KEY;
try {
  PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');
} catch (e) {
  PRIV_KEY = process.env.JWT_PRIV_KEY;
}

function validPassword(password, hash, salt) {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return hash === hashVerify;
}

function genHashAndSalt(password) {
  const salt = crypto.randomBytes(32).toString('hex');
  const genHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');

  return {
    salt: salt,
    hash: genHash,
  };
}

// create json web token
const createToken = (user) => {
  const { _id, username } = user;
  const maxAge = 3 * 24 * 60 * 60;
  console.log(PRIV_KEY);
  return jwt.sign(
    { _id, username },
    PRIV_KEY,
    { algorithm: 'RS256' },
    { expiresIn: maxAge }
  );
};

module.exports.validPassword = validPassword;
module.exports.genHashAndSalt = genHashAndSalt;
module.exports.createToken = createToken;
