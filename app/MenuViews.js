/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react/addons', './BaseViews'], function (require, exports, React, bv) {
    var MenuEditView = (function (_super) {
        __extends(MenuEditView, _super);
        function MenuEditView(props) {
            _super.call(this, props);
            this.name = '  MenuEditView';
            this.state = { selectedCategory: null, selectedItem: null };
        }
        MenuEditView.prototype.render = function () {
            var _this = this;
            console.log(this.name + ': Render');
            return (React.createElement("div", {"className": "menu-edit"}, React.createElement(MenuView, {"menu": this.props.menu, "selectedCategory": this.state.selectedCategory, "onCategorySelected": function (category) { _this.setState({ selectedCategory: category }); }}), this.state.selectedCategory ? React.createElement(MenuCategoryEditView, {"menu": this.props.menu, "category": this.state.selectedCategory, "onSaved": function (category) { _this.setState({ selectedCategory: category }); }}) : null));
        };
        return MenuEditView;
    })(bv.FreezerView);
    exports.MenuEditView = MenuEditView;
    var MenuView = (function (_super) {
        __extends(MenuView, _super);
        function MenuView(props) {
            _super.call(this, props);
            this.name = '  MenuView';
            this.state = { selectedCategory: null };
        }
        MenuView.prototype.componentWillReceiveProps = function (nextProps) {
            console.log(nextProps);
            this.setState({ selectedCategory: nextProps.selectedCategory });
        };
        MenuView.prototype.render = function () {
            var _this = this;
            console.log(this.name + ': Render');
            var menuItems = {};
            if (this.state.selectedCategory)
                menuItems = this.state.selectedCategory.items;
            return (React.createElement("div", {"className": "menu"}, React.createElement(MenuCategoriesView, {"categories": this.props.menu.categories, "selectedCategory": this.state.selectedCategory, "onSelectCategory": function (category) { _this.setState({ selectedCategory: category }); if (_this.props.onCategorySelected)
                _this.props.onCategorySelected(category); }}), React.createElement(MenuItemsView, {"items": menuItems, "selectedItem": this.state.selectedItem, "onSelectItem": function (item) { _this.setState({ selectedItem: item }); if (_this.props.onItemSelected)
                _this.props.onItemSelected(item); }})));
        };
        return MenuView;
    })(bv.FreezerView);
    exports.MenuView = MenuView;
    var MenuCategoryEditView = (function (_super) {
        __extends(MenuCategoryEditView, _super);
        function MenuCategoryEditView(props) {
            _super.call(this, props);
            this.name = '      MenuCategoryView';
            var mutable = props.category.toJS();
            this.state = {
                mutable: mutable,
                isDirty: false
            };
        }
        MenuCategoryEditView.prototype.shouldComponentUpdate = function (nextProps, nextState) {
            return _super.prototype.shouldComponentUpdate.call(this, nextProps, nextState) || this.state.isDirty;
        };
        MenuCategoryEditView.prototype.componentWillReceiveProps = function (nextProps) {
            if (this.props.category !== nextProps.category) {
                this.setState({ mutable: nextProps.category.toJS(), isDirty: false });
            }
        };
        MenuCategoryEditView.prototype.cancel = function () {
        };
        MenuCategoryEditView.prototype.save = function () {
            console.log(this.state.mutable);
            var immutable = this.props.menu.categories.set(this.state.mutable.key, this.state.mutable);
            console.log(immutable);
        };
        MenuCategoryEditView.prototype.remove = function () {
        };
        MenuCategoryEditView.prototype.handleChange = function (fieldName, event) {
            var mutable = this.state.mutable;
            if (mutable[fieldName] !== event.target.value) {
                mutable[fieldName] = event.target.value;
                this.setState({
                    mutable: mutable,
                    isDirty: true
                });
            }
        };
        MenuCategoryEditView.prototype.render = function () {
            var _this = this;
            console.log(this.name + ': Render Details: ' + this.props.category.name);
            var mutable = this.state.mutable;
            return (React.createElement("div", {"className": "menu-category-details"}, React.createElement("h3", null, "Edit Category"), React.createElement("div", {"className": "inner"}, React.createElement("span", {"className": "col-4"}, "Type: "), React.createElement("select", {"className": "col-4", "ref": "type", "value": mutable.type, "onChange": this.handleChange.bind(this, "type")}, React.createElement("option", null), React.createElement("option", null, "Food"), React.createElement("option", null, "Alcohol")), React.createElement("br", null), React.createElement("p", null, React.createElement("span", {"className": "col-4"}, "Name: "), React.createElement("input", {"className": "col-6", "ref": "name", "value": mutable.name, "onChange": this.handleChange.bind(this, "name")})), React.createElement("p", null, React.createElement("span", {"className": "col-4"}, "Note: "), React.createElement("input", {"className": "col-10", "value": mutable.note, "onChange": this.handleChange.bind(this, "note")})), React.createElement(bv.SimpleConfirmView, {"onCancel": function () { _this.cancel(); }, "onSave": function () { _this.save(); }, "onRemove": this.remove(), "isDirty": this.state.isDirty}))));
        };
        return MenuCategoryEditView;
    })(bv.FreezerView);
    exports.MenuCategoryEditView = MenuCategoryEditView;
    var MenuCategoriesView = (function (_super) {
        __extends(MenuCategoriesView, _super);
        function MenuCategoriesView() {
            _super.apply(this, arguments);
            this.name = '    MenuCategoriesView';
        }
        MenuCategoriesView.prototype.render = function () {
            var _this = this;
            console.log(this.name + ': Render');
            var nodes = Object.keys(this.props.categories).map(function (key) {
                var category = _this.props.categories[key];
                var isSelected = category === _this.props.selectedCategory;
                return (React.createElement(MenuCategoryView, {"key": key, "category": category, "isSelected": isSelected, "onSelectCategory": _this.props.onSelectCategory.bind(_this)}));
            });
            return (React.createElement("div", {"className": "menu-categories"}, React.createElement("h3", null, "Menu Categories"), React.createElement("ul", null, nodes)));
        };
        return MenuCategoriesView;
    })(bv.FreezerView);
    exports.MenuCategoriesView = MenuCategoriesView;
    var MenuCategoryView = (function (_super) {
        __extends(MenuCategoryView, _super);
        function MenuCategoryView() {
            _super.apply(this, arguments);
            this.name = '      MenuCategoryView';
        }
        MenuCategoryView.prototype.render = function () {
            var _this = this;
            console.log(this.name + ': Render ' + this.props.category.name);
            var className = this.props.isSelected ? 'active' : '';
            return (React.createElement("li", {"className": className, "onClick": function () { _this.props.onSelectCategory(_this.props.category); }}, this.props.category.name));
        };
        return MenuCategoryView;
    })(bv.FreezerView);
    exports.MenuCategoryView = MenuCategoryView;
    var MenuItemsView = (function (_super) {
        __extends(MenuItemsView, _super);
        function MenuItemsView() {
            _super.apply(this, arguments);
            this.name = '    MenuItemsView';
        }
        MenuItemsView.prototype.render = function () {
            var _this = this;
            console.log(this.name + ': Render');
            var nodes = Object.keys(this.props.items).map(function (key) {
                var item = _this.props.items[key];
                var isSelected = item === _this.props.selectedItem;
                return (React.createElement(MenuItemView, {"key": item.key, "item": item, "isSelected": isSelected, "onSelect": _this.props.onSelectItem.bind(_this)}));
            });
            return (React.createElement("div", {"className": "menu-items"}, React.createElement("h3", null, "Menu Items"), React.createElement("ul", null, nodes)));
        };
        return MenuItemsView;
    })(bv.FreezerView);
    exports.MenuItemsView = MenuItemsView;
    var MenuItemView = (function (_super) {
        __extends(MenuItemView, _super);
        function MenuItemView() {
            _super.apply(this, arguments);
            this.name = 'MenuItemView';
        }
        MenuItemView.prototype.render = function () {
            var _this = this;
            var className = this.props.isSelected ? 'active' : '';
            return (React.createElement("li", {"className": className, "onClick": function () { _this.props.onSelect(_this.props.item); }}, this.props.item.name));
        };
        return MenuItemView;
    })(bv.FreezerView);
    exports.MenuItemView = MenuItemView;
});
//# sourceMappingURL=MenuViews.js.map