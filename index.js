/*jshint esversion:6*/

global.__basedir = __dirname;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var PORT = 5000;
const fs = require('fs');
global.io = require('socket.io')(http);
const getremoteurl = 'http://www.virgili.netsons.org/read_boiler_status.php';
const setremoteurl = 'http://www.virgili.netsons.org/smarttest.php?boiler=';
const BoilerControl = require('./modules/BoilerControl');
const Status = require('./modules/Status');
const Scheduler = require('./modules/Scheduler');
global.boilerControl = new BoilerControl(getremoteurl, setremoteurl);

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
    boilerControl.setManual(req.params.relay);
    res.end(req.params.relay);
});

app.get('/startscheduler', (req, res) => {
    boilerControl.startScheduler();
    console.log("starting scheduler...");
    res.send("ok");
});

http.listen(PORT, function() {
    console.log("app listening on port", PORT);
    Scheduler.schedData = JSON.parse(fs.readFileSync(__basedir + '/data/scheduler.json'));
    boilerControl.checkRemote();
});

io.on('connection', function(socket) {
    io.emit('status', Status);
    socket.on('close', console.log);
    socket.on('error', console.log);
});