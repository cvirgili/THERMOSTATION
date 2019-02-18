/*jshint esversion:6*/
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.env.NODE_TLS_ACCEPT_UNTRUSTED_CERTIFICATES_THIS_IS_INSECURE = "1";

global.__basedir = __dirname;
var express = require('express');
var app = express();
var http = require('http');
//const https = require('https');
var bodyParser = require('body-parser');
var PORT = 5000;
const fs = require('fs');
const Status = require('./modules/Status').status;
const Scheduler = require('./modules/Scheduler');
const BoilerController = require('./modules/BoilerController');
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};
//https.globalAgent.options.rejectUnauthorized = false;
//const server = https.createServer(options, app);
const server = http.createServer(app);
global.io = require('socket.io')(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/', express.static(__dirname));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/', (req, res) => {
    res.send('<h1>TEST</h1>');
});

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