/// <reference path="../typings/tsd.d.ts" />

import React = require('react/addons');
import $ = require('jquery');
import io = require('socket.io');
import moment = require('moment');

import models = require('./Models');
import dataStores = require('./DataStores');


export class Utils {
    static FormatDollars(value, precision: number = 2): string {
        var val = Number(value);
        return '$' + val.toFixed(2)
    }
}

export class Button extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
          isPressed: false
        }
    }
    handleClick(e) {
        this.setState({ isPressed: true });
        setTimeout(() => { this.setState({ isPressed: false })}, 400); // set ms to twice the transition for in and out.
        if (this.props.onClick) this.props.onClick(e);
    }
    render() {
        var classes = this.props.className || "";
        classes = "btn " + classes + (this.state.isPressed ? ' pressed' : '');
        return (
            <div className={classes} onClick={(e) => { this.handleClick(e) } }>{this.props.children}</div>
        );
    }

}


export class BaseViewProps {
    public key: string;
    public entity: any;
}


export interface BaseItemViewProps extends BaseViewProps {
    onUpdate?: any;
    onRemove?: any;
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

        //this.dataStore = new dataStores.LocalPersistence<T>('inventory_items', callbacks);
        this.dataStore = new dataStores.SocketIODataStore<T>(collectionName);
        this.dataStore.on('queryed', this.handleRefresh.bind(this));
        this.dataStore.on('inserted', this.refresh.bind(this));
        this.dataStore.on('updated', this.refresh.bind(this));
        this.dataStore.on('removed', this.refresh.bind(this));
        this.dataStore.init();
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
        this.dataStore.insert(item);
    }
    update(data) {
        var me = this;
        this.dataStore.update(data);
    }
    remove(id) {
        var me = this;
        this.dataStore.remove(id);
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
    render() {
        return (
            <div>
            { (this.props as any).children }
            </div>
        );
    }
}

export class SimpleItemEditView extends React.Component<any, any> {
    private collectionName: string;
    constructor(props) {
        super(props);
        var entityCopy = {};
        if (props.entity) {
            entityCopy = JSON.parse(JSON.stringify(props.entity));
        }
        this.state = {
            entity: entityCopy,
            isDirty: false,
            isDisabled: false
        };
    }
    toggleIsDisabled() {
        this.setState({ isDisabled: !this.state.isDisabled });
    }
    componentWillReceiveProps(nextProps) {
        var entityCopy = {};
        if (nextProps.entity) {
            entityCopy = JSON.parse(JSON.stringify(nextProps.entity));
        }
        this.setState({
            entity: entityCopy,
            isDirty: false
        });
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
    reset() {
        this.setState({
            entity: JSON.parse(JSON.stringify(this.props.entity)),
            isDirty: false
        });
    }
    save() {
        this.props.onSave(this.state.entity);
    }
    cancel() {
        this.props.onCancel();
    }
    remove() {
        this.props.onRemove();
    }
    render() {
        return (
            <div>
            { (this.props as any).children }
            </div>
        );
    }
}




export class ModalView extends React.Component<any, any> {
    constructor(props, collectionName: string) {
        super(props);
        this.state = {
            isVisible: false
        };
    }
    show() {
        this.setState({
            isVisible: true
        });

        if (this.props.onShown) this.props.onShown()
    }
    hide() {
        this.setState({
            isVisible: false
        });
    }
    toggle() {
        this.setState({
            isVisible: !this.state.isVisible
        }, () => {
            if (this.state.isVisible && this.props.onShown) { this.props.onShown(); }
        });
    }
    render() {
        var backdropStyle = {
            display: this.state.isVisible ? 'block' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.5)'
        };
        var innerStyle = {
            borderRadius: '5px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            minWidth: '400px',
            maxWidth: '800px',
            minHeigth: '400px',
            width: '80%',
            margin: '20px auto',
            padding: '20px'
        };
        return (
            <div style={backdropStyle}>
              <div style={innerStyle}>
                { this.props.children }
              </div>
            </div>
        );
    }
}
