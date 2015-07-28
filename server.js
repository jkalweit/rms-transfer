/// <reference path='./typings/tsd.d.ts' />
require('amdefine/intercept');
var express = require('express');
var Mongo = require('mongodb');
var bodyParser = require('body-parser');
var http = require('http');
var socketio = require('socket.io');
var path = require('path');
var db = require('./db');
var models = require('./app/models');
var MongoClient = Mongo.MongoClient;
var ObjectId = Mongo.ObjectID;
var url = 'mongodb://localhost:27017/test2';
var app = express();
var server = http.createServer(app);
var io = socketio(server);
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
function buildREST(collectionName) {
    var api = express.Router();
    api.route('/' + collectionName)
        .get(function (req, res, next) {
        db.get(collectionName, {}, function (result) {
            res.send(result);
        });
    })
        .post(function (req, res, next) {
        db.insert(collectionName, req.body, function (result) {
            io.emit('updated');
            res.send(result);
        });
    });
    api.route('/' + collectionName + '/:id')
        .get(function (req, res, next) {
        db.getById(collectionName, req.params.id, function (result) {
            res.send(result);
        });
    })
        .patch(function (req, res, next) {
        db.patch(collectionName, req.body, function (result) {
            io.emit('updated');
            res.send(result);
        });
    }).delete(function (req, res, next) {
        db.remove(collectionName, req.params.id, function (result) {
            io.emit('updated');
            res.send(result);
        });
    });
    app.use('/api', api);
}
buildREST(models.InventoryItemModel.collectionName);
buildREST(models.VendorModel.collectionName);
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