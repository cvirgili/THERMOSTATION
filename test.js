// global.__basedir = __dirname;
const fs = require('fs');
const settings = require('./modules/Settings');
// const request = require('request');
// const Scheduler = require('./modules/Scheduler');
// let sched = new Scheduler();


// sched.chekData();

//request.get("https://virgili.netsons.org/scheduler.json", (res, err, body) => { console.log(JSON.parse(body)); });

//const boilerMaster = require('./modules/BoilerMasterControl')();

//boilerMaster.start();

//console.log(JSON.stringify(JSON.parse(fs.readFileSync('scheduler.json'))));


//console.log(fs.readFileSync('https://virgili.netsons.org/read_boiler_data.php'));


//DB MSSQL

const sql = require('mssql');


(async() => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect(settings.mssqlConfig);
        console.log('connected');
        const result = await sql.query `select * from THERMOSTATION where id = 1`
        console.log('resultr', esult);
    } catch (err) {
        // ... error checks
        console.error(err);
    }
})();