/// <reference path='./typings/tsd.d.ts' />
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
        socket.on('query', function (requestId, path, query) {
            console.log('query: ' + path + ': ' + JSON.stringify(query));
            query = query || {};
            query.filter = query.filter || {};
            query.sort = query.sort || {};
            db.get(path, query.filter, query.sort, function (data) {
                socket.emit('queryed:' + path, {
                    requestId: requestId,
                    data: data
                });
            });
        });
        socket.on('insert', function (requestId, path, data) {
            console.log('insert: ' + path + ': ' + JSON.stringify(data));
            db.insert(path, data, function (result, item) {
                socket.emit('inserted:' + path, {
                    requestId: requestId,
                    result: result,
                    data: item
                });
            });
        });
        socket.on('update', function (requestId, path, data) {
            console.log('remove: ' + path + ': ' + JSON.stringify(data));
            db.patch(path, data, function (result, patch) {
                socket.emit('updated:' + path, {
                    requestId: requestId,
                    result: result,
                    data: patch
                });
            });
        });
        socket.on('remove', function (requestId, path, id) {
            console.log('remove: ' + path + ': ' + id);
            db.remove(path, id, function (result, id) {
                socket.emit('removed:' + path, {
                    requestId: requestId,
                    result: result,
                    data: id
                });
            });
        });
    });
    return io;
}
exports.startSocketIO = startSocketIO;
//# sourceMappingURL=rms-rest.js.map