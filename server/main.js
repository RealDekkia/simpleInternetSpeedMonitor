const fs = require('fs');
var express = require('express');
var cors = require('cors');
var app = express();
var http = require('http').Server(app);
var mysql = require('mysql');
var connection;
const settings = JSON.parse(fs.readFileSync('config.json', 'UTF8'));

console.log(settings);

function doConnect() {
    connection = mysql.createConnection({
        host: settings.database.host,
        user: settings.database.user,
        password: settings.database.password,
        database: settings.database.databaseName,
    });
    connection.connect();
}

app.use(cors());
app.use(express.static('public'));

app.get('/getPing', function (req, res) {

    if (testDateTime(req.headers["start"]) && testDateTime(req.headers["end"])) {
        getDataFromDB("ping", req.headers["start"], req.headers["end"], sendData, res);
    } else {
        res.send("WRONG FORMAT");
    }
});

app.get('/getUp', function (req, res) {

    if (testDateTime(req.headers["start"]) && testDateTime(req.headers["end"])) {
        getDataFromDB("up", req.headers["start"], req.headers["end"], sendData, res);
    } else {
        res.send("WRONG FORMAT");
    }
});

app.get('/getDown', function (req, res) {

    if (testDateTime(req.headers["start"]) && testDateTime(req.headers["end"])) {
        getDataFromDB("down", req.headers["start"], req.headers["end"], sendData, res);
    } else {
        res.send("WRONG FORMAT");
    }
});

app.get('/getRange', function (req, res) {
    var order = "ASC";
    doConnect();
    if (req.headers["order"] == "asc") {
        order = "ASC";
    } else if (req.headers["order"] == "desc") {
        order = "DESC";
    }
    connection.query("SELECT measureTime FROM log ORDER BY ID " + order + " LIMIT 1;", function (error, results, fields) {
        if (error) throw error;
        sendData(res, results);
    });
    connection.end();

});

function sendData(res, dat) {
    res.send(dat);
}

function getDataFromDB(row, start, end, callback, res) {
    doConnect();
    connection.query("SELECT " + row + " AS 'dat', measureTime FROM log WHERE measureTime BETWEEN '" + start + "' AND '" + end + "' ORDER BY ID ASC;", function (error, results, fields) {
        if (error) throw error;
        callback(res, results);
    });
    connection.end();
}

function testDateTime(dt) {
    //https://gist.github.com/x-strong/5378739
    const regex = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\s([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return regex.test(dt);
}

http.listen(settings.serverPort, function () {
    console.log('listening on port ' + settings.serverPort);
});
