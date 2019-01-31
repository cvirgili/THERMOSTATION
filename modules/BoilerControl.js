/*jshint esversion:6*/
//global._status = { "relay": 0, "scheduler": 0 };
global._temp = 0.0;
global._settemp = 0.0;
global._humi = 0.0;

global._esp01url = "http://192.168.1.10";

const request = require('request');
const ReadRemoteData = require('./ReadRemoteData');
const Scheduler = require('./Scheduler');
const Status = require('./Status');

module.exports = class BoilerControl {

    constructor(getremoteurl, setremoteurl) {
        this.getremoteurl = getremoteurl;
        this.setremoteurl = setremoteurl;
        this.manualurl = "/hand/";
        this.gpiourl = "/gpio/";
        this.dataurl = "/data/";
        this.scheduler = new Scheduler();
    }

    sendCommand(url, val, cb) {
        request.get(_esp01url + url + val, cb);
    }

    setManual(val) {
        let doit = () => {
            if (Status.scheduler === 1) this.stopScheduler();
            this.sendCommand(this.manualurl, 1, (err, res, body) => {
                if (err) console.error(err);
            });
            this.setBoiler(val).then(console.log).catch(console.error);
        };
        this.setRemoteStatus(val).then(doit).catch((err) => { console.error("setRemoteStatus ERROR\n\n", err); });
    }

    setBoiler(val) {
        return new Promise((resolve, reject) => {
            if (val == Status.relay) resolve(Status);
            this.sendCommand(this.gpiourl, val, (err, res, body) => {
                if (err) reject("send command error: " + err);
                else {
                    Status.relay = body;
                    global.io.emit('status', Status);
                    resolve(Status);
                }
            });
        });
    }

    checkRemote() {
        let setmanual = (m) => { if (m != -1) this.setManual(m); };
        this.startScheduler();
        ReadRemoteData.loop(this.getremoteurl, 5000, setmanual);
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
        return this.setBoiler(val).then(console.log).catch(console.error);
    }

    startScheduler() {
        if (Status.scheduler == 1) return;
        return this.scheduler.start().then(() => {
            Status.scheduler = 1;
            global.io.emit('status', Status);
            console.log("scheduler started");
            //setta la variabile remota a -1
            this.setRemoteStatus("-1").then(() => {
                //spegne icona mano
                this.sendCommand(this.manualurl, 0, (err, res, body) => { console.log("sendCommand body", body); });
            }).catch(console.error);
        }).catch(console.error);
    }

    stopScheduler() {
        this.scheduler.stop().then(() => {
            Status.scheduler = 0;
            console.log("scheduler stopped");
        }).catch(console.error);
    }

    checkTempAndHumi() {
        //##############################################
        //read temp & humi from DHT11
        let temp, humi;
        let setBoiler = (val) => { this.setBoiler(val); };
        this.sendCommand(this.dataurl, temp + "-" + _settemp + "-" + humi, (err, x, y) => {
            if (temp >= _settemp) setBoiler(0);
        });
        //##############################################
    }

};