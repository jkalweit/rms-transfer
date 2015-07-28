/// <reference path='./typings/tsd.d.ts' />

require('amdefine/intercept');

import express = require('express');
import http = require('http');
import path = require('path');
import bodyParser = require('body-parser');

import models = require('./app/models');
import rmsRest = require('./rms-rest')

var app = express();
var server = http.createServer(app);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


rmsRest.buildREST<models.InventoryItemModel>(app, models.InventoryItemModel.collectionName);
rmsRest.buildREST<models.VendorModel>(app, models.VendorModel.collectionName);
rmsRest.buildREST<models.ShiftModel>(app, models.ShiftModel.collectionName);
rmsRest.startSocketIO(server);

// index
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});


app.use('/app', express.static(path.join(__dirname, './app')));
app.use('/bower_components', express.static(path.join(__dirname, './bower_components')));


var port = process.env.PORT || 1337;
server.listen(port, function() {
    console.log('Express is listening on %s:%s', server.address().address, server.address().port);
});
