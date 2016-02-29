'use strict'

var express = require('express');
var port = process.env.PORT || 8080
var app = express();
app.use('/', express.static(__dirname + '/'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.listen(port, function () {
    console.log('Server running at http://localhost:8080 !!')
})
app.get('/', function (req, res) {
    res.sendFile('index.html', { 'root': __dirname + '/' });
})