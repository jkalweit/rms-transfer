/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react/addons', 'Models', './BaseViews'], function (require, exports, React, models, bv) {
    var MenuCategoriesView = (function (_super) {
        __extends(MenuCategoriesView, _super);
        function MenuCategoriesView(props) {
            _super.call(this, props, models.MenuCategoryModel.collectionName);
        }
        MenuCategoriesView.prototype.insert = function (entity) {
            this.insertBase(entity);
            this.setState({ selectedCategory: entity });
        };
        MenuCategoriesView.prototype.addCategory = function () {
            this.refs.addCategoryModal.toggle();
        };
        MenuCategoriesView.prototype.render = function () {
            var _this = this;
            console.log('Selected Cat: ' + JSON.stringify(this.state.selectedCategory));
            var nodes = this.state.data.map(function (entity) {
                var className = (_this.state.selectedCategory && _this.state.selectedCategory._id === entity._id) ? 'active' : '';
                return (React.createElement("li", {"key": entity._id, "className": className, "onClick": function () { _this.setState({ selectedCategory: entity }); }}, entity.name));
            });
            return (React.createElement("div", {"className": "menu"}, React.createElement(bv.ModalView, {"ref": "addCategoryModal", "onShown": function () { _this.refs.addCategoryView.doFocus(); }}, React.createElement(MenuCategoryEditView, {"ref": "addCategoryView", "entity": this.state.entity, "onSave": function (entity) { _this.insert(entity); _this.refs.addCategoryModal.toggle(); }, "onCancel": function () { _this.refs.addCategoryModal.toggle(); }})), React.createElement("h3", null, "Menu Categories"), React.createElement("ul", null, React.createElement("li", null, React.createElement(bv.Button, {"className": "btn-add", "onClick": function () { _this.addCategory(); }}, React.createElement("span", {"className": "fa fa-plus-circle"}), "Category")), nodes)));
        };
        return MenuCategoriesView;
    })(bv.BaseView);
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
            var items = this.state.entity.menuItems || {};
            var nodes = [];
            for (var id in this.state.entity.menuItems) {
                var entity = this.state.entity.menuItems[id];
                nodes.push(React.createElement("li", {"key": entity._id}, entity.name));
            }
            return (React.createElement("li", {"key": this.state.entity._id}, this.state.entity.name));
        };
        return MenuCategoryDetailsView;
    })(bv.BaseItemView);
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
            return (React.createElement("div", null, React.createElement("h2", null, "Edit Menu Category"), React.createElement("br", null), React.createElement("br", null), React.createElement("span", {"className": "col-4"}, "Type: "), React.createElement("select", {"className": "col-4", "ref": "type", "value": this.state.entity.type, "onChange": this.handleChange.bind(this, "type")}, React.createElement("option", null), React.createElement("option", null, "Food"), React.createElement("option", null, "Alcohol")), React.createElement("br", null), React.createElement("div", {"className": "row"}, React.createElement("span", {"className": "col-4"}, "Name: "), React.createElement("input", {"className": "col-6", "ref": "name", "value": this.state.entity.name, "onChange": this.handleChange.bind(this, "name")})), React.createElement("div", {"className": "row"}, React.createElement("span", {"className": "col-4"}, "Note: "), React.createElement("input", {"className": "col-10", "value": this.state.entity.note, "onChange": this.handleChange.bind(this, "note")})), React.createElement(bv.SimpleConfirmView, {"onCancel": function () { _this.cancel(); }, "onSave": function () { _this.save(); }, "onRemove": this.props.onRemove ? function () { _this.remove(); } : null, "isDirty": this.state.isDirty})));
        };
        return MenuCategoryEditView;
    })(bv.SimpleItemEditView);
    exports.MenuCategoryEditView = MenuCategoryEditView;
    var MenuItemView = (function (_super) {
        __extends(MenuItemView, _super);
        function MenuItemView() {
            _super.apply(this, arguments);
        }
        MenuItemView.prototype.render = function () {
            var _this = this;
            return (React.createElement("div", {"className": "row", "key": this.props.entity._id}, React.createElement("div", {"className": "col-1"}), React.createElement(bv.Button, {"className": "col-8", "onClick": function () { _this.refs.editModal.toggle(); }}, this.props.entity.name), React.createElement("div", {"className": "col-4 text-right"}, bv.Utils.FormatDollars(this.props.entity.price)), React.createElement(bv.ModalView, {"ref": "editModal", "onShown": function () { _this.refs.editView.doFocus(); }}, React.createElement(MenuItemEditView, {"ref": "editView", "entity": this.state.entity, "onSave": function (entity) { _this.props.onUpdate(entity); _this.refs.editModal.toggle(); }, "onCancel": function () { _this.refs.editModal.toggle(); }, "onRemove": function () { _this.remove(); }}))));
        };
        return MenuItemView;
    })(bv.BaseItemView);
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
            return (React.createElement("div", null, React.createElement("h2", null, "Edit Menu Item"), React.createElement("div", {"className": "row"}, React.createElement("span", {"className": "col-4"}, "Name: "), React.createElement("input", {"className": "col-6", "ref": "name", "value": this.state.entity.name, "onChange": this.handleChange.bind(this, "name")})), React.createElement("div", {"className": "row"}, React.createElement("span", {"className": "col-4"}, "Note: "), React.createElement("input", {"className": "col-10", "value": this.state.entity.note, "onChange": this.handleChange.bind(this, "note")})), React.createElement("div", {"className": "row"}, React.createElement("span", {"className": "col-4"}, "Price: "), React.createElement("input", {"className": "col-2", "value": this.state.entity.price, "onChange": this.handleChange.bind(this, "price")})), React.createElement(bv.SimpleConfirmView, {"onCancel": function () { _this.cancel(); }, "onSave": function () { _this.save(); }, "onRemove": this.props.onRemove ? function () { _this.remove(); } : null, "isDirty": this.state.isDirty})));
        };
        return MenuItemEditView;
    })(bv.SimpleItemEditView);
    exports.MenuItemEditView = MenuItemEditView;
});
//# sourceMappingURL=MenuViews.js.map