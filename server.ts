/// <reference path='./typings/tsd.d.ts' />

import express = require('express');
import Mongo = require('mongodb');
import bodyParser = require('body-parser');
import http = require('http');
import socketio = require('socket.io');
import path = require("path");

import db = require('./db');
import models = require('./app/models');

var MongoClient = Mongo.MongoClient;
var ObjectId = Mongo.ObjectID;
var url = 'mongodb://localhost:27017/test2';

var app = express();
var server = http.createServer(app);
var io = socketio(server);
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var api = express.Router();

// REST API
api.route('/items')
    .get(function(req, res, next) {
        db.get<models.InventoryItemModel>(models.InventoryItemModel.collectionName, {}, function(result) {
            res.send(result);
        });
    })
    .post(function(req, res, next) {
        db.insert<models.InventoryItemModel>(models.InventoryItemModel.collectionName, req.body, function(result) {
            io.emit('updated');
            res.send(result);
        });
    });

api.route('/items/:id')
    .get(function(req, res, next) {
      db.getById<models.InventoryItemModel>(models.InventoryItemModel.collectionName, req.params.id, function(result) {
          res.send(result);
      });
    })
    .patch(function(req, res, next) {
        db.patch<models.InventoryItemModel>(models.InventoryItemModel.collectionName, req.body, function(result) {
            io.emit('updated');
            res.send(result);
        });
    }).delete(function(req, res, next) {
        if (req.body.id) {
            db.remove(models.InventoryItemModel.collectionName, req.params.id, function(result) {
                io.emit('updated');
                res.send(result);
            });
        }
    });

app.use('/api', api);






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
