/// <reference path='./typings/tsd.d.ts' />
require('amdefine/intercept');
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var models = require('./app/models');
var rmsRest = require('./rms-rest');
var app = express();
var server = http.createServer(app);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
rmsRest.buildREST(app, models.InventoryItemModel.collectionName);
rmsRest.buildREST(app, models.VendorModel.collectionName);
rmsRest.buildREST(app, models.ShiftModel.collectionName);
rmsRest.startSocketIO(server);
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});
app.use('/app', express.static(path.join(__dirname, './app')));
app.use('/bower_components', express.static(path.join(__dirname, './bower_components')));
var port = process.env.PORT || 1337;
server.listen(port, function () {
    console.log('Express is listening on %s:%s', server.address().address, server.address().port);
});
//# sourceMappingURL=server.js.map