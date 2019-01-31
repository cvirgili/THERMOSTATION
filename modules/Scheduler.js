/*jshint esversion:6*/
const fs = require('fs');
const Status = require('./Status');

module.exports = class Scheduler {
    constructor() {
        this.schedData = {};
        this.isStart = false;
        this.timeout = null;
    }

    resetTimerArray() {
        let timer = {};
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m++) {
                timer[h + "-" + m] = { "val": 0, "treshold": 0 };
            }
        }
        return timer;
    }

    getJobsOfTheDay(day) {
        let timerObject = this.resetTimerArray();
        timerObject.today = day;
        this.schedData.week.find((item) => { return item.id == day; }).jobs.forEach((job) => {
            for (let h = job.on.hour; h <= job.off.hour; h++) {
                let last = (h === job.off.hour) ? job.off.minute : 60;
                let first = (h === job.on.hour) ? job.on.minute : 0;
                for (let m = first; m < last; m++) {
                    timerObject[h + "-" + m].val = 1;
                    timerObject[h + "-" + m].treshold = job.on.treshold;
                }
            }
        });
        return timerObject;
    }

    start() {
        return new Promise((resolve, reject) => {
            if (this.isStart == true) resolve(true);
            this.isStart = true;
            this.schedData = JSON.parse(fs.readFileSync(__basedir + '/data/scheduler.json'));
            console.log("scheduler start");
            this.loop(this.getJobsOfTheDay(new Date().getDay()));
            resolve(true);
        });
    }

    loop(timerObject) {
        if (this.isStart == false) return;
        let now = new Date();
        if (timerObject.today != now.getDay()) {
            this.stop().then(() => {
                clearTimeout(this.timeout);
                this.start();
                return;
            });
        }
        global.boilerControl.setBoiler(timerObject[now.getHours() + "-" + now.getMinutes()].val); //.then(console.log).catch(console.error);
        let reloop = () => { this.loop(timerObject); };
        this.timeout = setTimeout(reloop, 5000);
    }

    stop() {
        return new Promise((resolve, reject) => {
            console.log("scheduler stop");
            clearTimeout(this.timeout);
            this.isStart = false;
            resolve(true);
        });
    }
};