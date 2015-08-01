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
                console.log('Sending queryed: ' + 'queryed:' + path + ' - ' + console.log(JSON.stringify(data)));
                socket.emit('queryed:' + path, {
                    requestId: requestId,
                    data: data
                });
            });
        });
        socket.on('upsert', function (requestId, path, data) {
            console.log('upsert: ' + path + ': ' + JSON.stringify(data));
            db.exists(path, data._id, function (exists) {
                if (exists) {
                    db.patch(path, data, function (result, patch) {
                        socket.emit('upserted:' + path, {
                            requestId: requestId,
                            result: result,
                            data: patch
                        });
                    });
                }
                else {
                    db.insert(path, data, function (result, item) {
                        socket.emit('upserted:' + path, {
                            requestId: requestId,
                            result: result,
                            data: item
                        });
                    });
                }
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