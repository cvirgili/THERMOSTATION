const Scheduler = require('./modules/Scheduler');
global.__basedir = __dirname;
const sch = new Scheduler();

sch.start();