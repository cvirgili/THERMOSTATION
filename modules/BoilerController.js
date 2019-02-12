/*jshint esversion:6*/

const fs = require('fs');
const request = require('request');
const Stat = require('./Status');
const ReadRemoteData = require('./ReadRemoteData');
const Scheduler = require('./Scheduler');
let Status = Stat.status;
const settings = JSON.parse(fs.readFileSync(__basedir + '/data/Settings.json'));

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
            Status.timestamp = new Date().getTime();
            request.post(settings.savedataremoteurl, { form: JSON.stringify(Status) }, (err, res, body) => {
                if (err) myreject(err);
                else myresolve(Status);
            });
        });
    }

    static setRelay(val) {
        //if (val == Status.relay) return new Promise((resolve, reject) => { resolve(val); });
        return this.sendCommand(settings.esp01url + settings.gpiourl, val).then((v) => {
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

    // static isManual() {
    //     return Status.scheduler == 0;
    // }

    static checkRemote() {
        ReadRemoteData.loop(settings.getremoteurl, 5000, (res) => {
            let status = JSON.parse(res);
            let isChanged = status.timestamp > Status.timestamp;
            if (isChanged == true) {
                console.log("isChanged", isChanged);
                Object.keys(Status).forEach(k => {
                    Status[k] = status[k];
                });
                if (Status.scheduler == 1) {
                    this.startScheduler();
                } else {
                    this.setManual(parseInt(Status.relay));
                }
            }
        });
    }

    static compareJSON(json1, json2) {
        let res = true;
        Object.keys(json1).forEach((k) => {
            if (json1[k] != json2[k]) res = false;
        });
        return res;
    }

};