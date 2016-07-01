var express = require('express');
var app = express();

app.use('/', express.static('../resources/html', {maxage: 60*60*24*1000}));
app.use('/images', express.static( '../resources/images'));
app.get('/', function(req, res){
    res.redirect('/html/index.html');
});
app.listen(8080);