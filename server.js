var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var moment = require('moment');
var moment = moment();

app.use(express.static('public'));

app.listen(port, function(){
    console.log("======================");
    console.log("Teacher Connection running on: " + port);
    console.log("======================");
});
