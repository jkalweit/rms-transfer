var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectID;
var server = new mongodb.Server('localhost', 27017, { auto_reconnect: true });
exports.db = new mongodb.Db('rms', server, { w: 1 });
exports.db.open(function () { });
function get(collectionName, filter, sort, callback) {
    exports.db.collection(collectionName, function (error, collection) {
        if (error) {
            console.error(error);
            return;
        }
        collection.find(filter).sort(sort.get).toArray(function (error, objs) {
            if (error) {
                console.error(error);
                return;
            }
            callback(objs);
        });
    });
}
exports.get = get;
function getById(collectionName, id, callback) {
    get(collectionName, { id: new ObjectId(id) }, {}, callback);
}
exports.getById = getById;
function insert(collection, item, callback) {
    exports.db.collection(collection, function (error, items) {
        if (error) {
            console.error(error);
            return;
        }
        item.created = new Date();
        item.lastModified = item.created;
        items.insert(item, function (error, result) {
            if (error) {
                console.error(error);
                return;
            }
            callback(result);
        });
    });
}
exports.insert = insert;
function patch(collection, item, callback) {
    exports.db.collection(collection, function (error, items) {
        if (error) {
            console.error(error);
            return;
        }
        var _id = new ObjectId(item._id);
        delete item._id;
        delete item.created;
        delete item.lastModified;
        items.update({ "_id": _id }, {
            "$set": item,
            "$currentDate": {
                lastModified: true
            }
        }, function (error, result) {
            if (error) {
                console.error(error);
                return;
            }
            callback(result);
        });
    });
}
exports.patch = patch;
function remove(collection, id, callback) {
    exports.db.collection(collection, function (error, items) {
        if (error) {
            console.error(error);
            return;
        }
        items.remove({ "_id": new ObjectId(id) }, { single: true }, function (error, result) {
            if (error) {
                console.error(error);
                return;
            }
            callback(result);
        });
    });
}
exports.remove = remove;
//# sourceMappingURL=db.js.map