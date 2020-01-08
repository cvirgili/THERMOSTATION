/*jshint esversion:6*/
const host = "https://cristiano-virgili.me/thermostation"
exports.esp01url = "http://192.168.1.10";
exports.manualurl = "/hand/";
exports.gpiourl = "/gpio/";
exports.dataurl = "/data/";
exports.status = "/status/";
exports.savestatusurl = `${host}/save-thermostation-data.php`;
exports.saveschedulerurl = `${host}/save-scheduler.php`;
exports.getboilerdataurl = `${host}/read_boiler_data.php`;