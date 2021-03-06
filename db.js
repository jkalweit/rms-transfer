var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectID;
var server = new mongodb.Server('localhost', 27017, { auto_reconnect: true });
exports.db = new mongodb.Db('rms', server, { w: 1 });
exports.db.open(function () { });
function get(collectionName, filter, sort, callback) {
    console.log('Here1 ' + collectionName);
    exports.db.collection(collectionName, function (error, collection) {
        console.log('Here2');
        if (error) {
            console.error(error);
            return;
        }
        collection.find().toArray(function (error, objs) {
            console.log('Here3');
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
function exists(collectionName, id, callback) {
    get(collectionName, { id: new ObjectId(id) }, {}, function (items) {
        return items.length > 0;
    });
}
exports.exists = exists;
function insert(collection, item, callback) {
    console.log('Here1');
    exports.db.collection(collection, function (error, items) {
        console.log('Here2');
        if (error) {
            console.error(error);
            return;
        }
        item.created = new Date();
        item.lastModified = item.created;
        items.insert(item, function (error, result) {
            console.log('Here3');
            if (error) {
                console.error(error);
                return;
            }
            callback(result, item);
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
            items.findOne({ "_id": _id }, function (error, current) {
                callback(result, current);
            });
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
            callback(result, id);
        });
    });
}
exports.remove = remove;
//# sourceMappingURL=db.js.map