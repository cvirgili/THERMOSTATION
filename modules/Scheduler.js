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
            let w = 0;
            this.schedData.week.forEach((element) => {
                //console.log("############################################");
                //console.log("Giorno", w);
                let nextcount = 1;
                let HourOn, HourOff, MinuteOn, MinuteOff, nextJob, jOn, jOff, job;

                for (let i = 0; i < element.jobs.length; i++) {
                    job = element.jobs[i];
                    //console.log("=>", i);

                    if (nextcount < element.jobs.length) {
                        nextJob = element.jobs[nextcount];
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


                    ruleOn.dayOfWeek = element.id;
                    ruleOn.hour = HourOn;
                    ruleOn.minute = MinuteOn;

                    ruleOff.dayOfWeek = element.id;
                    ruleOff.hour = HourOff;
                    ruleOff.minute = MinuteOff;

                    // console.log("H ON", HourOn, "M ON", MinuteOn);
                    // console.log("H OFF", HourOff, "M OFF", MinuteOff);
                    /*jOn = */
                    //schedule.scheduleJob(ruleOn, function() { global.boilerControl.schedulerAction(1).then(console.log).catch(console.error); });
                    /*jOff = */
                    //schedule.scheduleJob(ruleOff, function() { global.boilerControl.schedulerAction(0).then(console.log).catch(console.error); });
                    //this.jobs.push(jOn);
                    //this.jobs.push(jOff);
                    nextcount++;
                }

                //console.log("############################################");
                w++;
            });
            this.loop();
            resolve(true);
        });
    }

    loop() {
        //############################################################
        let reloop = () => { this.loop(); };
        console.log("day", new Date().getDay());
        console.log("hour", new Date().getHours());
        console.log("minute", new Date().getMinutes());

        console.log(this.schedData.week.find((item) => { return item.id == new Date().getDay(); }));
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