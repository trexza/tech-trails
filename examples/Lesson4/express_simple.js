/**
 * Created by Senthil Kumar on 03-06-2016.
 */
var express = require('express');
var app = express();

app.get('/', function(req, res){
    var response = "<h2> Your Request </h2>";
    response += "URL : "+req.originalUrl+ "<br\>";
    response += "Protocol : "+req.protocol+ "<br\>";
    response += "IP : "+req.ipc+ "<br\>";
    response += "Path : "+req.path+ "<br\>";
    response += "Host : "+req.hostname+ "<br\>";
    response += "Method : "+req.method+ "<br\>";
    response += "Connection: "+req.get('connection')+ "<br\>";
    response += "Request Query : "+JSON.stringify(req.query)+ "<br\>";
    response += "Headers : "+JSON.stringify(req.headers)+ "<br\>";

    res.status(200).send(response);
});

console.log("Sever starting ...")

app.listen(8080);
