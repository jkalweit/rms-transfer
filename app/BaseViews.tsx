/// <reference path="../typings/tsd.d.ts" />

import React = require('react/addons');
import $ = require('jquery');
import io = require('socket.io');
import moment = require('moment');

import models = require('./Models');
import dataStores = require('./DataStores');


export class BaseViewProps {
    public key: string;
    public entity: any;
}


export class BaseItemViewProps extends BaseViewProps {
    public onUpdate: any;
    public onRemove: any;
}


export class BaseView<T extends models.DbObjectModel, P, S> extends React.Component<P, any> {
    collectionName: string;
    private socketSubscriptions: any;
    private dataStore: dataStores.IDataStore<T>;
    constructor(props, collectionName: string) {
        super(props);
        this.collectionName = collectionName;
        this.state = {
            data: [],
            isDisabled: false
        };
        var callbacks = {
          queryCallback: this.handleRefresh.bind(this),
          upsertCallback: this.refresh.bind(this),
          removeCallback: this.refresh.bind(this)
        }
        //this.dataStore = new dataStores.LocalPersistence<T>('inventory_items', callbacks);
        this.dataStore = new dataStores.SocketIODataStore<T>('inventory_items', callbacks);

        this.socketSubscriptions = {};
    }
    subscribe(action: string, callback: (any) => void) {
        this.socketSubscriptions[action] = this.socketSubscriptions[action] || [];
        this.socketSubscriptions[action].push(callback);
    }
    toggleIsDisabled() {
        this.setState({ isDisabled: !this.state.isDisabled });
    }
    componentDidMount() {
        this.refresh();
    }
    refresh() {
        this.dataStore.query();
    }
    handleRefresh(data) {
      this.setState({ data: data });
    }
    insertBase(item) {
        this.dataStore.upsert(item);
        //var me = this;

        /*$.post('/api/' + this.collectionName, item, function(result) {
            me.refresh();
        });*/
    }
    update(data) {
        var me = this;
        //socket.emit('update', data);
        this.dataStore.upsert(data);
        /*$.ajax({
            url: '/api/' + this.collectionName + '/' + data._id,
            type: 'PATCH',
            data: data,
            success: function(result) {
                me.refresh();
            }
        });*/
    }
    remove(id) {
        var me = this;
        this.dataStore.remove(id);
        /*$.ajax({
            url: '/api/' + this.collectionName + '/' + id,
            type: 'DELETE',
            success: function(result) {
                me.refresh();
            }
        });*/
    }
}

export class BaseItemView<P extends BaseItemViewProps, S> extends React.Component<P, any> {
    private collectionName: string;
    constructor(props) {
        super(props);
        this.state = {
            entity: props.entity,
            isDirty: false,
            isDisabled: false
        };
    }
    toggleIsDisabled() {
        this.setState({ isDisabled: !this.state.isDisabled });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            entity: nextProps.entity,
            isDirty: false
        });
    }
    update() {
        var me = this;
        this.props.onUpdate(this.state.entity);
    }
    remove() {
        if (confirm('Delete?')) {
            this.props.onRemove(this.props.entity._id);
        }
    }
    handleChange(fieldName, event) {
        var newEntity = this.state.entity;
        if (newEntity[fieldName] !== event.target.value) {
            newEntity[fieldName] = event.target.value;
            this.setState({
                entity: newEntity,
                isDirty: true
            });
        }
    }
}
