/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react/addons', 'jquery', 'socket.io', 'moment', 'Models'], function (require, exports, React, $, io, moment, models) {
    var socket = io();
    var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
    var BaseViewProps = (function () {
        function BaseViewProps() {
        }
        return BaseViewProps;
    })();
    exports.BaseViewProps = BaseViewProps;
    var BaseItemViewProps = (function (_super) {
        __extends(BaseItemViewProps, _super);
        function BaseItemViewProps() {
            _super.apply(this, arguments);
        }
        return BaseItemViewProps;
    })(BaseViewProps);
    exports.BaseItemViewProps = BaseItemViewProps;
    var BaseView = (function (_super) {
        __extends(BaseView, _super);
        function BaseView(props, collectionName) {
            _super.call(this, props);
            this.collectionName = collectionName;
            this.state = {
                data: [],
                isDisabled: false
            };
            this.socketSubscriptions = {};
            socket.on('updated:' + this.collectionName, function (data) {
                this.refresh();
                var subscribers = this.socketSubscriptions[data.action] || [];
                subscribers.forEach(function (callback) {
                    callback(data);
                });
            }.bind(this));
        }
        BaseView.prototype.subscribe = function (action, callback) {
            this.socketSubscriptions[action] = this.socketSubscriptions[action] || [];
            this.socketSubscriptions[action].push(callback);
        };
        BaseView.prototype.toggleIsDisabled = function () {
            this.setState({ isDisabled: !this.state.isDisabled });
        };
        BaseView.prototype.componentDidMount = function () {
            this.refresh();
        };
        BaseView.prototype.refresh = function () {
            var me = this;
            $.getJSON('/api/' + this.collectionName, function (result) {
                me.setState({ data: result });
            });
        };
        BaseView.prototype.insertBase = function (item) {
            var me = this;
            $.post('/api/' + this.collectionName, item, function (result) {
                me.refresh();
            });
        };
        BaseView.prototype.update = function (data) {
            var me = this;
            $.ajax({
                url: '/api/' + this.collectionName + '/' + data._id,
                type: 'PATCH',
                data: data,
                success: function (result) {
                    me.refresh();
                }
            });
        };
        BaseView.prototype.remove = function (id) {
            var me = this;
            $.ajax({
                url: '/api/' + this.collectionName + '/' + id,
                type: 'DELETE',
                success: function (result) {
                    me.refresh();
                }
            });
        };
        return BaseView;
    })(React.Component);
    exports.BaseView = BaseView;
    var BaseItemView = (function (_super) {
        __extends(BaseItemView, _super);
        function BaseItemView(props) {
            _super.call(this, props);
            this.state = {
                entity: props.entity,
                isDirty: false,
                isDisabled: false
            };
        }
        BaseItemView.prototype.toggleIsDisabled = function () {
            this.setState({ isDisabled: !this.state.isDisabled });
        };
        BaseItemView.prototype.componentWillReceiveProps = function (nextProps) {
            this.setState({
                entity: nextProps.entity,
                isDirty: false
            });
        };
        BaseItemView.prototype.update = function () {
            var me = this;
            this.props.onUpdate(this.state.entity);
        };
        BaseItemView.prototype.remove = function () {
            if (confirm('Delete?')) {
                this.props.onRemove(this.props.entity._id);
            }
        };
        BaseItemView.prototype.handleChange = function (fieldName, event) {
            var newEntity = this.state.entity;
            if (newEntity[fieldName] !== event.target.value) {
                newEntity[fieldName] = event.target.value;
                this.setState({
                    entity: newEntity,
                    isDirty: true
                });
            }
        };
        return BaseItemView;
    })(React.Component);
    exports.BaseItemView = BaseItemView;
    var InventoryItemView = (function (_super) {
        __extends(InventoryItemView, _super);
        function InventoryItemView() {
            _super.apply(this, arguments);
        }
        InventoryItemView.prototype.render = function () {
            return (React.createElement("div", {"key": this.props.entity._id}, React.createElement("select", {"value": this.state.entity.location, "onChange": this.handleChange.bind(this, "location")}, React.createElement("option", null), React.createElement("option", null, "Dry Storage"), React.createElement("option", null, "Silver Fridge"), React.createElement("option", null, "Freezer 1"), React.createElement("option", null, "Freezer 2")), React.createElement("select", {"value": this.state.entity.type, "onChange": this.handleChange.bind(this, "type")}, React.createElement("option", null), React.createElement("option", null, "App"), React.createElement("option", null, "Bread"), React.createElement("option", null, "Drinks"), React.createElement("option", null, "Dry Goods"), React.createElement("option", null, "Meat"), React.createElement("option", null, "Produce"), React.createElement("option", null, "Sauce"), React.createElement("option", null, "Supplies")), React.createElement("input", {"value": this.state.entity.name, "onChange": this.handleChange.bind(this, "name")}), React.createElement("input", {"value": this.state.entity.note, "onChange": this.handleChange.bind(this, "note")}), React.createElement("input", {"value": this.state.entity.count, "onChange": this.handleChange.bind(this, "count")}), React.createElement("button", {"onClick": this.update.bind(this), "disabled": !this.state.isDirty}, "Update"), React.createElement("button", {"onClick": this.remove.bind(this)}, "X"), moment(this.state.entity.lastModified).format('llll')));
        };
        return InventoryItemView;
    })(BaseItemView);
    exports.InventoryItemView = InventoryItemView;
    var InventoryView = (function (_super) {
        __extends(InventoryView, _super);
        function InventoryView(props) {
            _super.call(this, props, models.InventoryItemModel.collectionName);
            this.state.isDisabled = true;
        }
        InventoryView.prototype.insert = function () {
            this.insertBase({
                name: React.findDOMNode(this.refs['name'])['value'],
                note: "",
                count: 0
            });
        };
        InventoryView.prototype.render = function () {
            var nodes = this.state.data.map(function (entity) {
                return (React.createElement(InventoryItemView, {"key": entity._id, "entity": entity, "onUpdate": this.update.bind(this), "onRemove": this.remove.bind(this)}));
            }.bind(this));
            var style = {
                display: this.state.isDisabled ? 'none' : 'block'
            };
            return (React.createElement("div", null, React.createElement("div", {"onClick": this.toggleIsDisabled.bind(this)}, React.createElement("h2", null, "Inventory")), React.createElement("div", {"style": style}, React.createElement("input", {"ref": "name"}), React.createElement("button", {"onClick": this.insert.bind(this)}, "Add"), nodes)));
        };
        return InventoryView;
    })(BaseView);
    exports.InventoryView = InventoryView;
    var VendorDetailsView = (function (_super) {
        __extends(VendorDetailsView, _super);
        function VendorDetailsView() {
            _super.apply(this, arguments);
        }
        VendorDetailsView.prototype.render = function () {
            return (React.createElement("div", {"key": this.props.entity._id}, React.createElement("input", {"value": this.state.entity.name, "onChange": this.handleChange.bind(this, "name")}), React.createElement("input", {"value": this.state.entity.note, "onChange": this.handleChange.bind(this, "note")}), React.createElement("button", {"onClick": this.update.bind(this), "disabled": !this.state.isDirty}, "Update"), React.createElement("button", {"onClick": this.remove.bind(this)}, "X")));
        };
        return VendorDetailsView;
    })(BaseItemView);
    exports.VendorDetailsView = VendorDetailsView;
    var VendorsView = (function (_super) {
        __extends(VendorsView, _super);
        function VendorsView(props) {
            _super.call(this, props, models.VendorModel.collectionName);
            this.state.isDisabled = true;
        }
        VendorsView.prototype.insert = function () {
            this.insertBase({
                name: React.findDOMNode(this.refs['name'])['value'],
                note: ''
            });
        };
        VendorsView.prototype.render = function () {
            var nodes = this.state.data.map(function (entity) {
                return (React.createElement(VendorDetailsView, {"key": entity._id, "entity": entity, "onUpdate": this.update.bind(this), "onRemove": this.remove.bind(this)}));
            }.bind(this));
            var style = {
                display: this.state.isDisabled ? 'none' : 'block'
            };
            return (React.createElement("div", null, React.createElement("div", {"onClick": this.toggleIsDisabled.bind(this)}, React.createElement("h2", null, "Vendors")), React.createElement("div", {"style": style}, React.createElement("input", {"ref": "name"}), React.createElement("button", {"onClick": this.insert.bind(this)}, "Add"), nodes)));
        };
        return VendorsView;
    })(BaseView);
    exports.VendorsView = VendorsView;
    var ShiftsView = (function (_super) {
        __extends(ShiftsView, _super);
        function ShiftsView(props) {
            _super.call(this, props, models.ShiftModel.collectionName);
            this.state.isDisabled = true;
        }
        ShiftsView.prototype.insert = function () {
            this.insertBase({
                date: React.findDOMNode(this.refs['date'])['value'],
            });
        };
        ShiftsView.prototype.handleMakeCopy = function (copy) {
            this.insertBase(copy);
        };
        ShiftsView.prototype.render = function () {
            var nodes = this.state.data.map(function (entity) {
                return (React.createElement(ShiftDetailsView, {"key": entity._id, "entity": entity, "onUpdate": this.update.bind(this), "onRemove": this.remove.bind(this), "onMakeCopy": this.handleMakeCopy.bind(this)}));
            }.bind(this));
            var style = {
                display: this.state.isDisabled ? 'none' : 'block'
            };
            return (React.createElement("div", null, React.createElement("div", {"onClick": this.toggleIsDisabled.bind(this)}, React.createElement("h2", null, "Shifts")), React.createElement("div", {"style": style}, React.createElement("input", {"ref": "date", "type": "date"}), React.createElement("button", {"onClick": this.insert.bind(this)}, "Add"), nodes)));
        };
        return ShiftsView;
    })(BaseView);
    exports.ShiftsView = ShiftsView;
    var ShiftDetailsViewProps = (function (_super) {
        __extends(ShiftDetailsViewProps, _super);
        function ShiftDetailsViewProps() {
            _super.apply(this, arguments);
        }
        return ShiftDetailsViewProps;
    })(BaseItemViewProps);
    exports.ShiftDetailsViewProps = ShiftDetailsViewProps;
    var ShiftDetailsView = (function (_super) {
        __extends(ShiftDetailsView, _super);
        function ShiftDetailsView() {
            _super.apply(this, arguments);
        }
        ShiftDetailsView.prototype.insert = function () {
            var newEntity = this.state.entity;
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
        };
        ShiftDetailsView.prototype.handlePostionUpdate = function (entity) {
            this.update();
        };
        ShiftDetailsView.prototype.handlePostionRemove = function (id) {
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
        };
        ShiftDetailsView.prototype.copy = function () {
            var newEntity = this.state.entity;
            delete newEntity._id;
            this.props.onMakeCopy(newEntity);
        };
        ShiftDetailsView.prototype.render = function () {
            var nodes = [];
            if (this.state.entity.positions) {
                nodes = this.state.entity.positions.map(function (position) {
                    return (React.createElement(ShiftPositionDetailsView, {"key": position._id, "entity": position, "onUpdate": this.handlePostionUpdate.bind(this), "onRemove": this.handlePostionRemove.bind(this)}));
                }.bind(this));
            }
            return (React.createElement("div", null, moment(this.state.entity.date).format('dddd'), React.createElement("input", {"value": this.state.entity.date, "type": "date", "onChange": this.handleChange.bind(this, "date")}), React.createElement("button", {"onClick": this.insert.bind(this)}, "Add Position"), React.createElement("button", {"onClick": this.update.bind(this), "disabled": !this.state.isDirty}, "Update"), React.createElement("button", {"onClick": this.remove.bind(this)}, "X"), React.createElement("button", {"onClick": this.copy.bind(this)}, "Copy"), nodes));
        };
        return ShiftDetailsView;
    })(BaseItemView);
    exports.ShiftDetailsView = ShiftDetailsView;
    var ShiftPositionDetailsView = (function (_super) {
        __extends(ShiftPositionDetailsView, _super);
        function ShiftPositionDetailsView() {
            _super.apply(this, arguments);
        }
        ShiftPositionDetailsView.prototype.render = function () {
            return (React.createElement("div", {"key": this.props.entity._id}, React.createElement("input", {"value": this.state.entity.name, "onChange": this.handleChange.bind(this, "name")}), React.createElement("select", {"value": this.state.entity.employee, "onChange": this.handleChange.bind(this, "employee")}, React.createElement("option", null), React.createElement("option", null, "Chris"), React.createElement("option", null, "Jake"), React.createElement("option", null, "Justin"), React.createElement("option", null, "Matt"), React.createElement("option", null, "Michael"), React.createElement("option", null, "Aerin"), React.createElement("option", null, "Keely"), React.createElement("option", null, "Kelly"), React.createElement("option", null, "Merrill"), React.createElement("option", null, "Stassie")), React.createElement("input", {"value": this.state.entity.start, "type": "time", "onChange": this.handleChange.bind(this, "start")}), React.createElement("input", {"value": this.state.entity.end, "type": "time", "onChange": this.handleChange.bind(this, "end")}), models.ShiftModel.shiftLength(this.state.entity), React.createElement("button", {"onClick": this.update.bind(this), "disabled": !this.state.isDirty}, "Update"), React.createElement("button", {"onClick": this.remove.bind(this)}, "X")));
        };
        return ShiftPositionDetailsView;
    })(BaseItemView);
    exports.ShiftPositionDetailsView = ShiftPositionDetailsView;
    var KitchenOrdersView = (function (_super) {
        __extends(KitchenOrdersView, _super);
        function KitchenOrdersView(props) {
            var _this = this;
            _super.call(this, props, models.KitchenOrderModel.collectionName);
            this.state.isDisabled = false;
            this.subscribe('inserted', function (data) {
                React.findDOMNode(_this.refs['newOrderSound'])['play']();
            });
        }
        KitchenOrdersView.prototype.handleComplete = function (entity) {
            entity.completedAt = (new Date()).toISOString();
            React.findDOMNode(this.refs['orderCompletedSound'])['play']();
            this.update(entity);
        };
        KitchenOrdersView.prototype.handleAcknowledge = function (entity) {
            entity.acknowledgedAt = (new Date()).toISOString();
            this.update(entity);
        };
        KitchenOrdersView.prototype.render = function () {
            var nodes = this.state.data.map(function (entity) {
                return (React.createElement(KitchenOrderDetailsView, {"key": entity._id, "entity": entity, "onAcknowledge": this.handleAcknowledge.bind(this), "onComplete": this.handleComplete.bind(this)}));
            }.bind(this));
            var style = {
                display: this.state.isDisabled ? 'none' : 'block'
            };
            return (React.createElement("div", null, React.createElement("audio", {"ref": "newOrderSound", "src": "/content/audio/bell.mp3", "preload": "auto"}), React.createElement("audio", {"ref": "orderCompletedSound", "src": "/content/audio/tada.mp3", "preload": "auto"}), React.createElement("div", {"onClick": this.toggleIsDisabled.bind(this)}, React.createElement("h2", null, "Kitchen Orders")), React.createElement("div", {"style": style}, nodes)));
        };
        return KitchenOrdersView;
    })(BaseView);
    exports.KitchenOrdersView = KitchenOrdersView;
    var KitchenOrderDetailsViewProps = (function (_super) {
        __extends(KitchenOrderDetailsViewProps, _super);
        function KitchenOrderDetailsViewProps() {
            _super.apply(this, arguments);
        }
        return KitchenOrderDetailsViewProps;
    })(BaseViewProps);
    exports.KitchenOrderDetailsViewProps = KitchenOrderDetailsViewProps;
    var KitchenOrderDetailsView = (function (_super) {
        __extends(KitchenOrderDetailsView, _super);
        function KitchenOrderDetailsView(props) {
            _super.call(this, props);
            this.state = {
                isNew: true,
                isAcknowledged: this.props.entity.acknowledgedAt ? true : false,
                isComplete: this.props.entity.completedAt ? true : false
            };
            this.state.timeElapsed = this.formatElapsedTime();
        }
        KitchenOrderDetailsView.prototype.elapsedDuration = function () {
            var start = moment(this.props.entity.created);
            var end = this.state.isComplete ? moment(this.props.entity.completedAt) : moment();
            var diff = end.diff(start, 'seconds');
            var duration = moment.duration(diff, 'seconds');
            return duration;
        };
        KitchenOrderDetailsView.prototype.formatElapsedTime = function () {
            var duration = this.elapsedDuration();
            var formatted = duration.minutes() + ':' + ('0' + duration.seconds()).slice(-2);
            return formatted;
        };
        KitchenOrderDetailsView.prototype.tick = function () {
            this.setState({ timeElapsed: this.formatElapsedTime() });
        };
        KitchenOrderDetailsView.prototype.componentDidMount = function () {
            if (!this.state.isComplete) {
                this.interval = setInterval(this.tick.bind(this), 1000);
            }
        };
        KitchenOrderDetailsView.prototype.componentWillUnmount = function () {
            clearInterval(this.interval);
        };
        KitchenOrderDetailsView.prototype.complete = function (e) {
            if (this.state.isAcknowledged && !this.state.isComplete) {
                this.props.onComplete(this.props.entity);
                this.setState({ isComplete: true });
                clearInterval(this.interval);
                e.preventDefault();
            }
        };
        KitchenOrderDetailsView.prototype.acknowledge = function (e) {
            if (!this.state.isAcknowledged) {
                this.props.onAcknowledge(this.props.entity);
                this.setState({ isAcknowledged: true });
                e.preventDefault();
            }
        };
        KitchenOrderDetailsView.prototype.render = function () {
            var me = this;
            function compareMilli(a, b) {
                var a_milli = moment(a.addedToOrderAt).valueOf();
                var b_milli = moment(b.addedToOrderAt).valueOf();
                if (a_milli < b_milli)
                    return -1;
                if (a_milli > b_milli)
                    return 1;
                return 0;
            }
            var nodes = this.props.entity.kitchenOrderItems.sort(compareMilli).map(function (entity) {
                return (React.createElement(KitchenOrderItemView, {"key": entity.addedToOrderAt, "entity": entity}));
            });
            var backgroundColor;
            var bucket = Math.floor(moment(this.props.entity.created).minutes() / 10);
            if (bucket == 0) {
                backgroundColor = '#D1C4E9';
            }
            else if (bucket == 1) {
                backgroundColor = '#C8E6C9';
            }
            else if (bucket == 2) {
                backgroundColor = '#B2DFDB';
            }
            else if (bucket == 3) {
                backgroundColor = '#F0F4C3';
            }
            else if (bucket == 4) {
                backgroundColor = '#BBDEFB';
            }
            else if (bucket == 5) {
                backgroundColor = '#FFE0B2';
            }
            else {
                backgroundColor = '';
            }
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
                }
                else {
                    progressColor = '#00FF00';
                }
            }
            else {
                if (!this.state.isComplete) {
                    progressColor = duration.asSeconds() % 2 ? '#FFCDD2' : '#F44336';
                }
                else {
                    progressColor = '#AB1409';
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
            };
            var completeButtonStyle = {
                backgroundColor: this.state.isComplete ? '#777777' : '#FFFFFF',
                color: this.state.isComplete ? '#FFFFFFF' : '#000000'
            };
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
            return (React.createElement("div", {"className": "kitchenOrder", "style": kitchenOrderStyle, "onClick": this.acknowledge.bind(this)}, React.createElement("div", {"style": disableStyle}), React.createElement("div", {"style": progressStyle}), React.createElement("div", {"className": "orderTime"}, moment(this.props.entity.created).format('h:mma')), React.createElement("div", {"className": "elapsedTime"}, this.state.timeElapsed), React.createElement("div", {"className": "kitchenOrderName"}, this.props.entity.name), React.createElement("div", {"className": "togo", "style": togoStyle}, "**TO GO**"), React.createElement("div", {"className": "kitchenOrderItems", "style": style}, nodes), React.createElement("div", {"className": "kitchenOrderCompleteButton", "style": completeButtonStyle, "onClick": this.complete.bind(this)}, "Complete")));
        };
        return KitchenOrderDetailsView;
    })(BaseItemView);
    exports.KitchenOrderDetailsView = KitchenOrderDetailsView;
    var KitchenOrderItemView = (function (_super) {
        __extends(KitchenOrderItemView, _super);
        function KitchenOrderItemView() {
            _super.apply(this, arguments);
        }
        KitchenOrderItemView.prototype.render = function () {
            var me = this;
            function compareSortOrder(a, b) {
                if (a.sortOrder < b.sortOrder)
                    return -1;
                if (a.sortOrder > b.sortOrder)
                    return 1;
                return 0;
            }
            var nodes = this.props.entity.kitchenOrderItemOptions.sort(compareSortOrder).map(function (entity) {
                return (React.createElement(KitchenOrderItemOptionView, {"key": entity.sortOrder, "entity": entity}));
            });
            var noteLines = this.props.entity.note != null ? this.props.entity.note.match(/[^\r\n]+/g) : [];
            var noteNodes = [];
            if (noteLines != null) {
                noteNodes = noteLines.map(function (line) {
                    var noteStyle = {
                        color: 'black'
                    };
                    var lower = line.trim().toLowerCase();
                    if (lower.indexOf('add') == 0) {
                        noteStyle.color = '#00AA00';
                    }
                    else if (lower.indexOf('no') == 0) {
                        noteStyle.color = '#AA0000';
                    }
                    return (React.createElement("div", {"className": "kitchenOrderItemNote", "style": noteStyle}, line));
                });
            }
            ;
            var icon = this.props.entity.prepType ? '/content/icons/' + this.props.entity.prepType.toLowerCase() + '.png' : '';
            return (React.createElement("div", {"className": "kitchenOrderItem"}, React.createElement("div", {"className": "kitchenOrderItemDescription"}, React.createElement("img", {"src": icon}), this.props.entity.description), nodes, noteNodes));
        };
        return KitchenOrderItemView;
    })(BaseItemView);
    exports.KitchenOrderItemView = KitchenOrderItemView;
    var KitchenOrderItemOptionView = (function (_super) {
        __extends(KitchenOrderItemOptionView, _super);
        function KitchenOrderItemOptionView() {
            _super.apply(this, arguments);
        }
        KitchenOrderItemOptionView.prototype.render = function () {
            var me = this;
            var color;
            var textDecoration = 'none';
            switch (this.props.entity.type) {
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
            return (React.createElement("div", {"className": "kitchenOrderItemOptionDescription", "style": style}, React.createElement("img", {"src": icon}), this.props.entity.description));
        };
        return KitchenOrderItemOptionView;
    })(BaseItemView);
    exports.KitchenOrderItemOptionView = KitchenOrderItemOptionView;
    var MainView = (function (_super) {
        __extends(MainView, _super);
        function MainView() {
            _super.apply(this, arguments);
        }
        MainView.prototype.render = function () {
            return (React.createElement("div", null, React.createElement("h1", null, "RMS"), React.createElement(KitchenOrdersView, null)));
        };
        return MainView;
    })(React.Component);
    exports.MainView = MainView;
});
//# sourceMappingURL=Views.js.map