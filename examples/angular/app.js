/**
 * Created by Senthil Kumar on 19-06-2016.
 */
(function () {
    'use strict';
    var express = require('express');
    var app = express();

    require('./config/config_app')(app);
    //require('./config/config_routes')(app);
    require('./js/module_routes')(app);


    // START THE SERVER
    console.log('STARTING THE TST SERVER');
    console.log('-------------------------');
    app.listen(3000);
    console.log('Started the server');
    process.on('uncaughtException', function (error) {
        console.log(error.stack);
        console.log(error);
    });

})();
