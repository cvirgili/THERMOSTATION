/*jshint esversion:6*/

const fs = require('fs');
const request = require('request');
const ReadRemoteData = require('./ReadRemoteData');
const Scheduler = require('./Scheduler');
const Stat = require('./Status');
let Status = Stat.status;
const settings = JSON.parse(fs.readFileSync(__basedir + '/data/Settings.json'));
const relayvalues = [0, 1];
module.exports = class BoilerController {
    static settimeout(to) {
        this.timeout = to;
    }

    static clearTimeout() {
        clearTimeout(this.timeout);
    }

    static init() {
        this.timeout = null;
        this.setRelay(0).then((v) => {
            this.startScheduler();
            this.checkRemote();
        }).catch((err) => {
            Status.relayonline = 0;
            this.settimeout(setTimeout(this.init, 5000));
        });
    }


    static startScheduler() {
        this.scheduler.start().then(() => {
            Status.scheduler = 1;
            this.sendStatusToRemote().catch((err) => { console.error("sendStatusToRemote error", err); });
            global.io.emit('status', Status);
            this.sendCommand(settings.esp01url + settings.manualurl, 0).catch(console.error);
        }).catch((err) => { console.error("scheduler start error", err); });
    }

    static stopScheduler() {
        this.scheduler.stop().then(() => {
            Status.scheduler = 0;
            this.sendStatusToRemote().catch((err) => { console.error("sendStatusToRemote error", err); });
            global.io.emit('status', Status);
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
        if (val == Status.relay) return new Promise((resolve, reject) => { resolve(val); });
        else return this.sendCommand(settings.esp01url + settings.gpiourl, val).then((v) => {
            Status.relay = parseInt(val);
            Status.relayonline = 1;
            //synch remote data
            this.sendStatusToRemote().catch(console.error);
            global.io.emit('status', Status);
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

    static isManual() {
        return Status.scheduler == 0;
    }

    static checkRemote() {
        ReadRemoteData.loop(settings.getremoteurl, 5000, (res) => {
            let status = JSON.parse(res);

            let arEquals = this.compareJSON(Status, status);
            console.log("arEquals", arEquals);
            console.log("Status", Status);
            console.log("status", status);

            if (!arEquals) {
                Object.keys(Status).forEach(k => {
                    Status[k] = status[k];
                });
                if (Status.scheduler == 1) {
                    this.startScheduler();

                } else {
                    this.setManual(parseInt(Status.remoterelay));
                }
            }

            // if (parseInt(status.remoterelay) != -1 && parseInt(status.remoterelay) != Status.relay) {
            //     this.setManual(parseInt(status.remoterelay));
            // }
        });
    }

    static compareJSON(json1, json2) {
        Object.keys(json1).forEach((k) => {
            if (json1[k] === json2[k]) return true;
        });
        return false;
    }

};