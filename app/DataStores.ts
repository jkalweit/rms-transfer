/// <reference path="../typings/tsd.d.ts" />


import io = require('socket.io');

import models = require('./models');



export function guid(): string {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}


export class Request {
    id: string;
    initiatedAt: Date;
    action: string;
    path: string;
    data: any;
}

export interface IDataStoreCallbacks<T extends models.DbObjectModel> {
    queryCallback?: (items: T[]) => void;
    upsertCallback?: (item?: T) => void;
    removeCallback?: () => void;
}

export interface IDataStore<T extends models.DbObjectModel> {
    collectionName: string;
    query(): void; //TODO: Make promises
    upsert<T>(data: T): void; //TODO: Make promises
    remove(id: string): void; //TODO: Make promises
}


export class LocalPersistence<T extends models.DbObjectModel> implements IDataStore<T> {
    collectionName: string;
    collection: T[];
    callbacks: IDataStoreCallbacks<T>;

    constructor(collectionName: string, callbacks: IDataStoreCallbacks<T> = {}) {
        this.collectionName = collectionName;
        this.callbacks = callbacks || {};
        var fromStorage = localStorage.getItem(this.collectionName);
        console.log('Read from storage: ' + fromStorage);
        this.collection = JSON.parse(fromStorage) || {};
    }

    query() {
        if (this.callbacks.queryCallback) {
            var result: T[] = [];
            for (var id in this.collection) {
                result.push(this.collection[id]);
            }
            console.log('Queryed: ' + JSON.stringify(result));
            this.callbacks.queryCallback(result);
        } else {
          console.log('No query callback, skipping query.');
        }
    }

    upsert(data: T) {
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
        if(this.callbacks.upsertCallback) {
          this.callbacks.upsertCallback(data);
        }
    }
    remove(id: string) {
        delete this.collection[id];
        this.persist();
        if(this.callbacks.removeCallback) {
          this.callbacks.removeCallback();
        }
    }

    persist() {
        var stringified = JSON.stringify(this.collection);
        console.log('Persisting: ' + stringified);
        localStorage.setItem(this.collectionName, stringified);
    }
}























export interface SocketIODataStoreResult<T extends models.DbObjectModel> {
    requestId: string;
    result: any;
    data?: any;
}


export class SocketIODataStore<T extends models.DbObjectModel> implements IDataStore<T> {
    guid: string;
    collectionName: string;
    callbacks: IDataStoreCallbacks<T>;
    openRequests: any = {};
    socket: SocketIO.Server;

    constructor(collectionName: string, callbacks: IDataStoreCallbacks<T>) {
        this.collectionName = collectionName;
        this.callbacks = callbacks || {};

        console.log('Connecting to namespace: \'/' + this.collectionName + '\'');
        this.socket = io('http://localhost:1337/' + this.collectionName);

        this.socket.on('queryed', (data: SocketIODataStoreResult<T>) => {
            //console.log('queryed: ' + this.collectionName + ': ' + JSON.stringify(data));
            this.clearRequest(data.requestId);
            if (this.callbacks.queryCallback) {
                console.log('Calling query callBack');
                this.callbacks.queryCallback(data.data);
            }
        });

        this.socket.on('upserted', (data: SocketIODataStoreResult<T>) => {
            //console.log('upserted: ' + this.collectionName + ': ' + JSON.stringify(data));
            this.clearRequest(data.requestId);
            if (this.callbacks.upsertCallback) {
                console.log('Calling upserted callBack');
                this.callbacks.upsertCallback(data.data);
            }
        });

        this.socket.on('removed', (data: SocketIODataStoreResult<T>) => {
            //console.log('Removed: ' + this.collectionName + ': ' + JSON.stringify(data));
            this.clearRequest(data.requestId);
            if (this.callbacks.removeCallback) {
                console.log('Calling removed callBack');
                this.callbacks.removeCallback();
            }
        });

        this.socket.on('itemUpserted', (data: SocketIODataStoreResult<T>) => {
          if (this.callbacks.upsertCallback) {
              console.log('Calling itemUpserted callBack');
              this.callbacks.upsertCallback(data.data);
          }
        });
        this.socket.on('itemRemoved', (data: SocketIODataStoreResult<T>) => {
          if (this.callbacks.removeCallback) {
              console.log('Calling itemRemoved callBack');
              this.callbacks.removeCallback();
          }
        });
    }
    query() {
        this.sendRequest('query', {});
    }
    upsert(data: T) {
        this.sendRequest('upsert', data);
    }
    remove(id) {
        this.sendRequest('remove', id);
    }

    showOpenRequests() {
        console.log("Open Requests:");
        for (var id in this.openRequests) {
            console.log(id + ' = ' + JSON.stringify(this.openRequests[id]));
        }
    }

    sendRequest(action: string, data: any) {
        var request = new Request();
        request.id = guid();
        request.initiatedAt = new Date();
        request.action = action;
        request.path = this.collectionName;
        request.data = data;

        this.openRequests[request.id] = request;
        console.log('Sending request: ' + this.collectionName + ': ' + JSON.stringify(request));
        this.socket.emit('crud', request);
        //this.showOpenRequests();
    }
    clearRequest(id: string) {
        delete this.openRequests[id];
        //this.showOpenRequests();
    }
}
