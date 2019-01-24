/*jshint esversion:6*/
const http = require('http');
const request = require('request');
module.exports = class ReadRemoteData {

    constructor() {
        this.status = 0;
        this.boilerrelayurl = 'http://192.168.1.10/gpio/';
    }

    start(url, delay, cb) {
        let restart = () => { this.start(url, delay, cb); };
        let setStatus = (s) => { this.status = s; };
        request.get(url, (err, res, body) => {
            console.log("error", err);
            console.log("res", res);
            console.log("body", body);
            if (!err) {
                setStatus(body);
                cb(body);
            }
            setTimeout(restart, delay);
        });
    }

};