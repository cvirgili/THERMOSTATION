global.__basedir = __dirname;
const fs = require('fs');
const request = require('request');
const Scheduler = require('./modules/Scheduler');
let sched = new Scheduler();


sched.chekData();

//request.get("https://virgili.netsons.org/scheduler.json", (res, err, body) => { console.log(JSON.parse(body)); });