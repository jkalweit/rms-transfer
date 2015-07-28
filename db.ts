import models = require('./app/models');
import mongodb = require('mongodb');
var ObjectId = mongodb.ObjectID;


var server = new mongodb.Server('localhost', 27017, { auto_reconnect: true })
var db = new mongodb.Db('rms', server, { w: 1 });
db.open(function() { });


/*export function getInventoryItems(callback: (items: InventoryItemModel[]) => void) {
    get<InventoryItemModel>(InventoryItemModel.collection, callback);
}

export function insertInventoryItem(item: InventoryItemModel, callback: (item: InventoryItemModel) => void) {
    insert(InventoryItemModel.collection, item, callback);
}

export function patchInventoryItem(item: InventoryItemModel, callback: (item: InventoryItemModel) => void) {
    patch(InventoryItemModel.collection, item, callback);
}

export function removeInventoryItem(id: string, callback: (result: any) => void) {
    remove(InventoryItemModel.collection, id, callback);
}*/




export function get<T extends models.DbObjectModel>(collectionName: string, filter: any, callback: (items: T[]) => void) {
    db.collection(collectionName, function(error, collection) {
        if (error) { console.error(error); return; }
        collection.find(filter).toArray(function(error, objs) {
            if (error) { console.error(error); return; }
            callback(objs);
        });
    });
}

export function getById<T extends models.DbObjectModel>(collectionName: string, id: string, callback: (items: T[]) => void) {
    get(collectionName, { id: new ObjectId(id) }, callback);
}

export function insert<T extends models.DbObjectModel>(collection: string, item: T, callback: (item: T) => void) {
    db.collection(collection, function(error, items) {
        if (error) { console.error(error); return; }
        items.insert(
            item,
            function(error, result) {
                if (error) { console.error(error); return; }
                callback(result);
            }
        );
    });
}


export function patch<T extends models.DbObjectModel>(collection: string, item: T, callback: (item: T) => void) {
    db.collection(collection, function(error, items) {
        if (error) { console.error(error); return; }
        var _id = new ObjectId(item._id);
        delete item._id; // _id is immutable, so don't include in $set
        items.update(
            { "_id": _id },
            {
                "$set": item,
                "$currentDate": {
                    lastModified: true
                }
            },
            function(error, result) {
                if (error) { console.error(error); return; }
                callback(result);
            }
        );
    });
}


export function remove(collection: string, id: string, callback: (result: any) => void) {
    db.collection(collection, function(error, items) {
        if (error) { console.error(error); return; }
        items.remove(
            { "_id": new ObjectId(id) },
            { single: true },
            function(error, result) {
                if (error) { console.error(error); return; }
                callback(result);
            }
        );
    });
}
