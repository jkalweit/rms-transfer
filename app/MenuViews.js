/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react/addons', './BaseViews'], function (require, exports, React, bv) {
    var MenuView = (function (_super) {
        __extends(MenuView, _super);
        function MenuView(props) {
            _super.call(this, props);
            this.name = '  MenuView';
            this.state = { selectedCategory: null };
        }
        MenuView.prototype.render = function () {
            var _this = this;
            console.log(this.name + ': Render');
            var menuItems = {};
            if (this.state.selectedCategory)
                menuItems = this.state.selectedCategory.items;
            return (React.createElement("div", {"className": "menu"}, React.createElement(MenuCategoriesView, {"categories": this.props.menu.categories, "selectedCategory": this.state.selectedCategory, "onSelectCategory": function (category) { _this.setState({ selectedCategory: category }); }}), React.createElement(MenuItemsView, {"items": menuItems, "selectedItem": this.state.selectedItem, "onSelectItem": function (item) { _this.setState({ selectedItem: item }); }})));
        };
        return MenuView;
    })(bv.FreezerView);
    exports.MenuView = MenuView;
    var MenuCategoriesView = (function (_super) {
        __extends(MenuCategoriesView, _super);
        function MenuCategoriesView() {
            _super.apply(this, arguments);
            this.name = '    MenuCategoriesView';
        }
        MenuCategoriesView.prototype.doTest = function () {
            var category = {
                key: new Date().toISOString(),
                name: 'Dinner Entrees',
                items: {}
            };
            this.props.categories.set(category.key, category);
        };
        MenuCategoriesView.prototype.render = function () {
            var _this = this;
            console.log(this.name + ': Render');
            var nodes = Object.keys(this.props.categories).map(function (key) {
                var category = _this.props.categories[key];
                var isSelected = category === _this.props.selectedCategory;
                return (React.createElement(MenuCategoryView, {"key": key, "category": category, "isSelected": isSelected, "onSelectCategory": _this.props.onSelectCategory.bind(_this)}));
            });
            return (React.createElement("div", {"className": "menu-categories"}, React.createElement("h3", null, "Menu Categories"), React.createElement("button", {"onClick": this.doTest.bind(this)}, "Do Test"), React.createElement("ul", null, nodes)));
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