/*jshint esversion:6*/

global.__basedir = __dirname;
var express = require('express');
var app = express();
var http = require('http'); //.Server(app);
var bodyParser = require('body-parser');
var DataHelper = require('./modules/Datahelper');
var PORT = 5000;
var fs = require('fs');

const getremoteurl = 'http://www.virgili.netsons.org/read_boiler_status.php';
const setremoteurl = 'http://www.virgili.netsons.org/smarttest.php?boiler=';
const BoilerControl = require('./modules/BoilerControl');
const boilerControl = new BoilerControl(getremoteurl, setremoteurl);

//app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/', express.static(__dirname));

app.get('/home', function(req, res) {
    res.sendFile(__dirname + "/controller.html");
});

app.get('/checkremote', (req, res) => {
    res.json({ 'status': remoteData.status });
});

app.get('/manual', (req, res) => {
    res.sendFile(__dirname + "/manual.html");
});

app.get('/setboiler/:relay', (req, res) => {
    boilerControl.setBoiler(req.params.relay).then((val) => {
        console.log("resolve to", val);
        boilerControl.setManual(1);
    }).catch(console.log);
    res.end(req.params.relay);
});

app.listen(PORT, function() {
    boilerControl.checkRemote();
    console.log("app listening on port", PORT);
});