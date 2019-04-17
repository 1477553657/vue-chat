const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
const {UserModel} = require('../db/models');
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'kim';

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        // console.log(jwt_payload)
        UserModel.findById(jwt_payload.id)
            .then(user => {
                if(user) {
                    return done(null,user)
                }
                    return done(null,false)
            })
            .catch(err => console.log(err))
    }))
}