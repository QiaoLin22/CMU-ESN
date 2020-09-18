const fs = require('fs');
const path = require('path');
const connection = require('../models/user');
const User = connection.models.User;
const jwt = require('jsonwebtoken')

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');


const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log(token)
    // check json web token exists & is verified
    if (token) {
      jwt.verify(token, 'qlin22', (err, decodedToken) => {
        console.log(decodedToken);
        if (err) {
          console.log(err.message);
          res.redirect('/login');
        } else {
          console.log(decodedToken);
          next();
        }
      });
    } else {
      res.redirect('/login');
    }
  };
  
  module.exports = { requireAuth };