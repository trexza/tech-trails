/**
 * Created by Senthil Kumar on 19-06-2016.
 */
'use strict';
var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    compression = require('compression'),
    errorhandler = require('errorhandler'),
    multer  = require('multer'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    proxy = require('express-http-proxy'),
    http = require('http');


module.exports = function(app, passport) {
    app.use(compression());
    app.use(morgan('dev'));
    app.use(bodyParser());
    app.use(multer());
    //app.use(cookieParser('Twyst_2014_Sessions'));
    app.use(cookieParser());
    app.set('view engine', 'ejs');

    app.use(session({ secret: 'MAGICString', resave: false, saveUninitialized: false, cookie : { maxAge: 300000 }}));
    app.use(methodOverride());
    app.use(passport.initialize());
    app.use(passport.session());

    mongoose.connect('mongodb://localhost/test_session');

    //app.all("/api/*", function(req, res, next) {
    app.all("/*", function(req, res, next) {
        console.log("Config_app: Route resolution");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, Accept");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, HEAD, DELETE, OPTIONS");
        console.log(req.path);
        if (req.path == '/authenticate') {
            return next();
        } else if (req.path == '/authComplete') {
            //check user and login
            var user = req.cookies["user"];
            //console.log(req.cookies);
            console.log("User cookie :" + user);
            req.query.username = user;
            req.query.password = 'noPassword';

            return next();

        } else if (req.path == '/logout') {
            return next();
        //} else {

        }
        ensureAuthenticated(req, res, next);
        
    });

    app.use(errorhandler({
        dumpExceptions: true,
        showStack: true
    }));

    app.use('/hosts', proxy('http://localhost:5678', {
        forwardPath: function(req, res) {
            console.log(require('url').parse(req.originalUrl).path);
            return require('url').parse(req.originalUrl).path;
        }
    }));

    app.use('/authenticate', proxy('http://localhost:3000', {
        forwardPath: function(req, res) {
            console.log(require('url').parse(req.originalUrl).path);
            return '/login/google';
        }
    }));

    app.use(express.static(__dirname + '/../www/'));
    
    function ensureAuthenticated(req, res, next) {
        if (req.user) {
            console.log("Session valid.. Processing request");
            return next();
        }
        console.log("No Session.. Redirecting to login")
        //req.session.error = 'Please sign in!';
        res.render('login');
    }


};
