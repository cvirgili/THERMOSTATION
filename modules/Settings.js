/*jshint esversion:6*/
exports.esp01url = "http://192.168.1.10";
exports.manualurl = "/hand/";
exports.gpiourl = "/gpio/";
exports.dataurl = "/data/";
exports.status = "/status/";
exports.savestatusurl = "https://virgili.netsons.org/save-thermostation-data.php";
exports.saveschedulerurl = "https://virgili.netsons.org/save-scheduler.php";
exports.getboilerdataurl = "https://virgili.netsons.org/read_boiler_data.php";
//connectionString :`Data Source=62.149.153.28;Initial Catalog=MSSql187380;Integrated Security=False;User ID=MSSql187380;Connect Timeout=0;Encrypt=False;Packet Size=4096`
//connectionString :`Driver={SQL Server Native Client 11.0};Server={62.149.153.28,1433};Database={MSSql187380};Uid={MSSql187380};Pwd={u4uc43436l};Trusted_Connection={#{trusted}};`
exports.mssqlConfig = {
    server: '62.149.153.28',
    user: 'MSSql187380',
    password: 'u4uc43436l',
    database: 'MSSql187380',
    connectionString: `Driver={SQL Server Native Client 11.0};Server={62.149.153.28,1433};Database={MSSql187380};Uid={MSSql187380};Pwd={u4uc43436l};};`
}