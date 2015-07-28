/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />

import React = require('react');
import $ = require('jquery');
import io = require('socket.io');
import moment = require('moment');
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
        this.state = {
          data: [],
          isDisabled: false
        };

        socket.on('updated:' + this.collectionName, function(data) {
            console.log('Updated: ' + collectionName);
            this.refresh();
        }.bind(this));
    }
    toggleIsDisabled() {
      this.setState({ isDisabled: !this.state.isDisabled });
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





export class InventoryItemView extends BaseItemView<BaseItemViewProps, any> {
    render() {
        return (
            <div key={this.props.entity._id}>
            <select value={this.state.entity.location} onChange={ this.handleChange.bind(this, "location") } >
                    <option></option>
                    <option>Dry Storage</option>
                    <option>Silver Fridge</option>
                    <option>Freezer 1</option>
                    <option>Freezer 2</option>
            </select>
                <select value={this.state.entity.type} onChange={ this.handleChange.bind(this, "type") } >
                    <option></option>
                    <option>App</option>
                    <option>Bread</option>
                    <option>Drinks</option>
                    <option>Dry Goods</option>
                    <option>Meat</option>
                    <option>Produce</option>
                    <option>Sauce</option>
                    <option>Supplies</option>
                </select>
              <input value={ this.state.entity.name } onChange={ this.handleChange.bind(this, "name") } />
              <input value={ this.state.entity.note } onChange={ this.handleChange.bind(this, "note") } />
              <input value={ this.state.entity.count } onChange={ this.handleChange.bind(this, "count") } />
              <button onClick={this.update.bind(this) } disabled={!this.state.isDirty}>Update</button>
              <button onClick={this.remove.bind(this) }>X</button>
              { moment(this.state.entity.lastModified).format('llll') }
            </div>
        );
    }
}


export class InventoryView extends BaseView<models.InventoryItemModel, {}, any> {
    constructor(props) {
        super(props, models.InventoryItemModel.collectionName);
        this.state.isDisabled = true;
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

        var style = {
          display: this.state.isDisabled ? 'none' : 'block'
        };

        return (
            <div>
              <div onClick={ this.toggleIsDisabled.bind(this) }>
                <h2>Inventory</h2>
              </div>
              <div style={style}>
                <input ref="name" />
                <button onClick={this.insert.bind(this) }>Add</button>
                {nodes}
              </div>
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
            <button onClick={this.update.bind(this) } disabled={!this.state.isDirty}>Update</button>
            <button onClick={this.remove.bind(this) }>X</button>
            </div>
        );
    }
}


export class VendorsView extends BaseView<models.VendorModel, {}, any> {
    constructor(props) {
        super(props, models.VendorModel.collectionName);
        this.state.isDisabled = true;
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

        var style = {
          display: this.state.isDisabled ? 'none' : 'block'
        };

        return (
            <div>
              <div onClick={ this.toggleIsDisabled.bind(this) }>
                <h2>Vendors</h2>
              </div>
              <div style={style}>
                <input ref="name" />
                <button onClick={this.insert.bind(this) }>Add</button>
                {nodes}
              </div>
            </div>
        );
    }
}






export class ShiftsView extends BaseView<models.ShiftModel, {}, any> {
    constructor(props) {
        super(props, models.ShiftModel.collectionName);
    }
    insert() {
        this.insertBase({
            date: React.findDOMNode(this.refs['date'])['value'],
        });
    }
    render() {
        var nodes = this.state.data.map(function(entity) {
            return (
                <ShiftDetailsView key={entity._id} entity={entity} onUpdate={this.update.bind(this) } onRemove={this.remove.bind(this) }></ShiftDetailsView>
            );
        }.bind(this));

        var style = {
          display: this.state.isDisabled ? 'none' : 'block'
        };

        return (
            <div>
              <div onClick={ this.toggleIsDisabled.bind(this) }>
                <h2>Shifts</h2>
              </div>
              <div style={style}>
                <input ref="date" type="date" />
                <button onClick={this.insert.bind(this) }>Add</button>
                {nodes}
              </div>
            </div>
        );
    }
}

export class ShiftDetailsView extends BaseItemView<BaseItemViewProps, any> {
    insert() {
        var newEntity = this.state.entity as models.ShiftModel;
        newEntity.positions = newEntity.positions || [];
        newEntity.positions.push({
            _id: new Date().toISOString(),
            name: '',
            employee: '',
            date: newEntity.date,
            start: '04:30',
            end: '09:30',
            lastModified: new Date()
        });
        this.setState({
            entity: newEntity,
            isDirty: true
        });
    }
    handlePostionUpdate(entity) {
        this.update();
    }
    handlePostionRemove(id) {
        var newEntity = this.state.entity;
        for (var i = 0; i < newEntity.positions.length; i++) {
            if (newEntity.positions[i]._id === id) {
                newEntity.positions.splice(i, 1);
                this.setState({
                    entity: newEntity,
                    isDirty: true
                });
                this.update();
                return;
            }
        }
    }
    render() {
        var nodes = [];
        if (this.state.entity.positions) {
            nodes = this.state.entity.positions.map(function(position) {
                return (
                    <ShiftPositionDetailsView key={position._id} entity={position} onUpdate={this.handlePostionUpdate.bind(this) } onRemove={this.handlePostionRemove.bind(this) }></ShiftPositionDetailsView>
                );
            }.bind(this));
        }
        return (
            <div key={this.props.entity._id}>
            <div>
            { moment(this.state.entity.date).format('dddd MMM Do') }
            <button onClick={this.insert.bind(this) }>Add Position</button>
            <button onClick={this.update.bind(this) } disabled={!this.state.isDirty}>Update</button>
            <button onClick={this.remove.bind(this) }>X</button>
            </div>
            { nodes }
            </div>
        );
    }
}

export class ShiftPositionDetailsView extends BaseItemView<BaseItemViewProps, any> {
    render() {
        return (
            <div key={this.props.entity._id}>
            <input value={ this.state.entity.name } onChange={ this.handleChange.bind(this, "name") } />
            <select value={ this.state.entity.employee } onChange={ this.handleChange.bind(this, "employee") }>
              <option></option>
              <option>Chris</option>
              <option>Jake</option>
              <option>Justin</option>
              <option>Matt</option>
              <option>Michael</option>
              <option>Aerin</option>
              <option>Keely</option>
              <option>Kelly</option>
              <option>Merrill</option>
              <option>Stassie</option>
            </select>
            <input value={ this.state.entity.start } type="time" onChange={ this.handleChange.bind(this, "start") } />
            <input value={ this.state.entity.end } type="time" onChange={ this.handleChange.bind(this, "end") } />
            { models.ShiftModel.shiftLength(this.state.entity) }
            <button onClick={this.update.bind(this) } disabled={!this.state.isDirty}>Update</button>
            <button onClick={this.remove.bind(this) }>X</button>
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
          <VendorsView></VendorsView>
          <ShiftsView></ShiftsView>
            </div>
        );
    }
}
