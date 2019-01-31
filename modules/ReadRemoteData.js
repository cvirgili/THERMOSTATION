/*jshint esversion:6*/
const request = require('request');
module.exports = class ReadRemoteData {

    constructor() {
        this.status = 0;
        this.timeout = null;
    }

    loop(url, delay, cb) {
        let inst = this;
        let restart = () => { this.loop(url, delay, cb); };
        let settimeout = () => { this.timeout = setTimeout(restart, delay); };
        request.get(url, (err, res, body) => {
            if (!err) {
                inst.status = body;
                cb(body);
            }
            settimeout();
        });
    }
};