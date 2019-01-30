/* jshint esversion:6 */

const app = require('express')();

let status = 0;

app.get('/gpio/:n', (req, res) => {
    status = req.params.n;
    res.send(status);
});

app.get('/hand/:n', (req, res) => {
    res.send(req.params.n);
});

app.get('/status/:n', (req, res) => {
    res.send(status);
});



app.listen(80, "192.168.1.10", () => {
    console.log("simul array listening :80");
});