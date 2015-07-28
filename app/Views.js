/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'jquery', 'socket.io', 'moment', 'Models'], function (require, exports, React, $, io, moment, models) {
    var socket = io();
    var BaseItemViewProps = (function () {
        function BaseItemViewProps() {
        }
        return BaseItemViewProps;
    })();
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
            socket.on('updated:' + this.collectionName, function (data) {
                console.log('Updated: ' + collectionName);
                this.refresh();
            }.bind(this));
        }
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
        }
        ShiftsView.prototype.insert = function () {
            this.insertBase({
                date: React.findDOMNode(this.refs['date'])['value'],
            });
        };
        ShiftsView.prototype.render = function () {
            var nodes = this.state.data.map(function (entity) {
                return (React.createElement(ShiftDetailsView, {"key": entity._id, "entity": entity, "onUpdate": this.update.bind(this), "onRemove": this.remove.bind(this)}));
            }.bind(this));
            var style = {
                display: this.state.isDisabled ? 'none' : 'block'
            };
            return (React.createElement("div", null, React.createElement("div", {"onClick": this.toggleIsDisabled.bind(this)}, React.createElement("h2", null, "Shifts")), React.createElement("div", {"style": style}, React.createElement("input", {"ref": "date", "type": "date"}), React.createElement("button", {"onClick": this.insert.bind(this)}, "Add"), nodes)));
        };
        return ShiftsView;
    })(BaseView);
    exports.ShiftsView = ShiftsView;
    var ShiftDetailsView = (function (_super) {
        __extends(ShiftDetailsView, _super);
        function ShiftDetailsView() {
            _super.apply(this, arguments);
        }
        ShiftDetailsView.prototype.insert = function () {
            var newEntity = this.state.entity;
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
        ShiftDetailsView.prototype.render = function () {
            var nodes = [];
            if (this.state.entity.positions) {
                nodes = this.state.entity.positions.map(function (position) {
                    return (React.createElement(ShiftPositionDetailsView, {"key": position._id, "entity": position, "onUpdate": this.handlePostionUpdate.bind(this), "onRemove": this.handlePostionRemove.bind(this)}));
                }.bind(this));
            }
            return (React.createElement("div", {"key": this.props.entity._id}, React.createElement("div", null, moment(this.state.entity.date).format('dddd MMM Do'), React.createElement("button", {"onClick": this.insert.bind(this)}, "Add Position"), React.createElement("button", {"onClick": this.update.bind(this), "disabled": !this.state.isDirty}, "Update"), React.createElement("button", {"onClick": this.remove.bind(this)}, "X")), nodes));
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
    var MainView = (function (_super) {
        __extends(MainView, _super);
        function MainView() {
            _super.apply(this, arguments);
        }
        MainView.prototype.render = function () {
            return (React.createElement("div", null, React.createElement("h1", null, "RMS"), React.createElement(InventoryView, null), React.createElement(VendorsView, null), React.createElement(ShiftsView, null)));
        };
        return MainView;
    })(React.Component);
    exports.MainView = MainView;
});
//# sourceMappingURL=Views.js.map