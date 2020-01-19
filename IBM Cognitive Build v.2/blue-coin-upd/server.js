var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('account', ['account']);
var bodyParser = require('body-parser');


// const Utility = require("./lib/BlueCoinContract");
// console.log(Utility.registerJobseeker());

app.use(express.static(__dirname + "/lib"));

app.use(bodyParser.json());

app.get('/account',function (req, res){
    console.log("Received");
    
    db.accounts.find(function (err, docs){
        console.log(docs);
        res.json(docs);
    });
});

app.post('/account', function(req, res){
    console.log(req.body);
    db.accounts.insert(req.body, function(err, doc){
        res.json(doc);
    });
});

app.listen(8000);
console.log("Server running on port 8000");