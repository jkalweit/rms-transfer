/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react/addons', 'Models', './BaseViews'], function (require, exports, React, models, baseViews) {
    var MenuCategoriesView = (function (_super) {
        __extends(MenuCategoriesView, _super);
        function MenuCategoriesView(props) {
            _super.call(this, props, models.MenuCategoryModel.collectionName);
        }
        MenuCategoriesView.prototype.insert = function (entity) {
            this.insertBase(entity);
        };
        MenuCategoriesView.prototype.addCategory = function () {
            this.refs.addCategoryModal.toggle();
        };
        MenuCategoriesView.prototype.render = function () {
            var _this = this;
            var nodes = this.state.data.map(function (entity) {
                return (React.createElement(MenuCategoryDetailsView, {"key": entity._id, "entity": entity, "onUpdate": _this.update.bind(_this), "onRemove": _this.remove.bind(_this)}));
            });
            var style = {
                display: this.state.isDisabled ? 'none' : 'block'
            };
            return (React.createElement("div", null, React.createElement("div", {"onClick": this.toggleIsDisabled.bind(this)}, React.createElement("h2", null, "Menu Categories")), React.createElement(baseViews.ModalView, {"ref": "addCategoryModal", "onShown": function () { _this.refs.addCategoryView.doFocus(); }}, React.createElement(MenuCategoryEditView, {"ref": "addCategoryView", "entity": this.state.entity, "onSave": function (entity) { _this.insert(entity); _this.refs.addCategoryModal.toggle(); }, "onCancel": function () { _this.refs.addCategoryModal.toggle(); }})), React.createElement("div", {"className": "row", "style": style}, React.createElement(baseViews.Button, {"className": "col-4", "onClick": function () { _this.addCategory(); }}, React.createElement("span", {"className": "fa fa-plus-circle fa-fw"}), "Category"), React.createElement("br", null), nodes)));
        };
        return MenuCategoriesView;
    })(baseViews.BaseView);
    exports.MenuCategoriesView = MenuCategoriesView;
    var MenuCategoryDetailsView = (function (_super) {
        __extends(MenuCategoryDetailsView, _super);
        function MenuCategoryDetailsView() {
            _super.apply(this, arguments);
        }
        MenuCategoryDetailsView.prototype.insertMenuItem = function (item) {
            var newEntity = this.state.entity;
            newEntity.menuItems = newEntity.menuItems || {};
            item._id = new Date().toUTCString();
            newEntity.menuItems[item._id] = item;
            this.setState({
                isDirty: true,
                entity: newEntity
            });
            this.update();
        };
        MenuCategoryDetailsView.prototype.updateMenuItem = function (item) {
            var newEntity = this.state.entity;
            newEntity.menuItems[item._id] = item;
            this.setState({
                isDirty: true,
                entity: newEntity
            });
            this.update();
        };
        MenuCategoryDetailsView.prototype.removeMenuItem = function (_id) {
            var newEntity = this.state.entity;
            delete newEntity.menuItems[_id];
            this.setState({
                isDirty: true,
                entity: newEntity
            });
            this.update();
        };
        MenuCategoryDetailsView.prototype.render = function () {
            var _this = this;
            var items = this.state.entity.menuItems || {};
            var nodes = [];
            for (var id in this.state.entity.menuItems) {
                var entity = this.state.entity.menuItems[id];
                nodes.push(React.createElement(MenuItemView, {"key": entity._id, "entity": entity, "onUpdate": this.updateMenuItem.bind(this), "onRemove": this.removeMenuItem.bind(this)}));
            }
            var style = { marginTop: '20px' };
            return (React.createElement("div", {"className": "row", "style": style, "key": this.state.entity._id}, React.createElement("div", {"className": "col-6 btn", "onClick": function () { _this.refs.editCategoryView.reset(); _this.refs.editCategoryModal.show(); }}, this.state.entity.name), React.createElement("div", {"className": "col-3 btn", "onClick": function () { _this.refs.addMenuItemModal.toggle(); }}, React.createElement("span", {"className": "fa fa-plus-circle fa-fw"}), "Item"), React.createElement(baseViews.ModalView, {"ref": "addMenuItemModal", "onShown": function () { _this.refs.editItemView.doFocus(); }}, React.createElement(MenuItemEditView, {"ref": "editItemView", "entity": {}, "onSave": function (entity) { _this.insertMenuItem(entity); _this.refs.addMenuItemModal.hide(); }, "onCancel": function () { _this.refs.addMenuItemModal.toggle(); }})), React.createElement(baseViews.ModalView, {"ref": "editCategoryModal", "onShown": function () { _this.refs.editCategoryView.doFocus(); }}, React.createElement(MenuCategoryEditView, {"ref": "editCategoryView", "entity": this.state.entity, "onSave": function (entity) { _this.props.onUpdate(entity); _this.refs.editCategoryModal.toggle(); }, "onCancel": function () { _this.refs.editCategoryModal.toggle(); }, "onRemove": function () { _this.remove(); }})), nodes));
        };
        return MenuCategoryDetailsView;
    })(baseViews.BaseItemView);
    exports.MenuCategoryDetailsView = MenuCategoryDetailsView;
    var MenuCategoryEditView = (function (_super) {
        __extends(MenuCategoryEditView, _super);
        function MenuCategoryEditView() {
            _super.apply(this, arguments);
        }
        MenuCategoryEditView.prototype.doFocus = function () {
            var input = React.findDOMNode(this.refs['type']);
            input.focus();
        };
        MenuCategoryEditView.prototype.render = function () {
            var _this = this;
            var hide = { float: 'right', display: this.props.onRemove ? 'block' : 'none' };
            return (React.createElement("div", null, React.createElement("h2", null, "Edit Menu Category"), React.createElement("p", null, "Type: ", React.createElement("select", {"ref": "type", "value": this.state.entity.type, "onChange": this.handleChange.bind(this, "type")}, React.createElement("option", null), React.createElement("option", null, "Food"), React.createElement("option", null, "Alcohol"))), React.createElement("p", null, "Name: ", React.createElement("input", {"ref": "name", "value": this.state.entity.name, "onChange": this.handleChange.bind(this, "name")})), React.createElement("p", null, "Note: ", React.createElement("input", {"value": this.state.entity.note, "onChange": this.handleChange.bind(this, "note")})), React.createElement("div", null, React.createElement("button", {"onClick": function () { _this.cancel(); }}, "Cancel"), React.createElement("button", {"onClick": this.save.bind(this), "disabled": !this.state.isDirty}, "Save"), React.createElement("div", {"className": "btn", "onClick": function () { _this.remove(); }, "style": hide}, "Delete"))));
        };
        return MenuCategoryEditView;
    })(baseViews.SimpleItemEditView);
    exports.MenuCategoryEditView = MenuCategoryEditView;
    var MenuItemView = (function (_super) {
        __extends(MenuItemView, _super);
        function MenuItemView() {
            _super.apply(this, arguments);
        }
        MenuItemView.prototype.render = function () {
            var _this = this;
            return (React.createElement("div", {"className": "row", "key": this.props.entity._id}, React.createElement("div", {"className": "col-1"}), React.createElement("div", {"className": "col-8 btn", "onClick": function () { _this.refs.editModal.toggle(); }}, this.props.entity.name), React.createElement("div", {"className": "col-4 text-right"}, baseViews.Utils.FormatDollars(this.props.entity.price)), React.createElement(baseViews.ModalView, {"ref": "editModal", "onShown": function () { _this.refs.editView.doFocus(); }}, React.createElement(MenuItemEditView, {"ref": "editView", "entity": this.state.entity, "onSave": function (entity) { _this.props.onUpdate(entity); _this.refs.editModal.toggle(); }, "onCancel": function () { _this.refs.editModal.toggle(); }, "onRemove": function () { _this.remove(); }}))));
        };
        return MenuItemView;
    })(baseViews.BaseItemView);
    exports.MenuItemView = MenuItemView;
    var MenuItemEditView = (function (_super) {
        __extends(MenuItemEditView, _super);
        function MenuItemEditView() {
            _super.apply(this, arguments);
        }
        MenuItemEditView.prototype.doFocus = function () {
            var input = React.findDOMNode(this.refs['name']);
            input.focus();
            input.select();
        };
        MenuItemEditView.prototype.render = function () {
            var _this = this;
            var hide = { float: 'right', display: this.props.onRemove ? 'block' : 'none' };
            return (React.createElement("div", null, React.createElement("h2", null, "Edit Menu Item"), React.createElement("p", null, "Name: ", React.createElement("input", {"ref": "name", "value": this.state.entity.name, "onChange": this.handleChange.bind(this, "name")})), React.createElement("p", null, "Note: ", React.createElement("input", {"value": this.state.entity.note, "onChange": this.handleChange.bind(this, "note")})), React.createElement("p", null, "Price: ", React.createElement("input", {"value": this.state.entity.price, "onChange": this.handleChange.bind(this, "price")})), React.createElement("div", null, React.createElement("button", {"onClick": function () { _this.cancel(); }}, "Cancel"), React.createElement("button", {"onClick": this.save.bind(this), "disabled": !this.state.isDirty}, "Save"), React.createElement("button", {"onClick": function () { _this.remove(); }, "style": hide}, "Delete"))));
        };
        return MenuItemEditView;
    })(baseViews.SimpleItemEditView);
    exports.MenuItemEditView = MenuItemEditView;
});
//# sourceMappingURL=MenuViews.js.map