/// <reference path='./typings/tsd.d.ts' />
var fs = require('fs');
var path = require('path');
var FilePersistence = (function () {
    function FilePersistence(collectionName, dataDirectory) {
        var _this = this;
        if (dataDirectory === void 0) { dataDirectory = 'data'; }
        this.collectionName = collectionName;
        this.dataDirectory = dataDirectory;
        this.collection = {};
        var path = this.buildFilePath();
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                if (err.code === 'ENOENT') {
                    _this.persist();
                }
                else {
                    console.error('Failed to read ' + path + ': ' + err);
                }
            }
            else {
                _this.collection = JSON.parse(data);
            }
        });
    }
    FilePersistence.prototype.query = function () {
        var result = [];
        for (var id in this.collection) {
            result.push(this.collection[id]);
        }
        return result;
    };
    FilePersistence.prototype.guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
    FilePersistence.prototype.upsert = function (data) {
        if (!data._id) {
            data._id = this.guid();
        }
        if (!data.created) {
            data.created = new Date();
        }
        data.lastModified = new Date();
        this.collection[data._id] = data;
        this.persist();
        return data;
    };
    FilePersistence.prototype.remove = function (id) {
        delete this.collection[id];
        this.persist();
    };
    FilePersistence.prototype.buildFilePath = function () {
        return path.join(this.dataDirectory, this.collectionName + '.json');
    };
    FilePersistence.prototype.persist = function () {
        var _this = this;
        var path = this.buildFilePath();
        fs.mkdir(this.dataDirectory, null, function (err) {
            if (err) {
                if (err.code != 'EEXIST') {
                    console.error('Failed to create folder ' + _this.dataDirectory + ': ' + err);
                    return;
                }
            }
            fs.writeFile(path, JSON.stringify(_this.collection), function (err) {
                if (err) {
                    console.error('Failed to write ' + path + ': ' + err);
                }
            });
        });
    };
    return FilePersistence;
})();
exports.FilePersistence = FilePersistence;
//# sourceMappingURL=FilePersistence.js.map