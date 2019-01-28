/*jshint esversion:6*/
const fs = require('fs');
const schedule = require('node-schedule');

module.exports = class Scheduler {
    constructor() {
        this.schedData = {};
        this.on = [];
        this.off = [];
    }

    start() {
        this.on = [], this.off = [];
        this.schedData = JSON.parse(fs.readFileSync(__basedir + '/data/scheduler.json'));
        this.schedData.week.forEach(element => {
            element.jobs.forEach((job) => {
                on.push(schedule.scheduleJob({ hour: job.on.hour, minute: job.on.minute, dayOfWeek: element.id }, () => { global.boilerControl.setBoiler(1).then(console.log).catch(console.error); }));
                off.push(schedule.scheduleJob({ hour: job.off.hour, minute: job.off.minute, dayOfWeek: element.id }, () => { global.boilerControl.setBoiler(0).then(console.log).catch(console.error); }));
            });
        });
    }

    stop() {
        on.forEach((job) => {
            job.cancel();
        });
        off.forEach((job) => {
            job.cancel();
        });
    }
};