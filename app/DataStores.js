/// <reference path="../typings/tsd.d.ts" />
define(["require", "exports", 'socket.io'], function (require, exports, io) {
    var socket = io();
    var Request = (function () {
        function Request() {
        }
        return Request;
    })();
    exports.Request = Request;
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
    exports.guid = guid;
    var SocketIODataStore = (function () {
        function SocketIODataStore(path, queryCallback, insertCallback, updateCallback, removeCallback) {
            var _this = this;
            this.openRequests = {};
            this.path = path;
            this.queryCallback = queryCallback;
            this.insertCallback = insertCallback;
            this.updateCallback = updateCallback;
            this.removeCallback = removeCallback;
            socket.on('success', function (message) {
                console.log('success! ' + JSON.stringify(message));
            });
            socket.on('err', function (error) {
                console.log('Error: ' + JSON.stringify(error));
            });
            socket.on('queryed:' + this.path, function (data) {
                console.log('queryed: ' + _this.path + ': ' + JSON.stringify(data));
                _this.clearRequest(data.requestId);
                if (_this.queryCallback) {
                    console.log('Calling query callBack');
                    _this.queryCallback(data);
                }
            });
            socket.on('inserted:' + this.path, function (data) {
                console.log('Inserted: ' + _this.path + ': ' + JSON.stringify(data));
                _this.clearRequest(data.requestId);
                if (_this.insertCallback) {
                    console.log('Calling insert callBack');
                    _this.insertCallback(data);
                }
            });
            socket.on('updated:' + this.path, function (data) {
                console.log('Updated: ' + _this.path + ': ' + JSON.stringify(data));
                _this.clearRequest(data.requestId);
                if (_this.updateCallback) {
                    console.log('Calling callBack');
                    _this.updateCallback(data);
                }
            });
            socket.on('removed:' + this.path, function (data) {
                console.log('Removed: ' + _this.path + ': ' + JSON.stringify(data));
                _this.clearRequest(data.requestId);
                if (_this.removeCallback) {
                    console.log('Calling remove callBack');
                    _this.removeCallback(data);
                }
            });
        }
        SocketIODataStore.prototype.query = function (query) {
            this.sendRequest('query', this.path, query);
        };
        SocketIODataStore.prototype.insert = function (data) {
            this.sendRequest('insert', this.path, data);
        };
        SocketIODataStore.prototype.update = function (data) {
            this.sendRequest('update', this.path, data);
        };
        SocketIODataStore.prototype.remove = function (id) {
            this.sendRequest('remove', this.path, id);
        };
        SocketIODataStore.prototype.showOpenRequests = function () {
            console.log("Open Requests:");
            for (var id in this.openRequests) {
                console.log(id + ' = ' + JSON.stringify(this.openRequests[id]));
            }
        };
        SocketIODataStore.prototype.sendRequest = function (action, path, data) {
            var request = new Request();
            request.id = guid();
            request.initiatedAt = new Date();
            request.data = {
                action: action,
                path: path,
                data: data
            };
            this.openRequests[request.id] = request;
            socket.emit(request.data.action, request.id, request.data.path, request.data.data);
            this.showOpenRequests();
        };
        SocketIODataStore.prototype.clearRequest = function (id) {
            delete this.openRequests[id];
            this.showOpenRequests();
        };
        return SocketIODataStore;
    })();
    exports.SocketIODataStore = SocketIODataStore;
});
//# sourceMappingURL=DataStores.js.map