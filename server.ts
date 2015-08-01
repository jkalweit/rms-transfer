/// <reference path='./typings/tsd.d.ts' />

require('amdefine/intercept');

import express = require('express');
import http = require('http');
import path = require('path');
import bodyParser = require('body-parser');
import socketio = require('socket.io');

//import Mongo = require('mongodb');
//var ObjectId = Mongo.ObjectID;

import models = require('./app/models');
//import rmsRest = require('./rms-rest');
import fp = require('./FilePersistence');



var app = express();
var server = http.createServer(app);


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var io = socketio(server);

var collections = ['inventory_items'];

collections.forEach((collectionName) => {
    var persistence = new fp.FilePersistence(collectionName);
    console.log('Setting up namespace: \'/' + collectionName + '\'');
    var namespace = io.of('/' + collectionName);
    namespace.on('connection', (socket) => {
        console.log('someone connected to ' + collectionName);
        socket.on('crud', (request) => {
            console.log('Do action: ' + collectionName + ': ' + JSON.stringify(request));
            if (request.action === 'query') {
                socket.emit('queryed', {
                    requestId: request.id,
                    data: persistence.query()
                });
            } else if (request.action === 'upsert') {
                var result = {
                    requestId: request.id,
                    data: persistence.upsert(request.data)
                };
                socket.emit('upserted', result);
                namespace.emit('itemUpserted', result.data);
            } else if (request.action === 'remove') {
                persistence.remove(request.data);;
                socket.emit('removed', {
                    requestId: request.id,
                    data: request.data._id
                });
                namespace.emit('itemRemoved', result.data._id);
            }

        });
    });
});


/*rmsRest.buildREST<models.InventoryItemModel>(app, models.InventoryItemModel.collectionName);
rmsRest.buildREST<models.VendorModel>(app, models.VendorModel.collectionName);
rmsRest.buildREST<models.ShiftModel>(app, models.ShiftModel.collectionName, { get: { date : 1 } });
rmsRest.buildREST<models.KitchenOrderModel>(app, models.KitchenOrderModel.collectionName);*/
//var io = rmsRest.startSocketIO(server);

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
app.use('/content', express.static(path.join(__dirname, './content')));

var port = process.env.PORT || 1337;
server.listen(port, function() {
    console.log('Express is listening on %s:%s', server.address().address, server.address().port);
});
