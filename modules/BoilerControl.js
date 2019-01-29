/*jshint esversion:6*/
global._manual = 0;
global._schedulerActive = 0;
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
        this.dataurl = "/data/";
        this.remoteControl = new ReadRemoteData();
        this.scheduler = new Scheduler();
    }

    getStatus() {
        return { "relay": _status, "scheduler": _schedulerActive };
    }

    sendCommand(url, val, cb) {
        request.get(_esp01url + url + val, cb);
    }

    setManual(val, isremote) {
        let doit = () => {
            this.stopScheduler();
            if (val == _manual) return val;
            _manual = val;
            this.sendCommand(this.manualurl, 1, (err, res, body) => {
                if (err) console.log(err);
            });
            this.setBoiler(val).then((s) => { return s; }).catch(console.log);
        };
        if (isremote == false)
            this.setRemoteStatus(val).then(doit).catch((res) => { console.log(res); return val; });
        else
            doit();

    }

    setBoiler(val) {
        return new Promise((resolve, reject) => {
            this.sendCommand(this.gpiourl, val, (err, res, body) => {
                if (err) reject("send command error: " + err);
                else {
                    _status = body;
                    global.io.emit('status', { "relay": _status, "scheduler": _schedulerActive });
                    resolve(_status);
                }
            });
        });

    }

    checkRemote() {
        let setmanual = (m) => { if (m != -1) this.setManual(m, true); };
        this.startScheduler().then(() => {
            this.remoteControl.loop(this.getremoteurl, 5000, setmanual);
        });
    }

    setRemoteStatus(val) {
        return new Promise((resolve, reject) => {
            request.get(this.setremoteurl + val, (err, res, body) => {
                if (err) reject(res);
                else resolve(val);
            });
        });
    }

    schedulerAction(val) {
        //setta il relay a <val>
        return this.setBoiler(val).then(console.log).catch(console.log);
    }

    startScheduler() {

        this.scheduler.start().then(() => {
            _schedulerActive = 1;
            global.io.emit('status', { "relay": _status, "scheduler": _schedulerActive });
            console.log("scheduler started");
            //setta la variabile remota a -1
            this.setRemoteStatus("-1").then(() => {
                //spegne icona mano
                this.sendCommand(this.manualurl, 0, console.log);
            }).catch(console.log);
        }).catch(console.log);
    }

    stopScheduler() {
        this.scheduler.stop().then(() => {
            _schedulerActive = 0;
            console.log("scheduler stopped");
        }).catch(console.log);
    }

    checkTempAndHumi() {
        //##############################################
        //read temp & humi from DHT11
        let temp, humi;
        let setBoiler = (val) => { this.setBoiler(val); };
        this.sendCommand(this.dataurl, temp + "-" + _settemp + "-" + humi, (err, x, y) => {
            if (temp >= _settemp) {
                setBoiler(0);
            }
        });
        //##############################################
    }

};