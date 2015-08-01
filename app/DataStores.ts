/// <reference path="../typings/tsd.d.ts" />

import io = require('socket.io');

import models = require('./models');


var socket = io();

export class Request {
    id: string;
    initiatedAt: Date;
    data: any;
}

export interface SocketIODataStoreResult<T extends models.DbObjectModel> {
  requestId: string;
  result: any;
  data?: T;
}

export function guid(): string {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export class SocketIODataStore<T extends models.DbObjectModel> {
  guid: string;
  path: string;

  openRequests: any = {};

  queryCallback: (items: any) => void;
  insertCallback: (result?: SocketIODataStoreResult<T>) => void;
  updateCallback: (result?: SocketIODataStoreResult<T>) => void;
  removeCallback: (result?: SocketIODataStoreResult<T>) => void;

  constructor(path: string,
    queryCallback: (items: any) => void,
    insertCallback: (result?: SocketIODataStoreResult<T>) => void,
    updateCallback: (result?: SocketIODataStoreResult<T>) => void,
    removeCallback: (result?: SocketIODataStoreResult<T>) => void) {

    this.path = path;
    this.queryCallback = queryCallback;
    this.insertCallback = insertCallback;
    this.updateCallback = updateCallback;
    this.removeCallback = removeCallback;

      socket.on('success', (message) => {
        console.log('success! ' + JSON.stringify(message));
      });
      socket.on('err', (error) => {
        console.log('Error: ' + JSON.stringify(error));
      });

      socket.on('queryed:' + this.path, (data: SocketIODataStoreResult<T>) => {
          console.log('queryed: ' + this.path + ': ' + JSON.stringify(data));
          this.clearRequest(data.requestId);
          if(this.queryCallback) {
            console.log('Calling query callBack');
            this.queryCallback(data);
          }
      });

      socket.on('inserted:' + this.path, (data: SocketIODataStoreResult<T>) => {
          console.log('Inserted: ' + this.path + ': ' + JSON.stringify(data));
          this.clearRequest(data.requestId);
          if(this.insertCallback) {
            console.log('Calling insert callBack');
            this.insertCallback(data);
          }
      });

      socket.on('updated:' + this.path, (data: SocketIODataStoreResult<T>) => {
          console.log('Updated: ' + this.path + ': ' + JSON.stringify(data));
          this.clearRequest(data.requestId);
          if(this.updateCallback) {
            console.log('Calling callBack');
            this.updateCallback(data);
          }
      });

      socket.on('removed:' + this.path, (data: SocketIODataStoreResult<T>) => {
          console.log('Removed: ' + this.path + ': ' + JSON.stringify(data));
          this.clearRequest(data.requestId);
          if(this.removeCallback) {
            console.log('Calling remove callBack');
            this.removeCallback(data);
          }
      });
  }
  query(query) {
    this.sendRequest('query', this.path, query);
  }
  insert(data){
    this.sendRequest('insert', this.path, data);
  }
  update(data) {
    this.sendRequest('update', this.path, data);
  }
  remove(id) {
    this.sendRequest('remove', this.path, id);
  }

  showOpenRequests() {
    console.log("Open Requests:");
    for (var id in this.openRequests) {
        console.log(id + ' = ' + JSON.stringify(this.openRequests[id]));
    }
  }

  sendRequest(action: string, path: string, data: any) {
    var request = new Request();
    request.id = guid();
    request.initiatedAt = new Date();
    request.data = {
      action: action,
      path: path,
      data: data
    }
    this.openRequests[request.id] = request;
    socket.emit(request.data.action, request.id, request.data.path, request.data.data);
    this.showOpenRequests();
  }
  clearRequest(id: string) {
    delete this.openRequests[id];
    this.showOpenRequests();
  }
}
