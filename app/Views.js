/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'jquery', 'socket.io', 'Models'], function (require, exports, React, $, io, models) {
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
            this.state = { data: [] };
            socket.on('updated', function (data) {
                console.log('Updated: ' + collectionName + ' ' + data);
                this.refresh();
            }.bind(this));
        }
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
            this.state = { entity: props.entity };
        }
        BaseItemView.prototype.componentWillReceiveProps = function (nextProps) {
            this.setState({
                entity: nextProps.entity
            });
        };
        BaseItemView.prototype.update = function () {
            var me = this;
            this.props.onUpdate(this.state.entity);
        };
        BaseItemView.prototype.remove = function () {
            this.props.onRemove(this.props.entity._id);
        };
        BaseItemView.prototype.handleChange = function (fieldName, event) {
            var newEntity = this.state.entity;
            newEntity[fieldName] = event.target.value;
            this.setState({ entity: newEntity });
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
            return (React.createElement("div", {"key": this.props.entity._id}, React.createElement("input", {"value": this.state.entity.name, "onChange": this.handleChange.bind(this, "name")}), React.createElement("input", {"value": this.state.entity.note, "onChange": this.handleChange.bind(this, "note")}), React.createElement("input", {"value": this.state.entity.count, "onChange": this.handleChange.bind(this, "count")}), React.createElement("button", {"onClick": this.update.bind(this)}, "Update"), React.createElement("button", {"onClick": this.remove.bind(this)}, "X")));
        };
        return InventoryItemView;
    })(BaseItemView);
    exports.InventoryItemView = InventoryItemView;
    var InventoryView = (function (_super) {
        __extends(InventoryView, _super);
        function InventoryView(props) {
            _super.call(this, props, models.InventoryItemModel.collectionName);
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
            return (React.createElement("div", null, React.createElement("h1", null, "Inventory"), React.createElement("input", {"ref": "name"}), React.createElement("button", {"onClick": this.insert.bind(this)}, "Add"), nodes, React.createElement(VendorView, null)));
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
            return (React.createElement("div", {"key": this.props.entity._id}, React.createElement("input", {"value": this.state.entity.name, "onChange": this.handleChange.bind(this, "name")}), React.createElement("input", {"value": this.state.entity.note, "onChange": this.handleChange.bind(this, "note")}), React.createElement("button", {"onClick": this.update.bind(this)}, "Update"), React.createElement("button", {"onClick": this.remove.bind(this)}, "X")));
        };
        return VendorDetailsView;
    })(BaseItemView);
    exports.VendorDetailsView = VendorDetailsView;
    var VendorView = (function (_super) {
        __extends(VendorView, _super);
        function VendorView(props) {
            _super.call(this, props, models.VendorModel.collectionName);
        }
        VendorView.prototype.insert = function () {
            this.insertBase({
                name: React.findDOMNode(this.refs['name'])['value'],
                note: ''
            });
        };
        VendorView.prototype.render = function () {
            var nodes = this.state.data.map(function (entity) {
                return (React.createElement(VendorDetailsView, {"key": entity._id, "entity": entity, "onUpdate": this.update.bind(this), "onRemove": this.remove.bind(this)}));
            }.bind(this));
            return (React.createElement("div", null, React.createElement("h1", null, "Vendors"), React.createElement("input", {"ref": "name"}), React.createElement("button", {"onClick": this.insert.bind(this)}, "Add"), nodes));
        };
        return VendorView;
    })(BaseView);
    exports.VendorView = VendorView;
});
//# sourceMappingURL=Views.js.map