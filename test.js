const fs = require('fs');
const request = require('request');
const Stat = require('./modules/Status');
let Status = Stat.status;
const settings = JSON.parse(fs.readFileSync(__dirname + '/data/Settings.json'));

Status.timestamp = new Date().getTime();
request.post(settings.savedataremoteurl, { form: JSON.stringify(Status) }, (err, res, body) => {
    console.log(body);
});