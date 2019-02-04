/*jshint esversion:6*/

const fs = require('fs');
const request = require('request');
const ReadRemoteData = require('./ReadRemoteData');
const Scheduler = require('./Scheduler');
const Stat = require('./Status');
const Status = Stat.status;
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
            Status.relayonline = 1;
            this.sendCommand(settings.setremoteurl, -1).then(() => {
                this.startScheduler();
                this.checkRemote();
            }).catch((err) => { console.error("init.sendCommand", err); });
        }).catch((err) => {
            Status.relayonline = 0;
            this.settimeout(setTimeout(this.init, 5000));
        });
    }

    static startScheduler() {
        this.scheduler.start().then(() => {
            Status.scheduler = 1;
            global.io.emit('status', Status);
            this.sendCommand(settings.esp01url + settings.manualurl, 0).catch(console.error);
        }).catch((err) => { console.error("scheduler start error", err); });
    }

    static stopScheduler() {

        this.scheduler.stop().then(() => {
            Status.scheduler = 0;
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

    static setRelay(val) {
        if (val == Status.relay) return new Promise((resolve, reject) => { resolve(val); });
        else return this.sendCommand(settings.setremoteurl, -1).then(() => {
            this.sendCommand(settings.esp01url + settings.gpiourl, val).then((v) => {
                Status.relay = parseInt(val);
                //request.post("http://www.virgili.netsons.org/smarttest.php").form({ status: JSON.stringify(Status) });
                console.log(Status);
                global.io.emit('status', Status);
            }).catch((err) => {
                console.error("setRelay error", err);
            });
        }).catch((err) => {
            console.error("setRemote error", err);
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
        ReadRemoteData.loop(settings.getremoteurl, 5000, (val) => {
            if (parseInt(val) != -1 && parseInt(val) != Status.relay) {
                this.setManual(parseInt(val));
            }
        });
    }

};