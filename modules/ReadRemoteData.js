/*jshint esversion:6*/
const request = require('request');
module.exports = class ReadRemoteData {

    constructor() {
        ReadRemoteData.timeout = null;
    }

    static loop(url, delay, cb) {
        let restart = () => { this.loop(url, delay, cb); };
        request.get(url, (err, res, body) => {
            if (!err) {
                cb(body);
            }
            clearTimeout(ReadRemoteData.timeout);
            ReadRemoteData.timeout = setTimeout(restart, delay);
        });
    }

    // static getData(url, cb) {
    //     request.get(url, (err, res, body) => {
    //         if (!err) {
    //             cb(body);
    //         }
    //     });
    // }
};