// reboot.js
/*jshint esversion:6*/
// Require child_process
var exec = require('child_process').exec;

// Create shutdown function
exports.reboot = (callback) => {
    exec('shutdown -r now', function(error, stdout, stderr) { callback(stdout); });
};