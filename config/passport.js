const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const fs = require('fs');
const path = require('path');
const connection = require('../models/user');
const User = connection.models.User;

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
  };

  module.exports = (passport) => {
   
    passport.use(new JwtStrategy(options, function(jwt_payload, done) {

        //console.log(jwt_payload);
        
        User.findOne({_id: jwt_payload.sub}, function(err, user) {

            if (err) {
                return done(err, false);
            }
            //for future use
            // if(user.admin){

            // }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
            
        });
        
    }));
}