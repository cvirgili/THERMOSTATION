/*jshint esversion:6*/

const fs = require('fs');
const request = require('request');
const Stat = require('./Status');
const ReadRemoteData = require('./ReadRemoteData');
const Scheduler = require('./Scheduler');
let Status = Stat.status;
const settings = JSON.parse(fs.readFileSync(__basedir + '/data/settings.json'));

module.exports = class BoilerController {

    static settimeout(to) {
        BoilerController.timeout = to;
    }

    static clearTimeout() {
        clearTimeout(BoilerController.timeout);
    }

    static init() {
        BoilerController.timeout = null;
        this.sendStatusToRemote().then((stat) => {
            console.log("init status", stat);
            this.setRelay(0).then((v) => {
                this.startScheduler();
                this.checkRemote();
            }).catch((err) => {
                this.settimeout(setTimeout(this.init, 5000));
            });
        }).catch(console.error);
    }

    static startScheduler() {
        this.scheduler.start().then(() => {
            Status.scheduler = 1;
            this.sendStatusToRemote().then(() => {
                //global.io.emit('status', Status);
                this.sendCommand(settings.esp01url + settings.manualurl, 0).catch(console.error);
            }).catch((err) => { console.error("sendStatusToRemote error", err); });
        }).catch((err) => { console.error("scheduler start error", err); });
    }

    static stopScheduler() {
        this.scheduler.stop().then(() => {
            Status.scheduler = 0;
            this.sendStatusToRemote().then(() => {
                //global.io.emit('status', Status);
            }).catch((err) => { console.error("sendStatusToRemote error", err); });
        }).catch((err) => { console.error("scheduler stop error", err); });
    }

    static sendCommand(url, val) {
        return new Promise((resolve, reject) => {
            let myresolve = (x) => { resolve(x); };
            let myreject = (x) => { reject(x); };
            request.get(url + val, (err, res, body) => {
                if (err) myreject(err);
                else myresolve(val);
            });
        });
    }

    static sendStatusToRemote() {
        return new Promise((resolve, reject) => {
            let myresolve = (x) => { resolve(x); };
            let myreject = (x) => { reject(x); };
            request.post(settings.savedataremoteurl, { form: JSON.stringify(Status) }, (err, res, body) => {
                if (err) myreject(err);
                else myresolve(Status);
            });
        });
    }

    static setRelay(val) {
        return this.sendCommand(settings.esp01url + settings.gpiourl, val).then((v) => {
            Status.relay = parseInt(val);
            Status.relayonline = 1;
            //synch remote data
            this.sendStatusToRemote().then(() => {
                //global.io.emit('status', Status);
            }).catch(console.error);
        }).catch((err) => {
            console.error("setRelay error", err);
            Status.relayonline = 0;
            this.sendStatusToRemote();
        });
    }

    static setManual(val) {
        this.stopScheduler();
        this.sendCommand(settings.esp01url + settings.manualurl, 1).then(() => {
            this.setRelay(val);
        }).catch((err) => { console.error("setManualError", err); });
    }

    static checkRemote() {
        ReadRemoteData.loop(settings.getremoteurl, 2000, (res) => {
            if (!res) return;
            let status = JSON.parse(res);
            let isChanged = this.compareJSON(status, Status);
            if (isChanged == true) {
                console.log("isChanged", isChanged);
                Status = JSON.parse(JSON.stringify(status));
                if (Status.scheduler == 1) {
                    this.startScheduler();
                } else {
                    this.setManual(parseInt(Status.relay));
                }
            }
        });
    }

    static compareJSON(json1, json2) {
        return JSON.stringify(json1) != JSON.stringify(json2);
    }

};