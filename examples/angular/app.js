/**
 * Created by Senthil Kumar on 19-06-2016.
 */
(function () {
    'use strict';
    var express = require('express');
    var app = express();
    var passport = require('passport');

    require('./js/localauth')(passport);
    require('./config/config_app')(app, passport);
    require('./js/module_routes')(app, passport);


    // START THE SERVER
    console.log('STARTING THE TST SERVER');
    console.log('-------------------------');
    app.listen(3005);
    console.log('Started the server');
    process.on('uncaughtException', function (error) {
        console.log(error.stack);
        console.log(error);
    });

})();
