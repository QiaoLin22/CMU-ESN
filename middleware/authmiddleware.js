const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const jwt = require('jsonwebtoken')

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');


const requireAuth = (req, res, next) => {
    console.log(req)
    console.log(req.cookies)
    const token = req.cookies.jwt;
    console.log(token)
    // check json web token exists & is verified
    if (token) {
      jwt.verify(token, PUB_KEY,{ algorithm: 'RS256'}, (err, decodedToken) => {
        console.log(decodedToken);
        if (err) {
          console.log(err.message);
          res.redirect('/');
        } else {
          console.log(decodedToken);
          next();
        }
      });
    } else {
      res.redirect('/');
    }
  };
  
  module.exports = { requireAuth };