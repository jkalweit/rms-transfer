
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />

import React = require('react');
import $ = require('jquery');
import io = require('socket.io');
import models = require('Models');


var socket = io();



export class BaseItemViewProps {
    public key: string;
    public entity: any;
    public onUpdate: any;
    public onRemove: any;
}



export class BaseView<T, P, S> extends React.Component<P, any> {
    private collectionName: string;
    constructor(props, collectionName: string) {
        super(props);
        this.collectionName = collectionName;
        this.state = { data: [] };

        socket.on('updated', function(data) {
            console.log('Updated: ' + collectionName + ' ' + data);
            this.refresh();
        }.bind(this));
    }
    componentDidMount() {
        this.refresh();
    }
    refresh() {
        var me = this;
        $.getJSON('/api/' + this.collectionName, function(result) {
            me.setState({ data: result });
        });
    }
    insertBase(item) {
        var me = this;
        $.post('/api/' + this.collectionName, item, function(result) {
            me.refresh();
        });
    }
    update(data) {
        var me = this;
        $.ajax({
            url: '/api/' + this.collectionName + '/' + data._id,
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
            url: '/api/' + this.collectionName + '/' + id,
            type: 'DELETE',
            success: function(result) {
                me.refresh();
            }
        });
    }
}


export class BaseItemView<P extends BaseItemViewProps, S> extends React.Component<P, any> {
    private collectionName: string;
    constructor(props) {
        super(props);
        this.state = { entity: props.entity };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            entity: nextProps.entity
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
        newEntity[fieldName] = event.target.value;
        this.setState({ entity: newEntity });
    }
}





export class InventoryItemView extends BaseItemView<BaseItemViewProps, any> {
    render() {
        return (
            <div key={this.props.entity._id}>
              <input value={ this.state.entity.name } onChange={ this.handleChange.bind(this, "name") } />
              <input value={ this.state.entity.note } onChange={ this.handleChange.bind(this, "note") } />
              <input value={ this.state.entity.count } onChange={ this.handleChange.bind(this, "count") } />
              <button onClick={this.update.bind(this) }>Update</button>
              <button onClick={this.remove.bind(this) }>X</button>
            </div>
        );
    }
}


export class InventoryView extends BaseView<models.InventoryItemModel, {}, any> {
    constructor(props) {
        super(props, models.InventoryItemModel.collectionName);
    }
    insert() {
        this.insertBase({
            name: React.findDOMNode(this.refs['name'])['value'],
            note: "",
            count: 0
        });
    }
    render() {
        var nodes = this.state.data.map(function(entity) {
            return (
                <InventoryItemView key={entity._id} entity={entity} onUpdate={this.update.bind(this) } onRemove={this.remove.bind(this) }></InventoryItemView>
            );
        }.bind(this));
        return (
            <div>
              <h2>Inventory</h2>
              <input ref="name" />
              <button onClick={this.insert.bind(this) }>Add</button>
              {nodes}
            </div>
        );
    }
}






export class VendorDetailsView extends BaseItemView<BaseItemViewProps, any> {
    render() {
        return (
            <div key={this.props.entity._id}>
            <input value={ this.state.entity.name } onChange={ this.handleChange.bind(this, "name") } />
            <input value={ this.state.entity.note } onChange={ this.handleChange.bind(this, "note") } />
            <button onClick={this.update.bind(this) }>Update</button>
            <button onClick={this.remove.bind(this) }>X</button>
            </div>
        );
    }
}


export class VendorView extends BaseView<models.VendorModel, {}, any> {
    constructor(props) {
        super(props, models.VendorModel.collectionName);
    }
    insert() {
        this.insertBase({
            name: React.findDOMNode(this.refs['name'])['value'],
            note: ''
        });
    }
    render() {
        var nodes = this.state.data.map(function(entity) {
            return (
                <VendorDetailsView key={entity._id} entity={entity} onUpdate={this.update.bind(this) } onRemove={this.remove.bind(this) }></VendorDetailsView>
            );
        }.bind(this));
        return (
            <div>
              <h2>Vendors</h2>
              <input ref="name" />
              <button onClick={this.insert.bind(this) }>Add</button>
              {nodes}
            </div>
        );
    }
}





export class MainView extends React.Component<{}, any> {
    render() {
        return (
            <div>
          <h1>RMS</h1>
          <InventoryView></InventoryView>
          <VendorView></VendorView>
            </div>
        );
    }
}
