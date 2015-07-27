/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'jquery', 'socket.io', 'Models'], function (require, exports, React, $, io, models) {
    var InventoryItemProps = (function () {
        function InventoryItemProps() {
        }
        return InventoryItemProps;
    })();
    exports.InventoryItemProps = InventoryItemProps;
    var InventoryItem = (function (_super) {
        __extends(InventoryItem, _super);
        function InventoryItem() {
            _super.apply(this, arguments);
        }
        InventoryItem.prototype.update = function () {
            var me = this;
            var update = {
                _id: this.props.entity._id,
                name: React.findDOMNode(this.refs['name'])['value']
            };
            this.props.onUpdate(update);
        };
        InventoryItem.prototype.remove = function () {
            this.props.onRemove(this.props.entity._id);
        };
        InventoryItem.prototype.render = function () {
            return (React.createElement("div", {"key": this.props.entity._id}, "An Item: ", this.props.entity.name, React.createElement("input", {"ref": "name"}), React.createElement("button", {"onClick": this.update.bind(this)}, "Update"), React.createElement("button", {"onClick": this.remove.bind(this)}, "X")));
        };
        return InventoryItem;
    })(React.Component);
    exports.InventoryItem = InventoryItem;
    var Inventory = (function (_super) {
        __extends(Inventory, _super);
        function Inventory(props) {
            _super.call(this, props);
            this.state = { data: [] };
            var socket = io();
            socket.on('updated', function (data) {
                console.log('Updated: ' + data);
                this.refresh();
            }.bind(this));
        }
        Inventory.prototype.componentDidMount = function () {
            this.refresh();
        };
        Inventory.prototype.refresh = function () {
            var me = this;
            $.getJSON('/api/items', function (result) {
                me.setState({ data: result });
            });
        };
        Inventory.prototype.insert = function () {
            var me = this;
            var item = {
                name: React.findDOMNode(this.refs['name'])['value'],
                note: "",
                count: 0
            };
            $.post('/api/items', item, function (result) {
                me.refresh();
            });
        };
        Inventory.prototype.update = function (data) {
            var me = this;
            $.ajax({
                url: models.InventoryItemModel.apiPath + data._id,
                type: 'PATCH',
                data: data,
                success: function (result) {
                    me.refresh();
                }
            });
        };
        Inventory.prototype.remove = function (id) {
            var me = this;
            $.ajax({
                url: models.InventoryItemModel.apiPath + id,
                type: 'DELETE',
                success: function (result) {
                    me.refresh();
                }
            });
        };
        Inventory.prototype.render = function () {
            var nodes = this.state.data.map(function (entity) {
                return (React.createElement(InventoryItem, {"key": entity._id, "entity": entity, "onUpdate": this.update.bind(this), "onRemove": this.remove.bind(this)}));
            }.bind(this));
            return (React.createElement("div", null, React.createElement("h1", null, "Inventory"), React.createElement("input", {"ref": "name"}), React.createElement("button", {"onClick": this.insert.bind(this)}, "Add"), nodes));
        };
        return Inventory;
    })(React.Component);
    exports.Inventory = Inventory;
});
//# sourceMappingURL=Inventory.js.map