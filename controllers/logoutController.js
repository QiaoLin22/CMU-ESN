const User = require('../models/user');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const io = require('socket.io-client');
const socket = io.connect('http://127.0.0.1:5000')

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

class LogoutController {
  static logout(req, res, next) {
    const token = req.cookies.jwt;
    jwt.verify(token, PUB_KEY, { algorithm: 'RS256' }, (err, decodedToken) => {
        const id = decodedToken.id
        User.updateOne(
            { "_id": id}, // Filter
            {$set: {"online": false}}, // Update
        )
        .then(() => {
            socket.emit('logout')
        })
        .catch(() => {
            console.log(err);
        }) 
    });
    next();
  }
}

module.exports = LogoutController;