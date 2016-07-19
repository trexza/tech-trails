var options = {};
var http = require('http');
var request = require('request');
//var app = require('express')();

module.exports = function(app, passport) {

    app.get('/', function(req, res){
        console.log("User Session:"+req.sessionID);
        res.redirect('../first.html');
    });


    /*app.get('/authComplete',
     passport.authenticate('local', { failureRedirect: '/login', successRedirect: '../first.html' }), function(req, res) {
     console.log("In Passport.authenticate callback ..");
     if (req.user) {
     console.log("User Authenticated :" + req.user);
     }
     res.redirect('../first.html');
     });*/

    app.get('/authComplete', function (req, res, next) {
        passport.authenticate('local', { failureRedirect: '/login', successRedirect: '../first.html' }, function (err, user, info) {
            if (err) {
                console.log('Oops. Something broke!');
            } else if (info) {
                console.log( 'unauthorized');
            } else {
                req.login(user, function(err) {
                    if (err) {
                        console.log( 'Login Error');
                        res.write("Error ");
                    } else {
                        console.log( 'Logged in ');
                        res.redirect('/');
                    }
                })
            }
        })(req, res, next);
    });

    app.get('/login', function(req, res) {
        res.render('login');
    });

    app.get('/logout', function(req, res){
        req.logout();
        req.session.destroy(function(){
            res.redirect('/login');
        });
    });

    /*app.get('/profile',
        require('connect-ensure-login').ensureLoggedIn(),
        function(req, res){
            res.render('profile', { user: req.user });
        });

    app.get('/', function (req, res) {
        res.redirect('../first.html');
    });*/

    function initStore() {
        var items = ['eggs', 'toast', 'bacon', 'juice'];
        var storeObj = {};
        for (var itemIDX in items) {
            storeObj[items[itemIDX]] =
                Math.floor(Math.random() * 10 + 1);
        }
        return storeObj;
    }

    app.get('/reset/data', function (req, res) {
        console.log("Reset called ...")
        storeItems = initStore();
        console.log("Restocked" + storeItems);
        res.json(storeItems);
    });

    app.post('/buy/item', function (req, res) {
        var order = Math.floor(Math.random() * 5 + 1);
        console.log("Reorder Item :" + req.body.item + " ### Qty :" + order);
        if (storeItems[req.body.item] > order) {
            storeItems[req.body.item] =
                storeItems[req.body.item] - order;
            res.json(storeItems[req.body.item]);
        } else {
            res.json(400, {
                msg: 'Sorry ' + req.body.item +
                ' is out of stock.'
            });
        }
    });

    app.get('/findborrow/:id', function (req, res) {
        console.log("Finding Borrow details for "+req.params.id);
        //var serverURL ;
        serverCall('/library/findBookByName/'+req.params.id, res);
        /*request.get({'url':'http://localhost:5678/hosts/micros'},function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
                //response = body;
               var info = JSON.parse(body);
                console.log("Micros URL : "+JSON.stringify(info, null, 2));
                //console.log(info[0].uri);
                serverURL = info[0].uri;
                console.log("ServiceAddr:"+ url);
                request.get({'url':serverURL+'/library/findBookByName/'+req.params.id},
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log(body);
                            response = body;
                            res.status(200).send({'info':body});
                        }
                    }
                );
            }
        });
        console.log("Micros URL : "+serverURL);
        */
    });

    function serverCall(uri, res) {
        serviceAddr("micros", function(url) {
            console.log("ServerCall -> ServiceAddr :"+url+uri);
            request.get({'url':url+uri},
                function (error, response, body) {
                    sendResponse(res, error, body);
                    /*if (!error && response.statusCode == 200) {
                        console.log(body);
                        response = body;
                        res.status(200).send({'info':body});
                    }*/
                }
            );

        });
    }

    function serviceAddr(serviceName, callback){
        var url;
        request.get({'url':'http://localhost:5678/hosts/'+serviceName},function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
                //response = body;
                var info = JSON.parse(body);
                //console.log("Micros URL : " + JSON.stringify(info, null, 2));
                console.log("ServiceAddr :"+info[0].uri);
                url = info[0].uri;
                callback(url);
            }
        });
    }

    function sendResponse(res, err, data) {
        if (err) {
            res.status(200).send({
                'status': false,
                'message': 'Error',
                'info': err
            });
        } else {
            res.status(200).send({
                'status': true,
                'message': 'Success',
                'info': data
            });
        }
    }

};