/// <reference path='./typings/tsd.d.ts' />

require('amdefine/intercept');

import express = require('express');
import http = require('http');
import path = require('path');
import bodyParser = require('body-parser');

import Mongo = require('mongodb');
var ObjectId = Mongo.ObjectID;

import models = require('./app/models');
import rmsRest = require('./rms-rest')




var app = express();
var server = http.createServer(app);


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

rmsRest.buildREST<models.InventoryItemModel>(app, models.InventoryItemModel.collectionName);
rmsRest.buildREST<models.VendorModel>(app, models.VendorModel.collectionName);
rmsRest.buildREST<models.ShiftModel>(app, models.ShiftModel.collectionName, { get: { date : 1 } });
rmsRest.buildREST<models.KitchenOrderModel>(app, models.KitchenOrderModel.collectionName);
var io = rmsRest.startSocketIO(server);

/*var api = express.Router();
api.route('/shifts/:id/positions')
    .post(function(req, res, next) {
        var db = rmsRest.getDb();
        db.collection('shifts', function(error, items) {
            if (error) { console.error(error); return; }
            var _id = new ObjectId(req.params.id);
            var item = req.body;
            delete item._id; // _id is immutable, so don't include in $set
            item.lastModified = new Date();
            items.update(
                { "_id": _id },
                {
                    "$push": {
                        positions: {
                          "$each": [item],
                          "$sort": { start: 1 }
                        }
                    }
                },
                function(error, result) {
                    if (error) { console.error(error); return; }
                    res.send(item);
                }
            );
        });
    });*/

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
