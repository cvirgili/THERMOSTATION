/*jshint esversion:6*/
global._manual = 0;
global._status = 0;
global._temp = 0.0;
global._settemp = 0.0;
global._humi = 0.0;

global._esp01url = "http://192.168.1.10";
const request = require('request');
const ReadRemoteData = require('./ReadRemoteData');

module.exports = class BoilerControl {
    constructor(getremoteurl, setremoteurl) {
        this.getremoteurl = getremoteurl;
        this.setremoteurl = setremoteurl;
        this.manualurl = "/hand/";
        this.gpiourl = "/gpio/";
        this.remoteControl = new ReadRemoteData();
    }

    sendCommand(url, val, cb) {
        request.get(_esp01url + url + val, cb);
    }

    setManual(val) {
        if (val == _manual) return;
        _manual = val;
        this.sendCommand(this.manualurl, val == -1 ? 0 : 1);
        if (val == -1) return;
        this.setBoiler(val);
    }

    setBoiler(val) {
        this.sendCommand(this.gpiourl, val, (res) => { _status = res; });
    }

    checkRemote() {
        let setmanual = (m) => { this.setManual(m); };
        this.remoteControl.start(this.getremoteurl, 5000, setmanual);
    }

    setRemote(val) {

    }

    checkScheduler() {

    }

    checkTempAndHumi() {
        //##############################################
        //##############################################
    }

};