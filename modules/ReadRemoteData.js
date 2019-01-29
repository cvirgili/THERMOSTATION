/*jshint esversion:6*/
const request = require('request');
module.exports = class ReadRemoteData {

    constructor() {
        this.status = 0;
    }

    loop(url, delay, cb) {
        let inst = this;
        let restart = () => { this.loop(url, delay, cb); };
        request.get(url, (err, res, body) => {
            // console.log("body", body);
            // console.log("_status", _status);
            if (!err) {
                inst.status = body;
                cb(body);
            }
            setTimeout(restart, delay);
        });
    }
};