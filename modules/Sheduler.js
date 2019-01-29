/*jshint esversion:6*/
const fs = require('fs');
const schedule = require('node-schedule');

module.exports = class Scheduler {
    constructor() {
        //this.schedData = {};
        this.on = [];
        this.off = [];
    }

    start() {
        this.on = [], this.off = [];
        let schedData = JSON.parse(fs.readFileSync(__basedir + '/data/scheduler.json'));
        console.log("scheduler start");
        schedData.week.forEach((element) => {
            console.log("############################################");
            console.log(element.name, element.jobs.length, "jobs");
            let nextcount = 1;
            for (let count = 0; count < element.jobs.length; count++) {
                let job = element.jobs[count];
                let HourOn, HourOff, MinuteOn, MinuteOff;
                console.log("=>", count);

                if (nextcount < element.jobs.length) {
                    let nextJob = element.jobs[nextcount];
                    HourOn = new schedule.Range(job.on.hour, job.off.hour);
                    MinuteOn = new schedule.Range(job.on.minute, job.off.minute);
                    HourOff = new schedule.Range(job.off.hour, nextJob.on.hour);
                    MinuteOff = new schedule.Range(job.off.minute, nextJob.on.minute);
                } else {
                    HourOn = new schedule.Range(job.on.hour, job.off.hour);
                    MinuteOn = new schedule.Range(job.on.minute, job.off.minute);
                    HourOff = new schedule.Range(job.off.hour, 23);
                    MinuteOff = new schedule.Range(job.off.minute, 59);
                }

                console.log("H ON", HourOn, "M ON", MinuteOn);
                console.log("H OFF", HourOff, "M OFF", MinuteOff);
                try {
                    this.on.push(schedule.scheduleJob({ hour: HourOn, minute: MinuteOn, dayOfWeek: element.id }, () => { global.boilerControl.schedulerAction(1).then(console.log).catch(console.error); }));
                    this.off.push(schedule.scheduleJob({ hour: HourOff, minute: MinuteOff, dayOfWeek: element.id }, () => { global.boilerControl.schedulerAction(0).then(console.log).catch(console.error); }));
                } catch (err) {
                    console.error(err);
                }
            }

            nextcount++;
            console.log("############################################");
            console.log("on array", this.on.length);
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        });
    }

    stop() {
        return new Promise((resolve, reject) => {
            console.log("scheduler stop");
            this.on.forEach((job) => {
                job.cancel();
            });
            this.off.forEach((job) => {
                job.cancel();
            });
            resolve(true);
        });
    }
};