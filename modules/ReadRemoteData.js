/*jshint esversion:6*/
const http = require('http');
module.exports = class ReadRemoteData {

    constructor() {
        this.status = 0;
        this.boilerrelayurl = 'http://192.168.1.10/gpio/';
    }

    boilerget() {
        http.get(this.boilerrelayurl + this.status, function(res) {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log('data', data);
            });
        }).on('error', (err) => {
            console.log('req error', err);
        });

    }

    loop(url, delay) {
        //'http://virgili.netsons.org/read_boiler_status.php'
        let restart = () => { this.loop(url, delay); };
        let setStatus = (s) => {
            if (this.status != s) {
                this.status = s;
                this.boilerget();
            }
        };
        http.get(url, function(res) {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                // console.log('data', data);
                setStatus(data);
                setTimeout(restart, delay);
            });
        }).on('error', (err) => {
            console.log('req error', err);
            setTimeout(restart, delay);
        });
    }

};