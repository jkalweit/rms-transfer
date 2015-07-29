/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />

import React = require('react/addons');
import $ = require('jquery');
import io = require('socket.io');
import moment = require('moment');
import models = require('Models');


var socket = io();

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;



export class BaseViewProps {
    public key: string;
    public entity: any;
}

export class BaseItemViewProps extends BaseViewProps {
    public onUpdate: any;
    public onRemove: any;
}



export class BaseView<T, P, S> extends React.Component<P, any> {
    collectionName: string;
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
        this.state.isDisabled = true;
    }
    insert() {
        this.insertBase({
            date: React.findDOMNode(this.refs['date'])['value'],
        });
    }
    handleMakeCopy(copy) {
        this.insertBase(copy);
    }
    render() {
        var nodes = this.state.data.map(function(entity) {
            return (
                <ShiftDetailsView key={entity._id} entity={entity} onUpdate={this.update.bind(this) } onRemove={this.remove.bind(this) } onMakeCopy={this.handleMakeCopy.bind(this) }></ShiftDetailsView>
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

export class ShiftDetailsViewProps extends BaseItemViewProps {
    public onMakeCopy: any;
}

export class ShiftDetailsView extends BaseItemView<ShiftDetailsViewProps, any> {
    insert() {
        var newEntity = this.state.entity as models.ShiftModel;
        newEntity.positions = newEntity.positions || [];
        newEntity.positions.push({
            name: '',
            employee: '',
            date: newEntity.date,
            start: '16:30',
            end: '21:30'
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
    copy() {
        var newEntity = this.state.entity;
        delete newEntity._id;
        this.props.onMakeCopy(newEntity);
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
            <div>
            { moment(this.state.entity.date).format('dddd') }
            <input value={ this.state.entity.date } type="date" onChange={ this.handleChange.bind(this, "date") } />
            <button onClick={this.insert.bind(this) }>Add Position</button>
            <button onClick={this.update.bind(this) } disabled={!this.state.isDirty}>Update</button>
            <button onClick={this.remove.bind(this) }>X</button>
            <button onClick={this.copy.bind(this) }>Copy</button>
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







export class KitchenOrdersView extends BaseView<models.VendorModel, any, any> {
    constructor(props) {
        super(props, models.KitchenOrderModel.collectionName);
        this.state.isDisabled = false;
    }
    handleComplete(entity) {
      entity.completedAt = new Date();
      React.findDOMNode(this.refs['alertCompletedSound'])['play']();
      this.update(entity);
    }
    handleAcknowledge(entity) {
        entity.acknowledgedAt = new Date();
        this.update(entity);
    }
    render() {
        var nodes = this.state.data.map(function(entity) {
            return (
                <KitchenOrderDetailsView key={entity._id} entity={entity} onAcknowledge={this.handleAcknowledge.bind(this) } onComplete={this.handleComplete.bind(this) }></KitchenOrderDetailsView>
            );
        }.bind(this));

        var style = {
            display: this.state.isDisabled ? 'none' : 'block'
        };

        return (
            <div>
              <audio ref="alertSound" src="/content/audio/bell.mp3" preload="auto"></audio>
              <audio ref="alertCompletedSound" src="/content/audio/tada.mp3" preload="auto"></audio>
              <div onClick={ this.toggleIsDisabled.bind(this) }>
                <h2>Kitchen Orders</h2>
              </div>
              <div style={style}>
                {nodes}
              </div>
            </div>
        );
    }
}



export class KitchenOrderDetailsViewProps extends BaseViewProps {
    public onComplete: any;
    public onAcknowledge: any;
}

export class KitchenOrderDetailsView extends BaseItemView<any, any> {
    private interval;
    constructor(props) {
        super(props);
        this.state = {
            isNew: true,
            isAcknowledged: this.props.entity.acknowledgedAt ? true : false,
            isComplete: this.props.entity.completedAt ? true : false
        };
        this.state.timeElapsed = this.formatElapsedTime();
    }
    elapsedDuration() {
        var start = moment(this.props.entity.created);
        var end = this.state.isComplete ? moment(this.props.entity.completedAt) : moment();
        var diff = end.diff(start, 'seconds');
        var duration = moment.duration(diff, 'seconds');
        return duration;
    }
    formatElapsedTime() {
        var duration = this.elapsedDuration();
        var formatted = duration.minutes() + ':' + ('0' + duration.seconds()).slice(-2);
        return formatted;
    }
    tick() {
        this.setState({ timeElapsed: this.formatElapsedTime() });
    }
    componentDidMount() {
      if(!this.state.isComplete) {
        this.interval = setInterval(this.tick.bind(this), 1000);
      }
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    complete(e) {
        // prevents completing again before GUI update.
        if (this.state.isAcknowledged && !this.state.isComplete) {
            this.props.onComplete(this.props.entity);
            this.setState({ isComplete: true });
            clearInterval(this.interval);
            e.preventDefault();
        }
    }
    acknowledge(e) {
        // prevents acknowledging again before GUI update.
        if (!this.state.isAcknowledged) {
            this.props.onAcknowledge(this.props.entity);
            this.setState({ isAcknowledged: true });
            e.preventDefault();
        }
    }
    render() {
        var me = this;
        function compareMilli(a, b) {
            var a_milli = moment(a.addedToOrderAt).valueOf();
            var b_milli = moment(b.addedToOrderAt).valueOf();
            if (a_milli < b_milli) return -1;
            if (a_milli > b_milli) return 1;
            return 0;
        }

        var nodes = this.props.entity.kitchenOrderItems.sort(compareMilli).map(function(entity) {
            return (
                <KitchenOrderItemView key={entity.id} entity={entity} />
            );
        });
        var backgroundColor;
        var bucket = Math.floor(moment(this.props.entity.created).minutes() / 10);
        if (bucket == 0) { backgroundColor = '#D1C4E9'; }
        else if (bucket == 1) { backgroundColor = '#C8E6C9'; }
        else if (bucket == 2) { backgroundColor = '#B2DFDB'; }
        else if (bucket == 3) { backgroundColor = '#F0F4C3'; }
        else if (bucket == 4) { backgroundColor = '#BBDEFB'; }
        else if (bucket == 5) { backgroundColor = '#FFE0B2'; }
        else { backgroundColor = ''; }

        if (!this.props.entity.acknowledgedAt) {
            backgroundColor = 'blue';
        }

        var style = {
            backgroundColor: backgroundColor
        };


        var duration = this.elapsedDuration();
        var targetTime = moment.duration(25, 'minutes');

        var progress = duration.asSeconds() / targetTime.asSeconds();
        var late = false;
        if (progress > 1) {
            late = true;
            progress = 1;
        }

        var progressColor;
        if (!late) {
            if (!this.state.isAcknowledged) {
                progressColor = 'blue';
            } else {
                progressColor = '#00FF00';
            }
        } else {
            if (!this.state.isComplete) {
                progressColor = duration.asSeconds() % 2 ? '#FFCDD2' : '#F44336'
            } else {
                progressColor = '#AB1409'
            }
        }


        var progressStyle = {
            position: 'absolute',
            zIndex: 0,
            top: 0,
            left: 0,
            height: 50,
            width: progress * 100 + '%',
            backgroundColor: progressColor
        };

        var isTogo = this.props.entity.isTogo === true || this.props.entity.isTogo === 'true';
        var togoStyle = {
            display: isTogo ? 'block' : 'none'
        }

        var completeButtonStyle = {
            backgroundColor: this.state.isComplete ? '#777777' : '#FFFFFF',
            color: this.state.isComplete ? '#FFFFFFF' : '#000000'
        }

        var disableStyle = {
            backgroundColor: "#000000",
            opacity: 0.5,
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 2,
            top: 0,
            left: 0,
            display: this.state.isComplete ? 'block' : 'none'
        };

        var kitchenOrderStyle = {
            backgroundColor: this.state.isComplete ? '#DDDDDD' : '#FFFFFF',
        };

        return (
            <div className="kitchenOrder" style={kitchenOrderStyle} onClick={this.acknowledge.bind(this) }>
              <div style={disableStyle}></div>
              <div style={progressStyle}></div>
              <div className="orderTime">{ moment(this.props.entity.created).format('h:mma') }</div>
              <div className="elapsedTime">{ this.state.timeElapsed }</div>
              {/* <div className="location">{ this.props.entity.location }</div> */}
              <div className="kitchenOrderName">{ this.props.entity.name }</div>
              <div className="togo" style={togoStyle}>**TO GO**</div>
              <div className="kitchenOrderItems" style={style}>
                {  nodes  }
              </div>
              <div className="kitchenOrderCompleteButton" style={completeButtonStyle} onClick={this.complete.bind(this) }>Complete</div>
            </div>
        );
    }
}

export class KitchenOrderItemView extends BaseItemView<any, any> {
  render() {
    var me = this;

    function compareSortOrder(a,b) {
      if(a.sortOrder < b.sortOrder) return -1;
      if(a.sortOrder > b.sortOrder) return 1;
      return 0;
    }

    var nodes = this.props.entity.kitchenOrderItemOptions.sort(compareSortOrder).map(function (entity) {
        return (
            <KitchenOrderItemOptionView key={entity.id} entity={entity} />
        );
    });

    var noteLines = this.props.entity.note != null ? this.props.entity.note.match(/[^\r\n]+/g) : [];

    var noteNodes = [];

    if(noteLines != null) {

        noteNodes = noteLines.map(function (line) {

            var noteStyle = {
                color: 'black'
            };

            var lower = line.trim().toLowerCase();

            if(lower.indexOf('add') == 0){
                noteStyle.color = '#00AA00';
            } else if(lower.indexOf('no') == 0) {
                noteStyle.color = '#AA0000';
            }

            return (
                <div className="kitchenOrderItemNote" style={ noteStyle }>{ line }</div>
            );
        });
    };

    var icon = this.props.entity.prepType ? '/content/icons/' + this.props.entity.prepType.toLowerCase() + '.png' : '';

    return (
      <div className="kitchenOrderItem">
        <div className="kitchenOrderItemDescription"><img src={icon} />{ this.props.entity.description }</div>
        {nodes}
        {noteNodes}
      </div>
    );
  }
}

export class KitchenOrderItemOptionView extends BaseItemView<any, any> {
  render() {
    var me = this;
    var color;
    var textDecoration = 'none';
    switch(this.props.entity.type) {
        case 'Remove':
            color = '#AA0000';
            textDecoration = 'line-through';
            break;
        case 'Add':
            color = '#00AA00';
            break;
        case 'Option':
            color = '#0000AA';
            break;
        default:
            color = 'rgba(0,0,0,0.87)';
    }
    var icon = this.props.entity.prepType ? '/content/icons/' + this.props.entity.prepType.toLowerCase() + '.png' : '';

    var style = {
        color: color,
        textDecoration: textDecoration
    };
    return (
      <div className="kitchenOrderItemOptionDescription" style={style}><img src={icon} />{ this.props.entity.description }</div>
    );
  }
}


export class MainView extends React.Component<{}, any> {
    render() {
        return (
            <div>
          <h1>RMS</h1>
          { /*
          <InventoryView></InventoryView>
          <VendorsView></VendorsView>
        <ShiftsView></ShiftsView> */ }
          <KitchenOrdersView></KitchenOrdersView>
            </div>
        );
    }
}
