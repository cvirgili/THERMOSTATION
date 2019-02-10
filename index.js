/*jshint esversion:6*/

global.__basedir = __dirname;
var express = require('express');
var app = express();
//var http = require('http').Server(app);
var http = require('http');
const https = require('https');
var bodyParser = require('body-parser');
var PORT = 5000;
const fs = require('fs');
//global.io = require('socket.io')(http);
//global.io = require('socket.io')(https);
const getremoteurl = 'http://www.virgili.netsons.org/read_boiler_status.php';
const setremoteurl = 'http://www.virgili.netsons.org/smarttest.php?boiler=';
const BoilerControl = require('./modules/BoilerControl');
const BoilerController = require('./modules/BoilerController');
const Status = require('./modules/Status').status;
const Scheduler = require('./modules/Scheduler');
const options = {
    key: fs.readFileSync('file.pem'),
    cert: fs.readFileSync('file.crt')
};

//const server = https.createServer(options, app);
const server = http.createServer(app);
global.io = require('socket.io')(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/', express.static(__dirname));

app.get('/home', function(req, res) {
    res.sendFile(__dirname + "/controller.html");
});

app.get('/manual', (req, res) => {
    res.sendFile(__dirname + "/manual.html");
});

app.get('/schedulerdata', (req, res) => {

});

//manual
app.get('/setboiler/:relay', (req, res) => {
    // boilerControl.setManual(req.params.relay);
    BoilerController.setManual(req.params.relay);
    res.end(req.params.relay);
});

app.get('/startscheduler', (req, res) => {
    // boilerControl.startScheduler();
    BoilerController.startScheduler();
    console.log("starting scheduler...");
    res.send("ok");
});

// http.listen(PORT, () => {
//     console.log("app listening on port", PORT);
//     BoilerController.scheduler = new Scheduler();
//     BoilerController.init();
// });

server.listen(PORT, function() {
    console.log('app listening on port', PORT);
    BoilerController.scheduler = new Scheduler();
    BoilerController.init();
});

io.on('connection', function(socket) {
    io.emit('status', Status);
    socket.on('close', console.log);
    socket.on('error', console.log);
});