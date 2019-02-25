/*jshint esversion:6*/

const fs = require('fs');
const request = require('request');
const Stat = require('./Status');
const ReadRemoteData = require('./ReadRemoteData');
const Scheduler = require('./Scheduler');
const settings = JSON.parse(fs.readFileSync(__basedir + '/data/settings.json'));

module.exports = class BoilerController {

    static init() {
        this.Status = Stat.status;
        BoilerController.issending = false;
        clearTimeout(BoilerController.timeout);
        this.checkRelayStatus();
        this.sendStatusToRemote().then((stat) => {
            this.setRelay(0).then((v) => {
                this.startScheduler();
                this.checkRemote();
            }).catch((err) => {
                BoilerController.timeout = setTimeout(this.init, 5000);
            });
        }).catch(console.error);
    }

    static startScheduler() {
        this.scheduler.start().then(() => {
            this.Status.scheduler = 1;
            this.sendStatusToRemote().then(() => {
                this.sendCommand(settings.esp01url + settings.manualurl, 0).catch(console.error);
            }).catch((err) => { console.error("sendStatusToRemote error", err); });
        }).catch((err) => { console.error("scheduler start error", err); });
    }

    static stopScheduler() {
        this.scheduler.stop().then(() => {
            this.Status.scheduler = 0;
            this.sendStatusToRemote().catch((err) => { console.error("sendStatusToRemote error", err); });
        }).catch((err) => { console.error("scheduler stop error", err); });
    }

    static sendCommand(url, val) {
        return new Promise((resolve, reject) => {
            let myresolve = (x) => { resolve(x); };
            let myreject = (x) => { reject(x); };
            request.get(url + val, (err, res, body) => {
                if (err) myreject(err);
                else {
                    console.log("response from", url + val, body);
                    myresolve(body);
                }
            });
        });
    }

    static sendStatusToRemote() {
        return new Promise((resolve, reject) => {
            let myresolve = (x) => {
                console.log("sendStatusToRemote", new Date().toLocaleTimeString(), JSON.stringify(this.Status));
                resolve(x);
            };
            let myreject = (x) => { reject(x); };
            BoilerController.issending = true;
            request.post(settings.savedataremoteurl, { form: JSON.stringify(this.Status) }, (err, res, body) => {
                BoilerController.issending = false;
                if (err) myreject(err);
                else myresolve(this.Status);
            });
        });
    }

    static setRelay(val) {
        if (parseInt(val) === parseInt(this.Status.relay)) return new Promise((resolve, reject) => { resolve(val); });
        return this.sendCommand(settings.esp01url + settings.gpiourl, val).then((v) => {
            this.Status.relay = parseInt(v);
            this.Status.relayonline = 1;
            this.sendStatusToRemote().catch(console.error);
        }).catch((err) => {
            console.error("setRelay error", err);
            this.Status.relayonline = 0;
            this.sendStatusToRemote();
        });
    }

    static setManual(val) {
        this.stopScheduler();
        if (parseInt(val) === parseInt(this.Status.relay)) return;
        this.sendCommand(settings.esp01url + settings.manualurl, 1).then((v) => {
            this.setRelay(parseInt(val));
        }).catch((err) => { console.error("setManualError", err); });
    }

    static checkRemote() {
        ReadRemoteData.loop("https://virgili.netsons.org/Status.json", 2000, (res) => {
            if (!res || BoilerController.issending == true) return;
            let status = JSON.parse(res);
            let isChanged = this.compareJSON(status, this.Status);
            if (isChanged == true) {
                console.log("isChanged", isChanged);
                if (parseInt(status.scheduler) === 1) {
                    this.startScheduler();
                } else {
                    this.setManual(parseInt(status.relay));
                }
            }
        });
    }

    static checkRelayStatus() {
        BoilerController.statusInterval = setInterval(() => {
            this.sendCommand("http://192.168.1.10/status/", "").then((v) => {
                this.Status.relayonline = 1;
                console.log("Relay online");
            }).catch(() => {
                this.Status.relayonline = 0;
                console.log("Relay offline");
            });
        }, 5000);
    }

    static compareJSON(json1, json2) {
        return JSON.stringify(json1) != JSON.stringify(json2);
    }

    /*
    
    "relayonline":1,
    "scheduler":1,
    "relay":0,

    Default
    110 => 6

    if < 4 (100) relay offline

    100 => 4
    manual off

    101 => 5
    manual on

    110 => 6
    auto off

    111 => 7
    auto on





    "temp":0,
    "actualTreshold":0,
    "humi":0
    
    */

};