/// <reference path="../typings/tsd.d.ts" />
define(["require", "exports", 'socket.io'], function (require, exports, io) {
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
    exports.guid = guid;
    var Request = (function () {
        function Request() {
        }
        return Request;
    })();
    exports.Request = Request;
    var LocalPersistence = (function () {
        function LocalPersistence(collectionName, callbacks) {
            if (callbacks === void 0) { callbacks = {}; }
            this.collectionName = collectionName;
            this.callbacks = callbacks || {};
            var fromStorage = localStorage.getItem(this.collectionName);
            console.log('Read from storage: ' + fromStorage);
            this.collection = JSON.parse(fromStorage) || {};
        }
        LocalPersistence.prototype.query = function () {
            if (this.callbacks.queryCallback) {
                var result = [];
                for (var id in this.collection) {
                    result.push(this.collection[id]);
                }
                console.log('Queryed: ' + JSON.stringify(result));
                this.callbacks.queryCallback(result);
            }
            else {
                console.log('No query callback, skipping query.');
            }
        };
        LocalPersistence.prototype.upsert = function (data) {
            if (!data._id) {
                data._id = guid();
            }
            if (!data.created) {
                data.created = new Date();
            }
            data.lastModified = new Date();
            console.log('Upserting: ' + data);
            this.collection[data._id] = data;
            this.persist();
            if (this.callbacks.upsertCallback) {
                this.callbacks.upsertCallback(data);
            }
        };
        LocalPersistence.prototype.remove = function (id) {
            delete this.collection[id];
            this.persist();
            if (this.callbacks.removeCallback) {
                this.callbacks.removeCallback();
            }
        };
        LocalPersistence.prototype.persist = function () {
            var stringified = JSON.stringify(this.collection);
            console.log('Persisting: ' + stringified);
            localStorage.setItem(this.collectionName, stringified);
        };
        return LocalPersistence;
    })();
    exports.LocalPersistence = LocalPersistence;
    var SocketIODataStore = (function () {
        function SocketIODataStore(collectionName, callbacks) {
            var _this = this;
            this.openRequests = {};
            this.collectionName = collectionName;
            this.callbacks = callbacks || {};
            console.log('Connecting to namespace: \'/' + this.collectionName + '\'');
            this.socket = io('http://localhost:1337/' + this.collectionName);
            this.socket.on('queryed', function (data) {
                _this.clearRequest(data.requestId);
                if (_this.callbacks.queryCallback) {
                    console.log('Calling query callBack');
                    _this.callbacks.queryCallback(data.data);
                }
            });
            this.socket.on('upserted', function (data) {
                _this.clearRequest(data.requestId);
                if (_this.callbacks.upsertCallback) {
                    console.log('Calling upserted callBack');
                    _this.callbacks.upsertCallback(data.data);
                }
            });
            this.socket.on('removed', function (data) {
                _this.clearRequest(data.requestId);
                if (_this.callbacks.removeCallback) {
                    console.log('Calling removed callBack');
                    _this.callbacks.removeCallback();
                }
            });
            this.socket.on('itemUpserted', function (data) {
                if (_this.callbacks.upsertCallback) {
                    console.log('Calling itemUpserted callBack');
                    _this.callbacks.upsertCallback(data.data);
                }
            });
            this.socket.on('itemRemoved', function (data) {
                if (_this.callbacks.removeCallback) {
                    console.log('Calling itemRemoved callBack');
                    _this.callbacks.removeCallback();
                }
            });
        }
        SocketIODataStore.prototype.query = function () {
            this.sendRequest('query', {});
        };
        SocketIODataStore.prototype.upsert = function (data) {
            this.sendRequest('upsert', data);
        };
        SocketIODataStore.prototype.remove = function (id) {
            this.sendRequest('remove', id);
        };
        SocketIODataStore.prototype.showOpenRequests = function () {
            console.log("Open Requests:");
            for (var id in this.openRequests) {
                console.log(id + ' = ' + JSON.stringify(this.openRequests[id]));
            }
        };
        SocketIODataStore.prototype.sendRequest = function (action, data) {
            var request = new Request();
            request.id = guid();
            request.initiatedAt = new Date();
            request.action = action;
            request.path = this.collectionName;
            request.data = data;
            this.openRequests[request.id] = request;
            console.log('Sending request: ' + this.collectionName + ': ' + JSON.stringify(request));
            this.socket.emit('crud', request);
        };
        SocketIODataStore.prototype.clearRequest = function (id) {
            delete this.openRequests[id];
        };
        return SocketIODataStore;
    })();
    exports.SocketIODataStore = SocketIODataStore;
});
//# sourceMappingURL=DataStores.js.map