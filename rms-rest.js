/// <reference path='./typings/tsd.d.ts' />
var express = require('express');
var Mongo = require('mongodb');
var socketio = require('socket.io');
var db = require('./db');
var MongoClient = Mongo.MongoClient;
var ObjectId = Mongo.ObjectID;
var url = 'mongodb://localhost:27017/test2';
var io;
function getDb() {
    return db.db;
}
exports.getDb = getDb;
function startSocketIO(server) {
    io = socketio(server);
    io.on('connection', function (socket) {
        console.log('a user connected');
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    });
    return io;
}
exports.startSocketIO = startSocketIO;
function buildREST(app, collectionName, sort) {
    if (sort === void 0) { sort = {}; }
    var api = express.Router();
    api.route('/' + collectionName)
        .get(function (req, res, next) {
        db.get(collectionName, {}, sort, function (result) {
            res.send(result);
        });
    })
        .post(function (req, res, next) {
        db.insert(collectionName, req.body, function (result, item) {
            io.emit('updated:' + collectionName, {
                action: "inserted",
                item: item,
                result: result
            });
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
        db.patch(collectionName, req.body, function (result, patch) {
            io.emit('updated:' + collectionName, {
                action: "updated",
                patch: patch,
                result: result
            });
            res.send(result);
        });
    }).delete(function (req, res, next) {
        db.remove(collectionName, req.params.id, function (result, id) {
            io.emit('updated:' + collectionName, {
                action: "deleted",
                id: id,
                result: result
            });
            res.send(result);
        });
    });
    app.use('/api', api);
    return api;
}
exports.buildREST = buildREST;
//# sourceMappingURL=rms-rest.js.map