/*jshint esversion:6*/
const fs = require('fs');
const schedule = require('node-schedule');

module.exports = class Scheduler {
    constructor() {
        //this.schedData = {};
        this.jobs = [];
        this.schedData = {};
    }

    start() {
        var ruleOn = new schedule.RecurrenceRule();
        var ruleOff = new schedule.RecurrenceRule();
        return new Promise((resolve, reject) => {
            this.schedData = JSON.parse(fs.readFileSync(__basedir + '/data/scheduler.json'));
            console.log("scheduler start");
            this.loop();
            resolve(true);
        });
    }

    loop() {
        //############################################################
        let reloop = () => { this.loop(); };
        let now = new Date();
        this.schedData.week.find((item) => { return item.id == new Date().getDay(); }).jobs.forEach((job) => {
            let dateOn = new Date();
            dateOn.setHours(job.on.hour, job.on.minute);
            let dateOff = new Date();
            dateOff.setHours(job.off.hour, job.off.minute);
            let val = 0;
            console.log("\nnow > dateOn && now < dateOff", now > dateOn && now < dateOff, "\n");
            if (now >= dateOn && now <= dateOff) val = 1;
            global.boilerControl.schedulerAction(val).then(console.log).catch(console.error);

        });
        setTimeout(reloop, 5000);
        //############################################################
    }

    stop() {
        return new Promise((resolve, reject) => {
            console.log("scheduler stop");
            this.jobs.forEach((job) => {
                job.cancel();
            });
            resolve(true);
        });
    }
};