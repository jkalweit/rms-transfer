/// <reference path='./typings/tsd.d.ts' />
require('amdefine/intercept');
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var socketio = require('socket.io');
var models = require('./app/models');
var fp = require('./FilePersistence');
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
var collections = [models.InventoryItemModel, models.MenuCategoryModel];
collections.forEach(function (type) {
    var persistence = new fp.FilePersistence(type.collectionName);
    console.log('Setting up namespace: \'/' + type.collectionName + '\'');
    var namespace = io.of('/' + type.collectionName);
    namespace.on('connection', function (socket) {
        console.log('someone connected to ' + type.collectionName);
        socket.on('crud', function (request) {
            console.log('Do action: ' + type.collectionName + ': ' + JSON.stringify(request));
            if (request.action === 'query') {
                socket.emit('queryed', {
                    requestId: request.id,
                    data: persistence.query()
                });
            }
            else if (request.action === 'insert') {
                var result = {
                    requestId: request.id,
                    data: persistence.insert(request.data)
                };
                namespace.emit('inserted', result);
            }
            else if (request.action === 'update') {
                var result = {
                    requestId: request.id,
                    data: persistence.update(request.data)
                };
                namespace.emit('updated', result);
            }
            else if (request.action === 'remove') {
                persistence.remove(request.data);
                ;
                namespace.emit('removed', {
                    requestId: request.id,
                    data: request.data
                });
            }
        });
    });
});
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