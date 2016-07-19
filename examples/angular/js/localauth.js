/**
 * Created by Trexza on 15/07/2016.
 */

var localStrategy = require('passport-local').Strategy,
    //passport = require('passport'),
    userSession = require('../models/Usersession');

module.exports = function(passport) {

    function findUser(user, fn) {
        console.log("Checking for user session..");
        var query = userSession.find({ username: user }).sort({ created_at: -1 }).limit(1);
        //userSession.find({ username: user }, function(err, user) {
        query.exec(function(err, user) {
            if (err) throw err;
            // object of the user
            console.log("User real :" + user);
            return fn(null, user);
        });
        return fn(null, null);
    }

    function findById(id, cb){
        userSession.find({ userId: id }, function(err, user) {
            if (err) throw err;
            // object of the user
            console.log("Found User :" + user);
            return cb(null, user);
        });
        //return cb(null, null);
    }

    passport.serializeUser(function(usr, user, done) {
        console.log("Serializing user :"+user.userId);
        done(null, "Constant");
    });

    passport.deserializeUser(function(id, done) {
        findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new localStrategy(
        function(username, password, done) {
            // asynchronous verification, for effect...
            console.log("Local Auth Strategy: Going to verify user");
            process.nextTick(function () {

                // Find the user by username.  If there is no user with the given
                // username, or the password is not correct, set the user to `false` to
                // indicate failure and set a flash message.  Otherwise, return the
                // authenticated `user`.
                findUser(username, function(err, user) {
                    if (err) { return done(err); }
                    if (!user) { return done(null, false, { message: 'Unknown user : ' + username }); }
                    // if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
                    console.log("User Authenticated !!:"+user);
                    return done(null, user);
                })
            });
        }
    ));
}
