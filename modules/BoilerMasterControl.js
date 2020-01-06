const settings = require('./Settings');
const request = require('request');
const scheduler = require('./SchedulerMasterControl')();
const axios = require('axios');

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
        //if (issaving == true) return;
        stoploop();
        axios.get(settings.getboilerdataurl).then(res => {
            console.log(new Date().toLocaleTimeString(), "get data");
            console.log(res.data.status);
            STATUS = res.data.status;
            SCHEDULER = res.data.scheduler;
            scheduler.setData(SCHEDULER);
            checkMode();
        }).catch((err) => { console.error(err);
            startloop() });
    }

    function checkMode() { //manual or scheduled
        if (STATUS.scheduler == 1) STATUS.relay = scheduler.checkJob();
        checkHardwareStatus();
    }


    function checkHardwareStatus() {
        console.log("check status");
        axios.get(settings.esp01url + settings.status, { timeout: 2000 }).then(res => {
            console.log("ESP 01 online");
            STATUS.relayonline = 1;
            setRelay();
        }).catch((err) => {
            console.log("ESP 01 offline");
            STATUS.relayonline = 0;
            setRemoteData();
        });
    }

    function setRelay() {
        if (STATUS.relay == relayactualstatus) { setRemoteData(); return; };
        console.log("set relay");
        axios.get(settings.esp01url + settings.gpiourl + STATUS.relay, { timeout: 1000 }).then(res => {
            relayactualstatus = STATUS.relay;
            console.log("relayactualstatus", relayactualstatus);
        }).catch((err) => {
            console.error("setRelay", err);
        }).finally(() => {
            console.log("set relay finally");
            setRemoteData();
        });
    }

    function setRemoteData() {
        axios.post(settings.savestatusurl, STATUS).then(res => {
            console.log("setRemoteData ok", res.data);
        }).catch(console.error).finally(() => { startloop(); });
    }

    function startloop() {
        console.log("\n\nSTART\n\n");
        interval = setInterval(getRemoteData, 10000);

    }

    function stoploop() {
        console.log("\n\nSTOP\n\n");
        clearInterval(interval);
    }

    return {
        start() {
            startloop();
        },
        stop() {
            stoploop();
        }
    }

}