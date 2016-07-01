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
    proxy = require('express-http-proxy'),
    http = require('http');


module.exports = function(app) {
    app.use(compression());
    app.use(morgan('dev'));
    app.use(bodyParser());
    app.use(multer());
    app.use(cookieParser('Twyst_2014_Sessions'));

    app.use(methodOverride());

    //app.use(express.static(__dirname + '/../www/'));
    app.use(express.static(__dirname + '/../www/'));

    // app.use(favicon(__dirname + '/../../Twyst-Web-Apps/common/images/favicon/twyst.ico'));

    //app.all("/api/*", function(req, res, next) {
    app.all("/*", function(req, res, next) {
        console.log("Config_app: Route resolution");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, Accept");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, HEAD, DELETE, OPTIONS");
        return next();
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

};
