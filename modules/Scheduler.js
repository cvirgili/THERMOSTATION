/*jshint esversion:6*/
const fs = require('fs');
const BoilerController = require('./BoilerController');
global.schedulerTimeout = null;

module.exports = class Scheduler {

    constructor() {
        //this.schedData = {};
        this.isStart = false;
        //this.timeout = null;
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
        Scheduler.schedData.week.find((item) => { return item.id == day; }).jobs.forEach((job) => {
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
            if (this.isStart == true) reject("scheduler is already started");
            //this.schedData = JSON.parse(fs.readFileSync(__basedir + '/data/scheduler.json'));
            Scheduler.schedData = JSON.parse(fs.readFileSync(__basedir + '/data/scheduler.json'));
            this.isStart = true;
            console.log("scheduler start");
            this.loop(this.getJobsOfTheDay(new Date().getDay()));
            resolve(true);
        });
    }

    loop(timerObject) {
        if (this.isStart == false) {
            clearTimeout(schedulerTimeout);
            return;
        }
        let now = new Date();
        if (timerObject.today != now.getDay()) {
            this.stop().then(() => {
                clearTimeout(schedulerTimeout);
                this.start();
                return;
            });
        }
        //global.boilerControl.setBoiler(timerObject[now.getHours() + "-" + now.getMinutes()].val).then(console.log).catch(console.error);
        BoilerController.setRelay(timerObject[now.getHours() + "-" + now.getMinutes()].val).catch(console.error);
        let reloop = () => { this.loop(timerObject); };
        schedulerTimeout = setTimeout(reloop, 5000);
    }

    stop() {
        return new Promise((resolve, reject) => {
            console.log("scheduler stop");
            clearTimeout(schedulerTimeout);
            this.isStart = false;
            resolve(true);
        });
    }

    saveData(data) {
        fs.writeFile(__basedir + '/data/scheduler.json', JSON.stringify(data, null, 1), (err) => {
            if (err) console.error("scheduler json save error");
        });
    }
};