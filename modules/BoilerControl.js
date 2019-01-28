/*jshint esversion:6*/
global._manual = 0;
global._status = 0;
global._temp = 0.0;
global._settemp = 0.0;
global._humi = 0.0;
global._esp01url = "http://192.168.1.10";

const request = require('request');
const ReadRemoteData = require('./ReadRemoteData');
const Scheduler = require('./Sheduler');

module.exports = class BoilerControl {
    constructor(getremoteurl, setremoteurl) {
        this.getremoteurl = getremoteurl;
        this.setremoteurl = setremoteurl;
        this.manualurl = "/hand/";
        this.gpiourl = "/gpio/";
        this.remoteControl = new ReadRemoteData();
        this.scheduler = new Scheduler();
    }

    getStatus() {
        return _status;
    }

    sendCommand(url, val, cb) {
        request.get(_esp01url + url + val, cb);
    }

    setManual(val) {
        if (val == _manual) return val;
        _manual = val;
        this.sendCommand(this.manualurl, val == -1 ? 0 : 1, (err, res, body) => {
            if (err) console.log(err);
        });
        if (val == -1) return val;
        this.setBoiler(val);
        return val;
    }

    setBoiler(val, cb) {
        return new Promise((resolve, reject) => {
            this.sendCommand(this.gpiourl, val, (err, res, body) => {
                if (err) reject("send command error: " + err);
                else {
                    _status = body;
                    resolve(_status);
                }
            });
        });

    }

    checkRemote() {
        //let setmanual = (m) => { this.setManual(m); };
        let inst = this;
        //this.remoteControl.loop(this.getremoteurl, 5000, setmanual);
        this.remoteControl.loop(this.getremoteurl, 5000, inst.setManual);
    }

    setRemoteStatus(val) {
        return new Promise((resolve, reject) => {
            request.get(this.setremoteurl + val, (err, res, body) => {
                if (err) reject(res);
                else resolve(val);
            });
        });
    }

    startScheduler() {
        request.get(this.setremoteurl + "-1", console.log);
        //##############################################
        this.scheduler.start();
        //##############################################
    }

    stopScheduler() {
        //##############################################
        this.scheduler.start();
        //##############################################
    }

    checkTempAndHumi() {
        //##############################################
        //##############################################
    }

};