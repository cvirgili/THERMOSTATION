/*jshint esversion:6*/
const fs = require('fs');
const BoilerController = require('./BoilerController');
const request = require('request');

module.exports = class Scheduler {

    constructor() {
        this.isStart = false;
        Scheduler.schedulerTimeout = null;
        Scheduler.schedData = JSON.parse(fs.readFileSync(__basedir + '/data/scheduler.json'));
        this.chekData();
        this.timer = {};
    }

    resetTimerArray() {
        this.timer = {};
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m++) {
                this.timer[h + "-" + m] = { "val": 0, "treshold": 0 };
            }
        }
        return this.timer;
    }

    getJobsOfTheDay(day) {
        Scheduler.timerObject = this.resetTimerArray();
        Scheduler.timerObject.today = day;
        Scheduler.schedData.week.find((item) => { return item.id == day; }).jobs.forEach((job) => {
            for (let h = job.on.hour; h <= job.off.hour; h++) {
                let last = (h === job.off.hour) ? job.off.minute : 60;
                let first = (h === job.on.hour) ? job.on.minute : 0;
                for (let m = first; m < last; m++) {
                    Scheduler.timerObject[h + "-" + m].val = 1;
                    Scheduler.timerObject[h + "-" + m].treshold = job.on.treshold;
                }
            }
        });
        return Scheduler.timerObject;
    }

    start() {
        return new Promise((resolve, reject) => {
            if (this.isStart == true) { resolve(true); return; }
            this.isStart = true;
            console.log("scheduler start");
            this.getJobsOfTheDay(new Date().getDay());
            this.loop();
            resolve(true);
        });
    }

    stop() {
        return new Promise((resolve, reject) => {
            if (this.isStart == false) { resolve(true); return; }
            console.log("scheduler stop");
            clearTimeout(Scheduler.schedulerTimeout);
            this.isStart = false;
            resolve(true);
        });
    }

    loop() {
        clearTimeout(Scheduler.schedulerTimeout);
        if (this.isStart == false) {
            return;
        }
        let now = new Date();
        if (Scheduler.timerObject.today != now.getDay()) {
            this.stop().then(() => {
                this.start();
                return;
            });
        }
        BoilerController.setRelay(Scheduler.timerObject[now.getHours() + "-" + now.getMinutes()].val).catch(console.error);
        now = null;
        let reloop = () => { this.loop(); };
        Scheduler.schedulerTimeout = setTimeout(reloop, 5000);
    }


    chekData() {
        let loop = () => {
            //            request.get("https://virgili.netsons.org/scheduler.json", (err, res, body) => {
            request.get("https://virgili.netsons.org/read_boiler_scheduler.php", (err, res, body) => {
                if (!err) {
                    if (body != JSON.stringify(Scheduler.schedData)) {
                        console.log("NEW SCHED", JSON.parse(body));
                        Scheduler.schedData = JSON.parse(body);
                        fs.writeFile(__basedir + '/data/scheduler.json', body, (err) => {
                            this.getJobsOfTheDay(new Date().getDay());
                        });
                    }
                } else {
                    console.error(err);
                }

            });
        };

        let interval = setInterval(loop, 5000);
    }

};