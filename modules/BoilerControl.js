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

    setManual(val, isremote) {
        let doit = () => {
            if (val == _manual) return val;
            _manual = val;
            this.sendCommand(this.manualurl, 1, (err, res, body) => {
                if (err) console.log(err);
            });
            this.setBoiler(val).then((s) => { return s; }).catch(console.log);
        };
        if (isremote == false)
            this.setRemoteStatus(-1).then(doit).catch((res) => { console.log(res); return val; });
        else
            doit();

    }

    setBoiler(val) {
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
        let setmanual = (m) => { if (m != -1) this.setManual(m, true); };
        this.remoteControl.loop(this.getremoteurl, 5000, setmanual);
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