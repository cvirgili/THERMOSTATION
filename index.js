/*jshint esversion:6*/

global.__basedir = __dirname;
var express = require('express');
var app = express();
var http = require('http'); //.Server(app);
var bodyParser = require('body-parser');
var DataHelper = require('./modules/datahelper.js');
var PORT = 5000;
var fs = require('fs');
const RemoteData = require('./modules/ReadRemoteData');
let remoteData = new RemoteData();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/home', function(req, res) {
    res.sendFile(__dirname + "/controller.html");
});

app.get('/checkremote', (req, res) => {
    res.json({ 'status': remoteData.status });
});


app.listen(PORT, function() {
    remoteData.loop('http://virgili.netsons.org/read_boiler_status.php', 5000);
    console.log("app listening on port", PORT);
});