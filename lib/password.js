const crypto = require('crypto');

function validatePassword(password, hash, salt) {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return hash === hashVerify;
}

function genHashAndSalt(password) {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');

  return { salt, hash };
}

module.exports = { validatePassword, genHashAndSalt };
