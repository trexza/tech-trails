var express = require('express');
console.log("Auth Example : Going to load Passport module ...");
var passport = require('passport');
console.log("Auth Example : Going to load Strategy modules ...");
var Strategy = require('passport-google-oauth20').Strategy;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test_session');
userSession = require('./models/Usersession');


// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
    //clientID: process.env.CLIENT_ID,
    //clientSecret: process.env.CLIENT_SECRET,
    clientID: '76166801582-3ndp8ib37csgsmqj5gg78smnag4g0oji.apps.googleusercontent.com',
    clientSecret: '4NGNtIFXHVSDyLIsXsgNQT1v',

    callbackURL: 'http://localhost:3000/login/google/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    console.log("Access Token :"+accessToken);
    console.log("Refresh Token :"+refreshToken);

    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
      var session = new userSession({
          userId: profile.id,
          username: profile.displayName,
          accessId: accessToken,
          created_at: new Date()
      });
      console.log('Going to save user..');
      session.save(function(err) {
          if (err) throw err;

          console.log('User session saved successfully!');
      });
      return cb(null, profile);
    //});
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'MAGICString', resave: false, saveUninitialized: true, cookie : { maxAge: 300000 }}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Define routes.
app.get('/',
  function(req, res) {
    console.log("Auth example : Calling GET:/ ...");
    res.render('home', { user: req.user });
  });

/*app.get('/login',
  function(req, res){
    console.log("Auth example : Calling GET:/login ...");
    res.render('login');
  });*/

console.log("Auth example : Calling Authenticate ...")
app.get('/login/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/login/google/return',
  //passport.authenticate('google', { successRedirect: 'http://localhost:3005/authComplete', failureRedirect: 'http://localhost:3005/' })
    passport.authenticate('google', { failureRedirect: 'http://localhost:3005/' }), function(req, res) {
      console.log("Auth example : Calling GET:/login/google/return (callback) ...");
      console.log("User Session started for :"+req.user.displayName);
      console.log(req.cookies);
      res.cookie('user', req.user.displayName);
      res.cookie('connect.sid', req.cookies["connect.sid"]);
      res.redirect("http://localhost:3005/authComplete");
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

app.listen(3000);
