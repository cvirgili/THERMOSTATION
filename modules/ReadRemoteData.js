/*jshint esversion:6*/
const request = require('request');
module.exports = class ReadRemoteData {

    constructor() {
        ReadRemoteData.timeout = null;
    }

    static loop(url, delay, cb) {
        let inst = this;
        let restart = () => { this.loop(url, delay, cb); };
        let settimeout = () => { ReadRemoteData.timeout = setTimeout(restart, delay); };
        request.get(url, (err, res, body) => {
            if (!err) {
                cb(body);
            }
            clearTimeout(ReadRemoteData.timeout);
            settimeout();
        });
    }
};