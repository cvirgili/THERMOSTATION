const settings = require('./Settings');
const request = require('request');

module.exports = () => {
    var interval, issaving, relayactualstatus = 0;
    var SCHEDULER;
    var STATUS = {
        relay: 0,
        relayonline: 1,
        scheduler: 1,
        temp: 0,
        actualTreshold: 0,
        humi: 0
    };

    function getRemoteData() {
        if (issaving == true) return;
        request.get(settings.getboilerdataurl + "STATUS", (err, res, body) => {
            console.log("response STATUS", body);
            if (!err) {
                STATUS = JSON.parse(body).status;
                SCHEDULER = JSON.parse(body).scheduler;
                console.log("STATUS", STATUS);
                console.log("SCHEDULER", SCHEDULER);
                setRelay();
            } else {
                console.log(err);
            }
        });
    }

    function setRemoteData() {
        issaving = true;
        request.post(settings.savestatusurl, { form: JSON.stringify(STATUS) }, (err, res, body) => {
            if (err) console.error(err);
            else console.log("setRemoteData", body)
            issaving = false;
        });
    }

    function setRelay() {
        if (STATUS.relay === relayactualstatus) return;
        issaving = true;
        request.get(settings.esp01url + settings.gpiourl + STATUS.relay, (err, res, body) => {
            if (err) {
                console.error("setRelay", err);
                if (STATUS.relayonline == 1) {
                    STATUS.relayonline = 0;
                    setRemoteData();
                }
            } else {
                relayactualstatus = parseInt(body);
                console.log("relayactualstatus", relayactualstatus);
                if (STATUS.relayonline == 0) {
                    STATUS.relayonline = 1;
                    setRemoteData();
                }
            }
            issaving = false;
        });
    }

    return {
        start() {
            console.log("START");
            interval = setInterval(getRemoteData, 4000);
        },

        stop() {
            console.log("STOP");
            clearInterval(interval);
            //clearTimeout(interval);
        }
    }

}