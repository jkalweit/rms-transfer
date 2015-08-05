/// <reference path='./typings/tsd.d.ts' />
require('amdefine/intercept');
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var socketio = require('socket.io');
var app = express();
var server = http.createServer(app);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var io = socketio(server);
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});
app.use('/app', express.static(path.join(__dirname, './app')));
app.use('/styles', express.static(path.join(__dirname, './styles')));
app.use('/bower_components', express.static(path.join(__dirname, './bower_components')));
app.use('/content', express.static(path.join(__dirname, './content')));
var port = process.env.PORT || 1337;
server.listen(port, function () {
    console.log('Express is listening on %s:%s', server.address().address, server.address().port);
});
//# sourceMappingURL=server.js.map