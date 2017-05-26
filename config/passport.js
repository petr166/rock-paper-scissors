const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('./database');

const initialize = (passport) => {
  let options = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.secret
  };

  passport.use(new JwtStrategy(options, (jwt_payload, done) => {
    User.getUserById(jwt_payload._doc._id, (err, user) => {
      if (err) {
        return done(err, false);
      }

      if (user) {
        user.password = "!private";
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
};


module.exports = initialize;
