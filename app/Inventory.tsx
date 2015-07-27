
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />

import React = require('react');
import $ = require('jquery');
import io = require('socket.io');
import models = require('Models');


export class InventoryItemProps {
    public key: string;
    public entity: any;
    public onUpdate: any;
    public onRemove: any;
}

export class InventoryItem extends React.Component<InventoryItemProps, any> {
    update() {
        var me = this;
        var update = {
            _id: this.props.entity._id,
            name: React.findDOMNode(this.refs['name'])['value']
        };
        this.props.onUpdate(update);
    }
    remove() {
        this.props.onRemove(this.props.entity._id);
    }
    render() {
        return (
            <div key={this.props.entity._id}>
            An Item: {this.props.entity.name} <input ref="name" />
              <button onClick={this.update.bind(this) }>Update</button>
              <button onClick={this.remove.bind(this) }>X</button>
            </div>
        );
    }
}


export class Inventory extends React.Component<{}, any> {
    constructor(props) {
        super(props);
        this.state = { data: [] };
        var socket = io();
        socket.on('updated', function(data) {
            console.log('Updated: ' + data);
            this.refresh();
        }.bind(this));
    }
    componentDidMount() {
        this.refresh();
    }
    refresh() {
        var me = this;
        //$.getJSON(InventoryItemModel.apiPath, function(result) {
        $.getJSON('/api/items', function(result) {
            me.setState({ data: result });
        });
    }
    insert() {
        var me = this;
        var item = {
            name: React.findDOMNode(this.refs['name'])['value'],
            note: "",
            count: 0
        };
        $.post('/api/items', item, function(result) {
            me.refresh();
        });
    }
    update(data) {
        var me = this;
        $.ajax({
            url: models.InventoryItemModel.apiPath + data._id,
            type: 'PATCH',
            data: data,
            success: function(result) {
                me.refresh();
            }
        });
    }
    remove(id) {
        var me = this;
        $.ajax({
            url: models.InventoryItemModel.apiPath + id,
            type: 'DELETE',
            success: function(result) {
                me.refresh();
            }
        });
    }
    render() {
        var nodes = this.state.data.map(function(entity) {
            return (
                <InventoryItem key={entity._id} entity={entity} onUpdate={this.update.bind(this) } onRemove={this.remove.bind(this) }></InventoryItem>
            );
        }.bind(this));
        return (
            <div>
              <h1>Inventory</h1>
              <input ref="name" />
              <button onClick={this.insert.bind(this) }>Add</button>
              {nodes}
            </div>
        );
    }
}
